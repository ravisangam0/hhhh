export function Badge({ children, color = 'gray' }) {
  const colors = {
    gray:   'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
    green:  'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    blue:   'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    yellow: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    red:    'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
    gold:   'bg-yellow-50 text-yellow-700 border border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400',
  }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold ${colors[color]}`}>
      {children}
    </span>
  )
}

export function Card({ children, className = '' }) {
  return (
    <div className={`bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm ${className}`}>
      {children}
    </div>
  )
}

export function Spinner({ size = 'md' }) {
  const s = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-10 h-10' : 'w-6 h-6'
  return <div className={`${s} border-2 border-primary border-t-transparent rounded-full animate-spin`} />
}

export function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className="text-center py-16 px-4">
      {Icon && <Icon size={40} className="mx-auto text-gray-300 dark:text-gray-700 mb-3" />}
      <h3 className="font-semibold text-gray-600 dark:text-gray-400 mb-1">{title}</h3>
      {description && <p className="text-sm text-gray-400 dark:text-gray-600">{description}</p>}
    </div>
  )
}

export function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
      <div>
        <h1 className="text-xl font-display font-bold text-primary dark:text-white">{title}</h1>
        {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 flex-wrap">{actions}</div>}
    </div>
  )
}

export function StatCard({ icon: Icon, label, value, color = 'blue' }) {
  const colors = {
    blue:   { bg: 'bg-blue-50 dark:bg-blue-900/20',   icon: 'text-blue-600 dark:text-blue-400' },
    gold:   { bg: 'bg-yellow-50 dark:bg-yellow-900/20', icon: 'text-yellow-600 dark:text-yellow-400' },
    green:  { bg: 'bg-green-50 dark:bg-green-900/20',  icon: 'text-green-600 dark:text-green-400' },
    purple: { bg: 'bg-purple-50 dark:bg-purple-900/20', icon: 'text-purple-600 dark:text-purple-400' },
  }
  const c = colors[color] || colors.blue
  return (
    <Card className="p-5">
      <div className="flex items-center gap-4">
        <div className={`w-11 h-11 rounded-xl ${c.bg} flex items-center justify-center shrink-0`}>
          <Icon size={20} className={c.icon} />
        </div>
        <div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{label}</div>
        </div>
      </div>
    </Card>
  )
}

export function ConfirmDialog({ open, title, description, onConfirm, onCancel, dangerous = true }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 w-full max-w-sm">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">{description}</p>
        <div className="flex gap-2 justify-end">
          <button onClick={onCancel} className="px-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm} className={`px-4 py-2 text-sm rounded-lg font-medium text-white transition-colors ${dangerous ? 'bg-red-500 hover:bg-red-600' : 'bg-primary hover:bg-primary-light'}`}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}
