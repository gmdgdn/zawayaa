'use client'

import React, { useState } from 'react'

interface TranscriptAccordionProps {
  transcript?: string
  transcriptMarkdown?: string
  title?: string
}

export function TranscriptAccordion({ 
  transcript, 
  transcriptMarkdown, 
  title = "نص الحلقة" 
}: TranscriptAccordionProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Use markdown transcript if available, otherwise fall back to plain text
  const content = transcriptMarkdown || transcript

  if (!content) {
    return null
  }

  // Simple markdown-to-HTML conversion for basic formatting
  const formatMarkdown = (text: string): string => {
    return text
      // Headers
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold text-gray-900 mt-6 mb-3">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold text-gray-900 mt-8 mb-4">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-gray-900 mt-8 mb-4">$1</h1>')
      
      // Bold and italic
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">$1</a>')
      
      // Line breaks
      .replace(/\n\n/g, '</p><p class="mb-4">')
      .replace(/\n/g, '<br>')
      
      // Wrap in paragraphs
      .replace(/^(.+)/, '<p class="mb-4">$1')
      .replace(/(.+)$/, '$1</p>')
  }

  const toggleAccordion = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <button
        onClick={toggleAccordion}
        className="w-full px-4 py-4 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between text-right"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 2 2h8c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
          </svg>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        
        {/* Chevron Icon */}
        <svg 
          className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
          fill="currentColor" 
          viewBox="0 0 24 24"
        >
          <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
        </svg>
      </button>

      {/* Content */}
      <div 
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 py-6 border-t border-gray-200">
          {/* Transcript Content */}
          <div className="prose prose-lg max-w-none">
            {transcriptMarkdown ? (
              <div 
                className="text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ 
                  __html: formatMarkdown(transcriptMarkdown) 
                }}
              />
            ) : (
              <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {transcript}
              </div>
            )}
          </div>

          {/* Copy Button */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <button
              onClick={() => {
                navigator.clipboard.writeText(content)
                // You could add a toast notification here
              }}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
              </svg>
              نسخ النص
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}