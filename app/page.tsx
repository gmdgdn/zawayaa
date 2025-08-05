import { redirect } from 'next/navigation'

export default function HomePage() {
  // Redirect directly to Arabic version for Phase 1
  redirect('/ar')
}
