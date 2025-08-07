import { Metadata } from 'next'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Clock, User, ArrowLeft, Headphones, Video, FileText } from 'lucide-react'
import { Button } from '@/components/atoms/Button'
import { Badge } from '@/components/atoms/Badge'
import { CardArticle } from '@/components/molecules/CardArticle'
import { CardProgram } from '@/components/molecules/CardProgram'
import { getArticles, getPrograms } from '@/lib/wp'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'زوايا • منصة فكرية عربية للحوار والتحليل المعاصر',
  description: 'منصة فكرية عربية تقدم تحليلات معمقة ومقالات متنوعة وبرامج صوتية ومرئية تغطي أهم القضايا المعاصرة',
  openGraph: {
    title: 'زوايا • منصة فكرية عربية للحوار والتحليل المعاصر',
    description: 'منصة فكرية عربية تقدم تحليلات معمقة ومقالات متنوعة وبرامج صوتية ومرئية تغطي أهم القضايا المعاصرة',
  },
}

export default async function ArabicHomepage() {
  let articles: any[] = []
  let programs: any[] = []
  
  try {
    const [articlesData, programsData] = await Promise.all([
      getArticles({ per_page: 6 }),
      getPrograms({ per_page: 4 })
    ])
    articles = articlesData
    programs = programsData
  } catch (error) {
    console.error('Error fetching homepage data:', error)
  }

  const featuredArticle = articles[0]

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-900 to-primary-700 text-neutral-50 py-2xl relative overflow-hidden">
        <div className="grid-container">
          <motion.div 
            className="col-span-full lg:col-span-8 space-y-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="space-y-md">
              {featuredArticle && (
                <Badge variant="verdict" className="bg-accent-600 text-neutral-50">
                  {featuredArticle.category?.name || 'مقال مميز'}
                </Badge>
              )}
              <div className="text-accent-300 text-0 font-bold tracking-wide uppercase">
                زاوية اليوم
              </div>
              <h1 className="text-4 lg:text-5 font-bold leading-tight text-neutral-50">
                {featuredArticle?.title?.rendered || 'مرحباً بكم في زوايا'}
              </h1>
            </div>

            <p className="text-1 text-neutral-200 leading-relaxed max-w-2xl">
              {featuredArticle?.excerpt?.rendered?.replace(/<[^>]*>/g, '') || 'منصة فكرية عربية للحوار والتحليل المعاصر'}
            </p>

            {featuredArticle && (
              <div className="flex items-center gap-lg text-0 text-neutral-300">
                <div className="flex items-center gap-xs">
                  <User className="w-4 h-4" />
                  <span>{featuredArticle.author?.name || 'فريق زوايا'}</span>
                </div>
                <div className="flex items-center gap-xs">
                  <Clock className="w-4 h-4" />
                  <span>5 دقائق</span>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-md">
              {featuredArticle ? (
                <Button asChild size="lg" variant="secondary">
                  <Link href={`/ar/articles/${featuredArticle.slug}`}>
                    ابدأ القراءة
                    <ArrowLeft className="w-5 h-5 mr-xs" />
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
              
              <Button variant="ghost" size="lg" className="text-neutral-200 hover:text-neutral-50">
                <Headphones className="w-4 h-4 ml-xs" />
                استمع للمحتوى
              </Button>
            </div>
          </motion.div>

          <motion.div 
            className="col-span-full lg:col-span-4 relative"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="aspect-[4/3] overflow-hidden rounded-2xl shadow-2xl bg-primary-800">
              <div className="w-full h-full flex items-center justify-center text-6xl">
                📖
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Latest Articles Section */}
      <section className="py-2xl bg-neutral-50">
        <div className="grid-container">
          <motion.div 
            className="col-span-full text-center mb-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-3 font-bold text-primary-900 mb-md">
              أحدث المقالات والتحليلات
            </h2>
            <p className="text-1 text-neutral-600 max-w-2xl mx-auto">
              تابع آخر التطورات والتحليلات من كتّاب زوايا
            </p>
          </motion.div>

          {articles.length > 0 && (
            <div className="col-span-full">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
                {articles.slice(0, 6).map((article, index) => (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, y: 20 }}
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

          <div className="col-span-full text-center mt-xl">
            <Button asChild variant="ghost">
              <Link href="/ar/articles">
                عرض جميع المقالات
                <ArrowLeft className="w-4 h-4 mr-xs" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Programs Section */}
      {programs.length > 0 && (
        <section className="py-2xl bg-neutral-100">
          <div className="grid-container">
            <motion.div 
              className="col-span-full text-center mb-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <h2 className="text-3 font-bold text-primary-900 mb-md">
                البرامج والبودكاست
              </h2>
              <p className="text-1 text-neutral-600 max-w-2xl mx-auto">
                استمع إلى برامجنا الصوتية والمرئية المتنوعة
              </p>
            </motion.div>

            <div className="col-span-full">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-lg">
                {programs.slice(0, 4).map((program, index) => (
                  <motion.div
                    key={program.id}
                    initial={{ opacity: 0, y: 20 }}
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

            <div className="col-span-full text-center mt-xl">
              <Button asChild variant="ghost">
                <Link href="/programs">
                  عرض جميع البرامج
                  <ArrowLeft className="w-4 h-4 mr-xs" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Newsletter Section */}
      <section className="py-2xl bg-primary-900 text-neutral-50">
        <div className="grid-container">
          <motion.div 
            className="col-span-full text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <h2 className="text-3 font-bold mb-md">
              انضم إلى مجتمع زوايا المعرفي
            </h2>
            <p className="text-1 text-neutral-200 mb-xl max-w-2xl mx-auto">
              احصل على أحدث التحليلات والمقالات مباشرة في بريدك الإلكتروني
            </p>
            <div className="flex flex-col sm:flex-row gap-md max-w-md mx-auto">
              <input
                type="email"
                placeholder="أدخل بريدك الإلكتروني"
                className="flex-1 px-lg py-md rounded-2xl bg-neutral-50/10 backdrop-blur-sm border border-neutral-50/20 text-neutral-50 placeholder:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-accent-600"
                dir="rtl"
              />
              <Button variant="secondary">
                اشترك الآن
              </Button>
            </div>
            <p className="text--1 text-neutral-300 mt-md">
              نحترم خصوصيتك ولن نرسل لك رسائل غير مرغوب فيها
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-xl bg-neutral-50 border-t border-neutral-200">
        <div className="grid-container">
          <div className="col-span-full">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-lg text-center">
              {[
                { number: '500+', label: 'مقال ومحتوى', icon: FileText },
                { number: '50+', label: 'حلقة بودكاست', icon: Headphones },
                { number: '25+', label: 'كاتب وباحث', icon: User },
                { number: '10K+', label: 'قارئ شهرياً', icon: User },
              ].map((stat, index) => {
                const IconComponent = stat.icon
                return (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 * index }}
                  >
                    <div className="w-16 h-16 mx-auto mb-md rounded-2xl bg-accent-300/20 border border-accent-600/30 flex items-center justify-center">
                      <IconComponent className="w-8 h-8 text-accent-600" />
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
