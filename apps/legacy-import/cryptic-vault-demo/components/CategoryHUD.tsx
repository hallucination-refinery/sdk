import { useState, useEffect, useCallback, useMemo } from 'react'
import { NODE_TYPE_COLORS } from '@/utils/clusterPalette'

// A simple color hash for consistent-ish button colors
const colorHash = (t: string) => NODE_TYPE_COLORS[t] || '#94a3b8'

export interface CategoryHUDProps {
  nodes: any[]
  /**
   * Called every time the active categories set changes.
   * The callback receives a Set<string> with the active cluster IDs.
   */
  onCategoriesChange?: (active: Set<string>) => void
}

/**
 * CategoryHUD renders a bottom-right floating panel with seven toggle chips and a
 * "Reset filters" button, as described in the Cryptic Vault PRD (F7).
 */
export default function CategoryHUD({ nodes, onCategoriesChange }: CategoryHUDProps) {
  const nodeTypes = useMemo<string[]>(() => {
    const types = new Set<string>(nodes.map((n) => n.type))
    return Array.from(types).sort()
  }, [nodes])

  const [activeCategories, setActiveCategories] = useState<Set<string>>(() => new Set(nodeTypes))

  // Inform parent component whenever activeCategories changes
  useEffect(() => {
    onCategoriesChange?.(new Set(activeCategories))
  }, [activeCategories, onCategoriesChange])

  /**
   * Toggle the active state of a single category chip.
   */
  const handleToggle = useCallback((categoryType: string) => {
    setActiveCategories((prev) => {
      const next = new Set(prev)
      if (next.has(categoryType)) {
        next.delete(categoryType)
      } else {
        next.add(categoryType)
      }
      return next
    })
  }, [])

  /**
   * Reset all chips to the active state.
   */
  const handleReset = useCallback(() => {
    setActiveCategories(new Set(nodeTypes))
  }, [nodeTypes])

  return (
    <div
      className="flex flex-col items-end gap-2 text-sm select-none"
      style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 100 }}
    >
      {/* Chips container */}
      <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-lg p-3 flex flex-wrap gap-2 justify-end max-w-xs">
        {nodeTypes.map((type) => {
          const isActive = activeCategories.has(type)
          const color = colorHash(type)
          const label = type.charAt(0).toUpperCase() + type.slice(1)
          return (
            <button
              key={type}
              onClick={() => handleToggle(type)}
              className={`px-3 py-1 rounded-full font-medium transition-all duration-200 border-2 text-xs whitespace-nowrap
                ${isActive ? 'shadow-lg transform scale-105' : 'opacity-60 hover:opacity-80'}
              `}
              style={{
                backgroundColor: isActive ? color : 'transparent',
                borderColor: color,
                color: isActive ? '#0F172A' : color,
              }}
            >
              {label}
            </button>
          )
        })}
      </div>

      {/* Reset button */}
      <button
        onClick={handleReset}
        className="mt-2 bg-slate-800/80 backdrop-blur-md border border-slate-700/50 text-slate-300 hover:bg-slate-700/80 rounded-md px-3 py-1 text-xs transition-colors"
      >
        Reset filters
      </button>
    </div>
  )
}
