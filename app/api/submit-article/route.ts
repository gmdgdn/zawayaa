import { type NextRequest, NextResponse } from "next/server"

// This would typically use Supabase client
// For now, we'll simulate the API response

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const title = formData.get("title") as string
    const bio = formData.get("bio") as string
    const file = formData.get("file") as File

    // Validate required fields
    if (!name || !email || !title || !bio || !file) {
      return NextResponse.json({ error: "جميع الحقول مطلوبة" }, { status: 400 })
    }

    // In a real implementation, you would:
    // 1. Upload the file to Supabase Storage
    // 2. Insert the submission data into the guest_submissions table
    // 3. Send confirmation email to the user
    // 4. Notify the editorial team

    /*
    Example Supabase implementation:
    
    import { createClient } from '@supabase/supabase-js'
    
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Upload file to Supabase Storage
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('article-submissions')
      .upload(fileName, file)

    if (uploadError) {
      throw uploadError
    }

    // Insert submission into database
    const { data, error } = await supabase
      .from('guest_submissions')
      .insert({
        name,
        email,
        title,
        bio,
        file_path: uploadData.path,
        file_name: file.name,
        file_size: file.size,
        status: 'pending',
        submitted_at: new Date().toISOString()
      })

    if (error) {
      throw error
    }
    */

    // Simulate successful submission
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return NextResponse.json(
      {
        message: "تم إرسال المقال بنجاح",
        submissionId: `sub_${Date.now()}`,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Submission error:", error)
    return NextResponse.json({ error: "حدث خطأ أثناء إرسال المقال" }, { status: 500 })
  }
}
