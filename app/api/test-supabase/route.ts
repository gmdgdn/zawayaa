import { NextRequest, NextResponse } from 'next/server'
import { supabase, supabaseAdmin } from '@/lib/supabase'
import { dbUtils } from '@/lib/database'

export async function GET(request: NextRequest) {
  const tests = []
  let overallStatus = 'success'

  // Test 1: Environment Variables
  tests.push({
    name: 'Environment Variables',
    status: process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'success' : 'failed',
    details: {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing',
      anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Missing',
      serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Set' : 'Missing'
    }
  })

  // Test 2: Basic Connection
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('count')
      .limit(1)

    tests.push({
      name: 'Basic Supabase Connection',
      status: error ? 'failed' : 'success',
      details: error ? { error: error.message } : { message: 'Connection successful' }
    })

    if (error) overallStatus = 'failed'
  } catch (error) {
    tests.push({
      name: 'Basic Supabase Connection',
      status: 'failed',
      details: { error: error instanceof Error ? error.message : 'Unknown error' }
    })
    overallStatus = 'failed'
  }

  // Test 3: Admin Connection
  try {
    const { data, error } = await supabaseAdmin
      .from('categories')
      .select('count')
      .limit(1)

    tests.push({
      name: 'Admin Supabase Connection',
      status: error ? 'failed' : 'success',
      details: error ? { error: error.message } : { message: 'Admin connection successful' }
    })

    if (error) overallStatus = 'failed'
  } catch (error) {
    tests.push({
      name: 'Admin Supabase Connection',
      status: 'failed',
      details: { error: error instanceof Error ? error.message : 'Unknown error' }
    })
    overallStatus = 'failed'
  }

  // Test 4: Database Schema Check
  try {
    const { data: tablesData, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .in('table_name', ['articles', 'authors', 'categories', 'programs', 'episodes'])

    const expectedTables = ['articles', 'authors', 'categories', 'programs', 'episodes']
    const existingTables = tablesData?.map(t => t.table_name) || []
    const missingTables = expectedTables.filter(table => !existingTables.includes(table))

    tests.push({
      name: 'Database Schema',
      status: missingTables.length === 0 ? 'success' : 'partial',
      details: {
        expectedTables,
        existingTables,
        missingTables
      }
    })

    if (missingTables.length > 0) overallStatus = 'partial'
  } catch (error) {
    tests.push({
      name: 'Database Schema',
      status: 'failed',
      details: { error: error instanceof Error ? error.message : 'Could not check schema' }
    })
    overallStatus = 'failed'
  }

  // Test 5: Sample Data Check
  try {
    const [categoriesResult, authorsResult] = await Promise.all([
      supabase.from('categories').select('count'),
      supabase.from('authors').select('count')
    ])

    tests.push({
      name: 'Sample Data',
      status: 'success',
      details: {
        categories: categoriesResult.count || 0,
        authors: authorsResult.count || 0,
        hasCategories: (categoriesResult.count || 0) > 0,
        hasAuthors: (authorsResult.count || 0) > 0
      }
    })
  } catch (error) {
    tests.push({
      name: 'Sample Data',
      status: 'failed',
      details: { error: error instanceof Error ? error.message : 'Could not check data' }
    })
  }

  // Test 6: Database Utils
  try {
    const dbConnectionCheck = await dbUtils.checkConnection()
    
    tests.push({
      name: 'Database Utils',
      status: dbConnectionCheck ? 'success' : 'failed',
      details: { connectionCheck: dbConnectionCheck }
    })
  } catch (error) {
    tests.push({
      name: 'Database Utils',
      status: 'failed',
      details: { error: error instanceof Error ? error.message : 'Utils check failed' }
    })
  }

  return NextResponse.json({
    overallStatus,
    timestamp: new Date().toISOString(),
    tests,
    recommendations: generateRecommendations(tests)
  })
}

function generateRecommendations(tests: any[]) {
  const recommendations = []

  const envTest = tests.find(t => t.name === 'Environment Variables')
  if (envTest?.status === 'failed') {
    recommendations.push({
      issue: 'Missing Environment Variables',
      solution: 'Create .env.local file with NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY'
    })
  }

  const connectionTest = tests.find(t => t.name === 'Basic Supabase Connection')
  if (connectionTest?.status === 'failed') {
    recommendations.push({
      issue: 'Supabase Connection Failed',
      solution: 'Check if Supabase project exists and URL/keys are correct. Verify project is not paused.'
    })
  }

  const schemaTest = tests.find(t => t.name === 'Database Schema')
  if (schemaTest?.status === 'partial' || schemaTest?.status === 'failed') {
    recommendations.push({
      issue: 'Missing Database Tables',
      solution: 'Run database schema creation scripts: npm run db:setup or manually execute scripts/create-database-schema.sql'
    })
  }

  const dataTest = tests.find(t => t.name === 'Sample Data')
  if (dataTest?.details?.hasCategories === false || dataTest?.details?.hasAuthors === false) {
    recommendations.push({
      issue: 'Missing Sample Data',
      solution: 'Run data seeding scripts: execute scripts/seed-categories.sql and scripts/seed-sample-data.sql'
    })
  }

  return recommendations
} 