import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { exportSubscribersCSV, exportSubscribersJSON } from '../lib/export'
import { Users, Trash2, Search } from 'lucide-react'
import { Card, Badge, Spinner, EmptyState, PageHeader, ConfirmDialog } from '../components/shared/UI'
import ExportButton from '../components/shared/ExportButton'
import toast from 'react-hot-toast'

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [delId, setDelId] = useState(null)

  useEffect(() => {
    supabase.from('subscribers').select('*').order('created_at', { ascending: false })
      .then(({ data }) => { setSubscribers(data ?? []); setLoading(false) })
  }, [])

  async function deleteSub() {
    const { error } = await supabase.from('subscribers').delete().eq('id', delId)
    if (error) toast.error('Failed to delete')
    else { toast.success('Subscriber removed'); setSubscribers(s => s.filter(x => x.id !== delId)) }
    setDelId(null)
  }

  const filtered = subscribers.filter(s =>
    !search || [s.email, s.name].some(f => f?.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div>
      <PageHeader
        title="Subscribers"
        subtitle={`${subscribers.length} total subscribers`}
        actions={
          <ExportButton
            onExportCSV={() => { exportSubscribersCSV(filtered); toast.success(`Exported ${filtered.length} subscribers`) }}
            onExportJSON={() => { exportSubscribersJSON(filtered); toast.success('JSON downloaded') }}
            count={filtered.length}
            disabled={filtered.length === 0}
          />
        }
      />

      <div className="relative mb-4">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search subscribers..."
          className="w-full sm:w-72 pl-9 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:border-primary"
        />
      </div>

      <Card>
        {loading ? (
          <div className="flex justify-center py-16"><Spinner /></div>
        ) : filtered.length === 0 ? (
          <EmptyState icon={Users} title="No subscribers yet" description="Newsletter subscribers will appear here." />
        ) : (
          <>
            {/* Table header */}
            <div className="hidden sm:grid grid-cols-[1fr_1fr_100px_80px_44px] gap-4 px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide border-b border-gray-100 dark:border-gray-800">
              <span>Email</span><span>Name</span><span>Status</span><span>Date</span><span />
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {filtered.map(s => (
                <div key={s.id} className="grid sm:grid-cols-[1fr_1fr_100px_80px_44px] gap-2 sm:gap-4 items-center px-5 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <span className="text-sm font-medium text-gray-900 dark:text-white break-all">{s.email}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{s.name || '—'}</span>
                  <Badge color={s.status === 'active' ? 'green' : 'gray'}>{s.status || 'active'}</Badge>
                  <span className="text-xs text-gray-400">{new Date(s.created_at).toLocaleDateString()}</span>
                  <button
                    onClick={() => setDelId(s.id)}
                    className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors justify-self-end"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </Card>

      <ConfirmDialog
        open={!!delId}
        title="Remove Subscriber"
        description="This subscriber will be permanently removed."
        onConfirm={deleteSub}
        onCancel={() => setDelId(null)}
      />
    </div>
  )
}
