"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"

const aboutContent = {
  title: "من نحن؟",
  sections: [
    {
      id: "vision",
      title: "رؤيتنا",
      content: `زوايا منصة معرفية غير ربحية، ثنائية اللغة، تهدف إلى ربط الواقع العربي بالتحولات العالمية من خلال تحليلات رصينة ومتعددة الاختصاصات.

نسعى لأن نصبح المرجع الفكري للتحليل العربي المدروس، مع الترحيب بالقراء من جميع أنحاء العالم. نؤمن بأن المعرفة جسر يربط بين الثقافات والحضارات، وأن التحليل العميق والموضوعي هو السبيل لفهم عالمنا المعقد.

تقدم زوايا محتوى متنوعاً يشمل المقالات والبودكاست والبرامج المرئية والوثائقيات، جميعها باللغتين العربية والإنجليزية، وجميعها خالية من الأيديولوجيات الضيقة.`,
    },
    {
      id: "values",
      title: "قيمنا",
      content: `**الموضوعية والحياد**
نلتزم بتقديم تحليلات موضوعية بعيدة عن التحيز السياسي أو الأيديولوجي. نؤمن بأن الحقيقة متعددة الأوجه، ولذلك نسعى لتقديم "القصة من كل زواياها".

**التعددية الفكرية**
نحتفي بتنوع الآراء والمدارس الفكرية، ونوفر منصة للحوار البناء بين مختلف التيارات الفكرية والسياسية في المنطقة العربية وخارجها.

**الجودة والعمق**
نركز على التحليل العميق والبحث الدقيق، ونرفض السطحية والإثارة. كل محتوى ننشره يخضع لمراجعة تحريرية صارمة تضمن جودته العلمية والمهنية.

**الشفافية والمسؤولية**
نلتزم بالشفافية في مصادر تمويلنا وفي منهجيتنا التحريرية. نتحمل المسؤولية الكاملة عن المحتوى الذي ننشره ونسعى للتصحيح الفوري لأي أخطاء.

**الوصول المجاني للمعرفة**
نؤمن بأن المعرفة حق للجميع، ولذلك نقدم جميع محتوياتنا مجاناً. نعتمد على التبرعات والدعم المؤسسي لضمان استمراريتنا دون المساس باستقلاليتنا.`,
    },
    {
      id: "audience",
      title: "جمهورنا",
      content: `**المفكرون والأكاديميون**
نخاطب الباحثين والأكاديميين وطلاب الدراسات العليا المهتمين بالشؤون العربية والإقليمية والدولية. نوفر لهم تحليلات معمقة ومراجع موثوقة تساعدهم في أبحاثهم ودراساتهم.

**صناع القرار والسياسيون**
نقدم تحليلات استراتيجية تساعد صناع القرار في القطاعين العام والخاص على فهم التطورات الإقليمية والدولية وتأثيرها على مصالحهم وسياساتهم.

**الإعلاميون والصحفيون**
نوفر للإعلاميين والصحفيين خلفيات معرفية وتحليلات متخصصة تساعدهم في تغطية الأحداث بعمق ومهنية أكبر.

**الجمهور المثقف**
نخاطب القارئ العربي المثقف الذي يسعى لفهم عالمه بعمق أكبر، والذي يبحث عن مصادر موثوقة للمعلومات والتحليلات بعيداً عن الضجيج الإعلامي.

**المجتمع الدولي**
نسعى لتقديم نافذة للعالم على الفكر العربي المعاصر، ولبناء جسور التفاهم بين الثقافة العربية والثقافات الأخرى من خلال المحتوى ثنائي اللغة.`,
    },
    {
      id: "methodology",
      title: "منهجيتنا",
      content: `**البحث والتحليل**
نعتمد على منهجية بحثية صارمة تقوم على جمع المعلومات من مصادر متعددة وموثوقة، وتحليلها باستخدام أدوات التحليل الأكاديمي والمهني المتقدمة.

**التحرير والمراجعة**
يخضع كل محتوى لعملية تحرير ومراجعة متعددة المراحل تشمل المراجعة اللغوية والعلمية والقانونية لضمان دقة المعلومات وسلامة التحليل.

**التنوع في المصادر**
نحرص على التنوع في مصادر المعلومات والآراء، ونسعى لتقديم وجهات نظر متعددة حول القضايا المطروحة دون تحيز لطرف معين.

**التفاعل مع الجمهور**
نشجع التفاعل البناء مع جمهورنا من خلال التعليقات والنقاشات، ونستفيد من ملاحظاتهم في تطوير محتوانا وتحسين جودته.`,
    },
    {
      id: "team",
      title: "فريقنا",
      content: `**هيئة التحرير**
تضم هيئة التحرير نخبة من الكتاب والمحللين والأكاديميين المتخصصين في مختلف المجالات، من السياسة والاقتصاد إلى الثقافة والتكنولوجيا.

**المستشارون الأكاديميون**
نستعين بشبكة من المستشارين الأكاديميين من جامعات ومراكز بحثية مرموقة لضمان الدقة العلمية والمنهجية في تحليلاتنا.

**فريق الإنتاج**
يضم فريق الإنتاج متخصصين في الإنتاج الصوتي والمرئي والتصميم الجرافيكي وتطوير المواقع الإلكترونية لضمان تقديم محتوى عالي الجودة تقنياً.

**المترجمون**
نعتمد على فريق من المترجمين المحترفين المتخصصين في الترجمة الأكاديمية والإعلامية لضمان دقة النقل بين اللغتين العربية والإنجليزية.`,
    },
    {
      id: "future",
      title: "رؤيتنا المستقبلية",
      content: `**التوسع الجغرافي**
نسعى لتوسيع نطاق تغطيتنا لتشمل مناطق جغرافية أوسع، مع التركيز على القضايا التي تهم العالم العربي والإسلامي والمجتمع الدولي.

**التطوير التقني**
نعمل على تطوير منصتنا الرقمية باستمرار لتوفير تجربة مستخدم أفضل، بما في ذلك تطبيقات الهواتف الذكية وأدوات البحث المتقدمة.

**الشراكات الاستراتيجية**
نسعى لبناء شراكات مع مؤسسات أكاديمية وإعلامية ومراكز بحثية لتعزيز قدراتنا وتوسيع نطاق تأثيرنا.

**التعليم والتدريب**
نخطط لإطلاق برامج تعليمية وتدريبية في مجال التحليل السياسي والإعلامي لتطوير قدرات الجيل الجديد من المحللين والإعلاميين.`,
    },
  ],
}

