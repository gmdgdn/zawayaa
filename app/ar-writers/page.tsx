"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import SubmitModal from "@/components/submit-modal"
import { PenTool, Users, BookOpen, Award, Edit3, FileText, Send } from "lucide-react"
import { colors } from "@/lib/theme"

export default function WritersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="container mx-auto px-4 py-12">
        {/* Page Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-zawaya-primary rounded-full flex items-center justify-center">
              <PenTool className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-zawaya-primary mb-6 font-ge-ss">منبر الكُتّاب</h1>
          <div className="max-w-4xl mx-auto space-y-4 text-lg text-gray-700 font-ge-ss leading-relaxed">
            <p>
              زوايا منصة مفتوحة للكتّاب والمفكرين العرب من جميع أنحاء العالم. نؤمن بأن التنوع في الأصوات والآراء يثري
              النقاش العام ويساهم في بناء فهم أعمق للقضايا المعاصرة.
            </p>
            <p>
              ندعو الكتّاب المتخصصين والباحثين وأصحاب الخبرة للمساهمة في منصتنا بمقالات وتحليلات تتناول الشؤون السياسية
              والاقتصادية والثقافية والاجتماعية في المنطقة العربية والعالم.
            </p>
          </div>

          {/* CTA Button */}
          <div className="mt-10">
            <Button
              onClick={() => setIsModalOpen(true)}
              size="lg"
              className="bg-zawaya-accent hover:bg-zawaya-accent/90 text-white px-8 py-4 text-lg font-ge-ss shadow-lg hover:shadow-xl transition-all duration-300"
              style={{ backgroundColor: colors.accent }}
            >
              <Send className="w-5 h-5 ml-2" />
              قدّم مقالك
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="p-8 text-center hover:shadow-lg transition-shadow duration-300 bg-white">
            <div className="w-16 h-16 bg-zawaya-menthol rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-8 h-8 text-zawaya-primary" />
            </div>
            <h3 className="text-xl font-semibold text-zawaya-primary mb-4 font-ge-ss">مجتمع متنوع</h3>
            <p className="text-gray-600 font-ge-ss leading-relaxed">
              انضم إلى مجتمع من الكتّاب والمفكرين العرب من مختلف التخصصات والخلفيات الثقافية
            </p>
          </Card>

          <Card className="p-8 text-center hover:shadow-lg transition-shadow duration-300 bg-white">
            <div className="w-16 h-16 bg-zawaya-yellow rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-8 h-8 text-zawaya-primary" />
            </div>
            <h3 className="text-xl font-semibold text-zawaya-primary mb-4 font-ge-ss">محتوى عالي الجودة</h3>
            <p className="text-gray-600 font-ge-ss leading-relaxed">
              نلتزم بنشر محتوى متميز يخضع لمراجعة تحريرية دقيقة لضمان الجودة والمصداقية
            </p>
          </Card>

          <Card className="p-8 text-center hover:shadow-lg transition-shadow duration-300 bg-white">
            <div className="w-16 h-16 bg-zawaya-iris/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Award className="w-8 h-8 text-zawaya-iris" />
            </div>
            <h3 className="text-xl font-semibold text-zawaya-primary mb-4 font-ge-ss">منصة مرموقة</h3>
            <p className="text-gray-600 font-ge-ss leading-relaxed">
              اكتب في منصة معترف بها إقليمياً ودولياً، واصل صوتك إلى جمهور واسع من القراء المهتمين
            </p>
          </Card>
        </div>

        {/* Guidelines Section */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <Card className="p-8 bg-white shadow-sm">
            <div className="flex items-center mb-6">
              <Edit3 className="w-6 h-6 text-zawaya-accent ml-3" />
              <h2 className="text-2xl font-semibold text-zawaya-primary font-ge-ss">إرشادات الكتابة</h2>
            </div>
            <div className="space-y-4 text-gray-700 font-ge-ss">
              <div className="flex items-start space-x-3 space-x-reverse">
                <div className="w-2 h-2 bg-zawaya-accent rounded-full mt-2 flex-shrink-0"></div>
                <p>المقالات يجب أن تكون أصلية وغير منشورة سابقاً في أي منصة أخرى</p>
              </div>
              <div className="flex items-start space-x-3 space-x-reverse">
                <div className="w-2 h-2 bg-zawaya-accent rounded-full mt-2 flex-shrink-0"></div>
                <p>الحد الأدنى للمقال 800 كلمة والحد الأقصى 3000 كلمة</p>
              </div>
              <div className="flex items-start space-x-3 space-x-reverse">
                <div className="w-2 h-2 bg-zawaya-accent rounded-full mt-2 flex-shrink-0"></div>
                <p>يجب أن يتضمن المقال مراجع ومصادر موثوقة عند الحاجة</p>
              </div>
              <div className="flex items-start space-x-3 space-x-reverse">
                <div className="w-2 h-2 bg-zawaya-accent rounded-full mt-2 flex-shrink-0"></div>
                <p>نرحب بالمقالات التحليلية والرأي والتقارير الاستقصائية</p>
              </div>
              <div className="flex items-start space-x-3 space-x-reverse">
                <div className="w-2 h-2 bg-zawaya-accent rounded-full mt-2 flex-shrink-0"></div>
                <p>يجب أن تلتزم المقالات بمعايير الموضوعية والمهنية</p>
              </div>
            </div>
          </Card>

          <Card className="p-8 bg-white shadow-sm">
            <div className="flex items-center mb-6">
              <FileText className="w-6 h-6 text-zawaya-accent ml-3" />
              <h2 className="text-2xl font-semibold text-zawaya-primary font-ge-ss">عملية المراجعة</h2>
            </div>
            <div className="space-y-6">
              <div className="flex items-start space-x-4 space-x-reverse">
                <div className="w-8 h-8 bg-zawaya-primary text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1 font-ge-ss">استلام المقال</h4>
                  <p className="text-gray-600 text-sm font-ge-ss">نستلم مقالك ونرسل تأكيد الاستلام خلال 24 ساعة</p>
                </div>
              </div>
              <div className="flex items-start space-x-4 space-x-reverse">
                <div className="w-8 h-8 bg-zawaya-primary text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1 font-ge-ss">المراجعة التحريرية</h4>
                  <p className="text-gray-600 text-sm font-ge-ss">يراجع فريقنا التحريري المقال خلال 5-7 أيام عمل</p>
                </div>
              </div>
              <div className="flex items-start space-x-4 space-x-reverse">
                <div className="w-8 h-8 bg-zawaya-primary text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1 font-ge-ss">القرار والنشر</h4>
                  <p className="text-gray-600 text-sm font-ge-ss">نبلغك بقرار النشر ونحدد موعد النشر المناسب</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Topics Section */}
        <Card className="p-8 mb-16 bg-gradient-to-r from-zawaya-primary to-zawaya-iris text-white">
          <h2 className="text-2xl font-semibold mb-6 font-ge-ss">المواضيع المرحب بها</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <h4 className="font-semibold font-ge-ss">السياسة والحكم</h4>
              <ul className="text-sm space-y-1 text-white/90 font-ge-ss">
                <li>• التحليل السياسي</li>
                <li>• السياسات العامة</li>
                <li>• العلاقات الدولية</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold font-ge-ss">الاقتصاد والأعمال</h4>
              <ul className="text-sm space-y-1 text-white/90 font-ge-ss">
                <li>• التحليل الاقتصادي</li>
                <li>• ريادة الأعمال</li>
                <li>• الأسواق المالية</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold font-ge-ss">الثقافة والمجتمع</h4>
              <ul className="text-sm space-y-1 text-white/90 font-ge-ss">
                <li>• القضايا الاجتماعية</li>
                <li>• الثقافة والفنون</li>
                <li>• التعليم والتربية</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold font-ge-ss">التكنولوجيا والعلوم</h4>
              <ul className="text-sm space-y-1 text-white/90 font-ge-ss">
                <li>• التكنولوجيا الناشئة</li>
                <li>• الذكاء الاصطناعي</li>
                <li>• البحث العلمي</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* FAQ Section */}
        <Card className="p-8 bg-white shadow-sm">
          <h2 className="text-2xl font-semibold text-zawaya-primary mb-8 font-ge-ss text-center">الأسئلة الشائعة</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2 font-ge-ss">هل يمكنني إرسال مقال منشور سابقاً؟</h4>
                <p className="text-gray-600 text-sm font-ge-ss">
                  لا، نقبل فقط المقالات الأصلية غير المنشورة سابقاً في أي منصة أخرى.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2 font-ge-ss">كم يستغرق الرد على المقال؟</h4>
                <p className="text-gray-600 text-sm font-ge-ss">
                  عادة ما نرد خلال 5-7 أيام عمل من تاريخ استلام المقال.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2 font-ge-ss">هل هناك مقابل مالي للنشر؟</h4>
                <p className="text-gray-600 text-sm font-ge-ss">
                  زوايا منصة غير ربحية، ولا نقدم مقابل مالي للكتّاب حالياً.
                </p>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2 font-ge-ss">ما هي صيغ الملفات المقبولة؟</h4>
                <p className="text-gray-600 text-sm font-ge-ss">نقبل ملفات .doc و .docx و .mdx بحد أقصى 10 ميجابايت.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2 font-ge-ss">هل يمكنني تعديل المقال بعد الإرسال؟</h4>
                <p className="text-gray-600 text-sm font-ge-ss">
                  يمكنك إرسال نسخة محدثة قبل بدء عملية المراجعة التحريرية.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2 font-ge-ss">هل تقبلون المقالات باللغة الإنجليزية؟</h4>
                <p className="text-gray-600 text-sm font-ge-ss">نعم، نقبل المقالات باللغتين العربية والإنجليزية.</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Final CTA */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-semibold text-zawaya-primary mb-4 font-ge-ss">هل أنت مستعد لمشاركة أفكارك؟</h3>
          <p className="text-gray-600 mb-8 font-ge-ss">انضم إلى مجتمع الكتّاب في زوايا وساهم في إثراء النقاش العام</p>
          <Button
            onClick={() => setIsModalOpen(true)}
            size="lg"
            className="bg-zawaya-accent hover:bg-zawaya-accent/90 text-white px-8 py-4 text-lg font-ge-ss shadow-lg hover:shadow-xl transition-all duration-300"
            style={{ backgroundColor: colors.accent }}
          >
            <Send className="w-5 h-5 ml-2" />
            ابدأ الآن
          </Button>
        </div>
      </div>

      {/* Submit Modal */}
      <SubmitModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} />
    </div>
  )
}
