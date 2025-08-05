/**
 * End-to-End Test Runner for Arabic Platform
 * Orchestrates comprehensive testing across user journeys, editorial workflows, and compatibility
 */

import { execSync } from 'child_process'
import { writeFileSync } from 'fs'

interface TestResult {
  suite: string
  passed: number
  failed: number
  skipped: number
  duration: number
  errors: string[]
}

interface TestReport {
  timestamp: string
  totalTests: number
  totalPassed: number
  totalFailed: number
  totalSkipped: number
  totalDuration: number
  suites: TestResult[]
  summary: string
}

class E2ETestRunner {
  private results: TestResult[] = []

  async runTestSuite(suiteName: string, testFile: string): Promise<TestResult> {
    console.log(`\n🧪 Running ${suiteName}...`)
    
    const startTime = Date.now()
    let passed = 0
    let failed = 0
    let skipped = 0
    const errors: string[] = []

    try {
      // Run the test file using vitest
      const output = execSync(`npx vitest run ${testFile} --reporter=json`, {
        encoding: 'utf-8',
        stdio: 'pipe'
      })

      // Parse vitest JSON output (simplified)
      try {
        const testOutput = JSON.parse(output)
        passed = testOutput.numPassedTests || 0
        failed = testOutput.numFailedTests || 0
        skipped = testOutput.numPendingTests || 0
      } catch {
        // Fallback: count based on console output patterns
        const lines = output.split('\n')
        passed = lines.filter(line => line.includes('✓')).length
        failed = lines.filter(line => line.includes('✗')).length
        skipped = lines.filter(line => line.includes('○')).length
      }

      console.log(`✅ ${suiteName}: ${passed} passed, ${failed} failed, ${skipped} skipped`)
    } catch (error: any) {
      console.log(`❌ ${suiteName}: Test execution failed`)
      errors.push(error.message)
      failed = 1
    }

    const duration = Date.now() - startTime

    return {
      suite: suiteName,
      passed,
      failed,
      skipped,
      duration,
      errors
    }
  }

  async runAllTests(): Promise<TestReport> {
    console.log('🚀 Starting Arabic Platform End-to-End Tests\n')

    // Define test suites
    const testSuites = [
      {
        name: 'Arabic User Journeys',
        file: 'test/e2e/arabic-user-journeys.test.tsx',
        description: 'Complete user flows from homepage to content consumption'
      },
      {
        name: 'Arabic Editorial Workflows',
        file: 'test/e2e/arabic-editorial-workflows.test.tsx',
        description: 'Content management and editorial processes'
      },
      {
        name: 'Cross-Browser Compatibility',
        file: 'test/e2e/arabic-cross-browser-compatibility.test.tsx',
        description: 'Browser and device compatibility testing'
      }
    ]

    // Run each test suite
    for (const suite of testSuites) {
      console.log(`📋 ${suite.description}`)
      const result = await this.runTestSuite(suite.name, suite.file)
      this.results.push(result)
    }

    // Generate report
    const report = this.generateReport()
    this.saveReport(report)
    this.printSummary(report)

    return report
  }

  private generateReport(): TestReport {
    const totalPassed = this.results.reduce((sum, result) => sum + result.passed, 0)
    const totalFailed = this.results.reduce((sum, result) => sum + result.failed, 0)
    const totalSkipped = this.results.reduce((sum, result) => sum + result.skipped, 0)
    const totalDuration = this.results.reduce((sum, result) => sum + result.duration, 0)
    const totalTests = totalPassed + totalFailed + totalSkipped

    let summary = ''
    if (totalFailed === 0) {
      summary = `✅ All ${totalTests} tests passed successfully!`
    } else {
      summary = `❌ ${totalFailed} out of ${totalTests} tests failed.`
    }

    return {
      timestamp: new Date().toISOString(),
      totalTests,
      totalPassed,
      totalFailed,
      totalSkipped,
      totalDuration,
      suites: this.results,
      summary
    }
  }

  private saveReport(report: TestReport): void {
    const reportPath = 'test/e2e/E2E_TEST_REPORT.json'
    writeFileSync(reportPath, JSON.stringify(report, null, 2))
    console.log(`\n📊 Detailed report saved to: ${reportPath}`)
  }

  private printSummary(report: TestReport): void {
    console.log('\n' + '='.repeat(60))
    console.log('📈 ARABIC PLATFORM E2E TEST SUMMARY')
    console.log('='.repeat(60))
    console.log(`🕐 Execution Time: ${(report.totalDuration / 1000).toFixed(2)}s`)
    console.log(`📊 Total Tests: ${report.totalTests}`)
    console.log(`✅ Passed: ${report.totalPassed}`)
    console.log(`❌ Failed: ${report.totalFailed}`)
    console.log(`⏭️  Skipped: ${report.totalSkipped}`)
    console.log(`📈 Success Rate: ${((report.totalPassed / report.totalTests) * 100).toFixed(1)}%`)
    
    console.log('\n📋 Suite Breakdown:')
    report.suites.forEach(suite => {
      const status = suite.failed === 0 ? '✅' : '❌'
      console.log(`  ${status} ${suite.suite}: ${suite.passed}/${suite.passed + suite.failed + suite.skipped} (${(suite.duration / 1000).toFixed(1)}s)`)
      
      if (suite.errors.length > 0) {
        suite.errors.forEach(error => {
          console.log(`    ⚠️  ${error}`)
        })
      }
    })

    console.log(`\n${report.summary}`)
    console.log('='.repeat(60))
  }
}

// Export for programmatic use
export { E2ETestRunner, TestResult, TestReport }

// CLI execution
if (require.main === module) {
  const runner = new E2ETestRunner()
  runner.runAllTests().then(report => {
    process.exit(report.totalFailed > 0 ? 1 : 0)
  }).catch(error => {
    console.error('❌ Test runner failed:', error)
    process.exit(1)
  })
}