import { useState } from 'react'
import { Download, ChevronDown, FileText, FileJson } from 'lucide-react'

/**
 * Reusable export dropdown button
 * Props:
 *   onExportCSV  - function to call for CSV export
 *   onExportJSON - function to call for JSON export (optional)
 *   label        - button label (default: "Export")
 *   disabled     - disable when no data
 *   count        - number of records (shown in label)
 */
export default function ExportButton({ onExportCSV, onExportJSON, label = 'Export', disabled = false, count }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        disabled={disabled}
        className="flex items-center gap-2 px-3.5 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-200 hover:border-gold hover:text-primary dark:hover:text-gold disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
      >
        <Download size={15} />
        {label}{count !== undefined ? ` (${count})` : ''}
        <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-1.5 w-44 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-20 overflow-hidden">
            <div className="px-3 py-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-gray-700">
              Export Format
            </div>
            <button
              onClick={() => { onExportCSV(); setOpen(false) }}
              className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <FileText size={15} className="text-green-600" />
              Download CSV
            </button>
            {onExportJSON && (
              <button
                onClick={() => { onExportJSON(); setOpen(false) }}
                className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <FileJson size={15} className="text-blue-600" />
                Download JSON
              </button>
            )}
          </div>
        </>
      )}
    </div>
  )
}
