import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  PenTool, 
  FileText, 
  Users, 
  CheckCircle, 
  Clock, 
  Upload,
  AlertCircle,
  BookOpen,
  Target,
  Award
} from "lucide-react"
import SubmitModal from "@/components/submit-modal"

// Sample contributor profiles
const featuredContributors = [
  {
    name: "د. أمين رشدي",
    specialty: "تكنولوجيا وحضارة",
    articles: 12,
    bio: "أستاذ دراسات المستقبل في جامعة القاهرة، متخصص في تأثير التكنولوجيا على المجتمعات العربية",
    image: "/placeholder-user.jpg"
  },
  {
    name: "ريم الخوري",
    specialty: "الفن والتراث",
    articles: 8,
    bio: "باحثة في تاريخ الفن، حاصلة على دكتوراه من السوربون في الفنون الإسلامية",
    image: "/placeholder-user.jpg"
  },
  {
    name: "حسن الإدريسي",
    specialty: "التاريخ الاجتماعي",
    articles: 15,
    bio: "مؤرخ متخصص في التاريخ الاجتماعي للحضارة الإسلامية، كاتب في عدة منصات فكرية",
    image: "/placeholder-user.jpg"
  }
]

// Submission guidelines
const submissionGuidelines = [
  {
    title: "المحتوى والموضوع",
    items: [
      "المقالات الفكرية والتحليلية في المجالات: السياسة، الثقافة، التاريخ، الفن، الأدب",
      "التحليلات الاستراتيجية وتقديرات الموقف",
      "الأبحاث المعمقة حول القضايا المعاصرة",
      "المقالات التي تربط الواقع العربي بالتحولات العالمية"
    ]
  },
  {
    title: "الشروط التقنية",
    items: [
      "طول المقال: 1500-3000 كلمة",
      "اللغة: العربية الفصحى",
      "التوثيق: مراجع ومصادر موثقة",
      "الأصالة: محتوى أصلي غير منشور مسبقاً"
    ]
  },
  {
    title: "معايير النشر",
    items: [
      "الجودة الفكرية والتحليلية",
      "الحياد والموضوعية",
      "الإضافة المعرفية للقارئ",
      "مطابقة رؤية ومنهجية زوايا"
    ]
  }
]

const submissionProcess = [
  {
    step: 1,
    title: "إرسال المقال",
    description: "قم بملء النموذج وإرفاق مقالك",
    icon: Upload,
    timeline: "فوري"
  },
  {
    step: 2,
    title: "المراجعة الأولية",
    description: "فحص المحتوى والشروط التقنية",
    icon: FileText,
    timeline: "3-5 أيام"
  },
  {
    step: 3,
    title: "التقييم التحريري",
    description: "مراجعة من قبل فريق التحرير",
    icon: Users,
    timeline: "7-10 أيام"
  },
  {
    step: 4,
    title: "النشر",
    description: "نشر المقال مع التسجيل الصوتي",
    icon: CheckCircle,
    timeline: "3-5 أيام إضافية"
  }
]

