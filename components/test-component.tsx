// Simple test component to verify the design system is working
export function TestComponent() {
  return (
    <div className="p-4 bg-sand-50">
      <h1 className="text-4xl font-bold text-ink-900 font-ge-ss mb-4">
        اختبار النظام التصميمي
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm">
          <h3 className="text-xl font-bold text-ink-700 mb-2">الألوان</h3>
          <div className="space-y-2">
            <div className="w-full h-8 bg-brand-red rounded"></div>
            <div className="w-full h-8 bg-brand-green rounded"></div>
            <div className="w-full h-8 bg-brand-violet rounded"></div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm">
          <h3 className="text-xl font-bold text-ink-700 mb-2">التدرجات</h3>
          <div className="space-y-2">
            <div className="w-full h-8 bg-gradient-to-r from-ink-700 to-ink-900 rounded"></div>
            <div className="w-full h-8 bg-gradient-to-r from-sand-50 to-white rounded"></div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm">
          <h3 className="text-xl font-bold text-ink-700 mb-2">النصوص</h3>
          <p className="text-ink-600 text-sm mb-2">نص صغير</p>
          <p className="text-ink-700 text-base mb-2">نص عادي</p>
          <p className="text-ink-900 text-lg font-bold">نص كبير</p>
        </div>
      </div>
    </div>
  )
}