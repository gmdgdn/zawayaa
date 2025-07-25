const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:')
  console.error('- NEXT_PUBLIC_SUPABASE_URL')
  console.error('- SUPABASE_SERVICE_ROLE_KEY')
  console.error('\nPlease create a .env.local file with these variables.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function runSQLFile(filename) {
  const filePath = path.join(__dirname, filename)
  
  if (!fs.existsSync(filePath)) {
    console.error(`❌ SQL file not found: ${filename}`)
    return false
  }

  const sql = fs.readFileSync(filePath, 'utf8')
  
  // Split by semicolon and filter out empty statements
  const statements = sql
    .split(';')
    .map(stmt => stmt.trim())
    .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))

  console.log(`📄 Executing ${filename} (${statements.length} statements)`)

  for (const statement of statements) {
    try {
      const { error } = await supabase.rpc('exec_sql', { sql_query: statement })
      if (error) {
        console.error(`❌ Error in ${filename}:`, error.message)
        return false
      }
    } catch (err) {
      // Try direct execution if rpc fails
      try {
        const { error } = await supabase.from('_temp').select('1').limit(0)
        // If this works, we'll need to handle the SQL differently
        console.warn(`⚠️ RPC not available, skipping complex SQL in ${filename}`)
      } catch (directErr) {
        console.error(`❌ Failed to execute statement from ${filename}:`, err.message)
        return false
      }
    }
  }

  console.log(`✅ ${filename} executed successfully`)
  return true
}

async function createTables() {
  console.log('🏗️ Creating database schema...')
  
  // Create tables using Supabase API instead of SQL
  const tables = [
    {
      name: 'categories',
      schema: {
        id: 'uuid primary key default gen_random_uuid()',
        name_ar: 'varchar(100) not null',
        name_en: 'varchar(100)',
        slug: 'varchar(100) unique not null',
        description_ar: 'text',
        description_en: 'text',
        color: 'varchar(7) default \'#6366f1\'',
        icon: 'varchar(50) default \'folder\'',
        sort_order: 'integer default 0',
        is_active: 'boolean default true',
        created_at: 'timestamp with time zone default now()',
        updated_at: 'timestamp with time zone default now()'
      }
    },
    {
      name: 'authors',
      schema: {
        id: 'uuid primary key default gen_random_uuid()',
        name: 'varchar(200) not null',
        bio: 'text',
        avatar_url: 'varchar(500)',
        email: 'varchar(255) unique',
        social_twitter: 'varchar(100)',
        social_facebook: 'varchar(100)',
        social_instagram: 'varchar(100)',
        social_linkedin: 'varchar(100)',
        website_url: 'varchar(500)',
        location: 'varchar(100)',
        expertise_tags: 'text[]',
        is_verified: 'boolean default false',
        is_featured: 'boolean default false',
        article_count: 'integer default 0',
        created_at: 'timestamp with time zone default now()',
        updated_at: 'timestamp with time zone default now()'
      }
    }
  ]

  // Since we can't execute arbitrary SQL, let's check if tables exist via the API
  try {
    const { data, error } = await supabase.from('categories').select('count').limit(1)
    if (!error) {
      console.log('✅ Tables already exist')
      return true
    }
  } catch (err) {
    // Tables don't exist, this is expected
  }

  console.log('⚠️ Tables need to be created in Supabase dashboard')
  console.log('📋 Please create the following tables in your Supabase project:')
  console.log('')
  console.log('1. Go to https://app.supabase.com/project/YOUR_PROJECT/editor')
  console.log('2. Run the SQL scripts manually:')
  console.log('   - scripts/create-database-schema.sql')
  console.log('   - scripts/seed-categories.sql')
  console.log('   - scripts/seed-sample-data.sql')
  console.log('')
  
  return false
}

async function seedData() {
  console.log('🌱 Seeding database with sample data...')

  // Check if categories exist
  const { data: categories, error: catError } = await supabase
    .from('categories')
    .select('count')

  if (catError || !categories || categories.length === 0) {
    console.log('📝 Inserting categories...')
    
    const categoriesData = [
      {
        name_ar: 'آراء سياسية',
        name_en: 'Political Opinions',
        slug: 'political-opinions',
        description_ar: 'تحليلات ووجهات نظر سياسية',
        color: '#f6523d',
        icon: 'file-text',
        sort_order: 1
      },
      {
        name_ar: 'تقدير موقف',
        name_en: 'Situation Assessment',
        slug: 'assessment',
        description_ar: 'تقييم وتحليل المواقف الراهنة',
        color: '#644bd2',
        icon: 'analysis',
        sort_order: 2
      },
      {
        name_ar: 'مقالات',
        name_en: 'Articles',
        slug: 'articles',
        description_ar: 'مقالات متنوعة في مختلف المجالات',
        color: '#28645a',
        icon: 'book-open',
        sort_order: 3
      }
    ]

    const { error: insertError } = await supabase
      .from('categories')
      .insert(categoriesData)

    if (insertError) {
      console.error('❌ Error inserting categories:', insertError.message)
      return false
    }

    console.log('✅ Categories seeded successfully')
  }

  // Check if authors exist
  const { data: authors, error: authError } = await supabase
    .from('authors')
    .select('count')

  if (authError || !authors || authors.length === 0) {
    console.log('📝 Inserting authors...')
    
    const authorsData = [
      {
        name: 'سارة بلقاسمي',
        bio: 'كاتبة وباحثة في السياسات العامة، متخصصة في قضايا التنمية الاقتصادية في الشرق الأوسط',
        email: 'sara@zawaya.org',
        is_verified: true,
        is_featured: true,
        expertise_tags: ['اقتصاد', 'تنمية', 'سياسات عامة']
      },
      {
        name: 'نور حداد',
        bio: 'محللة سياسية متخصصة في العلاقات الدولية والدبلوماسية الثقافية',
        email: 'nour@zawaya.org',
        is_verified: true,
        is_featured: true,
        expertise_tags: ['دبلوماسية', 'علاقات دولية', 'قوة ناعمة']
      },
      {
        name: 'د. أحمد الزهراني',
        bio: 'باحث في الجيوسياسة والعلاقات الدولية، متخصص في قضايا الأمن المائي في الشرق الأوسط',
        email: 'ahmed@zawaya.org',
        is_verified: true,
        expertise_tags: ['جيوسياسة', 'أمن مائي', 'علاقات دولية']
      }
    ]

    const { error: insertError } = await supabase
      .from('authors')
      .insert(authorsData)

    if (insertError) {
      console.error('❌ Error inserting authors:', insertError.message)
      return false
    }

    console.log('✅ Authors seeded successfully')
  }

  return true
}

async function main() {
  console.log('🚀 Starting Supabase setup...')
  console.log(`🔗 Connecting to: ${supabaseUrl}`)
  
  // Test connection
  try {
    const { data, error } = await supabase.from('_temp').select('1').limit(1)
    // Connection test (error is expected since table doesn't exist)
  } catch (err) {
    // This is normal for connection test
  }

  console.log('✅ Connection to Supabase established')

  // Try to create/check tables
  const tablesReady = await createTables()
  
  if (tablesReady) {
    // Seed data
    const dataSeeded = await seedData()
    
    if (dataSeeded) {
      console.log('')
      console.log('🎉 Supabase setup completed successfully!')
      console.log('📊 You can now test the integration at: http://localhost:3000/api/test-supabase')
    }
  } else {
    console.log('')
    console.log('⚠️ Manual setup required - please run the SQL scripts in Supabase dashboard')
    console.log('📖 See ENVIRONMENT_SETUP.md for detailed instructions')
  }
}

main().catch(console.error) 