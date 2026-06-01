/**
 * Export utility for SD Digital Hub Admin Panel
 * Supports CSV and JSON export for: contacts, subscribers, call_requests
 */

// Convert array of objects to CSV string
export function toCSV(data, columns) {
  if (!data || data.length === 0) return ''

  const headers = columns.map(c => `"${c.label}"`).join(',')
  const rows = data.map(row =>
    columns.map(c => {
      const val = row[c.key] ?? ''
      // Escape quotes and wrap in quotes
      return `"${String(val).replace(/"/g, '""')}"`
    }).join(',')
  )
  return [headers, ...rows].join('\n')
}

// Trigger browser download
export function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// Format date for filename
function fileDate() {
  return new Date().toISOString().slice(0, 10)
}

// ─── CONTACTS EXPORT ───────────────────────────────────────────────────────────
const CONTACT_COLUMNS = [
  { key: 'id',         label: 'ID' },
  { key: 'name',       label: 'Name' },
  { key: 'email',      label: 'Email' },
  { key: 'phone',      label: 'Phone' },
  { key: 'subject',    label: 'Subject' },
  { key: 'message',    label: 'Message' },
  { key: 'is_read',    label: 'Read' },
  { key: 'created_at', label: 'Submitted At' },
]

export function exportContactsCSV(data) {
  const csv = toCSV(data, CONTACT_COLUMNS)
  downloadFile(csv, `contacts_${fileDate()}.csv`, 'text/csv;charset=utf-8;')
}

export function exportContactsJSON(data) {
  downloadFile(JSON.stringify(data, null, 2), `contacts_${fileDate()}.json`, 'application/json')
}

// ─── SUBSCRIBERS EXPORT ────────────────────────────────────────────────────────
const SUBSCRIBER_COLUMNS = [
  { key: 'id',           label: 'ID' },
  { key: 'email',        label: 'Email' },
  { key: 'name',         label: 'Name' },
  { key: 'status',       label: 'Status' },
  { key: 'subscribed_at',label: 'Subscribed At' },
  { key: 'created_at',   label: 'Created At' },
]

export function exportSubscribersCSV(data) {
  const csv = toCSV(data, SUBSCRIBER_COLUMNS)
  downloadFile(csv, `subscribers_${fileDate()}.csv`, 'text/csv;charset=utf-8;')
}

export function exportSubscribersJSON(data) {
  downloadFile(JSON.stringify(data, null, 2), `subscribers_${fileDate()}.json`, 'application/json')
}

// ─── CALL REQUESTS EXPORT ──────────────────────────────────────────────────────
const CALL_COLUMNS = [
  { key: 'id',           label: 'ID' },
  { key: 'name',         label: 'Name' },
  { key: 'email',        label: 'Email' },
  { key: 'phone',        label: 'Phone' },
  { key: 'preferred_time', label: 'Preferred Time' },
  { key: 'service',      label: 'Service' },
  { key: 'message',      label: 'Message' },
  { key: 'status',       label: 'Status' },
  { key: 'is_read',      label: 'Read' },
  { key: 'created_at',   label: 'Requested At' },
]

export function exportCallRequestsCSV(data) {
  const csv = toCSV(data, CALL_COLUMNS)
  downloadFile(csv, `call_requests_${fileDate()}.csv`, 'text/csv;charset=utf-8;')
}

export function exportCallRequestsJSON(data) {
  downloadFile(JSON.stringify(data, null, 2), `call_requests_${fileDate()}.json`, 'application/json')
}

// ─── BLOGS EXPORT ──────────────────────────────────────────────────────────────
const BLOG_COLUMNS = [
  { key: 'id',               label: 'ID' },
  { key: 'title',            label: 'Title' },
  { key: 'slug',             label: 'Slug' },
  { key: 'category',         label: 'Category' },
  { key: 'status',           label: 'Status' },
  { key: 'seo_title',        label: 'SEO Title' },
  { key: 'meta_description', label: 'Meta Description' },
  { key: 'focus_keyword',    label: 'Focus Keyword' },
  { key: 'created_at',       label: 'Created At' },
  { key: 'updated_at',       label: 'Updated At' },
]

export function exportBlogsCSV(data) {
  const csv = toCSV(data, BLOG_COLUMNS)
  downloadFile(csv, `blogs_${fileDate()}.csv`, 'text/csv;charset=utf-8;')
}

export function exportBlogsJSON(data) {
  downloadFile(JSON.stringify(data, null, 2), `blogs_${fileDate()}.json`, 'application/json')
}
