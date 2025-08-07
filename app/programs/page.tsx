import { Metadata } from 'next'
import { motion } from 'framer-motion'
import { CardProgram } from '@/components/molecules/CardProgram'
import { getPrograms, WPProgram } from '@/lib/wp'

// ISR with 60 second revalidation
export const revalidate = 60

export const metadata: Metadata = {
  title: 'البرامج والعروض • زوايا',
  description: 'استكشف مجموعة متنوعة من البرامج والبودكاست والوثائقيات التي تقدم رؤى عميقة وتحليلات شاملة',
  openGraph: {
    title: 'البرامج والعروض • زوايا',
    description: 'استكشف مجموعة متنوعة من البرامج والبودكاست والوثائقيات التي تقدم رؤى عميقة وتحليلات شاملة',
  },
}

export default async function ProgramsPage() {
  let programs: WPProgram[] = []
  let error: string | null = null

  try {
    programs = await getPrograms({ per_page: 50, orderby: 'date', order: 'desc' })
  } catch (err) {
    console.error('Error fetching programs:', err)
    error = 'خطأ في تحميل البرامج'
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-md">
          <h1 className="text-2 font-bold text-primary-900">{error}</h1>
          <p className="text-neutral-600">حدث خطأ أثناء تحميل البرامج. يرجى المحاولة مرة أخرى.</p>
        </div>
      </div>
    )
  }

  // Transform WordPress programs to CardProgram props
  const programCards = programs.map(program => ({
    id: program.id,
    slug: program.slug,
    title: program.title.rendered,
    host: program.meta.host_arabic || 'فريق زوايا',
    cover: program.meta.cover_image || program._embedded?.['wp:featuredmedia']?.[0]?.source_url || '/images/placeholder-program.jpg',
    type: (program.meta.program_type as 'video' | 'audio' | 'mixed') || 'mixed',
    episodeCount: program.meta.episode_count || 0,
    themeColor: program.meta.theme_color,
    rating: program.meta.program_rating,
    subscriberCount: program.meta.subscriber_count,
    href: `/programs/${program.slug}`,
    description: program.excerpt.rendered?.replace(/<[^>]*>/g, '') || '',
    publishedAt: program.date
  }))

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Grid Container */}
      <div className="grid-container">
        {/* Page Header */}
        <motion.div 
          className="col-span-full text-center mb-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4 lg:text-5 font-bold text-primary-900 mb-md">
            البرامج والعروض
          </h1>
          <p className="text-1 text-neutral-600 max-w-3xl mx-auto leading-relaxed">
            استكشف مجموعة متنوعة من البرامج والبودكاست والوثائقيات التي تقدم رؤى عميقة وتحليلات شاملة
          </p>
        </motion.div>

        {/* Results Count */}
        <div className="col-span-full text-center mb-lg">
          <p className="text-0 text-neutral-600">
            {programCards.length} برنامج متاح
          </p>
        </div>

        {/* Programs Grid */}
        {programCards.length > 0 ? (
          <div className="col-span-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
              {programCards.map((program, index) => (
                <motion.div
                  key={program.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <CardProgram
                    id={program.id}
                    slug={program.slug}
                    title={program.title}
                    host={program.host}
                    cover={program.cover}
                    type={program.type}
                    episodeCount={program.episodeCount}
                    themeColor={program.themeColor}
                    rating={program.rating}
                    subscriberCount={program.subscriberCount}
                    href={program.href}
                    description={program.description}
                    publishedAt={program.publishedAt}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <div className="col-span-full text-center py-2xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="space-y-md"
            >
              <div className="text-6xl mb-md">📻</div>
              <h3 className="text-1 font-semibold text-neutral-600">لا توجد برامج</h3>
              <p className="text-0 text-neutral-500">لم نجد أي برامج متاحة حالياً</p>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}
