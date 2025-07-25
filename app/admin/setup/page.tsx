"use client"

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/admin-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Database, 
  Key, 
  Settings, 
  RefreshCw,
  ExternalLink,
  Copy,
  Terminal
} from 'lucide-react'
import Link from 'next/link'

interface TestResult {
  name: string
  status: 'success' | 'failed' | 'partial'
  details: any
}

interface DiagnosticResult {
  overallStatus: string
  timestamp: string
  tests: TestResult[]
  recommendations: Array<{
    issue: string
    solution: string
  }>
}

export default function SetupPage() {
  const [diagnosticResult, setDiagnosticResult] = useState<DiagnosticResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    runDiagnostics()
  }, [])

  const runDiagnostics = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/test-supabase')
      const result = await response.json()
      setDiagnosticResult(result)
    } catch (error) {
      console.error('Error running diagnostics:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />
      case 'partial':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-100 text-green-800">نجح</Badge>
      case 'failed':
        return <Badge variant="destructive">فشل</Badge>
      case 'partial':
        return <Badge className="bg-yellow-100 text-yellow-800">جزئي</Badge>
      default:
        return <Badge variant="secondary">غير معروف</Badge>
    }
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    setCopied(label)
    setTimeout(() => setCopied(null), 2000)
  }

  const envTemplate = `# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...your-anon-key
SUPABASE_SERVICE_ROLE_KEY=eyJ...your-service-role-key`

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">إعداد المنصة</h1>
            <p className="text-gray-600 mt-2">
              تكوين قاعدة البيانات وإعدادات المنصة
            </p>
          </div>
          <Button 
            onClick={runDiagnostics} 
            disabled={loading}
            className="flex items-center space-x-2 space-x-reverse"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>تحديث التشخيص</span>
          </Button>
        </div>

        {/* Overall Status */}
        {diagnosticResult && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-3 space-x-reverse">
                {getStatusIcon(diagnosticResult.overallStatus)}
                <span>حالة النظام العامة</span>
              </CardTitle>
              <CardDescription>
                آخر فحص: {new Date(diagnosticResult.timestamp).toLocaleString('ar-SA')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 space-x-reverse">
                  {getStatusBadge(diagnosticResult.overallStatus)}
                  <span className="text-sm text-gray-600">
                    {diagnosticResult.overallStatus === 'success' && 'جميع الأنظمة تعمل بشكل صحيح'}
                    {diagnosticResult.overallStatus === 'partial' && 'بعض المشاكل تحتاج إلى حل'}
                    {diagnosticResult.overallStatus === 'failed' && 'يتطلب إعداد قاعدة البيانات'}
                  </span>
                </div>
                {diagnosticResult.overallStatus === 'success' && (
                  <Link href="/admin">
                    <Button>الذهاب إلى لوحة التحكم</Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Setup Guide */}
        {diagnosticResult?.overallStatus !== 'success' && (
          <Alert>
            <Settings className="h-4 w-4" />
            <AlertTitle>إعداد مطلوب</AlertTitle>
            <AlertDescription>
              يبدو أن قاعدة البيانات تحتاج إلى إعداد. يرجى اتباع الخطوات أدناه لإكمال التكوين.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Diagnostic Results */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold">نتائج التشخيص</h2>
            
            {diagnosticResult ? (
              diagnosticResult.tests.map((test, index) => (
                <Card key={index}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center space-x-3 space-x-reverse">
                      {getStatusIcon(test.status)}
                      <span>{test.name}</span>
                      {getStatusBadge(test.status)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-gray-600 space-y-2">
                      {Object.entries(test.details).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="font-medium">{key}:</span>
                          <span className={typeof value === 'boolean' ? (value ? 'text-green-600' : 'text-red-600') : ''}>
                            {String(value)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="flex items-center justify-center p-8">
                <RefreshCw className="w-6 h-6 animate-spin text-gray-400" />
                <span className="mr-2 text-gray-600">جاري تشغيل التشخيص...</span>
              </div>
            )}
          </div>

          {/* Setup Instructions */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold">إرشادات الإعداد</h2>

            {/* Environment Variables */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 space-x-reverse">
                  <Key className="w-5 h-5" />
                  <span>متغيرات البيئة</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  أنشئ ملف <code>.env.local</code> في جذر المشروع:
                </p>
                <div className="relative">
                  <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                    {envTemplate}
                  </pre>
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute top-2 left-2"
                    onClick={() => copyToClipboard(envTemplate, 'env')}
                  >
                    {copied === 'env' ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
                <div className="flex space-x-2 space-x-reverse">
                  <Button size="sm" variant="outline" asChild>
                    <a href="https://app.supabase.com" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 ml-1" />
                      فتح Supabase
                    </a>
                  </Button>
                  <Button size="sm" variant="outline" asChild>
                    <Link href="/SUPABASE_SETUP_GUIDE.md">
                      دليل الإعداد الكامل
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Database Schema */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 space-x-reverse">
                  <Database className="w-5 h-5" />
                  <span>قاعدة البيانات</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  قم بتشغيل السكريبتات التالية في Supabase SQL Editor:
                </p>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-sm">1.</span>
                    <code className="bg-gray-100 px-2 py-1 rounded text-xs">scripts/create-database-schema.sql</code>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-sm">2.</span>
                    <code className="bg-gray-100 px-2 py-1 rounded text-xs">scripts/seed-categories.sql</code>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-sm">3.</span>
                    <code className="bg-gray-100 px-2 py-1 rounded text-xs">scripts/seed-sample-data.sql</code>
                  </div>
                </div>
                <Button size="sm" variant="outline" asChild>
                  <a href="https://app.supabase.com/project/_/sql" target="_blank" rel="noopener noreferrer">
                    <Terminal className="w-4 h-4 ml-1" />
                    فتح SQL Editor
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* Recommendations */}
            {diagnosticResult?.recommendations && diagnosticResult.recommendations.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 space-x-reverse">
                    <AlertCircle className="w-5 h-5" />
                    <span>توصيات الإصلاح</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {diagnosticResult.recommendations.map((rec, index) => (
                      <div key={index} className="border-r-4 border-yellow-400 pr-4">
                        <h4 className="font-medium text-gray-900">{rec.issue}</h4>
                        <p className="text-sm text-gray-600">{rec.solution}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>إجراءات سريعة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" onClick={runDiagnostics} disabled={loading}>
                <RefreshCw className={`w-4 h-4 ml-1 ${loading ? 'animate-spin' : ''}`} />
                إعادة الفحص
              </Button>
              <Button variant="outline" asChild>
                <Link href="/admin">
                  لوحة التحكم
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <a href="http://localhost:3000/api/test-supabase" target="_blank">
                  <ExternalLink className="w-4 h-4 ml-1" />
                  عرض نتائج التشخيص الخام
                </a>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/SUPABASE_SETUP_GUIDE.md">
                  دليل الإعداد الكامل
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
} 