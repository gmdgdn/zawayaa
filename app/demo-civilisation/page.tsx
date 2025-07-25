"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

// Timeline data for Eastern Civilization
const timelineSections = [
  {
    id: 1,
    period: "3500 - 3000 BCE",
    title: "Rise of River Civilizations",
    subtitle: "Birth of Writing and First Cities",
    image: "/placeholder.svg?height=800&width=1200",
    narrative: `During this pivotal period in human history, the regions of Mesopotamia and the Nile Valley witnessed the emergence of the first complex civilizations. Cuneiform writing developed in Sumer, and the first cities like Ur and Uruk appeared. This marked the beginning of a new era of social and political organization, where the first kingdoms formed and complex irrigation systems developed that enabled intensive agriculture along riverbanks.

This era was characterized by revolutionary technical innovations such as the invention of the wheel, the development of measurement and calculation systems, and the emergence of the first written laws. It also saw the rise of organized religions and massive temples that served as centers of economic and social life.`,
    hasVideo: true,
    videoUrl: "/placeholder-video.mp4",
    tags: ["Mesopotamia", "Cuneiform Writing", "First Cities"],
  },
  {
    id: 2,
    period: "2686 - 2181 BCE",
    title: "Age of Egyptian Pyramids",
    subtitle: "Old Kingdom and Architectural Wonders",
    image: "/placeholder.svg?height=800&width=1200",
    narrative: `The Old Kingdom of Egypt represents the pinnacle of architectural and engineering achievement in the ancient world. During this period, the Great Pyramids of Giza were built, which are considered one of the Seven Wonders of the Ancient World and the only one remaining today.

This era witnessed tremendous development in medicine, astronomy, and mathematics. The ancient Egyptians developed a complex system of mummification and body preservation, establishing an advanced medical tradition. Hieroglyphic writing also evolved to become a complex system for expressing both abstract and concrete ideas.

Egyptian civilization during this period was a center of trade and culture, with trade networks extending from Nubia in the south to the Levant in the north, leading to extensive cultural and technical exchange.`,
    hasVideo: false,
    tags: ["Ancient Egypt", "Pyramids", "Hieroglyphics", "Mummification"],
  },
  {
    id: 3,
    period: "2334 - 2154 BCE",
    title: "Akkadian Empire",
    subtitle: "First Multi-Ethnic Empire",
    image: "/placeholder.svg?height=800&width=1200",
    narrative: `The Akkadian Empire was founded by Sargon of Akkad and is considered the first true empire in history. It extended from the Persian Gulf in the south to Anatolia in the north, and from the Zagros Mountains in the east to the Mediterranean Sea in the west.

This empire was characterized by its advanced administrative system and organized army that relied on composite bows and war chariots. It also witnessed a flourishing of arts and literature, with the emergence of the first written literary epics.

The Akkadian Empire played a pivotal role in spreading culture and technology across a vast region of the Middle East, establishing imperial traditions that continued for thousands of years in the region.`,
    hasVideo: true,
    videoUrl: "/placeholder-video.mp4",
    tags: ["Akkadians", "Sargon", "Empire", "Mesopotamia"],
  },
  {
    id: 4,
    period: "2112 - 2004 BCE",
    title: "Ur III Period",
    subtitle: "Last Sumerian Renaissance",
    image: "/placeholder.svg?height=800&width=1200",
    narrative: `The Ur III period represents the last great flourishing of Sumerian civilization. Under the rule of Ur-Nammu and his successors, Mesopotamia witnessed an amazing cultural and administrative renaissance. The great Ziggurat of Ur was built, and a complex administrative system based on cuneiform writing was developed.

This period was characterized by tremendous legal development, as Ur-Nammu established the first known written code of laws in history, which preceded the Code of Hammurabi by three centuries. It also witnessed a flourishing of trade and handicrafts.

This period was the last golden age of Sumerian civilization, where ancient cultural and religious traditions were preserved while integrating new innovations in administration and technology.`,
    hasVideo: false,
    tags: ["Sumerians", "Ur", "Laws", "Ziggurat"],
  },
  {
    id: 5,
    period: "1894 - 1594 BCE",
    title: "Old Babylonian Empire",
    subtitle: "Hammurabi and His Famous Code",
    image: "/placeholder.svg?height=800&width=1200",
    narrative: `Under the rule of Hammurabi VI, the Old Babylonian Empire reached the height of its power and prosperity. This period is famous for establishing the Code of Hammurabi, one of the oldest and most comprehensive legal collections in history, which established principles of justice and equality before the law.

Babylon witnessed tremendous urban and cultural flourishing during this period, becoming a center of trade and learning in the Middle East. Astronomy and mathematics developed, and the first detailed astronomical maps appeared.

This era was also characterized by religious development, as the god Marduk became the supreme deity in the Babylonian pantheon, and the Babylonian creation epic "Enuma Elish" was developed, which influenced religious traditions in the region for many centuries.`,
    hasVideo: true,
    videoUrl: "/placeholder-video.mp4",
    tags: ["Babylon", "Hammurabi", "Law", "Marduk"],
  },
  {
    id: 6,
    period: "1550 - 1077 BCE",
    title: "New Egyptian Empire",
    subtitle: "Age of the Great Pharaohs",
    image: "/placeholder.svg?height=800&width=1200",
    narrative: `The New Egyptian Empire represents the pinnacle of Egyptian power and influence in the ancient world. This period witnessed the rule of the greatest pharaohs such as Thutmose III, Akhenaten, Tutankhamun, and Ramesses II.

The empire extended from Nubia in the south to the Euphrates River in the north, and Egypt became the dominant superpower in the Middle East. This period witnessed a religious revolution during the reign of Akhenaten who established the worship of Aten, and the construction of great temples such as Karnak and Abu Simbel.

Arts and crafts developed to unprecedented levels, and international trade and diplomacy flourished. The tomb of Tutankhamun was discovered in the twentieth century, revealing the wealth and sophistication of this great civilization.`,
    hasVideo: false,
    tags: ["New Kingdom Egypt", "Pharaohs", "Tutankhamun", "Ramesses"],
  },
]

