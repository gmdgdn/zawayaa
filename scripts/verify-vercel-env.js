#!/usr/bin/env node

/**
 * Vercel Environment Variables Verification Script
 * 
 * This script verifies that all required environment variables are properly
 * configured for the WordPress integration in production.
 */

const https = require('https');
const { URL } = require('url');

// Required environment variables
const REQUIRED_ENV_VARS = {
  // WordPress connection
  'NEXT_PUBLIC_WP_URL': {
    required: true,
    sensitive: false,
    description: 'WordPress site URL'
  },
  'WP_API_BASE': {
    required: true,
    sensitive: false,
    description: 'WordPress REST API base URL'
  },
  'WP_USERNAME': {
    required: true,
    sensitive: true,
    description: 'WordPress application user'
  },
  'WP_APP_PASSWORD': {
    required: true,
    sensitive: true,
    description: 'WordPress application password'
  },
  // Security
  'REVALIDATION_SECRET': {
    required: true,
    sensitive: true,
    description: 'Webhook revalidation secret'
  }
};

// Expected values for verification
const EXPECTED_VALUES = {
  'NEXT_PUBLIC_WP_URL': 'https://wordpress-1401009-5702602.cloudwaysapps.com',
  'REVALIDATION_SECRET': 'zawaya-wp-revalidation-2025-secure-token'
};

class EnvironmentVerifier {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      warnings: 0,
      errors: []
    };
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = {
      'info': '✓',
      'warn': '⚠',
      'error': '✗',
      'debug': '→'
    }[type] || 'ℹ';
    
    console.log(`${prefix} [${timestamp}] ${message}`);
  }

  async verifyEnvironmentVariables() {
    this.log('Starting environment variables verification...', 'info');
    
    for (const [varName, config] of Object.entries(REQUIRED_ENV_VARS)) {
      await this.verifyVariable(varName, config);
    }
    
    return this.generateReport();
  }

  async verifyVariable(varName, config) {
    const value = process.env[varName];
    
    if (!value) {
      this.results.failed++;
      this.results.errors.push(`Missing required environment variable: ${varName}`);
      this.log(`Missing: ${varName} - ${config.description}`, 'error');
      return;
    }

    // Check if value matches expected (for non-sensitive vars)
    if (EXPECTED_VALUES[varName] && !config.sensitive) {
      if (value !== EXPECTED_VALUES[varName]) {
        this.results.warnings++;
        this.log(`Unexpected value for ${varName}. Expected: ${EXPECTED_VALUES[varName]}, Got: ${value}`, 'warn');
      } else {
        this.results.passed++;
        this.log(`Verified: ${varName}`, 'info');
      }
    } else if (config.sensitive) {
      // For sensitive variables, just check they're set and have reasonable length
      if (varName === 'WP_APP_PASSWORD' && value.length !== 24) {
        this.results.warnings++;
        this.log(`WordPress app password should be 24 characters, got ${value.length}`, 'warn');
      } else if (varName === 'REVALIDATION_SECRET' && EXPECTED_VALUES[varName] && value !== EXPECTED_VALUES[varName]) {
        this.results.warnings++;
        this.log(`Revalidation secret doesn't match expected value`, 'warn');
      } else {
        this.results.passed++;
        this.log(`Verified: ${varName} (${config.sensitive ? 'sensitive' : 'public'})`, 'info');
      }
    } else {
      this.results.passed++;
      this.log(`Verified: ${varName}`, 'info');
    }
  }

  async testWordPressConnection() {
    this.log('Testing WordPress API connection...', 'info');
    
    const wpApiBase = process.env.WP_API_BASE;
    const wpUsername = process.env.WP_USERNAME;
    const wpPassword = process.env.WP_APP_PASSWORD;
    
    if (!wpApiBase || !wpUsername || !wpPassword) {
      this.log('Cannot test WordPress connection - missing credentials', 'error');
      return false;
    }

    try {
      const testUrl = `${wpApiBase}/posts?per_page=1`;
      const auth = Buffer.from(`${wpUsername}:${wpPassword}`).toString('base64');
      
      const response = await this.makeHttpsRequest(testUrl, {
        'Authorization': `Basic ${auth}`,
        'User-Agent': 'Zawaya-Vercel-Env-Verifier/1.0'
      });

      if (response.statusCode === 200) {
        this.log('WordPress API connection successful', 'info');
        return true;
      } else {
        this.log(`WordPress API returned status ${response.statusCode}`, 'error');
        return false;
      }
    } catch (error) {
      this.log(`WordPress API connection failed: ${error.message}`, 'error');
      return false;
    }
  }

  async testRevalidationEndpoint() {
    this.log('Testing revalidation endpoint...', 'info');
    
    const revalidationSecret = process.env.REVALIDATION_SECRET;
    if (!revalidationSecret) {
      this.log('Cannot test revalidation - missing secret', 'error');
      return false;
    }

    // In a real deployment, this would test the actual revalidation endpoint
    // For now, we just verify the secret is set correctly
    if (revalidationSecret === EXPECTED_VALUES.REVALIDATION_SECRET) {
      this.log('Revalidation secret matches expected value', 'info');
      return true;
    } else {
      this.log('Revalidation secret does not match expected value', 'warn');
      return false;
    }
  }

  makeHttpsRequest(url, headers = {}) {
    return new Promise((resolve, reject) => {
      const urlObj = new URL(url);
      const options = {
        hostname: urlObj.hostname,
        port: urlObj.port || 443,
        path: urlObj.pathname + urlObj.search,
        method: 'GET',
        headers: headers,
        timeout: 10000
      };

      const req = https.request(options, (res) => {
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

      req.end();
    });
  }

  generateReport() {
    const total = this.results.passed + this.results.failed + this.results.warnings;
    
    this.log('\n=== Environment Variables Verification Report ===', 'info');
    this.log(`Total variables checked: ${total}`, 'info');
    this.log(`Passed: ${this.results.passed}`, 'info');
    this.log(`Failed: ${this.results.failed}`, this.results.failed > 0 ? 'error' : 'info');
    this.log(`Warnings: ${this.results.warnings}`, this.results.warnings > 0 ? 'warn' : 'info');
    
    if (this.results.errors.length > 0) {
      this.log('\nErrors found:', 'error');
      this.results.errors.forEach(error => this.log(`  - ${error}`, 'error'));
    }
    
    const success = this.results.failed === 0;
    this.log(`\nOverall status: ${success ? 'PASSED' : 'FAILED'}`, success ? 'info' : 'error');
    
    return {
      success,
      passed: this.results.passed,
      failed: this.results.failed,
      warnings: this.results.warnings,
      errors: this.results.errors
    };
  }
}

// Main execution
async function main() {
  const verifier = new EnvironmentVerifier();
  
  try {
    // Verify environment variables
    const envResult = await verifier.verifyEnvironmentVariables();
    
    // Test WordPress connection if env vars are set
    if (envResult.failed === 0) {
      await verifier.testWordPressConnection();
      await verifier.testRevalidationEndpoint();
    }
    
    // Exit with appropriate code
    process.exit(envResult.success ? 0 : 1);
    
  } catch (error) {
    console.error('Verification failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { EnvironmentVerifier };