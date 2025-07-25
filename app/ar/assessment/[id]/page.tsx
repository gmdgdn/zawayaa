import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock, User, Play, Eye, Share2, BookOpen } from "lucide-react"
import ShareButtons from "@/components/share-buttons"
import AudioPlayer from "@/components/audio-player"

// Sample article content based on the guide
const sampleArticle = {
  id: "sa-002",
  title_ar: "جيوبوليتيك المياه: حروب الغد الصامتة على ضفاف النيل والفرات",
  author: {
    name: "د. أيمن الصباغ",
    bio: "باحث في الجيوسياسة والعلاقات الدولية، متخصص في قضايا الأمن المائي في الشرق الأوسط",
    avatar: "/placeholder-user.jpg"
  },
  published_date: "2025-07-23",
  read_time: 10,
  view_count: 8900,
  image_url: "/images/articles/water_geopolitics.png",
  audio_url: "/audio/sa-002.mp3",
  tags: ["جيوبوليتيك", "الأمن المائي", "تركيا", "مصر", "إثيوبيا", "العراق"],
  content: `**مقدمة: الذهب الأزرق**

في القرن العشرين، دارت صراعات الشرق الأوسط حول "الذهب الأسود". لكن في القرن الحادي والعشرين، وفي ظل التغير المناخي والنمو السكاني المتسارع، ينتقل مركز الثقل الاستراتيجي بصمت نحو "الذهب الأزرق": المياه. لم يعد الأمن المائي قضية بيئية أو تنموية فحسب، بل تحول إلى حجر زاوية في الأمن القومي، وعامل حاسم في رسم خرائط التحالفات والعداوات المستقبلية.

**مسرح الصراع الأول: حوض النيل**

يُعد سد النهضة الإثيوبي التجسيد الأوضح لهذا التحول. فمن منظور إثيوبيا، هو مشروع تنموي سيادي ضروري لانتشال الملايين من الفقر. ومن منظور مصر والسودان (دول المصب)، هو تهديد وجودي يمس شريان الحياة الذي قامت عليه حضارتهما لآلاف السنين. 

الصراع هنا يتجاوز مجرد أمتار مكعبة من المياه؛ إنه صراع على حق التنمية مقابل حق البقاء، وهو يعيد تعريف موازين القوى في القرن الإفريقي وحوض النيل. إن فشل الدبلوماسية في التوصل لاتفاق ملزم قد لا يؤدي إلى حرب تقليدية بالضرورة، بل إلى "حرب باردة" طويلة الأمد من الضغوط السياسية والاقتصادية والحروب بالوكالة.

**مسرح الصراع الثاني: نهرا دجلة والفرات**

في حوض دجلة والفرات، الوضع لا يقل تعقيدًا. تتحكم تركيا، دولة المنبع، في منابع النهرين عبر سلسلة من السدود العملاقة ضمن مشروع جنوب شرق الأناضول (GAP). هذا يمنحها ورقة ضغط هائلة على سوريا والعراق، دولتي المصب، اللتين تعانيان بالفعل من الجفاف والتصحر.

يؤثر التحكم في تدفق المياه بشكل مباشر على الزراعة في العراق، ويفاقم من التوترات الاجتماعية والسياسية الداخلية، ويمنح تركيا أداة جيوسياسية فعالة يمكن استخدامها في مفاوضاتها حول قضايا أخرى، مثل محاربة حزب العمال الكردستاني.

**التحديات المستقبلية**

مع ازدياد تأثيرات التغير المناخي وارتفاع درجات الحرارة، ستتفاقم أزمة المياه في المنطقة. الدراسات تشير إلى أن منطقة الشرق الأوسط ستواجه نقصًا حادًا في المياه بحلول عام 2050، مما قد يؤدي إلى نزوح ملايين السكان وعدم استقرار سياسي واجتماعي.

كما أن الطلب المتزايد على المياه للاستخدامات الصناعية والحضرية، إلى جانب النمو السكاني، سيزيد من حدة المنافسة على هذا المورد الحيوي. البلدان التي تتحكم في منابع المياه ستجد نفسها في موقع قوة متزايدة، بينما ستواجه دول المصب ضغوطًا متنامية لقبول شروط قد تكون مجحفة.

**خاتمة: نحو دبلوماسية المياه**

إن إدارة هذه الصراعات المائية لا يمكن أن تتم بعقلية "المباراة الصفرية" التي سادت في القرن العشرين. الحلول المستدامة تكمن في الانتقال من منطق تقاسم الموارد إلى منطق تقاسم المنافع. 

يتطلب ذلك دبلوماسية معقدة ترتكز على الاستثمارات المشتركة في تكنولوجيا تحلية المياه، وتطوير الزراعة الذكية، وإنشاء شبكات كهرباء إقليمية تربط مشاريع السدود بمصالح دول المصب. قبل أن تتحول حروب الغد الصامتة إلى مواجهات صاخبة، يجب أن يصبح الحوار حول "الذهب الأزرق" أولوية استراتيجية قصوى.

**المراجع والمصادر**

- معهد الشرق الأوسط لدراسات المياه
- تقارير البنك الدولي حول الأمن المائي
- دراسات مركز الأهرام للدراسات السياسية والاستراتيجية
- أبحاث معهد واشنطن لسياسة الشرق الأدنى`
}

