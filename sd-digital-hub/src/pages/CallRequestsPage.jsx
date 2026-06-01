import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { exportCallRequestsCSV, exportCallRequestsJSON } from '../lib/export'
import { PhoneCall, Trash2, Eye, EyeOff, Search, CheckCircle } from 'lucide-react'
import { Card, Badge, Spinner, EmptyState, PageHeader, ConfirmDialog } from '../components/shared/UI'
import ExportButton from '../components/shared/ExportButton'
import toast from 'react-hot-toast'

const STATUS_COLORS = { pending: 'yellow', completed: 'green', cancelled: 'red', new: 'blue' }

export default function CallRequestsPage() {
  const [calls, setCalls] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [delId, setDelId] = useState(null)
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    supabase.from('call_requests').select('*').order('created_at', { ascending: false })
      .then(({ data }) => { setCalls(data ?? []); setLoading(false) })
  }, [])

  async function markRead(id, val) {
    await supabase.from('call_requests').update({ is_read: val }).eq('id', id)
    setCalls(c => c.map(x => x.id === id ? { ...x, is_read: val } : x))
  }

  async function updateStatus(id, status) {
    const { error } = await supabase.from('call_requests').update({ status }).eq('id', id)
    if (error) toast.error('Update failed')
    else { setCalls(c => c.map(x => x.id === id ? { ...x, status } : x)); toast.success('Status updated') }
  }

  async function deleteCall() {
    const { error } = await supabase.from('call_requests').delete().eq('id', delId)
    if (error) toast.error('Failed to delete')
    else { toast.success('Deleted'); setCalls(c => c.filter(x => x.id !== delId)) }
    setDelId(null)
  }

  const filtered = calls
    .filter(c => filterStatus === 'all' || (c.status || 'new') === filterStatus)
    .filter(c => !search || [c.name, c.email, c.phone, c.service, c.message].some(f => f?.toLowerCase().includes(search.toLowerCase())))

  const unread = calls.filter(c => !c.is_read).length

  return (
    <div>
      <PageHeader
        title="Call Requests"
        subtitle={`${calls.length} total${unread > 0 ? ` · ${unread} unread` : ''}`}
        actions={
          <ExportButton
            onExportCSV={() => { exportCallRequestsCSV(filtered); toast.success(`Exported ${filtered.length} call requests`) }}
            onExportJSON={() => { exportCallRequestsJSON(filtered); toast.success('JSON downloaded') }}
            count={filtered.length}
            disabled={filtered.length === 0}
          />
        }
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search call requests..."
            className="w-full sm:w-64 pl-9 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:border-primary"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {['all', 'new', 'pending', 'completed', 'cancelled'].map(s => (
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
          <EmptyState icon={PhoneCall} title="No call requests" description="Call back requests will appear here." />
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {filtered.map(c => (
              <div key={c.id} className={`px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${!c.is_read ? 'bg-blue-50/40 dark:bg-blue-900/10' : ''}`}>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shrink-0 font-bold text-purple-600 dark:text-purple-400 text-sm mt-0.5">
                    {c.name?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm text-gray-900 dark:text-white">{c.name}</span>
                      <span className="text-xs text-gray-400">{c.phone}</span>
                      {c.email && <span className="text-xs text-gray-400">{c.email}</span>}
                      {!c.is_read && <Badge color="gold">New</Badge>}
                      <Badge color={STATUS_COLORS[c.status || 'new'] || 'gray'}>{c.status || 'new'}</Badge>
                    </div>
                    {c.service && <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-0.5">Service: {c.service}</p>}
                    {c.preferred_time && <p className="text-xs text-gray-500 mt-0.5">Preferred time: {c.preferred_time}</p>}
                    {c.message && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{c.message}</p>}
                    <p className="text-xs text-gray-400 mt-1.5">{new Date(c.created_at).toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {/* Quick status update */}
                    <select
                      value={c.status || 'new'}
                      onChange={e => updateStatus(c.id, e.target.value)}
                      className="text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-2 py-1.5 focus:outline-none focus:border-primary"
                    >
                      <option value="new">New</option>
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <button onClick={() => markRead(c.id, !c.is_read)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-primary transition-colors" title={c.is_read ? 'Mark unread' : 'Mark read'}>
                      {c.is_read ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                    <button onClick={() => setDelId(c.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <ConfirmDialog
        open={!!delId}
        title="Delete Call Request"
        description="This call request will be permanently deleted."
        onConfirm={deleteCall}
        onCancel={() => setDelId(null)}
      />
    </div>
  )
}
