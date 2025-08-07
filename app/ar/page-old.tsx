export const revalidate = 300

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Clock, User, ArrowLeft, Headphones, Video, FileText } from "lucide-react"
import { Button } from "@/components/atoms/Button"
import { Badge } from "@/components/atoms/Badge"
import { CardArticle } from "@/components/molecules/CardArticle"
import { CardProgram } from "@/components/molecules/CardProgram"
import DevNavigation from "@/components/dev-navigation"

export default async function ArabicHomepage() {
  // Get content from WordPress with enhanced helpers
  let homepageData
  try {
    const { 
      getFeaturedArticles, 
      getArticles, 
      getBreakingNews,
      getPrograms,
      getAuthors 
    } = await import("@/lib/wordpress-content-helpers")
    
    // Fetch all content in parallel for better performance
    const [
      featuredArticles,
      latestArticles,
      breakingNews,
      featuredPrograms,
      authors
    ] = await Promise.all([
      getFeaturedArticles(3),
      getArticles({ per_page: 6 }),
      getBreakingNews(2),
      getPrograms({ per_page: 4 }),
      getAuthors(4)
    ])
    
    homepageData = {
      hero_article: featuredArticles[0] || latestArticles[0] || null,
      featured_articles: featuredArticles.slice(1),
      latest_articles: latestArticles,
      breaking_news: breakingNews,
      featured_programs: featuredPrograms,
      spotlight_writers: authors
    }
  } catch (error) {
    console.log('Using fallback homepage data:', error)
    const { createFallbackPost } = await import("@/lib/wordpress-transformers")
    
    homepageData = {
      hero_article: createFallbackPost(),
      featured_articles: [],
      latest_articles: [createFallbackPost()],
      breaking_news: [],
      featured_programs: [],
      spotlight_writers: []
    }
  }
  
  // Extract data with fallbacks
  const featuredArticle = homepageData.hero_article
  const latestArticles = homepageData.latest_articles.slice(0, 2)
  const featuredPrograms = homepageData.featured_programs
  const diverseArticles = homepageData.featured_articles

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - زاوية اليوم */}
      <section className="bg-gradient-to-br from-ink-700 to-ink-900 text-white py-16 lg:py-20 relative overflow-hidden">
        {/* Subtle angle grid pattern */}
        <div className="absolute inset-0 opacity-[0.04]">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="angle-grid" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                <g fill="currentColor">
                  <polygon points="30,5 50,25 30,45 10,25" />
                  <polygon points="5,30 25,50 45,30 25,10" />
                </g>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#angle-grid)" />
          </svg>
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="grid lg:grid-cols-5 gap-16 items-center">
            <div className="lg:col-span-3 space-y-6 lg:space-y-8">
              <div className="space-y-4">
                {/* Small red pill label */}
                {featuredArticle && (
                  <span className="inline-flex items-center rounded-full bg-brand-red text-white px-3 py-1 text-xs font-bold uppercase tracking-wide">
                    {featuredArticle.category?.name || 'مقال'}
                  </span>
                )}
                <div className="text-brand-yellow text-sm font-bold tracking-wide uppercase">
                  زاوية اليوم
                </div>
                {/* Stroked headline for editorial impact */}
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight font-ge-ss h1-stroke text-white">
                  {featuredArticle?.title_ar || featuredArticle?.title || 'مرحباً بكم في زوايا'}
                </h1>
              </div>

              <p className="text-xl text-white/90 leading-relaxed max-w-2xl">
                {featuredArticle?.excerpt_ar || featuredArticle?.excerpt || 'منصة فكرية عربية للحوار والتحليل المعاصر'}
              </p>

              {featuredArticle && (
                <div className="flex items-center gap-6 text-sm text-white/80">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{featuredArticle.author.name_ar || featuredArticle.author.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{featuredArticle.read_time_minutes || featuredArticle.zawaya_meta.reading_time_minutes || 5} دقائق</span>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4">
                {featuredArticle ? (
                  <>
                    <Button asChild size="lg" className="bg-white text-brand-red hover:bg-white/90 font-bold">
                      <Link href={`/ar/articles/${featuredArticle.slug}`}>
                        ابدأ القراءة
                        <ArrowLeft className="w-5 h-5 mr-2" />
                      </Link>
                    </Button>
                    {(featuredArticle.audio_url || featuredArticle.zawaya_meta.audio_narration_url) && (
                      <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm">
                        <Headphones className="w-4 h-4 ml-2" />
                        استمع للمقال
                      </Button>
                    )}
                  </>
                ) : (
                  <Button asChild size="lg" className="bg-white text-brand-red hover:bg-white/90 font-bold">
                    <Link href="/ar/articles">
                      تصفح المقالات
                      <ArrowLeft className="w-5 h-5 mr-2" />
                    </Link>
                  </Button>
                )}
              </div>

              {/* Newsletter inline */}
              <div className="pt-6 border-t border-white/20">
                <p className="text-sm text-white/70 mb-3">احصل على زاوية اليوم في بريدك</p>
                <div className="flex gap-3 max-w-md">
                  <input
                    type="email"
                    placeholder="بريدك الإلكتروني"
                    className="flex-1 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-brand-red focus:ring-offset-2 text-sm"
                    dir="rtl"
                  />
                  <Button size="sm" className="bg-brand-red hover:bg-brand-red/90 text-white font-bold">
                    اشترك
                  </Button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 relative">
              {/* Angular masked feature image */}
              <div className="aspect-[4/3] overflow-hidden shadow-2xl mask-angle">
                <Image
                  src={featuredArticle?.featured_image_url || "/images/hero/default-hero.png"}
                  alt={featuredArticle?.title_ar || "زوايا"}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Secondary headlines */}
              <div className="mt-6 space-y-3">
                {latestArticles.slice(0, 2).map((article, index) => (
                  <div key={article.id} className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <CategoryChip
                        category={article.category?.name || 'مقال'}
                        size="sm"
                        className="bg-white/20 text-white border-white/30"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-white line-clamp-2 leading-snug">
                          <Link href={`/ar/articles/${article.slug}`} className="hover:text-brand-yellow transition-colors focus:outline-none focus:ring-2 focus:ring-brand-violet focus:ring-offset-2">
                            {article.title_ar || article.title}
                          </Link>
                        </h3>
                        <p className="text-xs text-white/70 mt-1">{article.author.name_ar || article.author.name}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Articles Section */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <SectionHeader
              title="أحدث المقالات والتحليلات"
              subtitle="تابع آخر التطورات والتحليلات من كتّاب زوايا"
              showKuficBand={true}
            />
            <Button variant="outline" asChild className="border-brand-green text-brand-green hover:bg-brand-green hover:text-white">
              <Link href="/ar/articles">
                عرض الكل
                <ArrowLeft className="w-4 h-4 mr-2" />
              </Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {homepageData.latest_articles.map((article) => (
              <ArticleCard
                key={article.id}
                id={article.id}
                slug={article.slug}
                title={article.title_ar || article.title}
                summary={article.excerpt_ar || article.excerpt || ''}
                imageUrl={article.featured_image_url || ''}
                category={article.category?.name || 'مقال'}
                author={article.author}
                readTime={article.read_time_minutes || article.zawaya_meta.reading_time_minutes}
                publishedDate={article.published_at}
                hasAudio={!!(article.audio_url || article.zawaya_meta.audio_narration_url)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Writers Section */}
      <section className="py-16 lg:py-20 bg-sand-50">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="كتّاب زوايا"
            subtitle="تعرّف على الأصوات الفكرية التي تشكل المحتوى في زوايا"
            className="text-center"
          />

          <div className="grid md:grid-cols-2 gap-6 mt-12">
            {[
              {
                name: 'د. أمين رشدي',
                specialty: 'تكنولوجيا وحضارة',
                avatar: '/placeholder.svg',
                articles: [
                  { title: 'الذكاء الاصطناعي والحضارة العربية', slug: 'ai-arab-civilization' },
                  { title: 'مستقبل التقنية في المنطقة', slug: 'tech-future-region' }
                ]
              },
              {
                name: 'سارة بلقاسمي',
                specialty: 'اقتصاد سياسي',
                avatar: '/placeholder.svg',
                articles: [
                  { title: 'ما بعد الريع: تحولات اقتصادية', slug: 'post-rentier-economy' },
                  { title: 'سلاسل الإمداد تحت الضغط', slug: 'supply-chains-pressure' }
                ]
              },
              {
                name: 'د. ريم الخوري',
                specialty: 'فن وتراث',
                avatar: '/placeholder.svg',
                articles: [
                  { title: 'استعادة الآثار من متاحف الغرب', slug: 'artifacts-restitution' },
                  { title: 'الفن المعاصر في العالم العربي', slug: 'contemporary-arab-art' }
                ]
              },
              {
                name: 'د. أيمن الصباغ',
                specialty: 'جيوبوليتيك',
                avatar: '/placeholder.svg',
                articles: [
                  { title: 'جيوبوليتيك المياه في المنطقة', slug: 'water-geopolitics' },
                  { title: 'التحالفات الإقليمية الجديدة', slug: 'new-regional-alliances' }
                ]
              },
            ].map((writer, index) => (
              <WriterSpotlight
                key={index}
                id={`writer-${index}`}
                slug={`writer-${index}`}
                name={writer.name}
                specialty={writer.specialty}
                avatarUrl={writer.avatar}
                articleCount={Math.floor(Math.random() * 20) + 5}
                latestArticles={writer.articles}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <SectionHeader
              title="البرامج والبودكاست"
              subtitle="استكشف برامجنا المرئية والصوتية المتنوعة"
              showKuficBand={true}
            />
            <div className="flex gap-4">
              <Button variant="outline" asChild className="border-brand-mint text-brand-mint hover:bg-brand-mint hover:text-ink-900">
                <Link href="/ar/podcast">
                  <Headphones className="w-4 h-4 ml-2" />
                  البودكاست
                </Link>
              </Button>
              <Button variant="outline" asChild className="border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-white">
                <Link href="/ar/programs">
                  <Video className="w-4 h-4 ml-2" />
                  البرامج
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {featuredPrograms.map((program) => (
              <ProgramCard
                key={program.id}
                id={program.id}
                slug={program.slug}
                title={program.zawaya_meta?.title_arabic || program.title?.rendered || 'برنامج'}
                description={program.zawaya_meta?.excerpt_arabic || program.excerpt?.rendered || ''}
                coverImageUrl={program.zawaya_meta?.cover_image || "/placeholder.svg"}
                type={program.zawaya_meta?.program_type || 'mixed'}
                host={program.zawaya_meta?.host_arabic || 'مقدم البرنامج'}
                episodeCount={program.zawaya_meta?.episode_count || 0}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Topic Exploration */}
      <section className="py-16 lg:py-20 bg-sand-50">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="استكشف حسب الموضوع"
            subtitle="اختر الموضوع الذي يهمك"
            className="text-center"
          />

          <div className="mt-12">
            <TopicFilter />
          </div>
        </div>
      </section>

      {/* Cultural Articles Section */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <SectionHeader
              title="مقالات ثقافية وفكرية"
              subtitle="اكتشف عالم الفن والأدب والثقافة من منظور عربي معاصر"
              showKuficBand={true}
            />
            <Button variant="outline" asChild className="border-brand-violet text-brand-violet hover:bg-brand-violet hover:text-white">
              <Link href="/ar/articles?category=culture">
                <FileText className="w-4 h-4 ml-2" />
                المزيد من المقالات
              </Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {diverseArticles.map((article) => (
              <ArticleCard
                key={article.id}
                id={article.id}
                slug={article.slug}
                title={article.title_ar || article.title}
                summary={article.excerpt_ar || article.excerpt || ''}
                imageUrl={article.featured_image_url || ''}
                category={article.category?.name || 'مقال'}
                author={article.author}
                readTime={article.read_time_minutes || article.zawaya_meta.reading_time_minutes}
                publishedDate={article.published_at}
                hasAudio={!!(article.audio_url || article.zawaya_meta.audio_narration_url)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Writers' Forum */}
      <section className="py-16 lg:py-20 bg-gradient-to-b from-sand-50 to-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <SectionHeader
              title="منبر الكُتّاب"
              subtitle="هل لديك فكرة أو رؤية تود مشاركتها؟ نرحب بمساهماتك الفكرية"
              className="text-center"
            />

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-stone-200 max-w-2xl mx-auto mt-8">
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="الاسم الكامل"
                  className="px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-brand-violet focus:ring-offset-2 text-body"
                  dir="rtl"
                />
                <input
                  type="email"
                  placeholder="البريد الإلكتروني"
                  className="px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-brand-violet focus:ring-offset-2 text-body"
                  dir="rtl"
                />
              </div>
              <textarea
                placeholder="اكتب فكرتك أو مقترحك (400 حرف كحد أقصى)"
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-brand-violet focus:ring-offset-2 text-body mb-4 resize-none"
                dir="rtl"
              />
              <Button className="bg-brand-red hover:bg-brand-red/90 text-white font-bold px-8">
                أرسل المقترح
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 lg:py-20 bg-gradient-to-br from-ink-700 to-ink-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4 font-ge-ss">
              انضم إلى مجتمع زوايا المعرفي
            </h2>
            <p className="text-xl text-white/90 mb-8">
              احصل على أحدث التحليلات والمقالات مع ملخصات صوتية حصرية، مباشرة في بريدك الإلكتروني
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="أدخل بريدك الإلكتروني"
                className="flex-1 px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-brand-red focus:ring-offset-2"
                dir="rtl"
              />
              <Button className="bg-brand-red hover:bg-brand-red/90 text-white font-bold px-8">
                اشترك الآن
              </Button>
            </div>
            <p className="text-sm text-white/70 mt-4">
              نحترم خصوصيتك ولن نرسل لك رسائل غير مرغوب فيها
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-t border-stone-200">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: '500+', label: 'مقال ومحتوى', icon: FileText },
              { number: '50+', label: 'حلقة بودكاست', icon: Headphones },
              { number: '25+', label: 'كاتب وباحث', icon: User },
              { number: '10K+', label: 'قارئ شهرياً', icon: User },
            ].map((stat, index) => {
              const IconComponent = stat.icon
              return (
                <div key={index}>
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-sand-50 border border-stone-200 flex items-center justify-center">
                    <IconComponent className="w-8 h-8 text-brand-green" />
                  </div>
                  <div className="text-3xl font-bold text-ink-900 mb-2 font-ge-ss">{stat.number}</div>
                  <div className="text-ink-600">{stat.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
      
      {process.env.NODE_ENV === 'development' && <DevNavigation />}
    </div>
  )
} 