export default function DemoCivilisationPage() {
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
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      {/* Header */}
      <div className="relative z-10 bg-white/90 backdrop-blur-sm border-b border-amber-200">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-amber-900 mb-2">Eastern Civilization</h1>
            <p className="text-lg text-amber-700 max-w-2xl mx-auto">
              An interactive journey through history to explore the greatest civilizations that arose in the Middle East
            </p>
          </div>
        </div>
      </div>

      {/* Timeline Navigation */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-amber-200 py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-amber-900">Interactive Timeline</h2>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => scrollToSection(Math.max(0, currentSection - 1))}
                disabled={currentSection === 0}
                className="border-amber-300 text-amber-700 hover:bg-amber-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => scrollToSection(Math.min(timelineSections.length - 1, currentSection + 1))}
                disabled={currentSection === timelineSections.length - 1}
                className="border-amber-300 text-amber-700 hover:bg-amber-50"
              >
                <ChevronRight className="w-4 h-4" />
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
                <div className="absolute top-6 left-6">
                  <Badge className="bg-amber-600 text-white text-sm px-3 py-1">{section.period}</Badge>
                </div>

                {/* Tags */}
                <div className="absolute bottom-6 left-6 flex flex-wrap gap-2">
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
                <div className="mt-8 text-center lg:text-left">
                  <p className="text-sm text-amber-600 mb-2">
                    {index < timelineSections.length - 1 ? "Next:" : "Journey Complete"}
                  </p>
                  {index < timelineSections.length - 1 && (
                    <Button
                      onClick={() => scrollToSection(index + 1)}
                      className="bg-amber-600 hover:bg-amber-700 text-white"
                    >
                      <ChevronRight className="w-4 h-4 ml-2" />
                      {timelineSections[index + 1].title}
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
            {currentSection + 1} of {timelineSections.length}
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
