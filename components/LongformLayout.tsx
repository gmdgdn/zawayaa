'use client'

import React from 'react'
import Image from 'next/image'
import { TaqdeerDetailProps, getVerdictDisplayName, getVerdictColorClass, getSourceTypeDisplayName, formatConfidence } from '@/lib/scf-mappings/taqdeer'

interface LongformLayoutProps {
  taqdeer: TaqdeerDetailProps
}

export function LongformLayout({ taqdeer }: LongformLayoutProps) {
  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      {/* Header Section */}
      <header className="mb-8">
        {/* Kicker */}
        {taqdeer.kicker && (
          <div className="mb-4">
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
              {taqdeer.kicker}
            </span>
          </div>
        )}

        {/* Title */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
          {taqdeer.title}
        </h1>

        {/* Deck */}
        {taqdeer.deck && (
          <p className="text-xl md:text-2xl text-gray-600 leading-relaxed mb-6">
            {taqdeer.deck}
          </p>
        )}

        {/* Verdict Badge */}
        <div className="flex items-center gap-4 mb-6">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-medium ${getVerdictColorClass(taqdeer.verdict)}`}>
            <span className="w-2 h-2 rounded-full bg-current"></span>
            <span>التقدير: {getVerdictDisplayName(taqdeer.verdict)}</span>
          </div>
          
          {taqdeer.confidence && (
            <div className="text-sm text-gray-600">
              مستوى الثقة: <span className="font-medium">{formatConfidence(taqdeer.confidence)}</span>
            </div>
          )}
        </div>

        {/* Meta Information */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 pb-6 border-b border-gray-200">
          <time dateTime={taqdeer.publishedAt}>
            نُشر في {formatDate(taqdeer.publishedAt)}
          </time>
          
          {taqdeer.lastUpdated && (
            <>
              <span>•</span>
              <time dateTime={taqdeer.lastUpdated}>
                آخر تحديث: {formatDate(taqdeer.lastUpdated)}
              </time>
            </>
          )}
        </div>
      </header>

      {/* Featured Image */}
      {taqdeer.image && (
        <div className="mb-8">
          <div className="relative aspect-video rounded-lg overflow-hidden">
            <Image
              src={taqdeer.image}
              alt={taqdeer.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="prose prose-lg max-w-none mb-12">
        <div 
          className="text-gray-800 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: taqdeer.content }}
        />
      </div>

      {/* Charts Gallery */}
      {taqdeer.chartsGallery && taqdeer.chartsGallery.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">الرسوم البيانية والمخططات</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {taqdeer.chartsGallery.map((chart, index) => (
              <div key={index} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="relative aspect-video">
                  <Image
                    src={chart.image_url}
                    alt={chart.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">{chart.title}</h3>
                  {chart.description && (
                    <p className="text-sm text-gray-600">{chart.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Methodology */}
      {taqdeer.methodology && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">المنهجية</h2>
          <div className="bg-gray-50 rounded-lg p-6">
            <div 
              className="prose prose-gray max-w-none"
              dangerouslySetInnerHTML={{ __html: taqdeer.methodology }}
            />
          </div>
        </section>
      )}

      {/* Sources */}
      {taqdeer.sources && taqdeer.sources.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">المصادر والمراجع</h2>
          <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
            {taqdeer.sources.map((source, index) => (
              <div key={index} className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 mb-1">
                      <a 
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-blue-600 transition-colors"
                      >
                        {source.title}
                      </a>
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                        {getSourceTypeDisplayName(source.type)}
                      </span>
                      {source.date && (
                        <>
                          <span>•</span>
                          <time dateTime={source.date}>
                            {formatDate(source.date)}
                          </time>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="فتح المصدر"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="pt-8 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div>
            <p>تم النشر في {formatDate(taqdeer.publishedAt)}</p>
            {taqdeer.modifiedAt !== taqdeer.publishedAt && (
              <p>آخر تعديل: {formatDate(taqdeer.modifiedAt)}</p>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            {/* Share buttons could go here */}
            <button className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
              </svg>
              مشاركة
            </button>
          </div>
        </div>
      </footer>
    </article>
  )
}