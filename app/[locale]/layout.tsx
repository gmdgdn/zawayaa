"use client"

import type { ReactNode } from "react"
import { useLocale } from "next-intl"
import { notFound } from "next/navigation"
import { Inter } from "next/font/google"
import Header from "@/components/header"
import Footer from "@/components/footer"

const inter = Inter({ subsets: ["latin"] })

type Props = {
  children: ReactNode
  params: { locale: string }
}

export default function LocaleLayout({ children, params }: Props) {
  const locale = useLocale()

  // Show a 404 error if the user requests an unknown locale
  if (params.locale !== locale) {
    notFound()
  }

  const direction = locale === "ar" ? "rtl" : "ltr"

  return (
    <html lang={locale} dir={direction}>
      <body className={`${inter.className} bg-background text-foreground`}>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
