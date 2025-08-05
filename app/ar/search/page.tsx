import SearchInterface from '@/components/search-interface'

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">البحث في زوايا</h1>
          <p className="text-gray-600">ابحث في المقالات والبرامج والبودكاست</p>
        </div>
        
        <SearchInterface />
      </div>
    </div>
  )
}