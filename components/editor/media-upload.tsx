"use client"

import { useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Upload, 
  Image as ImageIcon, 
  Link, 
  CheckCircle, 
  AlertCircle,
  X,
  FileImage,
  FileVideo,
  File
} from 'lucide-react'

interface MediaUploadProps {
  onMediaSelect: (url: string, type: 'image' | 'video' | 'file') => void
  onClose?: () => void
  acceptedTypes?: string[]
  maxFileSize?: number // in MB
}

interface UploadedFile {
  name: string
  url: string
  type: 'image' | 'video' | 'file'
  size: number
}

export default function MediaUpload({ 
  onMediaSelect, 
  onClose,
  acceptedTypes = ['image/*', 'video/*'],
  maxFileSize = 10
}: MediaUploadProps) {
  const [activeTab, setActiveTab] = useState('upload')
  const [fileUrl, setFileUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const getFileType = (file: File): 'image' | 'video' | 'file' => {
    if (file.type.startsWith('image/')) return 'image'
    if (file.type.startsWith('video/')) return 'video'
    return 'file'
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const generateFileName = (originalName: string): string => {
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const extension = originalName.split('.').pop()
    return `${timestamp}-${randomString}.${extension}`
  }

  const uploadFile = async (file: File): Promise<string | null> => {
    try {
      // Validate file size
      if (file.size > maxFileSize * 1024 * 1024) {
        throw new Error(`حجم الملف يجب أن يكون أقل من ${maxFileSize} ميجابايت`)
      }

      // Generate unique filename
      const fileName = generateFileName(file.name)
      const fileType = getFileType(file)
      
      // Determine storage bucket based on file type
      const bucket = fileType === 'image' ? 'images' : 
                    fileType === 'video' ? 'videos' : 'files'

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        console.error('Storage upload error:', error)
        throw new Error('فشل في رفع الملف إلى التخزين')
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName)

      return publicUrl

    } catch (error) {
      console.error('File upload error:', error)
      throw error
    }
  }

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    setError('')
    setSuccess('')
    setUploading(true)
    setUploadProgress(0)

    try {
      const file = files[0]
      const fileType = getFileType(file)

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      const publicUrl = await uploadFile(file)

      if (publicUrl) {
        setUploadProgress(100)
        
        const uploadedFile: UploadedFile = {
          name: file.name,
          url: publicUrl,
          type: fileType,
          size: file.size
        }

        setUploadedFiles(prev => [uploadedFile, ...prev])
        setSuccess(`تم رفع ${file.name} بنجاح!`)
        
        // Auto-select the uploaded file
        onMediaSelect(publicUrl, fileType)
        
        clearInterval(progressInterval)
        setTimeout(() => {
          setUploading(false)
          setUploadProgress(0)
        }, 1000)
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ أثناء رفع الملف')
      setUploading(false)
      setUploadProgress(0)
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleUrlSubmit = () => {
    if (!fileUrl.trim()) {
      setError('يرجى إدخال رابط صحيح')
      return
    }

    try {
      const url = new URL(fileUrl)
      const isImage = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url.pathname)
      const isVideo = /\.(mp4|webm|ogg|avi|mov)$/i.test(url.pathname)
      
      const type = isImage ? 'image' : isVideo ? 'video' : 'file'
      
      onMediaSelect(fileUrl, type)
      setSuccess('تم إضافة الرابط بنجاح!')
      setFileUrl('')
      
    } catch {
      setError('الرابط غير صحيح')
    }
  }

  const handleSelectFile = (file: UploadedFile) => {
    onMediaSelect(file.url, file.type)
    setSuccess(`تم اختيار ${file.name}`)
  }

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const getFileIcon = (type: 'image' | 'video' | 'file') => {
    switch (type) {
      case 'image':
        return <FileImage className="h-8 w-8 text-blue-500" />
      case 'video':
        return <FileVideo className="h-8 w-8 text-purple-500" />
      default:
        return <File className="h-8 w-8 text-gray-500" />
    }
  }

  return (
    <div className="space-y-4">
      {onClose && (
        <div className="flex justify-end">
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upload" className="font-ge-ss">رفع ملف</TabsTrigger>
          <TabsTrigger value="url" className="font-ge-ss">رابط خارجي</TabsTrigger>
          <TabsTrigger value="library" className="font-ge-ss">المكتبة</TabsTrigger>
        </TabsList>

        {/* File Upload Tab */}
        <TabsContent value="upload" className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-zawaya-primary transition-colors">
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <div className="space-y-2">
              <h3 className="text-lg font-medium font-ge-ss">رفع ملف جديد</h3>
              <p className="text-sm text-gray-500 font-ge-ss">
                اسحب الملف هنا أو انقر لاختيار ملف
              </p>
              <p className="text-xs text-gray-400 font-ge-ss">
                الحد الأقصى: {maxFileSize} ميجابايت
              </p>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept={acceptedTypes.join(',')}
              onChange={handleFileSelect}
              className="hidden"
              disabled={uploading}
            />
            
            <Button 
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="mt-4 font-ge-ss"
            >
              {uploading ? 'جاري الرفع...' : 'اختر ملف'}
            </Button>

            {uploading && (
              <div className="mt-4 space-y-2">
                <Progress value={uploadProgress} className="w-full" />
                <p className="text-sm text-gray-600 font-ge-ss">
                  {uploadProgress}% مكتمل
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* URL Tab */}
        <TabsContent value="url" className="space-y-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="file-url" className="font-ge-ss">رابط الملف</Label>
              <Input
                id="file-url"
                value={fileUrl}
                onChange={(e) => setFileUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                dir="ltr"
                className="mt-1"
              />
            </div>
            
            <Button 
              onClick={handleUrlSubmit} 
              disabled={!fileUrl.trim()}
              className="w-full font-ge-ss"
            >
              <Link className="mr-2 h-4 w-4" />
              إضافة الرابط
            </Button>

            {fileUrl && (
              <div className="border rounded-lg p-4">
                <p className="text-sm font-ge-ss mb-2">معاينة:</p>
                {fileUrl.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i) ? (
                  <img 
                    src={fileUrl} 
                    alt="معاينة" 
                    className="max-w-full h-32 object-cover rounded"
                    onError={() => setError('لا يمكن تحميل الصورة من هذا الرابط')}
                  />
                ) : (
                  <div className="bg-gray-100 p-4 rounded text-center">
                    <File className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 font-ge-ss">معاينة الملف غير متاحة</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </TabsContent>

        {/* Library Tab */}
        <TabsContent value="library" className="space-y-4">
          {uploadedFiles.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="relative border rounded-lg p-3 hover:shadow-md transition-shadow">
                  <button
                    onClick={() => removeFile(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                  
                  <div className="space-y-2">
                    {file.type === 'image' ? (
                      <img 
                        src={file.url} 
                        alt={file.name}
                        className="w-full h-20 object-cover rounded"
                      />
                    ) : (
                      <div className="w-full h-20 bg-gray-100 rounded flex items-center justify-center">
                        {getFileIcon(file.type)}
                      </div>
                    )}
                    
                    <div className="text-xs">
                      <p className="font-medium truncate font-ge-ss" title={file.name}>
                        {file.name}
                      </p>
                      <p className="text-gray-500">{formatFileSize(file.size)}</p>
                    </div>
                    
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleSelectFile(file)}
                      className="w-full text-xs font-ge-ss"
                    >
                      اختيار
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500 font-ge-ss">لا توجد ملفات مرفوعة</p>
              <p className="text-sm text-gray-400 font-ge-ss">ارفع ملفات لتظهر هنا</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Alerts */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="font-ge-ss">{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="font-ge-ss text-green-800">{success}</AlertDescription>
        </Alert>
      )}
    </div>
  )
} 