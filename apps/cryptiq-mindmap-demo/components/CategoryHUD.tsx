import { useState, useEffect, useCallback, useMemo } from 'react';

// Node type colors for consistent theming
const NODE_TYPE_COLORS: Record<string, string> = {
  Technology: '#3b82f6',
  Science: '#10b981',
  Business: '#f59e0b',
  Design: '#ec4899',
  Research: '#8b5cf6',
  Development: '#06b6d4',
  Strategy: '#f97316',
  Analytics: '#6366f1',
};

interface CategoryNode {
  label?: string;
}

export interface CategoryHUDProps {
  nodes: CategoryNode[];
  /**
   * Called every time the active categories set changes.
   * The callback receives a Set<string> with the active category names.
   */
  onCategoriesChange?: (active: Set<string>) => void;
}

/**
 * CategoryHUD renders a bottom-right floating panel with category toggle chips and a
 * "Reset filters" button for filtering node visibility by category.
 */
export default function CategoryHUD({
  nodes,
  onCategoriesChange,
}: CategoryHUDProps) {
  // Extract unique categories from nodes
  const categories = useMemo<string[]>(() => {
    const categorySet = new Set<string>();
    nodes.forEach(node => {
      if (node.label && typeof node.label === 'string') {
        // Extract category from node labels like "Technology Topic 1"
        const match = node.label.match(/^(Technology|Science|Business|Design|Research|Development|Strategy|Analytics)/);
        if (match) {
          categorySet.add(match[1]);
        }
      }
    });
    return Array.from(categorySet).sort();
  }, [nodes]);

  const [activeCategories, setActiveCategories] = useState<Set<string>>(
    () => new Set(categories),
  );

  // Inform parent component whenever activeCategories changes
  useEffect(() => {
    onCategoriesChange?.(new Set(activeCategories));
  }, [activeCategories, onCategoriesChange]);

  /**
   * Toggle the active state of a single category chip.
   */
  const handleToggle = useCallback((category: string) => {
    setActiveCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  }, []);

  /**
   * Reset all chips to the active state.
   */
  const handleReset = useCallback(() => {
    setActiveCategories(new Set(categories));
  }, [categories]);

  return (
    <div
      className="flex flex-col items-end gap-2 text-sm select-none"
      style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 100 }}
    >
      {/* Chips container */}
      <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-lg p-3 flex flex-wrap gap-2 justify-end max-w-xs">
        {categories.map((category) => {
          const isActive = activeCategories.has(category);
          const color = NODE_TYPE_COLORS[category] || '#94a3b8';
          
          return (
            <button
              key={category}
              onClick={() => handleToggle(category)}
              className={`px-3 py-1 rounded-full font-medium transition-all duration-200 border-2 text-xs whitespace-nowrap
                ${
                  isActive
                    ? 'shadow-lg transform scale-105'
                    : 'opacity-60 hover:opacity-80'
                }
              `}
              style={{
                backgroundColor: isActive ? color : 'transparent',
                borderColor: color,
                color: isActive ? '#0F172A' : color,
              }}
            >
              {category}
            </button>
          );
        })}
      </div>

      {/* Reset button */}
      {categories.length > 0 && (
        <button
          onClick={handleReset}
          className="mt-2 bg-slate-800/80 backdrop-blur-md border border-slate-700/50 text-slate-300 hover:bg-slate-700/80 rounded-md px-3 py-1 text-xs transition-colors"
        >
          Reset filters
        </button>
      )}
    </div>
  );
}