export default function WritersPage() {
  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-zawaya-primary/10 rounded-full">
              <PenTool className="w-12 h-12 text-zawaya-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 font-ge-ss">منبر الكُتّاب</h1>
          <p className="text-lg text-gray-600 font-ge-ss max-w-3xl mx-auto mb-8">
            نؤمن في زوايا أن الكلمة تبدأ من فتح المساحات. إذا كنت تملك فكرة تستحق أن تُقرأ، 
            فمنبر الكُتّاب هو مساحتك للمساهمة في صناعة محتوى فكري وتحليلي يعكس تنوّع رؤانا وفهمنا للعالم.
          </p>
          
          <div className="flex justify-center gap-4">
            <SubmitModal>
              <Button className="bg-zawaya-primary hover:bg-zawaya-primary/90 font-ge-ss px-8 py-3">
                <PenTool className="w-4 h-4 ml-2" />
                ابدأ الكتابة الآن
              </Button>
            </SubmitModal>
            <Button variant="outline" className="border-zawaya-primary text-zawaya-primary hover:bg-zawaya-primary hover:text-white font-ge-ss px-8 py-3">
              <BookOpen className="w-4 h-4 ml-2" />
              اقرأ الشروط والأحكام
            </Button>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="guidelines" className="max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="guidelines" className="font-ge-ss">الشروط والمعايير</TabsTrigger>
            <TabsTrigger value="process" className="font-ge-ss">عملية النشر</TabsTrigger>
            <TabsTrigger value="contributors" className="font-ge-ss">كُتّابنا</TabsTrigger>
            <TabsTrigger value="submit" className="font-ge-ss">إرسال مقال</TabsTrigger>
          </TabsList>

          {/* Guidelines Tab */}
          <TabsContent value="guidelines">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-8">
              {submissionGuidelines.map((guideline, index) => (
                <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-zawaya-primary/10 rounded-lg">
                      <Target className="w-5 h-5 text-zawaya-primary" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 font-ge-ss">
                      {guideline.title}
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    {guideline.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start gap-3">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                        <span className="text-gray-700 text-sm font-ge-ss">{item}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>

            <Card className="p-8 bg-blue-50 border-blue-200">
              <div className="flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="text-lg font-bold text-blue-900 mb-2 font-ge-ss">ملاحظة مهمة</h3>
                  <p className="text-blue-800 font-ge-ss leading-relaxed">
                    جميع المقالات المنشورة على منصة زوايا ستتوفر بصيغة صوتية (TTS) لتعزيز إمكانية الوصول. 
                    كما نحتفظ بحق التحرير والتنسيق للحفاظ على معايير النشر العالية.
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Process Tab */}
          <TabsContent value="process">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 font-ge-ss text-center">
                رحلة مقالك من الفكرة إلى النشر
              </h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {submissionProcess.map((step) => (
                  <Card key={step.step} className="p-6 text-center hover:shadow-lg transition-shadow">
                    <div className="flex justify-center mb-4">
                      <div className="relative">
                        <div className="p-3 bg-zawaya-primary/10 rounded-full">
                          <step.icon className="w-6 h-6 text-zawaya-primary" />
                        </div>
                        <Badge className="absolute -top-2 -right-2 bg-zawaya-accent text-white w-6 h-6 rounded-full p-0 flex items-center justify-center text-xs">
                          {step.step}
                        </Badge>
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 font-ge-ss">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 text-sm font-ge-ss mb-3">
                      {step.description}
                    </p>
                    <div className="flex items-center justify-center gap-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>{step.timeline}</span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <Card className="p-6 bg-green-50 border-green-200">
              <div className="flex items-center gap-3 mb-4">
                <Award className="w-6 h-6 text-green-600" />
                <h3 className="text-lg font-bold text-green-900 font-ge-ss">مكافآت الكُتّاب</h3>
              </div>
              <ul className="space-y-2 text-green-800 font-ge-ss">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  نشر المقال مع ذكر اسم الكاتب وسيرته
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  تسجيل صوتي احترافي للمقال
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  مشاركة على وسائل التواصل الاجتماعي
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  إضافة الكاتب لقائمة كُتّاب زوايا المميزين
                </li>
              </ul>
            </Card>
          </TabsContent>

          {/* Contributors Tab */}
          <TabsContent value="contributors">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 font-ge-ss text-center">
                كُتّابنا المميزون
              </h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {featuredContributors.map((contributor, index) => (
                  <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                        <Users className="w-8 h-8 text-gray-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 font-ge-ss">
                          {contributor.name}
                        </h3>
                        <p className="text-zawaya-primary font-medium text-sm font-ge-ss">
                          {contributor.specialty}
                        </p>
                        <p className="text-gray-500 text-xs">
                          {contributor.articles} مقال منشور
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm font-ge-ss leading-relaxed">
                      {contributor.bio}
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-4 w-full border-zawaya-primary text-zawaya-primary hover:bg-zawaya-primary hover:text-white font-ge-ss"
                    >
                      اقرأ مقالات {contributor.name.split(' ')[1]}
                    </Button>
                  </Card>
                ))}
              </div>
            </div>

            <Card className="p-8 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 font-ge-ss">
                انضم إلى قائمة كُتّابنا المميزين
              </h3>
              <p className="text-gray-600 mb-6 font-ge-ss max-w-2xl mx-auto">
                نبحث دائماً عن أصوات جديدة ومتنوعة تثري المحتوى الفكري العربي. 
                ابدأ رحلتك معنا اليوم وكن جزءاً من مجتمع زوايا المعرفي.
              </p>
              <SubmitModal>
                <Button className="bg-zawaya-primary hover:bg-zawaya-primary/90 font-ge-ss px-8 py-3">
                  ارسل مقالك الأول
                </Button>
              </SubmitModal>
            </Card>
          </TabsContent>

          {/* Submit Tab */}
          <TabsContent value="submit">
            <Card className="p-8 max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 font-ge-ss">
                  إرسال مقال جديد
                </h2>
                <p className="text-gray-600 font-ge-ss">
                  املأ النموذج أدناه لإرسال مقالك. سنتواصل معك خلال 3-5 أيام عمل.
                </p>
              </div>

              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-ge-ss">
                      الاسم الكامل *
                    </label>
                    <Input 
                      type="text" 
                      placeholder="اسم الكاتب كما سيظهر في المنصة"
                      className="font-ge-ss"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-ge-ss">
                      البريد الإلكتروني *
                    </label>
                    <Input 
                      type="email" 
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-ge-ss">
                      التخصص أو المجال
                    </label>
                    <Input 
                      type="text" 
                      placeholder="مثال: العلوم السياسية، التاريخ، الأدب"
                      className="font-ge-ss"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-ge-ss">
                      المؤهل العلمي
                    </label>
                    <Input 
                      type="text" 
                      placeholder="مثال: دكتوراه في التاريخ الحديث"
                      className="font-ge-ss"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-ge-ss">
                    عنوان المقال *
                  </label>
                  <Input 
                    type="text" 
                    placeholder="عنوان واضح ومعبر عن محتوى المقال"
                    className="font-ge-ss"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-ge-ss">
                    فئة المقال *
                  </label>
                  <select className="w-full p-3 border border-gray-300 rounded-md font-ge-ss bg-white" required>
                    <option value="">اختر فئة المقال</option>
                    <option value="political">آراء سياسية</option>
                    <option value="assessment">تقدير موقف</option>
                    <option value="art">فن</option>
                    <option value="literature">أدب</option>
                    <option value="culture">ثقافة</option>
                    <option value="history">تاريخ</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-ge-ss">
                    ملخص المقال (200-300 كلمة) *
                  </label>
                  <Textarea 
                    placeholder="ملخص يعرض الفكرة الرئيسية والأهداف من المقال..."
                    rows={4}
                    className="font-ge-ss"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-ge-ss">
                    نص المقال كاملاً *
                  </label>
                  <Textarea 
                    placeholder="انسخ والصق نص المقال كاملاً هنا، أو ارفق ملف..."
                    rows={12}
                    className="font-ge-ss"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-ge-ss">
                    المراجع والمصادر
                  </label>
                  <Textarea 
                    placeholder="قائمة بالمراجع والمصادر المستخدمة في المقال..."
                    rows={4}
                    className="font-ge-ss"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-ge-ss">
                    نبذة عن الكاتب (100-200 كلمة)
                  </label>
                  <Textarea 
                    placeholder="نبذة مختصرة عن خلفيتك الأكاديمية والمهنية..."
                    rows={3}
                    className="font-ge-ss"
                  />
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 font-ge-ss mb-2">
                    ارفع ملف المقال (اختياري)
                  </p>
                  <p className="text-sm text-gray-500 font-ge-ss">
                    صيغ مدعومة: DOC, DOCX, PDF (حد أقصى 10 ميجابايت)
                  </p>
                  <Button variant="outline" className="mt-4 font-ge-ss">
                    اختر ملف
                  </Button>
                </div>

                <div className="flex items-start gap-3">
                  <input type="checkbox" id="terms" className="mt-1" required />
                  <label htmlFor="terms" className="text-sm text-gray-700 font-ge-ss">
                    أوافق على شروط وأحكام النشر في منصة زوايا، وأؤكد أن المحتوى أصلي وغير منشور مسبقاً *
                  </label>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-zawaya-primary hover:bg-zawaya-primary/90 font-ge-ss py-3"
                  size="lg"
                >
                  <PenTool className="w-4 h-4 ml-2" />
                  إرسال المقال للمراجعة
                </Button>
              </form>

              <div className="mt-8 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-yellow-900 font-ge-ss mb-1">
                      ملاحظات مهمة
                    </h4>
                    <ul className="text-sm text-yellow-800 font-ge-ss space-y-1">
                      <li>• سيتم مراجعة المقال خلال 7-10 أيام عمل</li>
                      <li>• قد نطلب تعديلات قبل النشر</li>
                      <li>• المقالات المقبولة ستنشر مع تسجيل صوتي</li>
                      <li>• نحتفظ بحق عدم النشر دون إبداء الأسباب</li>
                    </ul>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 