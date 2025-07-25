"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

// Timeline data for Eastern Civilization
const timelineSections = [
  {
    id: 1,
    period: "3500 - 3000 ق.م",
    title: "بداية الحضارات النهرية",
    subtitle: "نشأة الكتابة والمدن الأولى",
    image: "/placeholder.svg?height=800&width=1200",
    narrative: `في هذه الفترة المحورية من التاريخ الإنساني، شهدت منطقة بلاد الرافدين ووادي النيل نشأة أولى الحضارات المعقدة. تطورت الكتابة المسمارية في سومر، وظهرت المدن الأولى مثل أور وأوروك. كانت هذه بداية عصر جديد من التنظيم الاجتماعي والسياسي، حيث تشكلت الممالك الأولى وتطورت أنظمة الري المعقدة التي مكنت من الزراعة المكثفة على ضفاف الأنهار.

تميزت هذه الحقبة بالابتكارات التقنية الثورية مثل اختراع العجلة، وتطوير أنظمة القياس والحساب، وظهور أولى القوانين المكتوبة. كما شهدت نشأة الأديان المنظمة والمعابد الضخمة التي كانت مراكز للحياة الاقتصادية والاجتماعية.`,
    hasVideo: true,
    videoUrl: "/placeholder-video.mp4",
    tags: ["بلاد الرافدين", "الكتابة المسمارية", "المدن الأولى"],
  },
  {
    id: 2,
    period: "2686 - 2181 ق.م",
    title: "عصر الأهرامات المصرية",
    subtitle: "المملكة القديمة وعجائب البناء",
    image: "/placeholder.svg?height=800&width=1200",
    narrative: `تمثل المملكة القديمة في مصر ذروة الإنجاز المعماري والهندسي في العالم القديم. خلال هذه الفترة، تم بناء الأهرامات العظيمة في الجيزة، والتي تعتبر من عجائب الدنيا السبع القديمة والوحيدة الباقية حتى اليوم.

شهدت هذه الحقبة تطوراً هائلاً في علوم الطب والفلك والرياضيات. طور المصريون القدماء نظاماً معقداً للتحنيط والحفاظ على الجثث، وأسسوا تقليداً طبياً متقدماً. كما تطورت الكتابة الهيروغليفية لتصبح نظاماً معقداً للتعبير عن الأفكار المجردة والملموسة.

كانت الحضارة المصرية في هذه الفترة مركزاً للتجارة والثقافة، حيث امتدت شبكات التجارة من النوبة جنوباً إلى بلاد الشام شمالاً، مما أدى إلى تبادل ثقافي وتقني واسع النطاق.`,
    hasVideo: false,
    tags: ["مصر القديمة", "الأهرامات", "الهيروغليفية", "التحنيط"],
  },
  {
    id: 3,
    period: "2334 - 2154 ق.م",
    title: "الإمبراطورية الأكادية",
    subtitle: "أول إمبراطورية متعددة الأعراق",
    image: "/placeholder.svg?height=800&width=1200",
    narrative: `تأسست الإمبراطورية الأكادية على يد سرجون الأكادي، وتعتبر أول إمبراطورية حقيقية في التاريخ. امتدت من الخليج العربي جنوباً إلى الأناضول شمالاً، ومن زاغروس شرقاً إلى البحر المتوسط غرباً.

تميزت هذه الإمبراطورية بنظامها الإداري المتطور والجيش المنظم الذي اعتمد على الأقواس المركبة والعربات الحربية. كما شهدت ازدهاراً في الفنون والأدب، حيث ظهرت أولى الملاحم الأدبية المكتوبة.

لعبت الإمبراطورية الأكادية دوراً محورياً في نشر الثقافة والتقنيات عبر منطقة واسعة من الشرق الأوسط، مما أسس لتقاليد إمبراطورية استمرت لآلاف السنين في المنطقة.`,
    hasVideo: true,
    videoUrl: "/placeholder-video.mp4",
    tags: ["الأكاديون", "سرجون", "الإمبراطورية", "بلاد الرافدين"],
  },
  {
    id: 4,
    period: "2112 - 2004 ق.م",
    title: "عصر أور الثالث",
    subtitle: "النهضة السومرية الأخيرة",
    image: "/placeholder.svg?height=800&width=1200",
    narrative: `يمثل عصر أور الثالث آخر فترات الازدهار السومري العظيم. تحت حكم أور-نامو وخلفائه، شهدت بلاد الرافدين نهضة ثقافية وإدارية مذهلة. تم بناء زقورة أور العظيمة، وتطوير نظام إداري معقد يعتمد على الكتابة المسمارية.

تميزت هذه الفترة بالتطور القانوني الهائل، حيث وضع أور-نامو أول مجموعة قوانين مكتوبة معروفة في التاريخ، والتي سبقت قانون حمورابي بثلاثة قرون. كما شهدت ازدهاراً في التجارة والحرف اليدوية.

كانت هذه الفترة بمثابة العصر الذهبي الأخير للحضارة السومرية، حيث تم الحفاظ على التقاليد الثقافية والدينية القديمة مع دمجها بالابتكارات الجديدة في الإدارة والتقنية.`,
    hasVideo: false,
    tags: ["السومريون", "أور", "القوانين", "الزقورة"],
  },
  {
    id: 5,
    period: "1894 - 1594 ق.م",
    title: "الإمبراطورية البابلية القديمة",
    subtitle: "حمورابي وقانونه الشهير",
    image: "/placeholder.svg?height=800&width=1200",
    narrative: `تحت حكم حمورابي السادس، وصلت الإمبراطورية البابلية القديمة إلى ذروة قوتها وازدهارها. اشتهرت هذه الفترة بوضع قانون حمورابي، وهو أحد أقدم وأشمل المجموعات القانونية في التاريخ، والذي أرسى مبادئ العدالة والمساواة أمام القانون.

شهدت بابل في هذه الفترة ازدهاراً عمرانياً وثقافياً هائلاً، حيث أصبحت مركزاً للتجارة والتعلم في الشرق الأوسط. تطورت علوم الفلك والرياضيات، وظهرت أولى الخرائط الفلكية المفصلة.

كما تميزت هذه الحقبة بالتطور الديني، حيث أصبح الإله مردوخ الإله الأعظم في البانثيون البابلي، وتم تطوير ملحمة الخلق البابلية "إينوما إليش" التي أثرت على التقاليد الدينية في المنطقة لقرون عديدة.`,
    hasVideo: true,
    videoUrl: "/placeholder-video.mp4",
    tags: ["بابل", "حمورابي", "القانون", "مردوخ"],
  },
  {
    id: 6,
    period: "1550 - 1077 ق.م",
    title: "الإمبراطورية المصرية الحديثة",
    subtitle: "عصر الفراعنة العظام",
    image: "/placeholder.svg?height=800&width=1200",
    narrative: `تمثل الإمبراطورية المصرية الحديثة ذروة القوة والنفوذ المصري في العالم القديم. شهدت هذه الفترة حكم أعظم الفراعنة مثل تحتمس الثالث، أخناتون، توت عنخ آمون، ورمسيس الثاني.

امتدت الإمبراطورية من النوبة جنوباً إلى نهر الفرات شمالاً، وأصبحت مصر القوة العظمى المهيمنة في الشرق الأوسط. شهدت هذه الفترة ثورة دينية في عهد أخناتون الذي أسس عبادة آتون، وبناء معابد عظيمة مثل الكرنك وأبو سمبل.

تطورت الفنون والحرف إلى مستويات لم تشهدها من قبل، كما ازدهرت التجارة الدولية والدبلوماسية. اكتشفت مقبرة توت عنخ آمون في القرن العشرين، مما كشف عن ثراء وتطور هذه الحضارة العظيمة.`,
    hasVideo: false,
    tags: ["مصر الحديثة", "الفراعنة", "توت عنخ آمون", "رمسيس"],
  },
]

