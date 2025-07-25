"use client"

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import AdminLayout from '@/components/admin/admin-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { 
  Upload, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye, 
  MessageSquare,
  User,
  Calendar,
  FileText,
  Mail
} from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

interface GuestSubmission {
  id: string
  author_name: string
  email: string
  title: string
  category: string
  summary: string
  content: string
  author_bio?: string
  references?: string
  qualifications?: string
  status: 'pending' | 'under_review' | 'approved' | 'rejected'
  feedback?: string
  submitted_at: string
  updated_at: string
}

export default function SubmissionsManagement() {
  const [submissions, setSubmissions] = useState<GuestSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSubmission, setSelectedSubmission] = useState<GuestSubmission | null>(null)
  const [feedback, setFeedback] = useState('')
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    loadSubmissions()
  }, [])

  const loadSubmissions = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('guest_submissions')
        .select('*')
        .order('submitted_at', { ascending: false })

      if (error) {
        console.error('Error loading submissions:', error)
        return
      }

      setSubmissions(data || [])
    } catch (error) {
      console.error('Error loading submissions:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateSubmissionStatus = async (
    submissionId: string, 
    newStatus: GuestSubmission['status'], 
    feedbackText?: string
  ) => {
    try {
      setActionLoading(true)
      
      const { error } = await supabase
        .from('guest_submissions')
        .update({ 
          status: newStatus,
          feedback: feedbackText,
          updated_at: new Date().toISOString()
        })
        .eq('id', submissionId)

      if (error) {
        console.error('Error updating submission:', error)
        return
      }

      // Update local state
      setSubmissions(prev => prev.map(sub => 
        sub.id === submissionId 
          ? { ...sub, status: newStatus, feedback: feedbackText }
          : sub
      ))

      // TODO: Send email notification to author
      
      setSelectedSubmission(null)
      setFeedback('')
    } catch (error) {
      console.error('Error updating submission:', error)
    } finally {
      setActionLoading(false)
    }
  }

  const getStatusBadge = (status: GuestSubmission['status']) => {
    const statusConfig = {
      pending: { label: 'قيد الانتظار', variant: 'secondary' as const, icon: Clock },
      under_review: { label: 'قيد المراجعة', variant: 'default' as const, icon: Eye },
      approved: { label: 'مقبول', variant: 'default' as const, icon: CheckCircle },
      rejected: { label: 'مرفوض', variant: 'destructive' as const, icon: XCircle }
    }
    
    const config = statusConfig[status]
    const Icon = config.icon
    
    return (
      <Badge variant={config.variant} className="flex items-center space-x-1 space-x-reverse">
        <Icon className="h-3 w-3" />
        <span>{config.label}</span>
      </Badge>
    )
  }

  const getCategoryLabel = (category: string) => {
    const categoryLabels = {
      'political': 'سياسي',
      'economic': 'اقتصادي',
      'cultural': 'ثقافي',
      'social': 'اجتماعي',
      'art': 'فن',
      'literature': 'أدب',
      'history': 'تاريخ'
    }
    return categoryLabels[category as keyof typeof categoryLabels] || category
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getSubmissionsByStatus = (status: GuestSubmission['status']) => {
    return submissions.filter(sub => sub.status === status)
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <h1 className="text-2xl font-bold font-ge-ss">مراجعة طلبات الكتابة</h1>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="animate-pulse space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold font-ge-ss">مراجعة طلبات الكتابة</h1>
          <p className="text-gray-600 font-ge-ss">
            إجمالي الطلبات: {submissions.length}
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium font-ge-ss">قيد الانتظار</CardTitle>
              <Clock className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getSubmissionsByStatus('pending').length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium font-ge-ss">قيد المراجعة</CardTitle>
              <Eye className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getSubmissionsByStatus('under_review').length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium font-ge-ss">مقبولة</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getSubmissionsByStatus('approved').length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium font-ge-ss">مرفوضة</CardTitle>
              <XCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getSubmissionsByStatus('rejected').length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Submissions List */}
        <div className="space-y-4">
          {submissions.length > 0 ? (
            submissions.map((submission) => (
              <Card key={submission.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 font-ge-ss mb-2">
                            {submission.title}
                          </h3>
                          <p className="text-sm text-gray-600 line-clamp-2 font-ge-ss mb-3">
                            {submission.summary}
                          </p>
                        </div>
                        <div className="flex-shrink-0 mr-4">
                          {getStatusBadge(submission.status)}
                        </div>
                      </div>

                      <div className="flex items-center space-x-6 space-x-reverse text-sm text-gray-500">
                        <div className="flex items-center space-x-1 space-x-reverse">
                          <User className="h-4 w-4" />
                          <span className="font-ge-ss">{submission.author_name}</span>
                        </div>
                        <div className="flex items-center space-x-1 space-x-reverse">
                          <Mail className="h-4 w-4" />
                          <span>{submission.email}</span>
                        </div>
                        <div className="flex items-center space-x-1 space-x-reverse">
                          <FileText className="h-4 w-4" />
                          <span className="font-ge-ss">{getCategoryLabel(submission.category)}</span>
                        </div>
                        <div className="flex items-center space-x-1 space-x-reverse">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(submission.submitted_at)}</span>
                        </div>
                      </div>

                      {submission.feedback && (
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="flex items-center space-x-2 space-x-reverse mb-1">
                            <MessageSquare className="h-4 w-4 text-gray-500" />
                            <span className="text-sm font-medium text-gray-700 font-ge-ss">ملاحظات المراجعة:</span>
                          </div>
                          <p className="text-sm text-gray-600 font-ge-ss">{submission.feedback}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 space-x-reverse">
                      {/* View Details Button */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedSubmission(submission)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            عرض التفاصيل
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto" dir="rtl">
                          <DialogHeader>
                            <DialogTitle className="font-ge-ss">{submission.title}</DialogTitle>
                            <DialogDescription className="font-ge-ss">
                              طلب كتابة من {submission.author_name}
                            </DialogDescription>
                          </DialogHeader>
                          
                          <div className="space-y-6">
                            {/* Author Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-medium font-ge-ss mb-2">معلومات الكاتب</h4>
                                <div className="space-y-2 text-sm">
                                  <p><strong>الاسم:</strong> {submission.author_name}</p>
                                  <p><strong>البريد الإلكتروني:</strong> {submission.email}</p>
                                  <p><strong>التاريخ:</strong> {formatDate(submission.submitted_at)}</p>
                                </div>
                              </div>
                              <div>
                                <h4 className="font-medium font-ge-ss mb-2">تفاصيل المقال</h4>
                                <div className="space-y-2 text-sm">
                                  <p><strong>التصنيف:</strong> {getCategoryLabel(submission.category)}</p>
                                  <p><strong>الحالة:</strong> {getStatusBadge(submission.status)}</p>
                                </div>
                              </div>
                            </div>

                            {/* Content */}
                            <div>
                              <h4 className="font-medium font-ge-ss mb-2">الملخص</h4>
                              <p className="text-sm bg-gray-50 p-3 rounded font-ge-ss">{submission.summary}</p>
                            </div>

                            <div>
                              <h4 className="font-medium font-ge-ss mb-2">المحتوى</h4>
                              <div className="text-sm bg-gray-50 p-3 rounded max-h-40 overflow-y-auto font-ge-ss">
                                {submission.content.split('\n').map((paragraph, index) => (
                                  <p key={index} className="mb-2">{paragraph}</p>
                                ))}
                              </div>
                            </div>

                            {/* Author Bio */}
                            {submission.author_bio && (
                              <div>
                                <h4 className="font-medium font-ge-ss mb-2">نبذة عن الكاتب</h4>
                                <p className="text-sm bg-gray-50 p-3 rounded font-ge-ss">{submission.author_bio}</p>
                              </div>
                            )}

                            {/* References */}
                            {submission.references && (
                              <div>
                                <h4 className="font-medium font-ge-ss mb-2">المراجع</h4>
                                <p className="text-sm bg-gray-50 p-3 rounded font-ge-ss">{submission.references}</p>
                              </div>
                            )}

                            {/* Current Feedback */}
                            {submission.feedback && (
                              <div>
                                <h4 className="font-medium font-ge-ss mb-2">ملاحظات المراجعة الحالية</h4>
                                <p className="text-sm bg-yellow-50 border border-yellow-200 p-3 rounded font-ge-ss">
                                  {submission.feedback}
                                </p>
                              </div>
                            )}

                            {/* Action Buttons */}
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-medium font-ge-ss mb-2">ملاحظات المراجعة</h4>
                                <Textarea
                                  placeholder="أضف ملاحظات للكاتب..."
                                  value={feedback}
                                  onChange={(e) => setFeedback(e.target.value)}
                                  className="font-ge-ss"
                                />
                              </div>

                              <div className="flex justify-end space-x-2 space-x-reverse">
                                {submission.status === 'pending' && (
                                  <Button
                                    variant="outline"
                                    onClick={() => updateSubmissionStatus(submission.id, 'under_review', feedback)}
                                    disabled={actionLoading}
                                    className="font-ge-ss"
                                  >
                                    بدء المراجعة
                                  </Button>
                                )}
                                
                                <Button
                                  variant="outline"
                                  onClick={() => updateSubmissionStatus(submission.id, 'rejected', feedback)}
                                  disabled={actionLoading}
                                  className="font-ge-ss"
                                >
                                  رفض
                                </Button>
                                
                                <Button
                                  onClick={() => updateSubmissionStatus(submission.id, 'approved', feedback)}
                                  disabled={actionLoading}
                                  className="font-ge-ss"
                                >
                                  قبول
                                </Button>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2 font-ge-ss">
                  لا توجد طلبات كتابة
                </h3>
                <p className="text-gray-600 font-ge-ss">
                  لم يتم استلام أي طلبات كتابة من الكُتّاب بعد
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AdminLayout>
  )
} 