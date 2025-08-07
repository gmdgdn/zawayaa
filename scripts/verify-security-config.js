#!/usr/bin/env node

/**
 * Security Configuration Verification Script
 * 
 * This script verifies that environment variables are properly configured
 * with appropriate security settings for production deployment.
 */

const https = require('https');
const { URL } = require('url');

// Security configuration requirements
const SECURITY_REQUIREMENTS = {
  'NEXT_PUBLIC_WP_URL': {
    required: true,
    sensitive: false,
    environments: ['production', 'preview', 'development'],
    validation: (value) => {
      try {
        const url = new URL(value);
        return url.protocol === 'https:' && url.hostname.includes('cloudwaysapps.com');
      } catch {
        return false;
      }
    },
    description: 'WordPress site URL (must be HTTPS)'
  },
  'WP_API_BASE': {
    required: true,
    sensitive: false,
    environments: ['production', 'preview'],
    validation: (value) => {
      try {
        const url = new URL(value);
        return url.protocol === 'https:' && url.pathname.includes('/wp-json/wp/v2');
      } catch {
        return false;
      }
    },
    description: 'WordPress REST API base URL'
  },
  'WP_USERNAME': {
    required: true,
    sensitive: true,
    environments: ['production', 'preview'],
    validation: (value) => {
      // Should be a valid email format for WordPress user
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value);
    },
    description: 'WordPress application user (email format)'
  },
  'WP_APP_PASSWORD': {
    required: true,
    sensitive: true,
    environments: ['production', 'preview'],
    validation: (value) => {
      // WordPress app passwords are exactly 24 characters
      return typeof value === 'string' && value.length === 24 && /^[a-zA-Z0-9]+$/.test(value);
    },
    description: 'WordPress application password (24 characters)'
  },
  'REVALIDATION_SECRET': {
    required: true,
    sensitive: true,
    environments: ['production', 'preview'],
    validation: (value) => {
      // Should be a strong secret (at least 32 characters)
      return typeof value === 'string' && value.length >= 32;
    },
    description: 'Revalidation webhook secret (minimum 32 characters)'
  }
};

