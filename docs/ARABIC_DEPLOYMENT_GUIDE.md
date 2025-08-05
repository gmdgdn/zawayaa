# 🚀 دليل النشر والصيانة لمنصة زوايا | Zawaya Deployment & Maintenance Guide

## 📋 فهرس المحتويات | Table of Contents

- [🏗️ متطلبات النشر | Deployment Requirements](#requirements)
- [🔧 إعداد البيئة | Environment Setup](#environment)
- [🚀 النشر على Vercel | Vercel Deployment](#vercel)
- [🗄️ إعداد قاعدة البيانات | Database Setup](#database)
- [📊 المراقبة والصيانة | Monitoring & Maintenance](#monitoring)
- [🔒 الأمان والنسخ الاحتياطية | Security & Backups](#security)

---

## 🏗️ متطلبات النشر | Deployment Requirements {#requirements}

### المتطلبات التقنية | Technical Requirements

| المكون | الإصدار المطلوب | الغرض |
|--------|----------------|-------|
| **Node.js** | 18.0+ | تشغيل التطبيق |
| **npm/yarn/pnpm** | Latest | إدارة الحزم |
| **Supabase Project** | Latest | قاعدة البيانات والمصادقة |
| **Vercel Account** | - | منصة الاستضافة |
| **Domain** | اختياري | النطاق المخصص |

### الخدمات الخارجية | External Services

#### خدمات أساسية | Essential Services
- **Supabase** - قاعدة البيانات والمصادقة
- **Vercel** - الاستضافة والنشر

#### خدمات اختيارية | Optional Services  
- **PlayHT** - تحويل النص إلى صوت
- **Resend** - خدمة البريد الإلكتروني
- **Google Analytics** - تحليلات الموقع

---

## 🔧 إعداد البيئة | Environment Setup {#environment}

### متغيرات البيئة الأساسية | Essential Environment Variables

```bash
# Supabase Configuration (مطلوب | Required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anonymous_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Base URL (مطلوب | Required)
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

### متغيرات البيئة الاختيارية | Optional Environment Variables

```bash
# TTS Service - PlayHT (اختياري | Optional)
PLAYHT_API_KEY=your_playht_api_key
PLAYHT_USER_ID=your_playht_user_id

# Email Service - Resend (اختياري | Optional)
RESEND_API_KEY=your_resend_api_key

# Analytics (اختياري | Optional)
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID

# Development (للتطوير فقط | Development only)
NODE_ENV=production
```

### إنشاء ملف البيئة | Creating Environment File

```bash
# إنشاء ملف .env.local
cp .env.example .env.local

# تحرير المتغيرات
nano .env.local
```

---

## 🚀 النشر على Vercel | Vercel Deployment {#vercel}

### الطريقة الأولى: النشر التلقائي | Automatic Deployment

#### 1. ربط المستودع | Connect Repository
```bash
# تسجيل الدخول إلى Vercel
npx vercel login

# ربط المشروع
npx vercel link

# نشر المشروع
npx vercel --prod
```

#### 2. إعداد متغيرات البيئة | Environment Variables Setup
```bash
# إضافة متغيرات البيئة عبر CLI
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY  
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add NEXT_PUBLIC_BASE_URL
```

### الطريقة الثانية: واجهة Vercel | Vercel Dashboard

#### 1. إنشاء مشروع جديد
1. اذهب إلى [vercel.com](https://vercel.com)
2. انقر على "New Project"
3. اختر مستودع GitHub
4. اختر إطار العمل: **Next.js**

#### 2. إعداد المتغيرات
```
Settings → Environment Variables → Add New
```

| المتغير | القيمة | البيئة |
|---------|-------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | https://xxx.supabase.co | Production |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | eyJ... | Production |
| `SUPABASE_SERVICE_ROLE_KEY` | eyJ... | Production |
| `NEXT_PUBLIC_BASE_URL` | https://zawaya.org | Production |

#### 3. إعدادات البناء | Build Settings
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "devCommand": "npm run dev"
}
```

---

## 🗄️ إعداد قاعدة البيانات | Database Setup {#database}

### إنشاء مشروع Supabase | Creating Supabase Project

#### 1. إنشاء المشروع
```bash
# تسجيل الدخول إلى Supabase
npx supabase login

# إنشاء مشروع جديد
npx supabase projects create zawaya-platform

# ربط المشروع المحلي
npx supabase link --project-ref your-project-id
```

#### 2. تشغيل سكريبتات قاعدة البيانات | Database Scripts
```bash
# تشغيل سكريبت الإعداد الرئيسي
node scripts/setup-supabase.js

# أو تشغيل السكريبتات يدوياً
psql $DATABASE_URL -f scripts/create-database-schema.sql
psql $DATABASE_URL -f scripts/seed-categories.sql
psql $DATABASE_URL -f scripts/seed-sample-data.sql
```

### سكريبتات قاعدة البيانات | Database Scripts

#### سكريبت الإعداد الشامل | Complete Setup Script
```sql
-- scripts/complete-setup.sql

-- إنشاء الجداول الأساسية
\i scripts/create-database-schema.sql

-- إضافة الفئات الافتراضية  
\i scripts/seed-categories.sql

-- إضافة البيانات التجريبية
\i scripts/seed-sample-data.sql

-- تحسين الأداء للمحتوى العربي
\i scripts/optimize-arabic-content.sql

-- إعداد التخزين
\i scripts/setup-storage.sql

-- إنشاء الدوال المساعدة
\i scripts/create-functions.sql
```

#### فحص صحة قاعدة البيانات | Database Health Check
```sql
-- فحص الجداول المطلوبة
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('articles', 'programs', 'episodes', 'authors', 'categories');

-- فحص الفهارس
SELECT indexname, tablename 
FROM pg_indexes 
WHERE schemaname = 'public' 
AND indexname LIKE '%arabic%';

-- فحص البيانات التجريبية
SELECT 
    (SELECT COUNT(*) FROM articles) as articles_count,
    (SELECT COUNT(*) FROM programs) as programs_count,
    (SELECT COUNT(*) FROM authors) as authors_count,
    (SELECT COUNT(*) FROM categories) as categories_count;
```

---

## 📊 المراقبة والصيانة | Monitoring & Maintenance {#monitoring}

### مراقبة الأداء | Performance Monitoring

#### فحص صحة النظام | System Health Checks
```bash
# فحص سريع للنظام
curl https://your-domain.com/api/health

# فحص شامل لقاعدة البيانات
curl https://your-domain.com/api/test-supabase

# فحص خدمة TTS
curl https://your-domain.com/api/tts/generate?action=status
```

#### مراقبة قاعدة البيانات | Database Monitoring
```sql
-- مراقبة الاستعلامات البطيئة
SELECT query, mean_time, calls, total_time
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;

-- مراقبة حجم الجداول
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- مراقبة الاتصالات النشطة
SELECT count(*) as active_connections
FROM pg_stat_activity 
WHERE state = 'active';
```

### الصيانة الدورية | Regular Maintenance

#### تحسين قاعدة البيانات | Database Optimization
```sql
-- إعادة فهرسة الجداول (أسبوعياً)
REINDEX TABLE articles;
REINDEX TABLE programs; 
REINDEX TABLE episodes;

-- تحليل الإحصائيات (يومياً)
ANALYZE articles;
ANALYZE programs;
ANALYZE episodes;

-- تنظيف البيانات القديمة (شهرياً)
DELETE FROM tts_generations 
WHERE status = 'failed' 
AND created_at < NOW() - INTERVAL '30 days';

-- تحديث العدادات (أسبوعياً)
UPDATE authors SET article_count = (
    SELECT COUNT(*) FROM articles 
    WHERE author_id = authors.id AND published = true
);

UPDATE categories SET article_count = (
    SELECT COUNT(*) FROM articles 
    WHERE category_id = categories.id AND published = true
);
```

#### سكريبت الصيانة التلقائية | Automated Maintenance Script
```bash
#!/bin/bash
# scripts/maintenance.sh

echo "🔧 بدء الصيانة الدورية | Starting routine maintenance"

# تحسين قاعدة البيانات
echo "📊 تحسين قاعدة البيانات | Optimizing database"
psql $DATABASE_URL -c "REINDEX TABLE articles;"
psql $DATABASE_URL -c "ANALYZE articles;"

# تنظيف الملفات المؤقتة
echo "🧹 تنظيف الملفات المؤقتة | Cleaning temporary files"
find /tmp -name "*.tmp" -mtime +7 -delete

# فحص مساحة التخزين
echo "💾 فحص مساحة التخزين | Checking storage space"
df -h

# إرسال تقرير الصيانة
echo "📧 إرسال تقرير الصيانة | Sending maintenance report"
curl -X POST https://your-domain.com/api/maintenance-report

echo "✅ انتهت الصيانة | Maintenance completed"
```

---

## 🔒 الأمان والنسخ الاحتياطية | Security & Backups {#security}

### إعدادات الأمان | Security Settings

#### Row Level Security (RLS)
```sql
-- تفعيل RLS على الجداول الحساسة
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;

-- سياسة قراءة المقالات المنشورة
CREATE POLICY "Public articles are viewable by everyone" 
ON articles FOR SELECT 
USING (published = true);

-- سياسة تحرير المقالات للكتّاب
CREATE POLICY "Authors can edit their own articles" 
ON articles FOR ALL 
USING (auth.uid() = author_id);

-- سياسة الإدارة للمديرين
CREATE POLICY "Admins can manage all content" 
ON articles FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM authors 
        WHERE id = auth.uid() 
        AND role IN ('admin', 'super_admin')
    )
);
```

#### إعدادات CORS
```typescript
// next.config.mjs
const nextConfig = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: 'https://zawaya.org' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type,Authorization' },
        ],
      },
    ]
  },
}
```

### النسخ الاحتياطية | Backups

#### نسخة احتياطية من قاعدة البيانات | Database Backup
```bash
#!/bin/bash
# scripts/backup-database.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/zawaya"
BACKUP_FILE="$BACKUP_DIR/zawaya_backup_$DATE.sql"

# إنشاء مجلد النسخ الاحتياطية
mkdir -p $BACKUP_DIR

# نسخة احتياطية من قاعدة البيانات
echo "📦 إنشاء نسخة احتياطية من قاعدة البيانات | Creating database backup"
pg_dump $DATABASE_URL > $BACKUP_FILE

# ضغط النسخة الاحتياطية
gzip $BACKUP_FILE

# رفع إلى التخزين السحابي (اختياري)
# aws s3 cp $BACKUP_FILE.gz s3://zawaya-backups/database/

# حذف النسخ القديمة (أكثر من 30 يوم)
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete

echo "✅ تمت النسخة الاحتياطية | Backup completed: $BACKUP_FILE.gz"
```

#### نسخة احتياطية من الملفات | Files Backup
```bash
#!/bin/bash
# scripts/backup-files.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/zawaya/files"

# إنشاء مجلد النسخ الاحتياطية
mkdir -p $BACKUP_DIR

# نسخة احتياطية من الملفات المرفوعة
echo "📁 نسخة احتياطية من الملفات | Backing up files"
supabase storage download --bucket media --recursive $BACKUP_DIR/media_$DATE/

# ضغط الملفات
tar -czf $BACKUP_DIR/media_$DATE.tar.gz $BACKUP_DIR/media_$DATE/
rm -rf $BACKUP_DIR/media_$DATE/

echo "✅ تمت نسخة الملفات | Files backup completed"
```

#### جدولة النسخ الاحتياطية | Backup Scheduling
```bash
# إضافة إلى crontab
crontab -e

# نسخة احتياطية يومية في الساعة 2:00 صباحاً
0 2 * * * /path/to/scripts/backup-database.sh

# نسخة احتياطية أسبوعية للملفات يوم الأحد
0 3 * * 0 /path/to/scripts/backup-files.sh

# صيانة دورية كل يوم في الساعة 4:00 صباحاً
0 4 * * * /path/to/scripts/maintenance.sh
```

### استعادة النسخ الاحتياطية | Backup Restoration

#### استعادة قاعدة البيانات | Database Restoration
```bash
#!/bin/bash
# scripts/restore-database.sh

BACKUP_FILE=$1

if [ -z "$BACKUP_FILE" ]; then
    echo "❌ يرجى تحديد ملف النسخة الاحتياطية | Please specify backup file"
    echo "Usage: $0 /path/to/backup.sql.gz"
    exit 1
fi

echo "⚠️  تحذير: سيتم استبدال قاعدة البيانات الحالية | Warning: Current database will be replaced"
read -p "هل تريد المتابعة؟ (y/N) | Continue? (y/N): " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
    # فك ضغط النسخة الاحتياطية
    gunzip -c $BACKUP_FILE > /tmp/restore.sql
    
    # استعادة قاعدة البيانات
    echo "🔄 استعادة قاعدة البيانات | Restoring database"
    psql $DATABASE_URL < /tmp/restore.sql
    
    # تنظيف الملف المؤقت
    rm /tmp/restore.sql
    
    echo "✅ تمت الاستعادة بنجاح | Restoration completed successfully"
else
    echo "❌ تم إلغاء العملية | Operation cancelled"
fi
```

---

## 📞 الدعم والمساعدة | Support & Help

### موارد المساعدة | Support Resources
- 📖 **الوثائق الكاملة:** [docs/](../docs/)
- 🐛 **تتبع المشاكل:** [GitHub Issues](https://github.com/gmdgdn/zawayaa/issues)
- 💬 **المناقشات:** [GitHub Discussions](https://github.com/gmdgdn/zawayaa/discussions)
- 📧 **الدعم الفني:** [support@zawaya.org](mailto:support@zawaya.org)

### قائمة فحص النشر | Deployment Checklist

#### قبل النشر | Pre-deployment
- [ ] فحص متغيرات البيئة
- [ ] اختبار قاعدة البيانات محلياً
- [ ] تشغيل الاختبارات
- [ ] فحص الأمان
- [ ] إعداد النسخ الاحتياطية

#### بعد النشر | Post-deployment  
- [ ] فحص صحة النظام
- [ ] اختبار الوظائف الأساسية
- [ ] مراقبة الأداء
- [ ] إعداد التنبيهات
- [ ] توثيق التغييرات

---

<div align="center">

**تم البناء بـ ❤️ للخطاب الفكري العربي**  
**Built with ❤️ for Arabic intellectual discourse**

[⭐ نجمة على GitHub](https://github.com/gmdgdn/zawayaa) | [🐛 بلاغ عن خطأ](https://github.com/gmdgdn/zawayaa/issues) | [💡 طلب ميزة](https://github.com/gmdgdn/zawayaa/issues/new)

</div>