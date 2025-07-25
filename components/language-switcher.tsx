"use client"

import { useLocale } from "next-intl"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "./ui/button"

export default function LanguageSwitcher() {
  const router = useRouter()
  const pathname = usePathname()
  const locale = useLocale()

  const switchLocale = () => {
    const newLocale = locale === "en" ? "ar" : "en"
    const newPathname = pathname.replace(`/${locale}`, `/${newLocale}`)
    router.push(newPathname)
  }

  return (
    <Button variant="ghost" onClick={switchLocale}>
      {locale === "en" ? "العربية" : "English"}
    </Button>
  )
}