class SecurityVerifier {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      warnings: 0,
      errors: [],
      warnings_list: []
    };
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = {
      'info': '✓',
      'warn': '⚠',
      'error': '✗',
      'debug': '→',
      'security': '🔒'
    }[type] || 'ℹ';
    
    console.log(`${prefix} [${timestamp}] ${message}`);
  }

  async verifySecurityConfiguration() {
    this.log('Starting security configuration verification...', 'security');
    
    // Check environment detection
    const environment = this.detectEnvironment();
    this.log(`Detected environment: ${environment}`, 'info');
    
    // Verify each environment variable
    for (const [varName, config] of Object.entries(SECURITY_REQUIREMENTS)) {
      await this.verifyVariable(varName, config, environment);
    }
    
    // Additional security checks
    await this.performSecurityChecks();
    
    return this.generateSecurityReport();
  }

  detectEnvironment() {
    if (process.env.VERCEL_ENV) {
      return process.env.VERCEL_ENV; // 'production', 'preview', or 'development'
    }
    
    if (process.env.NODE_ENV === 'production') {
      return 'production';
    }
    
    return 'development';
  }

  async verifyVariable(varName, config, environment) {
    const value = process.env[varName];
    
    // Check if variable is required for this environment
    if (config.environments.includes(environment)) {
      if (!value) {
        this.results.failed++;
        this.results.errors.push(`Missing required environment variable: ${varName} for ${environment} environment`);
        this.log(`Missing: ${varName} - ${config.description}`, 'error');
        return;
      }
      
      // Validate the value
      if (config.validation && !config.validation(value)) {
        this.results.failed++;
        this.results.errors.push(`Invalid format for ${varName}: ${config.description}`);
        this.log(`Invalid: ${varName} - ${config.description}`, 'error');
        return;
      }
      
      // Check if sensitive variables are properly handled
      if (config.sensitive) {
        this.verifySensitiveVariable(varName, value, environment);
      }
      
      this.results.passed++;
      this.log(`Verified: ${varName} (${config.sensitive ? 'sensitive' : 'public'})`, 'info');
      
    } else {
      // Variable should not be present in this environment
      if (value && config.sensitive) {
        this.results.warnings++;
        this.results.warnings_list.push(`Sensitive variable ${varName} present in ${environment} environment`);
        this.log(`Warning: ${varName} should not be present in ${environment} environment`, 'warn');
      }
    }
  }

  verifySensitiveVariable(varName, value, environment) {
    // Check for common security issues with sensitive variables
    
    // 1. Check if value looks like a placeholder
    const placeholders = ['your_', 'example_', 'test_', 'placeholder', 'changeme'];
    if (placeholders.some(placeholder => value.toLowerCase().includes(placeholder))) {
      this.results.warnings++;
      this.results.warnings_list.push(`${varName} appears to contain placeholder value`);
      this.log(`Warning: ${varName} may contain placeholder value`, 'warn');
    }
    
    // 2. Check for development-only values in production
    if (environment === 'production') {
      const devIndicators = ['localhost', '127.0.0.1', 'dev', 'test'];
      if (devIndicators.some(indicator => value.toLowerCase().includes(indicator))) {
        this.results.warnings++;
        this.results.warnings_list.push(`${varName} contains development-like value in production`);
        this.log(`Warning: ${varName} may contain development value in production`, 'warn');
      }
    }
    
    // 3. Check for weak secrets
    if (varName.includes('SECRET') || varName.includes('PASSWORD')) {
      if (value.length < 16) {
        this.results.warnings++;
        this.results.warnings_list.push(`${varName} is shorter than recommended minimum (16 characters)`);
        this.log(`Warning: ${varName} is shorter than recommended`, 'warn');
      }
    }
  }

  async performSecurityChecks() {
    this.log('Performing additional security checks...', 'security');
    
    // Check for credential exposure in logs
    this.checkCredentialExposure();
    
    // Verify HTTPS usage
    this.verifyHttpsUsage();
    
    // Check environment isolation
    this.checkEnvironmentIsolation();
  }

  checkCredentialExposure() {
    // Check if any environment variables might be exposed
    const publicVars = Object.keys(process.env).filter(key => key.startsWith('NEXT_PUBLIC_'));
    const sensitivePatterns = ['password', 'secret', 'key', 'token'];
    
    for (const varName of publicVars) {
      if (sensitivePatterns.some(pattern => varName.toLowerCase().includes(pattern))) {
        this.results.warnings++;
        this.results.warnings_list.push(`Public variable ${varName} contains sensitive-sounding name`);
        this.log(`Warning: Public variable ${varName} has sensitive-sounding name`, 'warn');
      }
    }
  }

  verifyHttpsUsage() {
    const urlVars = ['NEXT_PUBLIC_WP_URL', 'WP_API_BASE'];
    
    for (const varName of urlVars) {
      const value = process.env[varName];
      if (value && !value.startsWith('https://')) {
        this.results.warnings++;
        this.results.warnings_list.push(`${varName} is not using HTTPS`);
        this.log(`Warning: ${varName} should use HTTPS`, 'warn');
      }
    }
  }

  checkEnvironmentIsolation() {
    const environment = this.detectEnvironment();
    
    if (environment === 'development') {
      const sensitiveVars = Object.keys(SECURITY_REQUIREMENTS).filter(
        key => SECURITY_REQUIREMENTS[key].sensitive
      );
      
      const presentSensitiveVars = sensitiveVars.filter(key => process.env[key]);
      
      if (presentSensitiveVars.length > 0) {
        this.results.warnings++;
        this.results.warnings_list.push(`Sensitive variables present in development: ${presentSensitiveVars.join(', ')}`);
        this.log(`Warning: Sensitive variables should not be present in development environment`, 'warn');
      }
    }
  }

  async testConnections() {
    this.log('Testing secure connections...', 'security');
    
    // Test WordPress connection
    await this.testWordPressConnection();
    
    // Test revalidation endpoint (if in appropriate environment)
    const environment = this.detectEnvironment();
    if (environment !== 'development') {
      await this.testRevalidationSecurity();
    }
  }

  async testWordPressConnection() {
    const wpApiBase = process.env.WP_API_BASE;
    const wpUsername = process.env.WP_USERNAME;
    const wpPassword = process.env.WP_APP_PASSWORD;
    
    if (!wpApiBase || !wpUsername || !wpPassword) {
      this.log('Cannot test WordPress connection - missing credentials', 'warn');
      return false;
    }

    try {
      const testUrl = `${wpApiBase}/posts?per_page=1`;
      const auth = Buffer.from(`${wpUsername}:${wpPassword}`).toString('base64');
      
      const response = await this.makeHttpsRequest(testUrl, {
        'Authorization': `Basic ${auth}`,
        'User-Agent': 'Zawaya-Security-Verifier/1.0'
      });

      if (response.statusCode === 200) {
        this.log('WordPress connection secure and functional', 'security');
        return true;
      } else if (response.statusCode === 401) {
        this.results.failed++;
        this.results.errors.push('WordPress authentication failed - check credentials');
        this.log('WordPress authentication failed', 'error');
        return false;
      } else {
        this.log(`WordPress API returned status ${response.statusCode}`, 'warn');
        return false;
      }
    } catch (error) {
      this.log(`WordPress connection test failed: ${error.message}`, 'error');
      return false;
    }
  }

  async testRevalidationSecurity() {
    const revalidationSecret = process.env.REVALIDATION_SECRET;
    if (!revalidationSecret) {
      this.log('Cannot test revalidation security - missing secret', 'warn');
      return false;
    }

    // Test with correct secret (should succeed)
    try {
      const baseUrl = process.env.VERCEL_URL 
        ? `https://${process.env.VERCEL_URL}` 
        : 'http://localhost:3000';
      
      const testUrl = `${baseUrl}/api/revalidate`;
      
      const response = await this.makeHttpsRequest(testUrl, {
        'Content-Type': 'application/json'
      }, 'POST', JSON.stringify({
        secret: revalidationSecret,
        paths: ['/test']
      }));

      if (response.statusCode === 200) {
        this.log('Revalidation endpoint security verified', 'security');
        return true;
      } else {
        this.log(`Revalidation endpoint returned status ${response.statusCode}`, 'warn');
        return false;
      }
    } catch (error) {
      this.log(`Revalidation security test failed: ${error.message}`, 'warn');
      return false;
    }
  }

  makeHttpsRequest(url, headers = {}, method = 'GET', body = null) {
    return new Promise((resolve, reject) => {
      const urlObj = new URL(url);
      const options = {
        hostname: urlObj.hostname,
        port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
        path: urlObj.pathname + urlObj.search,
        method: method,
        headers: headers,
        timeout: 10000
      };

      const client = urlObj.protocol === 'https:' ? https : require('http');
      const req = client.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: data
          });
        });
      });

      req.on('error', reject);
      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });

      if (body) {
        req.write(body);
      }
      
      req.end();
    });
  }

  generateSecurityReport() {
    const total = this.results.passed + this.results.failed;
    
    this.log('\n=== Security Configuration Report ===', 'security');
    this.log(`Environment variables checked: ${total}`, 'info');
    this.log(`Passed: ${this.results.passed}`, 'info');
    this.log(`Failed: ${this.results.failed}`, this.results.failed > 0 ? 'error' : 'info');
    this.log(`Warnings: ${this.results.warnings}`, this.results.warnings > 0 ? 'warn' : 'info');
    
    if (this.results.errors.length > 0) {
      this.log('\nSecurity Errors:', 'error');
      this.results.errors.forEach(error => this.log(`  - ${error}`, 'error'));
    }
    
    if (this.results.warnings_list.length > 0) {
      this.log('\nSecurity Warnings:', 'warn');
      this.results.warnings_list.forEach(warning => this.log(`  - ${warning}`, 'warn'));
    }
    
    const success = this.results.failed === 0;
    const securityLevel = success && this.results.warnings === 0 ? 'SECURE' : 
                         success ? 'SECURE (with warnings)' : 'INSECURE';
    
    this.log(`\nSecurity Status: ${securityLevel}`, success ? 'security' : 'error');
    
    // Provide recommendations
    if (this.results.failed > 0 || this.results.warnings > 0) {
      this.log('\nRecommendations:', 'info');
      
      if (this.results.failed > 0) {
        this.log('  1. Fix all failed security checks before deploying to production', 'info');
      }
      
      if (this.results.warnings > 0) {
        this.log('  2. Review and address security warnings', 'info');
      }
      
      this.log('  3. Ensure sensitive variables are marked as "Sensitive" in Vercel', 'info');
      this.log('  4. Restrict sensitive variables to Production and Preview environments only', 'info');
      this.log('  5. Regularly rotate credentials (WordPress app passwords every 90 days)', 'info');
    }
    
    return {
      success,
      securityLevel,
      passed: this.results.passed,
      failed: this.results.failed,
      warnings: this.results.warnings,
      errors: this.results.errors,
      warnings_list: this.results.warnings_list
    };
  }
}

// Main execution
async function main() {
  const verifier = new SecurityVerifier();
  
  try {
    // Verify security configuration
    const configResult = await verifier.verifySecurityConfiguration();
    
    // Test connections if configuration is valid
    if (configResult.failed === 0) {
      await verifier.testConnections();
    }
    
    // Exit with appropriate code
    process.exit(configResult.success ? 0 : 1);
    
  } catch (error) {
    console.error('Security verification failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { SecurityVerifier };