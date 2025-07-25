"use client"

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Shield, Eye, EyeOff } from 'lucide-react'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectedFrom = searchParams.get('redirectedFrom')

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.push('/admin')
      }
    })
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setError('البريد الإلكتروني أو كلمة المرور غير صحيحة')
        } else if (error.message.includes('Email not confirmed')) {
          setError('يرجى تأكيد بريدك الإلكتروني أولاً')
        } else {
          setError(error.message)
        }
        return
      }

      if (data.user) {
        // Check if user has admin/editor role
        const { data: profile, error: profileError } = await supabase
          .from('authors')
          .select('role, name')
          .eq('id', data.user.id)
          .single()

        if (profileError || !profile) {
          setError('لا يمكن العثور على ملف التعريف الخاص بك')
          await supabase.auth.signOut()
          return
        }

        if (profile.role !== 'admin' && profile.role !== 'editor') {
          setError('ليس لديك صلاحية للوصول إلى لوحة الإدارة')
          await supabase.auth.signOut()
          return
        }

        setMessage(`مرحباً ${profile.name}! تم تسجيل الدخول بنجاح`)
        
        // Redirect to admin dashboard or original destination
        setTimeout(() => {
          router.push(redirectedFrom || '/admin')
        }, 1000)
      }
    } catch (err) {
      setError('حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.')
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async () => {
    if (!email) {
      setError('يرجى إدخال بريدك الإلكتروني أولاً')
      return
    }

    setLoading(true)
    setError('')

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/admin/reset-password`,
      })

      if (error) {
        setError(error.message)
      } else {
        setMessage('تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني')
      }
    } catch (err) {
      setError('حدث خطأ أثناء إرسال البريد الإلكتروني')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zawaya-primary/5 to-zawaya-accent/5 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-zawaya-primary rounded-lg flex items-center justify-center">
              <Shield className="h-6 w-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-zawaya-primary font-eurostile">
            لوحة إدارة زوايا
          </CardTitle>
          <CardDescription className="font-ge-ss">
            تسجيل الدخول للوصول إلى نظام إدارة المحتوى
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="font-ge-ss">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@zawaya.com"
                required
                disabled={loading}
                className="font-ge-ss"
                dir="ltr"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="font-ge-ss">كلمة المرور</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={loading}
                  className="font-ge-ss pr-10"
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription className="font-ge-ss">{error}</AlertDescription>
              </Alert>
            )}

            {message && (
              <Alert className="border-green-200 bg-green-50">
                <AlertDescription className="font-ge-ss text-green-800">{message}</AlertDescription>
              </Alert>
            )}

            <Button 
              type="submit" 
              className="w-full font-ge-ss" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  جاري تسجيل الدخول...
                </>
              ) : (
                'تسجيل الدخول'
              )}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-zawaya-primary hover:underline font-ge-ss"
                disabled={loading}
              >
                نسيت كلمة المرور؟
              </button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t text-center">
            <p className="text-sm text-gray-600 font-ge-ss">
              لوحة إدارة منصة زوايا - للمخولين فقط
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 