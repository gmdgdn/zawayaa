"use client"

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import Color from '@tiptap/extension-color'
import { TextStyle } from '@tiptap/extension-text-style'
import FontFamily from '@tiptap/extension-font-family'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Youtube from '@tiptap/extension-youtube'
import Placeholder from '@tiptap/extension-placeholder'
import CharacterCount from '@tiptap/extension-character-count'
import { useState, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Quote,
  Code,
  Image as ImageIcon,
  Link as LinkIcon,
  Youtube as YoutubeIcon,
  Twitter,
  Undo,
  Redo,
  Type,
  Palette,
  FileText,
  Upload
} from 'lucide-react'
import MediaUploadComponent from './media-upload'

interface RichTextEditorProps {
  content?: string
  onChange?: (content: string) => void
  placeholder?: string
  className?: string
  direction?: 'ltr' | 'rtl'
  minHeight?: string
}

interface SimpleMediaUploadProps {
  onImageSelect: (url: string) => void
}

const SimpleMediaUpload = ({ onImageSelect }: SimpleMediaUploadProps) => {
  const [imageUrl, setImageUrl] = useState('')
  const [uploadMethod, setUploadMethod] = useState<'url' | 'upload'>('url')

  const handleImageUrl = () => {
    if (imageUrl) {
      onImageSelect(imageUrl)
      setImageUrl('')
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // In a real implementation, upload to Supabase Storage
      // For now, create a local URL for preview
      const url = URL.createObjectURL(file)
      onImageSelect(url)
      
      // TODO: Implement actual file upload to Supabase Storage
      console.log('TODO: Upload file to Supabase Storage:', file.name)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex space-x-2 space-x-reverse">
        <Button
          variant={uploadMethod === 'url' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setUploadMethod('url')}
          className="font-ge-ss"
        >
          رابط الصورة
        </Button>
        <Button
          variant={uploadMethod === 'upload' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setUploadMethod('upload')}
          className="font-ge-ss"
        >
          رفع صورة
        </Button>
      </div>

      {uploadMethod === 'url' ? (
        <div className="space-y-2">
          <Label htmlFor="image-url" className="font-ge-ss">رابط الصورة</Label>
          <Input
            id="image-url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
            dir="ltr"
          />
          <Button onClick={handleImageUrl} disabled={!imageUrl} className="w-full font-ge-ss">
            إضافة الصورة
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          <Label htmlFor="file-upload" className="font-ge-ss">اختر صورة</Label>
          <Input
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
          />
        </div>
      )}
    </div>
  )
}

const TwitterEmbed = ({ url, onInsert }: { url: string; onInsert: (html: string) => void }) => {
  const handleTwitterEmbed = () => {
    // Extract tweet ID from URL
    const tweetIdMatch = url.match(/status\/(\d+)/)
    if (tweetIdMatch) {
      const tweetId = tweetIdMatch[1]
      // Create a simple embedded tweet HTML
      const embedHtml = `
        <div class="twitter-embed" data-tweet-id="${tweetId}">
          <blockquote class="twitter-tweet">
            <a href="${url}">View Tweet</a>
          </blockquote>
        </div>
      `
      onInsert(embedHtml)
    }
  }

  return (
    <div className="space-y-2">
      <Button onClick={handleTwitterEmbed} disabled={!url} className="w-full font-ge-ss">
        إضافة التغريدة
      </Button>
    </div>
  )
}

export default function RichTextEditor({ 
  content = '', 
  onChange, 
  placeholder = 'ابدأ الكتابة...', 
  className = '',
  direction = 'rtl',
  minHeight = '300px'
}: RichTextEditorProps) {
  const [showImageDialog, setShowImageDialog] = useState(false)
  const [showLinkDialog, setShowLinkDialog] = useState(false)
  const [showYoutubeDialog, setShowYoutubeDialog] = useState(false)
  const [showTwitterDialog, setShowTwitterDialog] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [linkText, setLinkText] = useState('')
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [twitterUrl, setTwitterUrl] = useState('')

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right', 'justify'],
        defaultAlignment: direction === 'rtl' ? 'right' : 'left',
      }),
      Color.configure({
        types: ['textStyle'],
      }),
      TextStyle,
      FontFamily.configure({
        types: ['textStyle'],
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'editor-image',
        },
      }),
      Link.configure({
        HTMLAttributes: {
          class: 'editor-link',
          rel: 'noopener noreferrer',
          target: '_blank',
        },
      }),
      Youtube.configure({
        HTMLAttributes: {
          class: 'editor-youtube',
        },
        width: 640,
        height: 400,
      }),
      Placeholder.configure({
        placeholder,
      }),
      CharacterCount,
    ],
    content,
    editorProps: {
      attributes: {
        class: `prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none ${direction === 'rtl' ? 'prose-rtl' : ''}`,
        style: `min-height: ${minHeight}; direction: ${direction};`,
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      onChange?.(html)
    },
  })

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  const addImage = useCallback((url: string) => {
    if (editor) {
      editor.chain().focus().setImage({ src: url }).run()
      setShowImageDialog(false)
    }
  }, [editor])

  const addLink = useCallback(() => {
    if (editor && linkUrl) {
      if (linkText) {
        editor.chain().focus().insertContent(`<a href="${linkUrl}">${linkText}</a>`).run()
      } else {
        editor.chain().focus().setLink({ href: linkUrl }).run()
      }
      setLinkUrl('')
      setLinkText('')
      setShowLinkDialog(false)
    }
  }, [editor, linkUrl, linkText])

  const addYoutubeVideo = useCallback(() => {
    if (editor && youtubeUrl) {
      editor.commands.setYoutubeVideo({
        src: youtubeUrl,
        width: 640,
        height: 400,
      })
      setYoutubeUrl('')
      setShowYoutubeDialog(false)
    }
  }, [editor, youtubeUrl])

  const insertTwitterEmbed = useCallback((html: string) => {
    if (editor) {
      editor.chain().focus().insertContent(html).run()
      setShowTwitterDialog(false)
      setTwitterUrl('')
    }
  }, [editor])

  if (!editor) {
    return (
      <div className="border rounded-lg p-4 bg-gray-50">
        <div className="animate-pulse space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    )
  }

  const characterCount = editor.storage.characterCount.characters()
  const wordCount = editor.storage.characterCount.words()

  return (
    <div className={`border rounded-lg overflow-hidden ${className}`} dir={direction}>
      {/* Toolbar */}
      <div className="border-b bg-gray-50 p-2">
        <div className="flex flex-wrap items-center gap-1">
          {/* Text Formatting */}
          <div className="flex items-center gap-1">
            <Button
              variant={editor.isActive('bold') ? 'default' : 'ghost'}
              size="sm"
              onClick={() => editor.chain().focus().toggleBold().run()}
              title="غامق"
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              variant={editor.isActive('italic') ? 'default' : 'ghost'}
              size="sm"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              title="مائل"
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button
              variant={editor.isActive('underline') ? 'default' : 'ghost'}
              size="sm"
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              title="تحته خط"
            >
              <Underline className="h-4 w-4" />
            </Button>
            <Button
              variant={editor.isActive('strike') ? 'default' : 'ghost'}
              size="sm"
              onClick={() => editor.chain().focus().toggleStrike().run()}
              title="يتوسطه خط"
            >
              <Strikethrough className="h-4 w-4" />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Text Alignment */}
          <div className="flex items-center gap-1">
            <Button
              variant={editor.isActive({ textAlign: 'right' }) ? 'default' : 'ghost'}
              size="sm"
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
              title="محاذاة يمين"
            >
              <AlignRight className="h-4 w-4" />
            </Button>
            <Button
              variant={editor.isActive({ textAlign: 'center' }) ? 'default' : 'ghost'}
              size="sm"
              onClick={() => editor.chain().focus().setTextAlign('center').run()}
              title="محاذاة وسط"
            >
              <AlignCenter className="h-4 w-4" />
            </Button>
            <Button
              variant={editor.isActive({ textAlign: 'left' }) ? 'default' : 'ghost'}
              size="sm"
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
              title="محاذاة شمال"
            >
              <AlignLeft className="h-4 w-4" />
            </Button>
            <Button
              variant={editor.isActive({ textAlign: 'justify' }) ? 'default' : 'ghost'}
              size="sm"
              onClick={() => editor.chain().focus().setTextAlign('justify').run()}
              title="ضبط"
            >
              <AlignJustify className="h-4 w-4" />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Lists and Blocks */}
          <div className="flex items-center gap-1">
            <Button
              variant={editor.isActive('bulletList') ? 'default' : 'ghost'}
              size="sm"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              title="قائمة نقطية"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={editor.isActive('orderedList') ? 'default' : 'ghost'}
              size="sm"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              title="قائمة مرقمة"
            >
              <ListOrdered className="h-4 w-4" />
            </Button>
            <Button
              variant={editor.isActive('blockquote') ? 'default' : 'ghost'}
              size="sm"
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              title="اقتباس"
            >
              <Quote className="h-4 w-4" />
            </Button>
            <Button
              variant={editor.isActive('codeBlock') ? 'default' : 'ghost'}
              size="sm"
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              title="كود"
            >
              <Code className="h-4 w-4" />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Headings */}
          <Select
            value={
              editor.isActive('heading', { level: 1 }) ? 'h1' :
              editor.isActive('heading', { level: 2 }) ? 'h2' :
              editor.isActive('heading', { level: 3 }) ? 'h3' :
              editor.isActive('heading', { level: 4 }) ? 'h4' :
              editor.isActive('heading', { level: 5 }) ? 'h5' :
              editor.isActive('heading', { level: 6 }) ? 'h6' :
              'paragraph'
            }
            onValueChange={(value) => {
              if (value === 'paragraph') {
                editor.chain().focus().setParagraph().run()
              } else {
                const level = parseInt(value.replace('h', '')) as 1 | 2 | 3 | 4 | 5 | 6
                editor.chain().focus().toggleHeading({ level }).run()
              }
            }}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="paragraph">فقرة</SelectItem>
              <SelectItem value="h1">عنوان 1</SelectItem>
              <SelectItem value="h2">عنوان 2</SelectItem>
              <SelectItem value="h3">عنوان 3</SelectItem>
              <SelectItem value="h4">عنوان 4</SelectItem>
              <SelectItem value="h5">عنوان 5</SelectItem>
              <SelectItem value="h6">عنوان 6</SelectItem>
            </SelectContent>
          </Select>

          <Separator orientation="vertical" className="h-6" />

          {/* Media and Links */}
          <div className="flex items-center gap-1">
            <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" title="إضافة صورة">
                  <ImageIcon className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent dir={direction}>
                <DialogHeader>
                  <DialogTitle className="font-ge-ss">إضافة صورة</DialogTitle>
                  <DialogDescription className="font-ge-ss">
                    أضف صورة من رابط أو ارفع صورة جديدة
                  </DialogDescription>
                </DialogHeader>
                <SimpleMediaUpload onImageSelect={addImage} />
              </DialogContent>
            </Dialog>

            <Dialog open={showLinkDialog} onOpenChange={setShowLinkDialog}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" title="إضافة رابط">
                  <LinkIcon className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent dir={direction}>
                <DialogHeader>
                  <DialogTitle className="font-ge-ss">إضافة رابط</DialogTitle>
                  <DialogDescription className="font-ge-ss">
                    أضف رابط خارجي
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="link-url" className="font-ge-ss">الرابط</Label>
                    <Input
                      id="link-url"
                      value={linkUrl}
                      onChange={(e) => setLinkUrl(e.target.value)}
                      placeholder="https://example.com"
                      dir="ltr"
                    />
                  </div>
                  <div>
                    <Label htmlFor="link-text" className="font-ge-ss">نص الرابط (اختياري)</Label>
                    <Input
                      id="link-text"
                      value={linkText}
                      onChange={(e) => setLinkText(e.target.value)}
                      placeholder="انقر هنا"
                      className="font-ge-ss"
                    />
                  </div>
                  <Button onClick={addLink} disabled={!linkUrl} className="w-full font-ge-ss">
                    إضافة الرابط
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={showYoutubeDialog} onOpenChange={setShowYoutubeDialog}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" title="إضافة يوتيوب">
                  <YoutubeIcon className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent dir={direction}>
                <DialogHeader>
                  <DialogTitle className="font-ge-ss">إضافة فيديو يوتيوب</DialogTitle>
                  <DialogDescription className="font-ge-ss">
                    أضف رابط فيديو من يوتيوب
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="youtube-url" className="font-ge-ss">رابط يوتيوب</Label>
                    <Input
                      id="youtube-url"
                      value={youtubeUrl}
                      onChange={(e) => setYoutubeUrl(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=..."
                      dir="ltr"
                    />
                  </div>
                  <Button onClick={addYoutubeVideo} disabled={!youtubeUrl} className="w-full font-ge-ss">
                    إضافة الفيديو
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={showTwitterDialog} onOpenChange={setShowTwitterDialog}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" title="إضافة تغريدة">
                  <Twitter className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent dir={direction}>
                <DialogHeader>
                  <DialogTitle className="font-ge-ss">إضافة تغريدة</DialogTitle>
                  <DialogDescription className="font-ge-ss">
                    أضف رابط تغريدة من تويتر
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="twitter-url" className="font-ge-ss">رابط التغريدة</Label>
                    <Input
                      id="twitter-url"
                      value={twitterUrl}
                      onChange={(e) => setTwitterUrl(e.target.value)}
                      placeholder="https://twitter.com/user/status/..."
                      dir="ltr"
                    />
                  </div>
                  <TwitterEmbed url={twitterUrl} onInsert={insertTwitterEmbed} />
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Undo/Redo */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              title="تراجع"
            >
              <Undo className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              title="إعادة"
            >
              <Redo className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Editor Content */}
      <div className="p-4">
        <EditorContent 
          editor={editor} 
          className="min-h-[300px] focus-within:outline-none prose prose-lg max-w-none font-ge-ss"
        />
      </div>

      {/* Footer with Stats */}
      <div className="border-t bg-gray-50 px-4 py-2 text-sm text-gray-600 font-ge-ss">
        <div className="flex justify-between items-center">
          <span>{wordCount} كلمة • {characterCount} حرف</span>
          <span className="text-xs">استخدم Ctrl+B للنص الغامق، Ctrl+I للمائل</span>
        </div>
      </div>
    </div>
  )
} 