export default function ArCivilisationPage() {
  const [currentSection, setCurrentSection] = useState(0)
  const [isVideoPlaying, setIsVideoPlaying] = useState<{ [key: number]: boolean }>({})
  const [isVideoMuted, setIsVideoMuted] = useState<{ [key: number]: boolean }>({})
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const videoRefs = useRef<{ [key: number]: HTMLVideoElement | null }>({})

  // Handle scroll snapping
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft
      const sectionWidth = container.clientWidth
      const newSection = Math.round(scrollLeft / sectionWidth)
      setCurrentSection(newSection)
    }

    container.addEventListener("scroll", handleScroll)
    return () => container.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (index: number) => {
    const container = scrollContainerRef.current
    if (!container) return

    const sectionWidth = container.clientWidth
    container.scrollTo({
      left: index * sectionWidth,
      behavior: "smooth",
    })
  }

  const toggleVideo = (sectionId: number) => {
    const video = videoRefs.current[sectionId]
    if (!video) return

    if (isVideoPlaying[sectionId]) {
      video.pause()
      setIsVideoPlaying((prev) => ({ ...prev, [sectionId]: false }))
    } else {
      video.play()
      setIsVideoPlaying((prev) => ({ ...prev, [sectionId]: true }))
    }
  }

  const toggleMute = (sectionId: number) => {
    const video = videoRefs.current[sectionId]
    if (!video) return

    video.muted = !video.muted
    setIsVideoMuted((prev) => ({ ...prev, [sectionId]: video.muted }))
  }

  const toggleFullscreen = (sectionId: number) => {
    const video = videoRefs.current[sectionId]
    if (!video) return

    if (video.requestFullscreen) {
      video.requestFullscreen()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50" dir="rtl">
      {/* Header */}
      <div className="relative z-10 bg-white/90 backdrop-blur-sm border-b border-amber-200">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-amber-900 mb-2">حضارة الشرق</h1>
            <p className="text-lg text-amber-700 max-w-2xl mx-auto">
              رحلة تفاعلية عبر التاريخ لاستكشاف أعظم الحضارات التي نشأت في الشرق الأوسط
            </p>
          </div>
        </div>
      </div>

      {/* Timeline Navigation */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-amber-200 py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-amber-900">الخط الزمني التفاعلي</h2>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => scrollToSection(Math.max(0, currentSection - 1))}
                disabled={currentSection === 0}
                className="border-amber-300 text-amber-700 hover:bg-amber-50"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => scrollToSection(Math.min(timelineSections.length - 1, currentSection + 1))}
                disabled={currentSection === timelineSections.length - 1}
                className="border-amber-300 text-amber-700 hover:bg-amber-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Timeline dots */}
          <div className="flex justify-center gap-2 overflow-x-auto pb-2">
            {timelineSections.map((section, index) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(index)}
                className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  currentSection === index
                    ? "bg-amber-600 text-white"
                    : "bg-amber-100 text-amber-700 hover:bg-amber-200"
                }`}
              >
                {section.period}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Horizontal Scroll Container */}
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {timelineSections.map((section, index) => (
          <div key={section.id} className="min-w-full snap-start flex flex-col lg:flex-row">
            {/* Hero Image Section */}
            <div className="lg:w-1/2 relative">
              <div className="h-[50vh] lg:h-screen relative overflow-hidden">
                <img
                  src={section.image || "/placeholder.svg"}
                  alt={section.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                {/* Period Badge */}
                <div className="absolute top-6 right-6">
                  <Badge className="bg-amber-600 text-white text-sm px-3 py-1">{section.period}</Badge>
                </div>

                {/* Tags */}
                <div className="absolute bottom-6 right-6 flex flex-wrap gap-2">
                  {section.tags.map((tag, tagIndex) => (
                    <Badge key={tagIndex} variant="secondary" className="bg-white/90 text-amber-900 text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="lg:w-1/2 flex flex-col justify-center p-8 lg:p-12 bg-white">
              <div className="max-w-2xl">
                <h2 className="text-3xl lg:text-4xl font-bold text-amber-900 mb-4">{section.title}</h2>
                <h3 className="text-xl text-amber-700 mb-6">{section.subtitle}</h3>

                <div className="prose prose-lg prose-amber max-w-none text-gray-700 leading-relaxed">
                  {section.narrative.split("\n\n").map((paragraph, pIndex) => (
                    <p key={pIndex} className="mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>

                {/* Video Player */}
                {section.hasVideo && (
                  <div className="mt-8">
                    <div className="relative bg-black rounded-lg overflow-hidden">
                      <video
                        ref={(el) => {
                          if (el) videoRefs.current[section.id] = el
                        }}
                        className="w-full h-64 object-cover"
                        poster={section.image}
                        muted
                        onPlay={() => setIsVideoPlaying((prev) => ({ ...prev, [section.id]: true }))}
                        onPause={() => setIsVideoPlaying((prev) => ({ ...prev, [section.id]: false }))}
                      >
                        <source src={section.videoUrl} type="video/mp4" />
                      </video>

                      {/* Video Controls */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity">
                        <div className="flex gap-4">
                          <Button
                            size="sm"
                            onClick={() => toggleVideo(section.id)}
                            className="bg-white/90 text-black hover:bg-white"
                          >
                            {isVideoPlaying[section.id] ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => toggleMute(section.id)}
                            className="bg-white/90 text-black hover:bg-white"
                          >
                            {isVideoMuted[section.id] ? (
                              <VolumeX className="w-4 h-4" />
                            ) : (
                              <Volume2 className="w-4 h-4" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => toggleFullscreen(section.id)}
                            className="bg-white/90 text-black hover:bg-white"
                          >
                            <Maximize className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Hint */}
                <div className="mt-8 text-center lg:text-right">
                  <p className="text-sm text-amber-600 mb-2">
                    {index < timelineSections.length - 1 ? "التالي:" : "انتهت الرحلة"}
                  </p>
                  {index < timelineSections.length - 1 && (
                    <Button
                      onClick={() => scrollToSection(index + 1)}
                      className="bg-amber-600 hover:bg-amber-700 text-white"
                    >
                      {timelineSections[index + 1].title}
                      <ChevronLeft className="w-4 h-4 mr-2" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Progress Indicator */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-20">
        <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-amber-200">
          <span className="text-sm font-medium text-amber-900">
            {currentSection + 1} من {timelineSections.length}
          </span>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}
