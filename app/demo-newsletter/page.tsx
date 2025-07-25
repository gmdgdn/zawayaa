"use client"

import NewsletterTrigger from "@/components/newsletter-trigger"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Bell, Users, Zap } from "lucide-react"

export default function NewsletterDemo() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 font-eurostile">Newsletter Modal Demo</h1>
          <p className="text-xl text-gray-600 font-eurostile">
            Test the reusable newsletter subscription modal component
          </p>
        </div>

        {/* Different trigger variations */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center font-eurostile">
                <Mail className="w-5 h-5 mr-2" />
                Default Button
              </CardTitle>
              <CardDescription>Standard newsletter subscription button</CardDescription>
            </CardHeader>
            <CardContent>
              <NewsletterTrigger />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center font-eurostile">
                <Bell className="w-5 h-5 mr-2" />
                Outline Variant
              </CardTitle>
              <CardDescription>Outline style with custom text</CardDescription>
            </CardHeader>
            <CardContent>
              <NewsletterTrigger variant="outline">
                <Bell className="w-4 h-4 mr-2" />
                Get Updates
              </NewsletterTrigger>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center font-eurostile">
                <Users className="w-5 h-5 mr-2" />
                Large Size
              </CardTitle>
              <CardDescription>Large button for hero sections</CardDescription>
            </CardHeader>
            <CardContent>
              <NewsletterTrigger size="lg" className="w-full bg-zawaya-primary hover:bg-zawaya-primary/90">
                <Users className="w-5 h-5 mr-2" />
                Join Our Community
              </NewsletterTrigger>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center font-eurostile">
                <Zap className="w-5 h-5 mr-2" />
                Ghost Variant
              </CardTitle>
              <CardDescription>Subtle ghost style button</CardDescription>
            </CardHeader>
            <CardContent>
              <NewsletterTrigger variant="ghost">
                <Zap className="w-4 h-4 mr-2" />
                Stay Informed
              </NewsletterTrigger>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center font-eurostile">
                <Mail className="w-5 h-5 mr-2" />
                Small Size
              </CardTitle>
              <CardDescription>Compact button for headers</CardDescription>
            </CardHeader>
            <CardContent>
              <NewsletterTrigger
                size="sm"
                variant="outline"
                className="text-zawaya-primary border-zawaya-primary hover:bg-zawaya-primary hover:text-white"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center font-eurostile">
                <Mail className="w-5 h-5 mr-2" />
                Custom Style
              </CardTitle>
              <CardDescription>Custom styled trigger button</CardDescription>
            </CardHeader>
            <CardContent>
              <NewsletterTrigger className="bg-gradient-to-r from-zawaya-primary to-zawaya-accent text-white hover:from-zawaya-primary/90 hover:to-zawaya-accent/90 shadow-lg">
                <Mail className="w-4 h-4 mr-2" />
                Subscribe Now
              </NewsletterTrigger>
            </CardContent>
          </Card>
        </div>

        {/* Usage examples */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="font-eurostile">Usage Examples</CardTitle>
            <CardDescription>How to use the NewsletterTrigger component in different contexts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-100 p-4 rounded-lg">
              <h4 className="font-semibold mb-2 font-eurostile">Basic Usage:</h4>
              <code className="text-sm bg-white p-2 rounded block">{`<NewsletterTrigger />`}</code>
            </div>

            <div className="bg-gray-100 p-4 rounded-lg">
              <h4 className="font-semibold mb-2 font-eurostile">With Custom Props:</h4>
              <code className="text-sm bg-white p-2 rounded block">
                {`<NewsletterTrigger variant="outline" size="lg" className="custom-class">
  Custom Text
</NewsletterTrigger>`}
              </code>
            </div>

            <div className="bg-gray-100 p-4 rounded-lg">
              <h4 className="font-semibold mb-2 font-eurostile">In Header:</h4>
              <code className="text-sm bg-white p-2 rounded block">
                {`<NewsletterTrigger size="sm" variant="ghost" />`}
              </code>
            </div>
          </CardContent>
        </Card>

        {/* Features list */}
        <Card>
          <CardHeader>
            <CardTitle className="font-eurostile">Modal Features</CardTitle>
            <CardDescription>What's included in the newsletter subscription modal</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-zawaya-primary rounded-full mr-3"></div>
                Bilingual support (Arabic/English) with RTL layout
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-zawaya-primary rounded-full mr-3"></div>
                Form validation for name and email fields
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-zawaya-primary rounded-full mr-3"></div>
                Topic selection with checkboxes
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-zawaya-primary rounded-full mr-3"></div>
                Loading states and success confirmation
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-zawaya-primary rounded-full mr-3"></div>
                Privacy notice and user-friendly messaging
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-zawaya-primary rounded-full mr-3"></div>
                Responsive design for all screen sizes
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-zawaya-primary rounded-full mr-3"></div>
                Auto-reset form after successful submission
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
