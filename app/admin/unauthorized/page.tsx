"use client"

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield, Home, LogOut } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function UnauthorizedPage() {
  const router = useRouter()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100 p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
              <Shield className="h-6 w-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-red-600 font-eurostile">
            غير مخول للدخول
          </CardTitle>
          <CardDescription className="font-ge-ss">
            ليس لديك صلاحية للوصول إلى لوحة إدارة زوايا
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-700 font-ge-ss">
                هذه المنطقة مخصصة للمديرين والمحررين المخولين فقط. 
                إذا كنت تعتقد أن هذا خطأ، يرجى التواصل مع إدارة المنصة.
              </p>
            </div>

            <div className="space-y-2">
              <Link href="/ar">
                <Button variant="outline" className="w-full font-ge-ss">
                  <Home className="mr-2 h-4 w-4" />
                  العودة إلى الموقع الرئيسي
                </Button>
              </Link>
              
              <Button 
                variant="default" 
                className="w-full font-ge-ss"
                onClick={handleSignOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                تسجيل الخروج
              </Button>
            </div>

            <div className="pt-4 border-t">
              <p className="text-xs text-gray-500 font-ge-ss">
                للحصول على صلاحيات الإدارة، يرجى التواصل مع:
              </p>
              <p className="text-sm text-zawaya-primary font-medium">
                admin@zawaya.com
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 