import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { wpFetch, getTaqdeer, WPTaqdeer } from '@/lib/wp'
import { transformToTaqdeerDetail } from '@/lib/scf-mappings/taqdeer'
import { LongformLayout } from '@/components/LongformLayout'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowRight, Calendar, ExternalLink, FileText, TrendingUp, TrendingDown, Minus, BarChart3 } from 'lucide-react'

interface TaqdeerPageProps {
  params: {
    slug: string
  }
}

// Generate static params for all Taqdeer assessments
export async function generateStaticParams() {
  try {
    const taqdeerItems = await wpFetch<WPTaqdeer[]>('/taqdeer_mawqef', '?per_page=100&_fields=slug')
    return taqdeerItems.map((item) => ({
      slug: item.slug,
    }))
  } catch (error) {
    console.error('Error generating static params for taqdeer:', error)
    return []
  }
}

// Generate metadata for the Taqdeer page
export async function generateMetadata({ params }: TaqdeerPageProps): Promise<Metadata> {
  try {
    const taqdeer = await getTaqdeer(params.slug)
    
    if (!taqdeer) {
      return {
        title: 'التقدير غير موجود - زوايا',
        description: 'التقدير المطلوب غير متاح',
      }
    }

    const title = taqdeer.title.rendered
    const kicker = taqdeer.meta.kicker
    const deck = taqdeer.meta.deck
    const description = deck || taqdeer.excerpt.rendered.replace(/<[^>]*>/g, '') || `تقدير: ${title}`
    const image = taqdeer._embedded?.['wp:featuredmedia']?.[0]?.source_url

    return {
      title: `${kicker ? kicker + ' | ' : ''}${title} - تقدير موقف | زوايا`,
      description,
      openGraph: {
        title: `${kicker ? kicker + ' | ' : ''}${title} - تقدير موقف | زوايا`,
        description,
        type: 'article',
        images: image ? [{ url: image, alt: title }] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${kicker ? kicker + ' | ' : ''}${title} - تقدير موقف | زوايا`,
        description,
        images: image ? [image] : [],
      },
    }
  } catch (error) {
    console.error('Error generating metadata for taqdeer:', error)
    return {
      title: 'خطأ - زوايا',
      description: 'حدث خطأ أثناء تحميل التقدير',
    }
  }
}

// ISR configuration
export const revalidate = 300 // 5 minutes

export default async function TaqdeerPage({ params }: TaqdeerPageProps) {
  let taqdeer: WPTaqdeer | null = null
  let error: string | null = null

  try {
    taqdeer = await getTaqdeer(params.slug)
    
    if (!taqdeer) {
      notFound()
    }
  } catch (err) {
    console.error('Error fetching taqdeer data:', err)
    error = 'خطأ في تحميل التقدير'
  }

  if (error || !taqdeer) {
    return (
      <div className="min-h-screen flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{error || 'التقدير غير موجود'}</h1>
          <p className="text-gray-600 mb-4">
            {error ? 'حدث خطأ أثناء تحميل التقدير. يرجى المحاولة مرة أخرى.' : 'التقدير المطلوب غير متاح.'}
          </p>
          <Button asChild>
            <Link href="/taqdeer-mawqef">العودة إلى تقدير الموقف</Link>
          </Button>
        </div>
      </div>
    )
  }

  // Transform taqdeer data
  const taqdeerDetail = transformToTaqdeerDetail({
    id: taqdeer.id,
    slug: taqdeer.slug,
    title: taqdeer.title.rendered,
    title_ar: taqdeer.title.rendered,
    content: taqdeer.content.rendered,
    content_ar: taqdeer.content.rendered,
    excerpt: taqdeer.excerpt.rendered,
    excerpt_ar: taqdeer.excerpt.rendered,
    date: taqdeer.date,
    modified: taqdeer.modified,
    featured_image_url: taqdeer._embedded?.['wp:featuredmedia']?.[0]?.source_url,
    zawaya_meta: taqdeer.meta
  })

  const getVerdictIcon = (verdict: string) => {
    switch (verdict) {
      case 'positive':
        return <TrendingUp className="w-5 h-5" />
      case 'negative':
        return <TrendingDown className="w-5 h-5" />
      case 'mixed':
        return <BarChart3 className="w-5 h-5" />
      case 'neutral':
      default:
        return <Minus className="w-5 h-5" />
    }
  }

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case 'positive':
        return 'text-green-600 bg-green-50 border-green-200'
      case 'negative':
        return 'text-red-600 bg-red-50 border-red-200'
      case 'mixed':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'neutral':
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getVerdictLabel = (verdict: string) => {
    switch (verdict) {
      case 'positive':
        return 'إيجابي'
      case 'negative':
        return 'سلبي'
      case 'mixed':
        return 'مختلط'
      case 'neutral':
      default:
        return 'محايد'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatSourceType = (type: string) => {
    switch (type) {
      case 'article':
        return 'مقال'
      case 'report':
        return 'تقرير'
      case 'website':
        return 'موقع ويب'
      case 'document':
        return 'وثيقة'
      default:
        return 'مصدر'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <div className="flex items-center space-x-2 space-x-reverse text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600">الرئيسية</Link>
            <ArrowRight className="w-4 h-4" />
            <Link href="/taqdeer-mawqef" className="hover:text-blue-600">تقدير الموقف</Link>
            <ArrowRight className="w-4 h-4" />
            <span className="text-gray-900">{taqdeer.title.rendered}</span>
          </div>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <LongformLayout
              title={taqdeerDetail.title}
              content={taqdeerDetail.content}
              kicker={taqdeerDetail.kicker}
              deck={taqdeerDetail.deck}
              image={taqdeerDetail.image}
              publishedAt={taqdeerDetail.publishedAt}
              modifiedAt={taqdeerDetail.modifiedAt}
              seo={taqdeerDetail.seo}
            />

            {/* Charts Gallery */}
            {taqdeerDetail.chartsGallery && taqdeerDetail.chartsGallery.length > 0 && (
              <Card className="p-8 mt-8">
                <h3 className="text-2xl font-bold mb-6">الرسوم البيانية والمخططات</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {taqdeerDetail.chartsGallery.map((chart, index) => (
                    <div key={index} className="space-y-3">
                      <div className="relative h-64 rounded-lg overflow-hidden">
                        <Image
                          src={chart.image_url}
                          alt={chart.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg">{chart.title}</h4>
                        {chart.description && (
                          <p className="text-gray-600 text-sm mt-1">{chart.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Methodology */}
            {taqdeerDetail.methodology && (
              <Card className="p-8 mt-8">
                <h3 className="text-2xl font-bold mb-4">المنهجية</h3>
                <div 
                  className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: taqdeerDetail.methodology }}
                />
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Verdict Card */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">التقدير</h3>
              <div className={`flex items-center space-x-3 space-x-reverse p-4 rounded-lg border ${getVerdictColor(taqdeerDetail.verdict)}`}>
                {getVerdictIcon(taqdeerDetail.verdict)}
                <div className="flex-1">
                  <div className="font-semibold">{getVerdictLabel(taqdeerDetail.verdict)}</div>
                  {taqdeerDetail.confidence && (
                    <div className="text-sm opacity-75">
                      مستوى الثقة: {taqdeerDetail.confidence}%
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Publication Info */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">معلومات النشر</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <div>
                    <div className="font-medium">تاريخ النشر</div>
                    <div className="text-gray-600">{formatDate(taqdeerDetail.publishedAt)}</div>
                  </div>
                </div>
                
                {taqdeerDetail.lastUpdated && (
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <FileText className="w-4 h-4 text-gray-500" />
                    <div>
                      <div className="font-medium">آخر تحديث</div>
                      <div className="text-gray-600">{formatDate(taqdeerDetail.lastUpdated)}</div>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Sources */}
            {taqdeerDetail.sources && taqdeerDetail.sources.length > 0 && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">المصادر</h3>
                <div className="space-y-3">
                  {taqdeerDetail.sources.map((source, index) => (
                    <a
                      key={index}
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 text-sm leading-tight">
                            {source.title}
                          </h4>
                          <div className="flex items-center space-x-2 space-x-reverse mt-1">
                            <Badge variant="secondary" className="text-xs">
                              {formatSourceType(source.type)}
                            </Badge>
                            {source.date && (
                              <span className="text-xs text-gray-500">
                                {formatDate(source.date)}
                              </span>
                            )}
                          </div>
                        </div>
                        <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0 mr-2" />
                      </div>
                    </a>
                  ))}
                </div>
              </Card>
            )}

            {/* Share */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">مشاركة</h3>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: taqdeerDetail.seo.title,
                        text: taqdeerDetail.seo.description,
                        url: window.location.href,
                      })
                    } else {
                      navigator.clipboard.writeText(window.location.href)
                    }
                  }}
                >
                  نسخ الرابط
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}