import { NextRequest, NextResponse } from 'next/server'
import { submissionService } from '@/lib/database'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    // Extract form fields
    const authorName = formData.get('author_name') as string
    const email = formData.get('email') as string
    const title = formData.get('title') as string
    const category = formData.get('category') as string
    const summary = formData.get('summary') as string
    const content = formData.get('content') as string
    const authorBio = formData.get('author_bio') as string || undefined
    const references = formData.get('references') as string || undefined
    const qualifications = formData.get('qualifications') as string || undefined
    const file = formData.get('file') as File || null

    // Validate required fields
    if (!authorName || !email || !title || !category || !summary || !content) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'جميع الحقول المطلوبة يجب أن تكون مملوءة' 
        },
        { status: 400 }
      )
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'يرجى إدخال بريد إلكتروني صحيح' },
        { status: 400 }
      )
    }

    // Handle file upload (if provided)
    let fileUrl = null
    if (file && file.size > 0) {
      // TODO: Upload file to Supabase Storage
      // For now, we'll just log that a file was provided
      console.log('File provided:', file.name, file.size)
      
      // In a real implementation:
      // const { data: uploadData, error: uploadError } = await supabase.storage
      //   .from('submissions')
      //   .upload(`${Date.now()}-${file.name}`, file)
      // 
      // if (uploadError) throw uploadError
      // fileUrl = uploadData.path
    }

    // Create submission in database
    const submission = await submissionService.create({
      author_name: authorName,
      email,
      title,
      category,
      summary,
      content,
      author_bio: authorBio,
      references,
      qualifications
    })

    // TODO: Send confirmation email to author
    // TODO: Send notification email to editorial team

    return NextResponse.json({
      success: true,
      message: 'تم إرسال المقال بنجاح! سنتواصل معك خلال 3-5 أيام عمل.',
      data: {
        submission_id: submission.id,
        status: submission.status
      }
    })

  } catch (error) {
    console.error('Error submitting article:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'حدث خطأ أثناء إرسال المقال. يرجى المحاولة مرة أخرى.',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
