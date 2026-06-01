import { AlertCircle, CheckCircle } from 'lucide-react'

function Counter({ value = '', max, label }) {
  const len = value.length
  const ok = len >= (label === 'SEO Title' ? 30 : 120) && len <= max
  const warn = len > max
  return (
    <div className={`flex justify-between text-xs mt-1 ${warn ? 'text-red-500' : ok ? 'text-green-600' : 'text-gray-400'}`}>
      <span>{label} length</span>
      <span>{len} / {max}</span>
    </div>
  )
}

function Field({ label, required, hint, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  )
}

export default function SEOPanel({ data, onChange }) {
  const set = (key, val) => onChange({ ...data, [key]: val })

  const warnings = []
  if (!data.seo_title) warnings.push('SEO Title is missing')
  else if (data.seo_title.length < 30) warnings.push('SEO Title is too short (min 30 chars)')
  else if (data.seo_title.length > 60) warnings.push('SEO Title is too long (max 60 chars)')
  if (!data.meta_description) warnings.push('Meta Description is missing')
  else if (data.meta_description.length < 120) warnings.push('Meta Description is too short (min 120 chars)')
  else if (data.meta_description.length > 160) warnings.push('Meta Description is too long (max 160 chars)')
  if (!data.focus_keyword) warnings.push('Focus Keyword is missing')

  return (
    <div className="space-y-4">
      {/* Warnings */}
      {warnings.length > 0 ? (
        <div className="rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-900/20 p-3.5">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle size={15} className="text-amber-500 shrink-0" />
            <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">SEO Warnings ({warnings.length})</span>
          </div>
          <ul className="space-y-1">
            {warnings.map(w => <li key={w} className="text-xs text-amber-600 dark:text-amber-400 flex items-start gap-1.5"><span className="mt-0.5">•</span>{w}</li>)}
          </ul>
        </div>
      ) : (
        <div className="rounded-xl border border-green-200 dark:border-green-900/50 bg-green-50 dark:bg-green-900/20 p-3 flex items-center gap-2">
          <CheckCircle size={15} className="text-green-500" />
          <span className="text-xs font-semibold text-green-700 dark:text-green-400">SEO looks good!</span>
        </div>
      )}

      <Field label="SEO Title" required hint="Shown in search engine results (30–60 chars recommended)">
        <input
          value={data.seo_title || ''}
          onChange={e => set('seo_title', e.target.value)}
          placeholder="Enter SEO title..."
          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
        />
        <Counter value={data.seo_title} max={60} label="SEO Title" />
      </Field>

      <Field label="Meta Description" required hint="Shown as snippet in search results (120–160 chars)">
        <textarea
          value={data.meta_description || ''}
          onChange={e => set('meta_description', e.target.value)}
          placeholder="Write a compelling meta description..."
          rows={3}
          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
        />
        <Counter value={data.meta_description} max={160} label="Meta Description" />
      </Field>

      <Field label="Focus Keyword" hint="Primary keyword this blog targets">
        <input
          value={data.focus_keyword || ''}
          onChange={e => set('focus_keyword', e.target.value)}
          placeholder="e.g. business website design"
          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
        />
      </Field>

      <Field label="Canonical URL" hint="Leave blank to auto-generate from slug">
        <input
          value={data.canonical_url || ''}
          onChange={e => set('canonical_url', e.target.value)}
          placeholder="https://yourdomain.com/blog/post-slug"
          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm font-mono focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
        />
      </Field>

      <Field label="Meta Robots">
        <select
          value={data.meta_robots || 'index, follow'}
          onChange={e => set('meta_robots', e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:border-primary transition-all"
        >
          <option>index, follow</option>
          <option>noindex, follow</option>
          <option>index, nofollow</option>
          <option>noindex, nofollow</option>
        </select>
      </Field>

      {/* Preview */}
      {(data.seo_title || data.meta_description) && (
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Search Preview</p>
          <div className="space-y-0.5">
            <p className="text-[13px] font-medium text-blue-700 dark:text-blue-400 truncate">{data.seo_title || 'SEO Title'}</p>
            <p className="text-[11px] text-green-700 dark:text-green-500 truncate">https://yourdomain.com/blog/{data.slug || 'post-slug'}</p>
            <p className="text-[12px] text-gray-600 dark:text-gray-400 line-clamp-2">{data.meta_description || 'Meta description will appear here...'}</p>
          </div>
        </div>
      )}
    </div>
  )
}
