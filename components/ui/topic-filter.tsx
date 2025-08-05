"use client"

import { CategoryChip } from "./category-chip"

const topics = [
  'آراء سياسية',
  'تقدير موقف', 
  'ثقافة',
  'تاريخ',
  'تقنية',
  'فن',
  'وثائقيات'
]

export function TopicFilter() {
  const handleTopicClick = (topic: string) => {
    // Navigate to topic page or filter
    console.log(`Navigate to ${topic}`)
    // In a real app, you would use router.push() here
  }

  return (
    <div className="flex flex-wrap justify-center gap-3">
      {topics.map((topic) => (
        <CategoryChip 
          key={topic}
          category={topic}
          size="lg"
          onClick={() => handleTopicClick(topic)}
        />
      ))}
    </div>
  )
}