export default function AboutPage() {
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
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-zawaya-primary mb-4 font-ge-ss">{aboutContent.title}</h1>
          <div className="w-24 h-1 bg-zawaya-accent mx-auto rounded-full"></div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Left Column - Sticky ToC */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8 p-6 bg-white shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-zawaya-primary mb-4 font-ge-ss">المحتويات</h3>
              <nav className="space-y-2">
                {aboutContent.sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`w-full text-right px-3 py-2 rounded-lg transition-all duration-200 font-ge-ss text-sm ${
                      activeSection === section.id
                        ? "bg-zawaya-accent text-white shadow-sm"
                        : "text-gray-600 hover:text-zawaya-primary hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <ChevronLeft
                        className={`w-4 h-4 transition-transform ${
                          activeSection === section.id ? "rotate-90 text-white" : "text-gray-400"
                        }`}
                      />
                      <span>{section.title}</span>
                    </div>
                  </button>
                ))}
              </nav>

              {/* Contact Info */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-zawaya-primary mb-3 font-ge-ss">تواصل معنا</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <p className="font-ge-ss">info@zawaya.org</p>
                  <p className="font-ge-ss">+1 (555) 123-4567</p>
                </div>
                <Button
                  className="w-full mt-4 bg-zawaya-primary hover:bg-zawaya-primary/90 text-white font-ge-ss"
                  size="sm"
                >
                  راسلنا
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
                      <h2 className="text-2xl font-medium text-zawaya-primary mb-6 font-ge-ss leading-relaxed border-b border-gray-200 pb-3">
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
                                className="text-xl font-medium text-zawaya-iris mt-8 mb-4 font-ge-ss leading-relaxed"
                              >
                                {headingText}
                              </h3>
                            )
                          }

                          return (
                            <p
                              key={pIndex}
                              className="text-gray-700 font-ge-ss font-light leading-relaxed text-lg"
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
                  <h3 className="text-2xl font-semibold mb-4 font-ge-ss">انضم إلى مجتمع زوايا</h3>
                  <p className="text-lg mb-6 font-ge-ss font-light leading-relaxed">
                    اشترك في نشرتنا البريدية للحصول على أحدث التحليلات والمقالات
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
                    <input
                      type="email"
                      placeholder="البريد الإلكتروني"
                      className="flex-1 px-4 py-3 rounded-lg text-gray-900 font-ge-ss text-right"
                      dir="rtl"
                    />
                    <Button className="bg-zawaya-accent hover:bg-zawaya-accent/90 text-white px-8 py-3 font-ge-ss">
                      اشترك
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="mt-12 flex justify-between items-center">
          <Button variant="outline" className="font-ge-ss bg-transparent">
            <ChevronLeft className="w-4 h-4 ml-2" />
            العودة للرئيسية
          </Button>
          <Button className="bg-zawaya-accent hover:bg-zawaya-accent/90 text-white font-ge-ss">
            تصفح المقالات
            <ChevronLeft className="w-4 h-4 mr-2 rotate-180" />
          </Button>
        </div>
      </div>
    </div>
  )
}
