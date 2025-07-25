"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"

const aboutContent = {
  title: "About Us",
  sections: [
    {
      id: "vision",
      title: "Our Vision",
      content: `Zawaya is a non-profit, bilingual knowledge hub that links Arab realities to global transformations through rigorous, multi-disciplinary analysis.

We aspire to become the reference library for thoughtful Arabic-language analysis while welcoming an international readership. We believe that knowledge serves as a bridge between cultures and civilizations, and that deep, objective analysis is the path to understanding our complex world.

Zawaya offers diverse content including articles, podcasts, video programs, and documentaries, all in both Arabic and English, and all free of narrow ideology.`,
    },
    {
      id: "values",
      title: "Our Values",
      content: `**Objectivity and Neutrality**
We are committed to providing objective analysis free from political or ideological bias. We believe that truth has multiple facets, which is why we strive to present "the story from every angle."

**Intellectual Diversity**
We celebrate the diversity of opinions and schools of thought, providing a platform for constructive dialogue between different intellectual and political currents in the Arab region and beyond.

**Quality and Depth**
We focus on deep analysis and rigorous research, rejecting superficiality and sensationalism. All content we publish undergoes strict editorial review to ensure its scientific and professional quality.

**Transparency and Responsibility**
We are committed to transparency in our funding sources and editorial methodology. We take full responsibility for the content we publish and strive for immediate correction of any errors.

**Free Access to Knowledge**
We believe that knowledge is a right for everyone, which is why we offer all our content for free. We rely on donations and institutional support to ensure our continuity without compromising our independence.`,
    },
    {
      id: "audience",
      title: "Our Audience",
      content: `**Thinkers and Academics**
We address researchers, academics, and graduate students interested in Arab, regional, and international affairs. We provide them with in-depth analysis and reliable references to assist in their research and studies.

**Decision Makers and Politicians**
We offer strategic analysis that helps decision makers in both public and private sectors understand regional and international developments and their impact on their interests and policies.

**Media and Journalists**
We provide media professionals and journalists with specialized knowledge backgrounds and analysis that help them cover events with greater depth and professionalism.

**Educated Public**
We address the educated Arab reader who seeks to understand their world more deeply, and who looks for reliable sources of information and analysis away from media noise.

**International Community**
We seek to provide the world with a window into contemporary Arab thought, and to build bridges of understanding between Arab culture and other cultures through bilingual content.`,
    },
  ],
}

export default function AboutPageEN() {
  const [activeSection, setActiveSection] = useState("vision")

  useEffect(() => {
    const handleScroll = () => {
      const sections = aboutContent.sections
      const scrollPosition = window.scrollY + 200

      for (let i = sections.length - 1; i >= 0; i--) {
        const element = document.getElementById(sections[i].id)
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(sections[i].id)
          break
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="ltr">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-zawaya-primary mb-4 font-eurostile">{aboutContent.title}</h1>
          <div className="w-24 h-1 bg-zawaya-accent mx-auto rounded-full"></div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Left Column - Sticky ToC */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8 p-6 bg-white shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-zawaya-primary mb-4 font-eurostile">Contents</h3>
              <nav className="space-y-2">
                {aboutContent.sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 font-eurostile text-sm ${
                      activeSection === section.id
                        ? "bg-zawaya-accent text-white shadow-sm"
                        : "text-gray-600 hover:text-zawaya-primary hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{section.title}</span>
                      <ChevronRight
                        className={`w-4 h-4 transition-transform ${
                          activeSection === section.id ? "rotate-90 text-white" : "text-gray-400"
                        }`}
                      />
                    </div>
                  </button>
                ))}
              </nav>

              {/* Contact Info */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-zawaya-primary mb-3 font-eurostile">Contact Us</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <p className="font-eurostile">info@zawaya.org</p>
                  <p className="font-eurostile">+1 (555) 123-4567</p>
                </div>
                <Button
                  className="w-full mt-4 bg-zawaya-primary hover:bg-zawaya-primary/90 text-white font-eurostile"
                  size="sm"
                >
                  Contact Us
                </Button>
              </div>
            </Card>
          </div>

          {/* Right Column - Content */}
          <div className="lg:col-span-3">
            <Card className="bg-white shadow-sm border border-gray-200">
              <div className="p-8 lg:p-12">
                <div className="prose prose-lg max-w-none">
                  {aboutContent.sections.map((section, index) => (
                    <section key={section.id} id={section.id} className="mb-16 scroll-mt-8">
                      <h2 className="text-2xl font-medium text-zawaya-primary mb-6 font-eurostile leading-relaxed border-b border-gray-200 pb-3">
                        {section.title}
                      </h2>
                      <div className="space-y-6">
                        {section.content.split("\n\n").map((paragraph, pIndex) => {
                          // Check if paragraph is a heading (starts with **)
                          if (paragraph.startsWith("**") && paragraph.endsWith("**")) {
                            const headingText = paragraph.slice(2, -2)
                            return (
                              <h3
                                key={pIndex}
                                className="text-xl font-medium text-zawaya-iris mt-8 mb-4 font-eurostile leading-relaxed"
                              >
                                {headingText}
                              </h3>
                            )
                          }

                          return (
                            <p
                              key={pIndex}
                              className="text-gray-700 font-eurostile font-light leading-relaxed text-lg"
                              style={{ lineHeight: "1.8" }}
                            >
                              {paragraph}
                            </p>
                          )
                        })}
                      </div>

                      {/* Add separator between sections except for the last one */}
                      {index < aboutContent.sections.length - 1 && (
                        <div className="mt-12 flex justify-center">
                          <div className="w-16 h-px bg-gradient-to-r from-transparent via-zawaya-accent to-transparent"></div>
                        </div>
                      )}
                    </section>
                  ))}
                </div>

                {/* Call to Action */}
                <div className="mt-16 p-8 bg-gradient-to-r from-zawaya-primary to-zawaya-iris rounded-lg text-white text-center">
                  <h3 className="text-2xl font-semibold mb-4 font-eurostile">Join the Zawaya Community</h3>
                  <p className="text-lg mb-6 font-eurostile font-light leading-relaxed">
                    Subscribe to our newsletter for the latest analysis and articles
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
                    <input
                      type="email"
                      placeholder="Email address"
                      className="flex-1 px-4 py-3 rounded-lg text-gray-900 font-eurostile text-left"
                      dir="ltr"
                    />
                    <Button className="bg-zawaya-accent hover:bg-zawaya-accent/90 text-white px-8 py-3 font-eurostile">
                      Subscribe
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="mt-12 flex justify-between items-center">
          <Button variant="outline" className="font-eurostile bg-transparent">
            <ChevronRight className="w-4 h-4 mr-2 rotate-180" />
            Back to Home
          </Button>
          <Button className="bg-zawaya-accent hover:bg-zawaya-accent/90 text-white font-eurostile">
            Browse Articles
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}
