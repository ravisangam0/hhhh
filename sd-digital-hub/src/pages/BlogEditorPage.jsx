import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import RichEditor from '../components/blog/RichEditor'
import SEOPanel from '../components/blog/SEOPanel'
import { Card, Spinner } from '../components/shared/UI'
import { Save, Eye, ArrowLeft, Loader2, Image as ImgIcon } from 'lucide-react'
import toast from 'react-hot-toast'

const CATEGORIES = ['Business', 'Marketing', 'Technology', 'Design', 'SEO', 'Social Media', 'Tips & Tricks', 'News', 'Other']

function slugify(str) {
  return str.toLowerCase().trim()
    .replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '')
}

const EMPTY_BLOG = {
  title: '', slug: '', category: '', featured_image: '', image_alt: '',
  content: '', status: 'draft',
  seo_title: '', meta_description: '', focus_keyword: '', canonical_url: '', meta_robots: 'index, follow',
}

export default function BlogEditorPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id
  const [blog, setBlog] = useState(EMPTY_BLOG)
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('content')

  useEffect(() => {
    if (!isEdit) return
    supabase.from('blogs').select('*').eq('id', id).single()
      .then(({ data, error }) => {
        if (error) { toast.error('Blog not found'); navigate('/blogs'); return }
        setBlog(data)
        setLoading(false)
      })
  }, [id])

  function set(key, val) {
    setBlog(prev => {
      const next = { ...prev, [key]: val }
      if (key === 'title' && !isEdit) next.slug = slugify(val)
      return next
    })
  }

  async function save(statusOverride) {
    const data = statusOverride ? { ...blog, status: statusOverride } : blog
    if (!data.title.trim()) { toast.error('Title is required'); return }
    if (!data.slug.trim()) { toast.error('Slug is required'); return }
    setSaving(true)
    const payload = { ...data, updated_at: new Date().toISOString() }
    const { error } = isEdit
      ? await supabase.from('blogs').update(payload).eq('id', id)
      : await supabase.from('blogs').insert([{ ...payload, created_at: new Date().toISOString() }])
    setSaving(false)
    if (error) toast.error(error.message || 'Save failed')
    else { toast.success(isEdit ? 'Blog updated!' : 'Blog created!'); navigate('/blogs') }
  }

  if (loading) return <div className="flex justify-center py-16"><Spinner size="lg" /></div>

  const inputCls = "w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/blogs')} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-xl font-display font-bold text-primary dark:text-white">
              {isEdit ? 'Edit Blog Post' : 'New Blog Post'}
            </h1>
            <p className="text-xs text-gray-400 font-mono mt-0.5">/blog/{blog.slug || 'slug-here'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={blog.status}
            onChange={e => set('status', e.target.value)}
            className="text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 focus:outline-none focus:border-primary"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
          <button
            onClick={() => save()}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary hover:bg-primary-light text-white text-sm font-medium disabled:opacity-60 transition-all shadow-sm"
          >
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            {saving ? 'Saving...' : 'Save'}
          </button>
          {blog.status === 'draft' && (
            <button
              onClick={() => save('published')}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gold hover:bg-gold-light text-primary text-sm font-semibold disabled:opacity-60 transition-all shadow-sm"
            >
              <Eye size={15} /> Publish
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-5 border-b border-gray-200 dark:border-gray-800">
        {['content', 'seo'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm font-medium capitalize transition-all border-b-2 -mb-px ${
              activeTab === tab
                ? 'border-primary text-primary dark:text-white'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            {tab === 'seo' ? 'SEO & Meta' : 'Content'}
          </button>
        ))}
      </div>

      {activeTab === 'content' && (
        <div className="grid lg:grid-cols-[1fr_280px] gap-5">
          {/* Main content */}
          <div className="space-y-4">
            <Card className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Blog Title *</label>
                <input value={blog.title} onChange={e => set('title', e.target.value)} placeholder="Enter blog title..." className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">URL Slug *</label>
                <div className="flex items-center">
                  <span className="px-3 py-2.5 bg-gray-100 dark:bg-gray-700 border border-r-0 border-gray-200 dark:border-gray-600 rounded-l-xl text-xs text-gray-500 font-mono">/blog/</span>
                  <input
                    value={blog.slug}
                    onChange={e => set('slug', slugify(e.target.value))}
                    placeholder="post-url-slug"
                    className="flex-1 px-3.5 py-2.5 rounded-r-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm font-mono focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
              </div>
            </Card>

            <Card className="p-2">
              <RichEditor content={blog.content} onChange={v => set('content', v)} />
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <Card className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Category</label>
                <select value={blog.category} onChange={e => set('category', e.target.value)} className={inputCls}>
                  <option value="">Select category...</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </Card>

            <Card className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
                  <ImgIcon size={12} className="inline mr-1" />Featured Image URL
                </label>
                <input value={blog.featured_image} onChange={e => set('featured_image', e.target.value)} placeholder="https://..." className={inputCls} />
                {blog.featured_image && (
                  <img src={blog.featured_image} alt="preview" className="mt-2 w-full h-32 object-cover rounded-lg" onError={e => e.target.style.display='none'} />
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Image Alt Text</label>
                <input value={blog.image_alt} onChange={e => set('image_alt', e.target.value)} placeholder="Describe the image..." className={inputCls} />
              </div>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'seo' && (
        <div className="max-w-2xl">
          <Card className="p-5">
            <SEOPanel
              data={{ ...blog }}
              onChange={updates => setBlog(prev => ({ ...prev, ...updates }))}
            />
          </Card>
        </div>
      )}
    </div>
  )
}
