import LanguageSplash from "@/components/language-splash"

export default function Home() {
  return (
    <div>
      <LanguageSplash />
      <div className="container mx-auto py-12">
        <h1 className="text-4xl font-bold">Welcome to Zawaya</h1>
        <p>Content will be displayed here after language selection.</p>
      </div>
    </div>
  )
}
