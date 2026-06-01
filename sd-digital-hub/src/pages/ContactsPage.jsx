import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { exportContactsCSV, exportContactsJSON } from '../lib/export'
import { Mail, Trash2, Eye, EyeOff, Search } from 'lucide-react'
import { Card, Badge, Spinner, EmptyState, PageHeader, ConfirmDialog } from '../components/shared/UI'
import ExportButton from '../components/shared/ExportButton'
import toast from 'react-hot-toast'

export default function ContactsPage() {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [delId, setDelId] = useState(null)
  const [selected, setSelected] = useState(null)

  async function load() {
    setLoading(true)
    const { data } = await supabase.from('contact_forms').select('*').order('created_at', { ascending: false })
    setContacts(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function markRead(id, val) {
    await supabase.from('contact_forms').update({ is_read: val }).eq('id', id)
    setContacts(c => c.map(x => x.id === id ? { ...x, is_read: val } : x))
  }

  async function deleteContact() {
    const { error } = await supabase.from('contact_forms').delete().eq('id', delId)
    if (error) toast.error('Failed to delete')
    else { toast.success('Deleted'); setContacts(c => c.filter(x => x.id !== delId)) }
    setDelId(null)
  }

  const filtered = contacts.filter(c =>
    !search || [c.name, c.email, c.subject, c.message].some(f => f?.toLowerCase().includes(search.toLowerCase()))
  )
  const unread = contacts.filter(c => !c.is_read).length

  return (
    <div>
      <PageHeader
        title="Contact Forms"
        subtitle={`${contacts.length} total${unread > 0 ? ` · ${unread} unread` : ''}`}
        actions={
          <ExportButton
            onExportCSV={() => { exportContactsCSV(filtered); toast.success(`Exported ${filtered.length} contacts`) }}
            onExportJSON={() => { exportContactsJSON(filtered); toast.success('JSON downloaded') }}
            count={filtered.length}
            disabled={filtered.length === 0}
          />
        }
      />

      {/* Search */}
      <div className="relative mb-4">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search contacts..."
          className="w-full sm:w-72 pl-9 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:border-primary"
        />
      </div>

      <Card>
        {loading ? (
          <div className="flex justify-center py-16"><Spinner /></div>
        ) : filtered.length === 0 ? (
          <EmptyState icon={Mail} title="No contact submissions" description="Contact form submissions will appear here." />
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {filtered.map(c => (
              <div key={c.id} className={`px-5 py-4 flex items-start gap-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${!c.is_read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}>
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0 font-bold text-primary dark:text-blue-400 text-sm mt-0.5">
                  {c.name?.[0]?.toUpperCase() || '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm text-gray-900 dark:text-white">{c.name}</span>
                    <span className="text-xs text-gray-400">{c.email}</span>
                    {c.phone && <span className="text-xs text-gray-400">{c.phone}</span>}
                    {!c.is_read && <Badge color="gold">New</Badge>}
                  </div>
                  {c.subject && <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-0.5">{c.subject}</p>}
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{c.message}</p>
                  <p className="text-xs text-gray-400 mt-1.5">{new Date(c.created_at).toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => markRead(c.id, !c.is_read)}
                    className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-primary transition-colors"
                    title={c.is_read ? 'Mark unread' : 'Mark read'}
                  >
                    {c.is_read ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                  <button
                    onClick={() => setDelId(c.id)}
                    className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <ConfirmDialog
        open={!!delId}
        title="Delete Contact"
        description="This will permanently delete this contact submission."
        onConfirm={deleteContact}
        onCancel={() => setDelId(null)}
      />
    </div>
  )
}
