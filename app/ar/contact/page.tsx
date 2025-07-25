import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube, 
  Linkedin,
  Send,
  MessageSquare
} from "lucide-react"

// Social media links based on the platform guide
const socialMediaLinks = [
  { name: "Facebook", icon: Facebook, url: "#", color: "text-blue-600" },
  { name: "X (Twitter)", icon: Twitter, url: "#", color: "text-gray-900" },
  { name: "Instagram", icon: Instagram, url: "#", color: "text-pink-600" },
  { name: "LinkedIn", icon: Linkedin, url: "#", color: "text-blue-700" },
  { name: "YouTube", icon: Youtube, url: "#", color: "text-red-600" }
]

const contactMethods = [
  {
    icon: Mail,
    title: "البريد الإلكتروني",
    value: "info@zawaya.com",
    description: "للاستفسارات العامة والمراسلات"
  },
  {
    icon: MessageSquare,
    title: "منبر الكُتّاب",
    value: "writers@zawaya.com",
    description: "لإرسال مقالاتكم ومساهماتكم"
  },
  {
    icon: Phone,
    title: "رقم الهاتف",
    value: "+966 11 234 5678",
    description: "للاتصال المباشر"
  }
]

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="container mx-auto px-4 py-12">
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 font-ge-ss">تواصل معنا</h1>
          <p className="text-lg text-gray-600 font-ge-ss max-w-2xl mx-auto">
            نحن نؤمن في زوايا أن الحوار أساس المعرفة. تواصل معنا لأي استفسار أو اقتراح أو مساهمة
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-8 font-ge-ss">طرق التواصل</h2>
            
            <div className="space-y-6 mb-8">
              {contactMethods.map((method, index) => (
                <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-zawaya-primary/10 rounded-lg">
                      <method.icon className="w-6 h-6 text-zawaya-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1 font-ge-ss">
                        {method.title}
                      </h3>
                      <p className="text-zawaya-primary font-medium mb-2">
                        {method.value}
                      </p>
                      <p className="text-gray-600 text-sm font-ge-ss">
                        {method.description}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* About the Platform */}
            <Card className="p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4 font-ge-ss">نبذة عن المنصة</h3>
              <p className="text-gray-600 leading-relaxed font-ge-ss mb-4">
                زوايا منصة معرفية غير ربحية، ثنائية اللغة، تربط الواقع العربي بالتحولات العالمية 
                عبر تحليلات رصينة متعددة الاختصاصات.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="font-ge-ss">غير ربحية</Badge>
                <Badge variant="secondary" className="font-ge-ss">مستقلة</Badge>
                <Badge variant="secondary" className="font-ge-ss">متعددة الاختصاصات</Badge>
                <Badge variant="secondary" className="font-ge-ss">ثنائية اللغة</Badge>
              </div>
            </Card>

            {/* Social Media */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-6 font-ge-ss">تابعنا على</h3>
              <div className="grid grid-cols-3 gap-4">
                {socialMediaLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    className="flex flex-col items-center p-4 bg-white rounded-lg hover:shadow-lg transition-shadow group"
                  >
                    <social.icon className={`w-8 h-8 mb-2 group-hover:scale-110 transition-transform ${social.color}`} />
                    <span className="text-sm font-ge-ss text-gray-700 group-hover:text-gray-900">
                      {social.name}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 font-ge-ss">أرسل لنا رسالة</h2>
              
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-ge-ss">
                      الاسم الكامل
                    </label>
                    <Input 
                      type="text" 
                      placeholder="أدخل اسمك الكامل"
                      className="font-ge-ss"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-ge-ss">
                      البريد الإلكتروني
                    </label>
                    <Input 
                      type="email" 
                      placeholder="name@example.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-ge-ss">
                    الموضوع
                  </label>
                  <Input 
                    type="text" 
                    placeholder="موضوع الرسالة"
                    className="font-ge-ss"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-ge-ss">
                    نوع الاستفسار
                  </label>
                  <select className="w-full p-3 border border-gray-300 rounded-md font-ge-ss bg-white">
                    <option value="">اختر نوع الاستفسار</option>
                    <option value="general">استفسار عام</option>
                    <option value="submission">إرسال مقال</option>
                    <option value="partnership">شراكة</option>
                    <option value="technical">مساعدة تقنية</option>
                    <option value="feedback">ملاحظات واقتراحات</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-ge-ss">
                    الرسالة
                  </label>
                  <Textarea 
                    placeholder="اكتب رسالتك هنا..."
                    rows={6}
                    className="font-ge-ss"
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-zawaya-primary hover:bg-zawaya-primary/90 font-ge-ss"
                  size="lg"
                >
                  <Send className="w-4 h-4 ml-2" />
                  إرسال الرسالة
                </Button>
              </form>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800 font-ge-ss">
                  <strong>ملاحظة:</strong> سنرد على رسالتك خلال 48 ساعة من تاريخ الاستلام. 
                  إذا كنت تريد إرسال مقال، يرجى زيارة صفحة 
                  <a href="/ar/writers" className="text-zawaya-primary hover:underline mx-1">منبر الكُتّاب</a>
                  لمعرفة الشروط والمتطلبات.
                </p>
              </div>
            </Card>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-16 max-w-4xl mx-auto">
          <Card className="p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 font-ge-ss">هل تريد المساهمة؟</h3>
            <p className="text-gray-600 mb-6 font-ge-ss leading-relaxed">
              نؤمن في زوايا أن الكلمة تبدأ من فتح المساحات. إذا كنت تملك فكرة تستحق أن تُقرأ، 
              فمنبر الكُتّاب هو مساحتك للمساهمة في صناعة محتوى فكري وتحليلي يعكس تنوّع رؤانا وفهمنا للعالم.
            </p>
            <div className="flex gap-4 justify-center">
              <Button 
                className="bg-zawaya-primary hover:bg-zawaya-primary/90 font-ge-ss"
                asChild
              >
                <a href="/ar/writers">منبر الكُتّاب</a>
              </Button>
              <Button 
                variant="outline" 
                className="border-zawaya-primary text-zawaya-primary hover:bg-zawaya-primary hover:text-white font-ge-ss"
                asChild
              >
                <a href="/ar/about">تعرف على زوايا</a>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
} 