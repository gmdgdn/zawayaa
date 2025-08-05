import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Play, Clock, User, ArrowLeft, Headphones, Video } from "lucide-react"

export default function ModernArabicHomepage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Modern & Clean */}
      <section className="bg-gradient-to-br from-brand-green to-primary-text text-white py-24 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="text-5xl lg:text-7xl font-bold text-headline leading-tight">
              القِصة مِن كُل زَواياها
            </h1>
            <p className="text-xl lg:text-2xl text-white/90 max-w-2xl mx-auto leading-relaxed text-subheading">
              منصة فكرية مستقلة لفهم التحولات التي تشكل عالمنا اليوم
            </p>
            <Button asChild size="lg" className="bg-primary-accent hover:bg-primary-accent/90 text-white font-bold px-8 py-4 text-lg">
              <Link href="/ar/articles">
                استكشف المحتوى
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Content - محتوى مُمَيَّز */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-12 items-center">
              <div className="lg:col-span-2 space-y-6">
                <div className="space-y-4">
                  <span className="inline-flex items-center rounded-full bg-brand-green/10 text-brand-green px-3 py-1 text-sm font-medium">
                    تقدير موقف
                  </span>
                  <h2 className="text-3xl lg:text-4xl font-bold text-headline text-primary-text leading-tight">
                    صعود القوى غير الغربية: كيف يُعيد النظام العالمي تشكيل نفسه؟
                  </h2>
                </div>
                
                <p className="text-lg text-ink-700 leading-relaxed text-body">
                  في تحليل معمّق، نستكشف ديناميكيات القوة الجديدة التي تتحدى الهيمنة الغربية، ونرصد كيف تؤثر التحولات في أنماط الإنتاج والتكنولوجيا على موازين النفوذ الدولي، وما يعنيه ذلك للمنطقة العربية.
                </p>
                
                <div className="flex items-center gap-4 text-sm text-ink-600">
                  <span className="text-subheading">بقلم: أ. د. فرانك مسمار</span>
                </div>
                
                <Button asChild className="bg-primary-accent hover:bg-primary-accent/90 text-white font-bold">
                  <Link href="/ar/articles/global-power-shift">
                    اقرأ التحليل كاملًا
                  </Link>
                </Button>
              </div>
              
              <div className="lg:col-span-1">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
                  <Image
                    src="/placeholder.svg"
                    alt="صعود القوى غير الغربية"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Articles - أحدث المقالات */}
      <section className="py-16 lg:py-24 bg-sand-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-headline text-primary-text mb-4">
                أحدث المقالات والتحليلات
              </h2>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Article Card 1 */}
              <article className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                <div className="aspect-video relative">
                  <Image
                    src="/placeholder.svg"
                    alt="الثورة الصناعية الخامسة"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6 space-y-4">
                  <span className="inline-flex items-center rounded-full bg-secondary-accent/10 text-secondary-accent px-3 py-1 text-sm font-medium">
                    تقنية وثقافة رقمية
                  </span>
                  <h3 className="text-xl font-bold text-headline text-primary-text leading-tight">
                    <Link href="/ar/articles/fifth-industrial-revolution" className="hover:text-primary-accent transition-colors">
                      في زمن الثورة الصناعية الخامسة، هل يعيد "ترانزستور" توصيل الإشارة بين التطور التكنولوجي والعقل العربي؟
                    </Link>
                  </h3>
                  <p className="text-ink-600 text-body">فريق التحرير</p>
                </div>
              </article>

              {/* Article Card 2 */}
              <article className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                <div className="aspect-video relative">
                  <Image
                    src="/placeholder.svg"
                    alt="الجغرافيا والسياسة"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6 space-y-4">
                  <span className="inline-flex items-center rounded-full bg-brand-green/10 text-brand-green px-3 py-1 text-sm font-medium">
                    جيوبوليتيكا
                  </span>
                  <h3 className="text-xl font-bold text-headline text-primary-text leading-tight">
                    <Link href="/ar/articles/geography-politics" className="hover:text-primary-accent transition-colors">
                      قراءة في الخريطة: كيف تشكّل الجغرافيا الإطار الحاكم لدوافع الدول وصراعاتها الدولية؟
                    </Link>
                  </h3>
                  <p className="text-ink-600 text-body">د. ريم الكردي</p>
                </div>
              </article>

              {/* Article Card 3 */}
              <article className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                <div className="aspect-video relative">
                  <Image
                    src="/placeholder.svg"
                    alt="حضارة الشرق"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6 space-y-4">
                  <span className="inline-flex items-center rounded-full bg-brand-yellow/20 text-primary-text px-3 py-1 text-sm font-medium">
                    حضارة الشرق
                  </span>
                  <h3 className="text-xl font-bold text-headline text-primary-text leading-tight">
                    <Link href="/ar/articles/east-civilization" className="hover:text-primary-accent transition-colors">
                      نحن أنتم، وأنتم نحن: إعادة استكشاف تاريخ الشرق كفضاء للتلاقي لا للصراع
                    </Link>
                  </h3>
                  <p className="text-ink-600 text-body">سارة الهاشمي</p>
                </div>
              </article>
            </div>
            
            <div className="text-center mt-12">
              <Button asChild variant="outline" className="border-primary-accent text-primary-accent hover:bg-primary-accent hover:text-white">
                <Link href="/ar/articles">
                  تصفح كل المقالات
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Podcast Spotlight - في دائرة الضوء: بودكاست */}
      <section className="py-16 lg:py-24 bg-secondary-accent/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl lg:text-4xl font-bold text-headline text-primary-text">
                بودكاست ترانزيت
              </h2>
              <h3 className="text-xl lg:text-2xl text-subheading text-ink-700">
                الحلقة 15: الفلسفة والواقع - حوار مفتوح مع د. أمين بدري حول أسئلة اليوم الكبرى
              </h3>
            </div>
            
            <p className="text-lg text-body text-ink-700 max-w-3xl mx-auto leading-relaxed">
              في مساحة حوارية جديدة، نستضيف شخصية بارزة في مجال الفكر لنقاش مفتوح يتناول تحولات الواقع المعاصر من زوايا متعددة. حلقة هذا الشهر تتناول علاقة الفلسفة بحياتنا اليومية، وكيف يمكنها أن تساعدنا على فهم عالم يزداد تعقيدًا.
            </p>
            
            {/* Audio Player Placeholder */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200 max-w-2xl mx-auto">
              <div className="flex items-center gap-4">
                <Button size="lg" className="bg-secondary-accent hover:bg-secondary-accent/90 text-white rounded-full w-16 h-16">
                  <Play className="w-6 h-6" />
                </Button>
                <div className="flex-1 text-right">
                  <div className="text-sm text-ink-600 mb-1">الحلقة 15</div>
                  <div className="text-lg font-bold text-headline text-primary-text">الفلسفة والواقع</div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="bg-secondary-accent hover:bg-secondary-accent/90 text-white font-bold">
                <Link href="/ar/podcast/episode-15">
                  استمع الآن
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-secondary-accent text-secondary-accent hover:bg-secondary-accent hover:text-white">
                <Link href="/ar/podcast">
                  تصفح كل حلقات البودكاست
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Programs - برامج زوايا */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-headline text-primary-text mb-4">
                برامج نتابعها لكم
              </h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* Program 1 */}
              <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden hover:shadow-lg transition-all duration-200">
                <div className="aspect-video relative bg-gradient-to-br from-primary-accent/10 to-primary-accent/5">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <Video className="w-12 h-12 text-primary-accent mx-auto mb-2" />
                      <div className="text-sm font-bold text-primary-accent">أصل الخبر من واشنطن</div>
                    </div>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <h3 className="text-xl font-bold text-headline text-primary-text">
                    أصل الخبر من واشنطن
                  </h3>
                  <p className="text-ink-700 text-body">
                    قراءة تحليلية لأبرز ما يدور في الولايات المتحدة وتأثيراته على الشرق الأوسط، مرتين أسبوعيًا.
                  </p>
                </div>
              </div>

              {/* Program 2 */}
              <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden hover:shadow-lg transition-all duration-200">
                <div className="aspect-video relative bg-gradient-to-br from-brand-green/10 to-brand-green/5">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <Video className="w-12 h-12 text-brand-green mx-auto mb-2" />
                      <div className="text-sm font-bold text-brand-green">جيوبوليتيكا</div>
                    </div>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <h3 className="text-xl font-bold text-headline text-primary-text">
                    جيوبوليتيكا
                  </h3>
                  <p className="text-ink-700 text-body">
                    فهم عميق للصراعات الدولية من منظور الجغرافيا، وكيف ترسم الخرائط مصالح الدول.
                  </p>
                </div>
              </div>

              {/* Program 3 */}
              <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden hover:shadow-lg transition-all duration-200">
                <div className="aspect-video relative bg-gradient-to-br from-secondary-accent/10 to-secondary-accent/5">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <Video className="w-12 h-12 text-secondary-accent mx-auto mb-2" />
                      <div className="text-sm font-bold text-secondary-accent">لخصنا لك</div>
                    </div>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <h3 className="text-xl font-bold text-headline text-primary-text">
                    لخصنا لك
                  </h3>
                  <p className="text-ink-700 text-body">
                    خلاصة مركزّة لأهم الكتب في الفكر والسياسة والاقتصاد. بداية ذكية للقراءة، لا بديلًا عنها.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="text-center mt-12">
              <Button asChild variant="outline" className="border-primary-accent text-primary-accent hover:bg-primary-accent hover:text-white">
                <Link href="/ar/programs">
                  شاهد كل البرامج
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Writers Platform - منبر الكُتّاب */}
      <section className="py-16 lg:py-24 bg-sand-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl lg:text-4xl font-bold text-headline text-primary-text">
                هل تملك فكرة تستحق أن تُقرأ؟
              </h2>
              <p className="text-lg text-body text-ink-700 leading-relaxed">
                نؤمن في "زوايا" أن الكلمة تبدأ من فتح المساحات. "منبر الكُتّاب" هو دعوة مفتوحة للمواهب والأقلام الجادة للمساهمة في صناعة محتوى فكري وتحليلي يعكس تنوّع رؤانا وفهمنا للعالم. هذا منبرك.
              </p>
            </div>
            
            <Button asChild size="lg" className="bg-primary-accent hover:bg-primary-accent/90 text-white font-bold px-8 py-4">
              <Link href="/ar/writers-platform">
                شاركنا بكتاباتك
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter - الاشتراك في النشرة البريدية */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl lg:text-4xl font-bold text-headline text-primary-text">
                ابقَ على اطلاع
              </h2>
              <p className="text-lg text-body text-ink-700">
                اشترك في نشرتنا البريدية لتصلك أحدث التحليلات، والمقالات، وحلقات البودكاست مباشرة إلى بريدك الإلكتروني.
              </p>
            </div>
            
            <div className="max-w-md mx-auto">
              <div className="flex gap-4">
                <input
                  type="email"
                  placeholder="أدخل بريدك الإلكتروني"
                  className="flex-1 px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-primary-accent focus:border-primary-accent text-body"
                  dir="rtl"
                />
                <Button className="bg-primary-accent hover:bg-primary-accent/90 text-white font-bold px-6">
                  اشتراك
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}