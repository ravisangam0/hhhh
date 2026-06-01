import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { exportBlogsCSV, exportBlogsJSON } from '../lib/export'
import { FileText, Plus, Pencil, Trash2, Search, Eye } from 'lucide-react'
import { Card, Badge, Spinner, EmptyState, PageHeader, ConfirmDialog } from '../components/shared/UI'
import ExportButton from '../components/shared/ExportButton'
import toast from 'react-hot-toast'

export default function BlogsPage() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [delId, setDelId] = useState(null)
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    supabase.from('blogs').select('id,title,slug,category,status,seo_title,created_at,updated_at')
      .order('created_at', { ascending: false })
      .then(({ data }) => { setBlogs(data ?? []); setLoading(false) })
  }, [])

  async function deleteBlog() {
    const { error } = await supabase.from('blogs').delete().eq('id', delId)
    if (error) toast.error('Failed to delete')
    else { toast.success('Blog deleted'); setBlogs(b => b.filter(x => x.id !== delId)) }
    setDelId(null)
  }

  const filtered = blogs
    .filter(b => filterStatus === 'all' || b.status === filterStatus)
    .filter(b => !search || [b.title, b.slug, b.category].some(f => f?.toLowerCase().includes(search.toLowerCase())))

  return (
    <div>
      <PageHeader
        title="Blog Posts"
        subtitle={`${blogs.length} total posts`}
        actions={
          <div className="flex items-center gap-2">
            <ExportButton
              onExportCSV={() => { exportBlogsCSV(filtered); toast.success(`Exported ${filtered.length} blogs`) }}
              onExportJSON={() => { exportBlogsJSON(filtered); toast.success('JSON downloaded') }}
              count={filtered.length}
              disabled={filtered.length === 0}
            />
            <Link
              to="/blogs/new"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-primary hover:bg-primary-light text-white text-sm font-medium shadow-sm hover:shadow-md transition-all"
            >
              <Plus size={16} /> New Post
            </Link>
          </div>
        }
      />

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search blogs..."
            className="w-full sm:w-64 pl-9 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:border-primary"
          />
        </div>
        <div className="flex gap-1.5">
          {['all', 'published', 'draft'].map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                filterStatus === s
                  ? 'bg-primary text-white'
                  : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-primary hover:text-primary'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <Card>
        {loading ? (
          <div className="flex justify-center py-16"><Spinner /></div>
        ) : filtered.length === 0 ? (
          <EmptyState icon={FileText} title="No blog posts" description="Create your first blog post to get started." />
        ) : (
          <>
            <div className="hidden sm:grid grid-cols-[1fr_140px_100px_120px_80px] gap-4 px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide border-b border-gray-100 dark:border-gray-800">
              <span>Title</span><span>Category</span><span>Status</span><span>Date</span><span />
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {filtered.map(b => (
                <div key={b.id} className="grid sm:grid-cols-[1fr_140px_100px_120px_80px] gap-2 sm:gap-4 items-center px-5 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <div className="min-w-0">
                    <p className="font-medium text-sm text-gray-900 dark:text-white truncate">{b.title}</p>
                    <p className="text-xs text-gray-400 font-mono truncate">/blog/{b.slug}</p>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400 truncate">{b.category || '—'}</span>
                  <Badge color={b.status === 'published' ? 'green' : 'gray'}>{b.status}</Badge>
                  <span className="text-xs text-gray-400">{new Date(b.created_at).toLocaleDateString()}</span>
                  <div className="flex items-center gap-1 justify-end">
                    <Link to={`/blogs/edit/${b.id}`} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-primary transition-colors">
                      <Pencil size={14} />
                    </Link>
                    <button onClick={() => setDelId(b.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </Card>

      <ConfirmDialog
        open={!!delId}
        title="Delete Blog Post"
        description="This blog post will be permanently deleted and cannot be recovered."
        onConfirm={deleteBlog}
        onCancel={() => setDelId(null)}
      />
    </div>
  )
}