interface ArticleDetailPageProps {
  params: {
    id: string
  }
}

export default function ArticleDetailPage({ params }: ArticleDetailPageProps) {
  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <div className="flex items-center space-x-2 space-x-reverse text-sm text-gray-500">
            <a href="/ar" className="hover:text-zawaya-primary font-ge-ss">الرئيسية</a>
            <span>/</span>
            <a href="/ar/assessment" className="hover:text-zawaya-primary font-ge-ss">تقدير موقف</a>
            <span>/</span>
            <span className="text-gray-900 font-ge-ss">المقال</span>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto">
          {/* Article Header */}
          <div className="mb-8">
            <Badge className="mb-4 bg-zawaya-primary text-white">
              تقدير موقف
            </Badge>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-6 font-ge-ss leading-tight">
              {sampleArticle.title_ar}
            </h1>

            {/* Article Meta */}
            <div className="flex items-center gap-6 text-gray-600 mb-6">
              <div className="flex items-center gap-2">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={sampleArticle.author.avatar} />
                  <AvatarFallback>
                    {sampleArticle.author.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-gray-900 font-ge-ss">{sampleArticle.author.name}</p>
                  <p className="text-sm font-ge-ss">{sampleArticle.author.bio}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6 text-sm text-gray-500 mb-6">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{new Date(sampleArticle.published_date).toLocaleDateString('ar-SA')}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{sampleArticle.read_time} دقائق قراءة</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{sampleArticle.view_count.toLocaleString('ar-SA')} مشاهدة</span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {sampleArticle.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="font-ge-ss">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Featured Image */}
          <div className="mb-8">
            <img 
              src={sampleArticle.image_url} 
              alt={sampleArticle.title_ar}
              className="w-full h-96 object-cover rounded-lg"
            />
          </div>

          {/* Audio Player */}
          {sampleArticle.audio_url && (
            <Card className="p-6 mb-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-zawaya-primary/10 rounded-lg">
                  <Play className="w-6 h-6 text-zawaya-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 font-ge-ss">استمع للمقال</h3>
                  <p className="text-sm text-gray-600 font-ge-ss">
                    بصوت مولد تلقائياً باستخدام تقنية الذكاء الاصطناعي
                  </p>
                </div>
              </div>
              <AudioPlayer src={sampleArticle.audio_url} />
            </Card>
          )}

          {/* Article Content */}
          <Card className="p-8 mb-8">
            <div className="prose prose-lg max-w-none font-ge-ss text-right leading-relaxed">
              {sampleArticle.content.split('\n\n').map((paragraph, index) => {
                if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                  return (
                    <h2 key={index} className="text-2xl font-bold text-gray-900 mt-8 mb-4 font-ge-ss">
                      {paragraph.replace(/\*\*/g, '')}
                    </h2>
                  )
                }
                return (
                  <p key={index} className="mb-6 text-gray-700 leading-relaxed">
                    {paragraph}
                  </p>
                )
              })}
            </div>
          </Card>

          {/* Share and Actions */}
          <Card className="p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button className="bg-zawaya-primary hover:bg-zawaya-primary/90 font-ge-ss">
                  <BookOpen className="w-4 h-4 ml-2" />
                  المقال التالي
                </Button>
                <Button variant="outline" className="font-ge-ss">
                  <Share2 className="w-4 h-4 ml-2" />
                  شارك المقال
                </Button>
              </div>
              <ShareButtons 
                title={sampleArticle.title_ar}
                url={`https://zawaya.com/ar/assessment/${params.id}`}
              />
            </div>
          </Card>

          {/* Author Bio */}
          <Card className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 font-ge-ss">عن الكاتب</h3>
            <div className="flex items-start gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={sampleArticle.author.avatar} />
                <AvatarFallback>
                  {sampleArticle.author.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2 font-ge-ss">
                  {sampleArticle.author.name}
                </h4>
                <p className="text-gray-600 font-ge-ss leading-relaxed">
                  {sampleArticle.author.bio}
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-4 border-zawaya-primary text-zawaya-primary hover:bg-zawaya-primary hover:text-white font-ge-ss"
                >
                  مقالات أخرى للكاتب
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
} 