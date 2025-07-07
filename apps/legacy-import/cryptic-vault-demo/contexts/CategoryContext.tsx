'use client';

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from 'react';
// Keeping clusterPalette import for potential colors but not needed for initialization

interface CategoryContextType {
  activeCategories: Set<string>;
  setActiveCategories: (categories: Set<string>) => void;
  isNodeVisible: (type: string | undefined) => boolean;
}

const CategoryContext = createContext<CategoryContextType | undefined>(
  undefined,
);

export function CategoryProvider({ children }: { children: ReactNode }) {
  // Start with an empty set which means "no filters applied" (show all)
  const [activeCategories, setActiveCategories] = useState<Set<string>>(
    () => new Set(),
  );

  const isNodeVisible = useCallback(
    (type: string | undefined): boolean => {
      if (!type) return true; // Show nodes without a type
      // If no filters selected, show everything
      if (activeCategories.size === 0) return true;
      return activeCategories.has(type);
    },
    [activeCategories],
  );

  return (
    <CategoryContext.Provider
      value={{ activeCategories, setActiveCategories, isNodeVisible }}
    >
      {children}
    </CategoryContext.Provider>
  );
}

export function useCategory() {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error('useCategory must be used within a CategoryProvider');
  }
  return context;
}
