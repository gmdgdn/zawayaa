import { Metadata } from 'next'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Clock, User, ArrowLeft, Headphones, Video, FileText, 
  Play, Star, TrendingUp, BookOpen, Mic, Users, 
  Calendar, Eye, Heart, Share2, ChevronRight
} from 'lucide-react'
import { Button } from '@/components/atoms/Button'
import { Badge } from '@/components/atoms/Badge'
import { CardArticle } from '@/components/molecules/CardArticle'
import { CardProgram } from '@/components/molecules/CardProgram'
import { getArticles, getPrograms } from '@/lib/wp'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'زوايا • منصة فكرية عربية للحوار والتحليل المعاصر',
  description: 'منصة فكرية عربية تقدم تحليلات معمقة ومقالات متنوعة وبرامج صوتية ومرئية تغطي أهم القضايا المعاصرة بأسلوب حديث ومتطور',
  openGraph: {
    title: 'زوايا • منصة فكرية عربية للحوار والتحليل المعاصر',
    description: 'منصة فكرية عربية تقدم تحليلات معمقة ومقالات متنوعة وبرامج صوتية ومرئية تغطي أهم القضايا المعاصرة بأسلوب حديث ومتطور',
    images: ['/images/og-homepage.jpg'],
  },
}

export default async function DetailedHomepage() {
  let articles: any[] = []
  let programs: any[] = []
  
  try {
    const [articlesData, programsData] = await Promise.all([
      getArticles({ per_page: 8 }),
      getPrograms({ per_page: 6 })
    ])
    articles = articlesData
    programs = programsData
  } catch (error) {
    console.error('Error fetching homepage data:', error)
  }

  const featuredArticle = articles[0]
  const latestArticles = articles.slice(1, 4)
  const trendingArticles = articles.slice(4, 7)
  const featuredPrograms = programs.slice(0, 3)
  const latestPrograms = programs.slice(3, 6)

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section - Enhanced */}
      <section className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-neutral-50 py-3xl overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm0 0c0 11.046 8.954 20 20 20s20-8.954 20-20-8.954-20-20-20-20 8.954-20 20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="grid-container relative">
          <motion.div 
            className="col-span-full lg:col-span-7 space-y-xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            {/* Breaking News Ticker */}
            <motion.div 
              className="flex items-center gap-md text-accent-300"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="flex items-center gap-xs">
                <div className="w-2 h-2 bg-accent-600 rounded-full animate-pulse" />
                <span className="text--1 font-bold uppercase tracking-wide">عاجل</span>
              </div>
              <div className="text--1 text-neutral-200">
                آخر التحديثات والتحليلات المعاصرة
              </div>
            </motion.div>

            <div className="space-y-lg">
              {featuredArticle && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  <Badge variant="verdict" className="bg-accent-600 text-neutral-50 mb-md">
                    {featuredArticle.category?.name || 'مقال مميز'}
                  </Badge>
                </motion.div>
              )}
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <div className="text-accent-300 text-0 font-bold tracking-wide uppercase mb-sm">
                  زاوية اليوم
                </div>
                <h1 className="text-5 lg:text-6 font-bold leading-tight text-neutral-50 mb-md">
                  {featuredArticle?.title?.rendered || 'مرحباً بكم في زوايا'}
                </h1>
              </motion.div>

              <motion.p 
                className="text-1 text-neutral-200 leading-relaxed max-w-3xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                {featuredArticle?.excerpt?.rendered?.replace(/<[^>]*>/g, '') || 'منصة فكرية عربية للحوار والتحليل المعاصر تقدم رؤى عميقة وتحليلات شاملة للقضايا المعاصرة'}
              </motion.p>

              {featuredArticle && (
                <motion.div 
                  className="flex items-center gap-xl text-0 text-neutral-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1 }}
                >
                  <div className="flex items-center gap-xs">
                    <User className="w-4 h-4" />
                    <span>{featuredArticle.author?.name || 'فريق زوايا'}</span>
                  </div>
                  <div className="flex items-center gap-xs">
                    <Clock className="w-4 h-4" />
                    <span>5 دقائق قراءة</span>
                  </div>
                  <div className="flex items-center gap-xs">
                    <Eye className="w-4 h-4" />
                    <span>2.5K مشاهدة</span>
                  </div>
                </motion.div>
              )}
            </div>

            <motion.div 
              className="flex flex-col sm:flex-row gap-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
            >
              {featuredArticle ? (
                <Button asChild size="lg" variant="secondary" className="group">
                  <Link href={`/ar/articles/${featuredArticle.slug}`}>
                    ابدأ القراءة
                    <ArrowLeft className="w-5 h-5 mr-xs group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              ) : (
                <Button asChild size="lg" variant="secondary">
                  <Link href="/ar/articles">
                    تصفح المقالات
                    <ArrowLeft className="w-5 h-5 mr-xs" />
                  </Link>
                </Button>
              )}
              
              <Button variant="ghost" size="lg" className="text-neutral-200 hover:text-neutral-50 hover:bg-neutral-50/10">
                <Headphones className="w-4 h-4 ml-xs" />
                استمع للمحتوى
              </Button>
            </motion.div>

            {/* Quick Newsletter Signup */}
            <motion.div 
              className="pt-lg border-t border-neutral-50/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.4 }}
            >
              <p className="text-0 text-neutral-300 mb-md">احصل على زاوية اليوم في بريدك</p>
              <div className="flex gap-sm max-w-md">
                <input
                  type="email"
                  placeholder="بريدك الإلكتروني"
                  className="flex-1 px-md py-sm rounded-2xl bg-neutral-50/10 backdrop-blur-sm border border-neutral-50/20 text-neutral-50 placeholder:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-accent-600 text-0"
                  dir="rtl"
                />
                <Button size="sm" variant="secondary">
                  اشترك
                </Button>
              </div>
            </motion.div>
          </motion.div>

          {/* Hero Visual */}
          <motion.div 
            className="col-span-full lg:col-span-5 relative"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            <div className="aspect-[4/3] overflow-hidden rounded-3xl shadow-2xl bg-gradient-to-br from-accent-300 to-accent-600 relative">
              {featuredArticle?.featured_media_url ? (
                <Image
                  src={featuredArticle.featured_media_url}
                  alt={featuredArticle.title?.rendered || 'زوايا'}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-6xl text-neutral-50">
                  📖
                </div>
              )}
              
              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.button
                  className="w-20 h-20 bg-neutral-50/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play className="w-8 h-8 text-primary-900 ml-1" />
                </motion.button>
              </div>
            </div>

            {/* Floating Stats */}
            <motion.div 
              className="absolute -bottom-6 -right-6 bg-neutral-50 rounded-2xl p-lg shadow-xl"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 1.6 }}
            >
              <div className="flex items-center gap-md">
                <div className="text-center">
                  <div className="text-2 font-bold text-primary-900">500+</div>
                  <div className="text--1 text-neutral-600">مقال</div>
                </div>
                <div className="w-px h-8 bg-neutral-300" />
                <div className="text-center">
                  <div className="text-2 font-bold text-primary-900">50+</div>
                  <div className="text--1 text-neutral-600">برنامج</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Trending Topics Bar */}
      <section className="bg-accent-300 py-md">
        <div className="grid-container">
          <motion.div 
            className="col-span-full flex items-center gap-lg overflow-x-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center gap-xs text-primary-900 whitespace-nowrap">
              <TrendingUp className="w-4 h-4" />
              <span className="text-0 font-bold">الأكثر قراءة:</span>
            </div>
            <div className="flex gap-md">
              {['السياسة المعاصرة', 'الثقافة العربية', 'التكنولوجيا', 'الاقتصاد'].map((topic, index) => (
                <motion.div
                  key={topic}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                >
                  <Badge variant="tag" className="whitespace-nowrap cursor-pointer hover:bg-primary-900/20">
                    {topic}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Latest Articles - Enhanced Grid */}
      <section className="py-3xl bg-neutral-50">
        <div className="grid-container">
          <motion.div 
            className="col-span-full text-center mb-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="flex items-center justify-center gap-md mb-md">
              <div className="w-12 h-px bg-accent-600" />
              <BookOpen className="w-6 h-6 text-accent-600" />
              <div className="w-12 h-px bg-accent-600" />
            </div>
            <h2 className="text-4 font-bold text-primary-900 mb-md">
              أحدث المقالات والتحليلات
            </h2>
            <p className="text-1 text-neutral-600 max-w-2xl mx-auto">
              تابع آخر التطورات والتحليلات المعمقة من نخبة من الكتّاب والمحللين العرب
            </p>
          </motion.div>

          {latestArticles.length > 0 && (
            <div className="col-span-full">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-xl">
                {latestArticles.map((article, index) => (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 * index }}
                  >
                    <CardArticle
                      id={article.id}
                      slug={article.slug}
                      title={article.title.rendered}
                      excerpt={article.excerpt.rendered?.replace(/<[^>]*>/g, '') || ''}
                      author={article.author?.name || 'فريق زوايا'}
                      publishedAt={article.date}
                      readingTime={5}
                      category={article.category?.name || 'مقال'}
                      featuredImage={article.featured_media_url || '/images/placeholder-article.jpg'}
                      href={`/ar/articles/${article.slug}`}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          <div className="col-span-full text-center mt-2xl">
            <Button asChild variant="ghost" size="lg" className="group">
              <Link href="/ar/articles">
                عرض جميع المقالات
                <ArrowLeft className="w-4 h-4 mr-xs group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Programs - Enhanced */}
      <section className="py-3xl bg-gradient-to-br from-neutral-100 to-neutral-200">
        <div className="grid-container">
          <motion.div 
            className="col-span-full text-center mb-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="flex items-center justify-center gap-md mb-md">
              <div className="w-12 h-px bg-accent-600" />
              <Mic className="w-6 h-6 text-accent-600" />
              <div className="w-12 h-px bg-accent-600" />
            </div>
            <h2 className="text-4 font-bold text-primary-900 mb-md">
              البرامج والبودكاست المميزة
            </h2>
            <p className="text-1 text-neutral-600 max-w-2xl mx-auto">
              استمع إلى برامجنا الصوتية والمرئية المتنوعة التي تغطي مختلف جوانب الحياة المعاصرة
            </p>
          </motion.div>

          {featuredPrograms.length > 0 && (
            <div className="col-span-full">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-xl">
                {featuredPrograms.map((program, index) => (
                  <motion.div
                    key={program.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 * index }}
                  >
                    <CardProgram
                      id={program.id}
                      slug={program.slug}
                      title={program.title.rendered}
                      host={program.meta?.host_arabic || 'فريق زوايا'}
                      cover={program.meta?.cover_image || program.featured_media_url || '/images/placeholder-program.jpg'}
                      type={(program.meta?.program_type as 'video' | 'audio' | 'mixed') || 'mixed'}
                      episodeCount={program.meta?.episode_count || 0}
                      themeColor={program.meta?.theme_color}
                      rating={program.meta?.program_rating}
                      subscriberCount={program.meta?.subscriber_count}
                      href={`/programs/${program.slug}`}
                      description={program.excerpt?.rendered?.replace(/<[^>]*>/g, '') || ''}
                      publishedAt={program.date}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          <div className="col-span-full text-center mt-2xl">
            <Button asChild variant="ghost" size="lg" className="group">
              <Link href="/programs">
                عرض جميع البرامج
                <ArrowLeft className="w-4 h-4 mr-xs group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter Section - Enhanced */}
      <section className="py-3xl bg-gradient-to-br from-primary-900 to-primary-700 text-neutral-50 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm0 0c0 5.5 4.5 10 10 10s10-4.5 10-10-4.5-10-10-10-10 4.5-10 10z'/%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="grid-container relative">
          <motion.div 
            className="col-span-full text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4 font-bold mb-lg">
                انضم إلى مجتمع زوايا المعرفي
              </h2>
              <p className="text-1 text-neutral-200 mb-2xl max-w-2xl mx-auto">
                احصل على أحدث التحليلات والمقالات مع ملخصات صوتية حصرية، مباشرة في بريدك الإلكتروني
              </p>
              
              <div className="flex flex-col sm:flex-row gap-md max-w-lg mx-auto mb-xl">
                <input
                  type="email"
                  placeholder="أدخل بريدك الإلكتروني"
                  className="flex-1 px-lg py-md rounded-2xl bg-neutral-50/10 backdrop-blur-sm border border-neutral-50/20 text-neutral-50 placeholder:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-accent-600"
                  dir="rtl"
                />
                <Button variant="secondary" size="lg">
                  اشترك الآن
                </Button>
              </div>
              
              <div className="flex items-center justify-center gap-xl text-0 text-neutral-300">
                <div className="flex items-center gap-xs">
                  <Users className="w-4 h-4" />
                  <span>+10K مشترك</span>
                </div>
                <div className="flex items-center gap-xs">
                  <Star className="w-4 h-4 text-accent-300" />
                  <span>تقييم 4.8/5</span>
                </div>
              </div>
              
              <p className="text--1 text-neutral-400 mt-lg">
                نحترم خصوصيتك ولن نرسل لك رسائل غير مرغوب فيها • يمكنك إلغاء الاشتراك في أي وقت
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section - Enhanced */}
      <section className="py-2xl bg-neutral-50 border-t border-neutral-200">
        <div className="grid-container">
          <div className="col-span-full">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-xl text-center">
              {[
                { number: '500+', label: 'مقال ومحتوى', icon: FileText, color: 'text-accent-600' },
                { number: '50+', label: 'حلقة بودكاست', icon: Headphones, color: 'text-primary-700' },
                { number: '25+', label: 'كاتب وباحث', icon: User, color: 'text-accent-600' },
                { number: '10K+', label: 'قارئ شهرياً', icon: Heart, color: 'text-primary-700' },
              ].map((stat, index) => {
                const IconComponent = stat.icon
                return (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 * index }}
                    className="group hover:scale-105 transition-transform cursor-pointer"
                  >
                    <div className={`w-20 h-20 mx-auto mb-lg rounded-3xl bg-gradient-to-br from-accent-300/20 to-primary-900/20 border border-accent-600/30 flex items-center justify-center group-hover:shadow-lg transition-shadow`}>
                      <IconComponent className={`w-10 h-10 ${stat.color}`} />
                    </div>
                    <div className="text-3 font-bold text-primary-900 mb-xs">{stat.number}</div>
                    <div className="text-0 text-neutral-600">{stat.label}</div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
