import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white" dir="rtl">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-zawaya-primary mb-6 font-ge-ss">
            زوايا
          </h1>
          <p className="text-2xl text-gray-600 mb-8 font-ge-ss">
            القصة من كل زواياها
          </p>
          <div className="w-24 h-1 bg-zawaya-accent mx-auto"></div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 mb-8">
            <div className="prose prose-lg max-w-none font-ge-ss text-right">
              <p className="text-xl leading-relaxed mb-6">
                منصة فكرية مستقلة وغير ربحية، تُعنى بإنتاج محتوى معرفي متنوع يسهم في تعميق فهمنا للتحولات التي يشهدها العالم، من خلال مقاربات تجمع بين التحليل الثقافي، والقراءة التاريخية، والفهم الجيوسياسي والجيواقتصادي، دون انحيازات أيديولوجية أو هوياتية ضيقة.
              </p>

              <p className="text-lg leading-relaxed mb-6">
                تقدّم |زوايا| موادًا مكتوبة ومرئية وصوتية تتناول موضوعات تمتد من الثقافة العامة والاقتصاد السياسي إلى قضايا المجتمع، والفكر الديني، والفلسفة، والإعلام، والتحولات الجيلية، والتقنية والثقافة الرقمية.
              </p>

              <p className="text-lg leading-relaxed mb-6">
                كما تولي اهتمامًا خاصًا بفهم العالم وفق تحوّلاته الكبرى: صعود القوى غير الغربية، التغير في أنماط الإنتاج والتكنولوجيا، التحولات المناخية والديمغرافية، وتغيّر موازين النفوذ الدولي، وما ينتج عن ذلك من تحديات وفرص للمنطقة العربية.
              </p>

              <p className="text-lg leading-relaxed mb-6">
                تسعى |زوايا| إلى الربط بين المحلي والعالمي، وتقديم قراءات متعددة الزوايا لفهم الظواهر بعيدًا عن التبسيط أو القولبة الجاهزة، مع إدراك عميق لتشابك السياسة بالاقتصاد، والثقافة بالتكنولوجيا، والهويات الفردية بالتحولات البنيوية الكبرى.
              </p>

              <p className="text-lg leading-relaxed mb-6">
                كما تركز على تحليل تأثير هذه التحولات على الواقع العربي، من حيث إعادة تشكّل الدولة، وبنية المجتمعات، وموقع المنطقة في خريطة النظام العالمي الجديد.
              </p>

              <p className="text-lg leading-relaxed mb-6">
                تنطلق المنصة من إيمان راسخ بقيم الحوار، والانفتاح، والتعددية، وتحتفي بالتنوع الثقافي والديني واللغوي بوصفه ركيزة حضارية لا مصدرًا للصراع. وتستلهم في ذلك الإرث الفكري والروحي للشرق، الذي طالما اعتبر التعايش والاعتراف بالآخر جزءًا من بنائه الحضاري، لا نقيضًا له.
              </p>

              <p className="text-lg leading-relaxed mb-6">
                وتسعى |زوايا| إلى تعزيز فهم متبادل بين الشعوب والثقافات، وترسيخ القيم الإنسانية المشتركة في عالم تتزايد فيه التوترات والانقسامات.
              </p>

              <p className="text-lg leading-relaxed mb-6">
                تستهدف المنصة جمهورًا واسعًا من المهتمين بالشأن العام والمعرفة، من طلاب وباحثين ومفكرين وفاعلين ثقافيين، وتسعى إلى أن تكون مساحة حوار مفتوحة لكل من يتحدث اللغة العربية، باختلاف خلفياتهم وانتماءاتهم، إيمانًا بأن المعرفة جسر جامع لا أداة فرز.
              </p>

              <p className="text-lg leading-relaxed">
                وتطمح |زوايا| إلى التوسّع مستقبلًا عبر إطلاق مجلات متخصصة، ومشاريع ترجمة، وندوات فكرية، تسهم في خلق تفاعل حيّ بين المعرفة والواقع، وتعزز حضور الخطاب المعرفي العربي في النقاشات الإقليمية والعالمية، وتُعيد وضع اللغة العربية في قلب الأسئلة الكبرى لعصرنا.
              </p>
            </div>
          </Card>

          {/* Values Section */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="p-6 text-center">
              <div className="text-zawaya-primary text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold mb-2 font-ge-ss">الهدف</h3>
              <p className="text-gray-600 font-ge-ss">
                تعميق فهمنا للتحولات العالمية من منظور عربي معاصر
              </p>
            </Card>
            
            <Card className="p-6 text-center">
              <div className="text-zawaya-primary text-4xl mb-4">🌍</div>
              <h3 className="text-xl font-bold mb-2 font-ge-ss">الرؤية</h3>
              <p className="text-gray-600 font-ge-ss">
                الربط بين المحلي والعالمي بقراءات متعددة الزوايا
              </p>
            </Card>
            
            <Card className="p-6 text-center">
              <div className="text-zawaya-primary text-4xl mb-4">💭</div>
              <h3 className="text-xl font-bold mb-2 font-ge-ss">المبدأ</h3>
              <p className="text-gray-600 font-ge-ss">
                الحوار والانفتاح والتعددية دون انحيازات ضيقة
              </p>
            </Card>
          </div>

          {/* Contact Section */}
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-6 font-ge-ss">انضم إلى مجتمع زوايا</h2>
            <p className="text-lg text-gray-600 mb-8 font-ge-ss">
              كن جزءًا من الحوار وساهم في إثراء المحتوى المعرفي
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
                <a href="/ar/contact">تواصل معنا</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 