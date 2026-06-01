import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { FileText, Mail, Users, PhoneCall, Clock, ArrowRight } from 'lucide-react'
import { StatCard, Card, Badge, Spinner } from '../components/shared/UI'

export default function DashboardPage() {
  const [stats, setStats] = useState({ blogs: 0, contacts: 0, subscribers: 0, callRequests: 0 })
  const [recentBlogs, setRecentBlogs] = useState([])
  const [recentContacts, setRecentContacts] = useState([])
  const [recentCalls, setRecentCalls] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [blogs, contacts, subscribers, calls, rBlogs, rContacts, rCalls] = await Promise.all([
        supabase.from('blogs').select('id', { count: 'exact', head: true }),
        supabase.from('contact_forms').select('id', { count: 'exact', head: true }),
        supabase.from('subscribers').select('id', { count: 'exact', head: true }),
        supabase.from('call_requests').select('id', { count: 'exact', head: true }),
        supabase.from('blogs').select('id,title,status,created_at').order('created_at', { ascending: false }).limit(5),
        supabase.from('contact_forms').select('id,name,email,subject,is_read,created_at').order('created_at', { ascending: false }).limit(5),
        supabase.from('call_requests').select('id,name,phone,service,status,created_at').order('created_at', { ascending: false }).limit(5),
      ])
      setStats({
        blogs: blogs.count ?? 0,
        contacts: contacts.count ?? 0,
        subscribers: subscribers.count ?? 0,
        callRequests: calls.count ?? 0,
      })
      setRecentBlogs(rBlogs.data ?? [])
      setRecentContacts(rContacts.data ?? [])
      setRecentCalls(rCalls.data ?? [])
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-display font-bold text-primary dark:text-white">Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Welcome back — here's your overview</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={FileText}  label="Total Blog Posts"    value={stats.blogs}       color="blue" />
        <StatCard icon={Mail}      label="Contact Requests"    value={stats.contacts}    color="gold" />
        <StatCard icon={PhoneCall} label="Call Requests"       value={stats.callRequests} color="purple" />
        <StatCard icon={Users}     label="Subscribers"         value={stats.subscribers} color="green" />
      </div>

      {/* Recent sections */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Recent Blogs */}
        <Card>
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
            <h2 className="font-semibold text-sm text-gray-800 dark:text-gray-200">Recent Blog Posts</h2>
            <Link to="/blogs" className="text-xs text-primary dark:text-gold hover:underline flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-gray-50 dark:divide-gray-800">
            {recentBlogs.length === 0 ? (
              <p className="text-xs text-center text-gray-400 py-8">No blog posts yet</p>
            ) : recentBlogs.map(b => (
              <div key={b.id} className="px-5 py-3 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{b.title}</p>
                  <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                    <Clock size={10} /> {new Date(b.created_at).toLocaleDateString()}
                  </p>
                </div>
                <Badge color={b.status === 'published' ? 'green' : 'gray'}>{b.status}</Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Contacts */}
        <Card>
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
            <h2 className="font-semibold text-sm text-gray-800 dark:text-gray-200">Recent Contacts</h2>
            <Link to="/contacts" className="text-xs text-primary dark:text-gold hover:underline flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-gray-50 dark:divide-gray-800">
            {recentContacts.length === 0 ? (
              <p className="text-xs text-center text-gray-400 py-8">No contact submissions</p>
            ) : recentContacts.map(c => (
              <div key={c.id} className="px-5 py-3 flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-xs font-bold text-primary dark:text-blue-400">
                  {c.name?.[0]?.toUpperCase() || '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{c.name}</p>
                  <p className="text-xs text-gray-400 truncate">{c.subject || c.email}</p>
                </div>
                {!c.is_read && <span className="w-2 h-2 rounded-full bg-gold shrink-0" />}
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Call Requests */}
        <Card>
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
            <h2 className="font-semibold text-sm text-gray-800 dark:text-gray-200">Recent Call Requests</h2>
            <Link to="/call-requests" className="text-xs text-primary dark:text-gold hover:underline flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-gray-50 dark:divide-gray-800">
            {recentCalls.length === 0 ? (
              <p className="text-xs text-center text-gray-400 py-8">No call requests</p>
            ) : recentCalls.map(c => (
              <div key={c.id} className="px-5 py-3 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{c.name}</p>
                  <p className="text-xs text-gray-400">{c.phone} · {c.service || '—'}</p>
                </div>
                <Badge color={c.status === 'completed' ? 'green' : c.status === 'pending' ? 'yellow' : 'gray'}>
                  {c.status || 'new'}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
