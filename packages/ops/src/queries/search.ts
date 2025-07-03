import { Graph, IdeaNode, Edge } from '@refinery/schema'

/**
 * Search options
 */
export interface SearchOptions {
  /**
   * Case sensitive search (default: false)
   */
  caseSensitive?: boolean
  
  /**
   * Use regex for search (default: false)
   */
  regex?: boolean
  
  /**
   * Search in node labels (default: true)
   */
  searchLabels?: boolean
  
  /**
   * Search in node content (default: true)
   */
  searchContent?: boolean
  
  /**
   * Search in metadata (default: false)
   */
  searchMetadata?: boolean
  
  /**
   * Maximum results to return (default: Infinity)
   */
  limit?: number
}

/**
 * Search result
 */
export interface SearchResult<T> {
  /**
   * The matched item
   */
  item: T
  
  /**
   * Relevance score (0-1)
   */
  score: number
  
  /**
   * Matched fields
   */
  matches: {
    field: string
    value: string
    indices?: [number, number][]
  }[]
}

/**
 * Search for nodes by text query
 * 
 * @param graph - The graph to search
 * @param query - Search query
 * @param options - Search options
 * @returns Array of search results
 */
export function searchNodes(
  graph: Graph,
  query: string,
  options: SearchOptions = {}
): SearchResult<IdeaNode>[] {
  const {
    caseSensitive = false,
    regex = false,
    searchLabels = true,
    searchContent = true,
    searchMetadata = false,
    limit = Infinity
  } = options
  
  if (!query) {
    return []
  }
  
  const results: SearchResult<IdeaNode>[] = []
  const searchTerm = caseSensitive ? query : query.toLowerCase()
  const searchRegex = regex ? new RegExp(query, caseSensitive ? 'g' : 'gi') : null
  
  for (const node of graph.nodes) {
    const matches: SearchResult<IdeaNode>['matches'] = []
    let score = 0
    
    // Search in label
    if (searchLabels && node.label) {
      const label = caseSensitive ? node.label : node.label.toLowerCase()
      const labelMatches = searchRegex 
        ? findRegexMatches(node.label, searchRegex)
        : findStringMatches(label, searchTerm)
      
      if (labelMatches.length > 0) {
        matches.push({
          field: 'label',
          value: node.label,
          indices: labelMatches
        })
        score += 0.5 * (labelMatches.length / label.length)
      }
    }
    
    // Search in content
    if (searchContent && node.content) {
      const content = caseSensitive ? node.content : node.content.toLowerCase()
      const contentMatches = searchRegex
        ? findRegexMatches(node.content, searchRegex)
        : findStringMatches(content, searchTerm)
      
      if (contentMatches.length > 0) {
        matches.push({
          field: 'content',
          value: node.content,
          indices: contentMatches
        })
        score += 0.3 * (contentMatches.length / content.length)
      }
    }
    
    // Search in metadata
    if (searchMetadata && node.metadata) {
      const metadataMatches = searchInObject(
        node.metadata,
        searchTerm,
        searchRegex,
        caseSensitive
      )
      
      for (const match of metadataMatches) {
        matches.push({
          field: `metadata.${match.path}`,
          value: match.value,
          indices: match.indices
        })
        score += 0.2 * (match.indices.length / match.value.length)
      }
    }
    
    if (matches.length > 0) {
      results.push({
        item: node,
        score: Math.min(1, score),
        matches
      })
    }
    
    if (results.length >= limit) {
      break
    }
  }
  
  // Sort by relevance score
  results.sort((a, b) => b.score - a.score)
  
  return results.slice(0, limit)
}

/**
 * Search for edges by text query
 * 
 * @param graph - The graph to search
 * @param query - Search query
 * @param options - Search options
 * @returns Array of search results
 */
export function searchEdges(
  graph: Graph,
  query: string,
  options: SearchOptions = {}
): SearchResult<Edge>[] {
  const {
    caseSensitive = false,
    regex = false,
    searchLabels = true,
    searchMetadata = false,
    limit = Infinity
  } = options
  
  if (!query) {
    return []
  }
  
  const results: SearchResult<Edge>[] = []
  const searchTerm = caseSensitive ? query : query.toLowerCase()
  const searchRegex = regex ? new RegExp(query, caseSensitive ? 'g' : 'gi') : null
  
  for (const edge of graph.edges) {
    const matches: SearchResult<Edge>['matches'] = []
    let score = 0
    
    // Search in label
    if (searchLabels && edge.label) {
      const label = caseSensitive ? edge.label : edge.label.toLowerCase()
      const labelMatches = searchRegex
        ? findRegexMatches(edge.label, searchRegex)
        : findStringMatches(label, searchTerm)
      
      if (labelMatches.length > 0) {
        matches.push({
          field: 'label',
          value: edge.label,
          indices: labelMatches
        })
        score += 0.7 * (labelMatches.length / label.length)
      }
    }
    
    // Search in metadata
    if (searchMetadata && edge.metadata) {
      const metadataMatches = searchInObject(
        edge.metadata,
        searchTerm,
        searchRegex,
        caseSensitive
      )
      
      for (const match of metadataMatches) {
        matches.push({
          field: `metadata.${match.path}`,
          value: match.value,
          indices: match.indices
        })
        score += 0.3 * (match.indices.length / match.value.length)
      }
    }
    
    if (matches.length > 0) {
      results.push({
        item: edge,
        score: Math.min(1, score),
        matches
      })
    }
    
    if (results.length >= limit) {
      break
    }
  }
  
  // Sort by relevance score
  results.sort((a, b) => b.score - a.score)
  
  return results.slice(0, limit)
}

/**
 * Fuzzy search for nodes
 * Allows for typos and partial matches
 * 
 * @param graph - The graph to search
 * @param query - Search query
 * @param threshold - Minimum similarity score (0-1, default: 0.6)
 * @param options - Search options
 * @returns Array of search results
 */
export function fuzzySearchNodes(
  graph: Graph,
  query: string,
  threshold: number = 0.6,
  options: Omit<SearchOptions, 'regex'> = {}
): SearchResult<IdeaNode>[] {
  const {
    caseSensitive = false,
    searchLabels = true,
    searchContent = true,
    limit = Infinity
  } = options
  
  if (!query) {
    return []
  }
  
  const results: SearchResult<IdeaNode>[] = []
  const searchTerm = caseSensitive ? query : query.toLowerCase()
  
  for (const node of graph.nodes) {
    const matches: SearchResult<IdeaNode>['matches'] = []
    let maxScore = 0
    
    // Search in label
    if (searchLabels && node.label) {
      const label = caseSensitive ? node.label : node.label.toLowerCase()
      const similarity = calculateSimilarity(searchTerm, label)
      
      if (similarity >= threshold) {
        matches.push({
          field: 'label',
          value: node.label
        })
        maxScore = Math.max(maxScore, similarity)
      }
    }
    
    // Search in content
    if (searchContent && node.content) {
      const content = caseSensitive ? node.content : node.content.toLowerCase()
      // Check each word in content
      const words = content.split(/\s+/)
      let bestWordScore = 0
      
      for (const word of words) {
        const similarity = calculateSimilarity(searchTerm, word)
        if (similarity >= threshold) {
          bestWordScore = Math.max(bestWordScore, similarity)
        }
      }
      
      if (bestWordScore > 0) {
        matches.push({
          field: 'content',
          value: node.content
        })
        maxScore = Math.max(maxScore, bestWordScore * 0.8) // Weight content slightly lower
      }
    }
    
    if (matches.length > 0) {
      results.push({
        item: node,
        score: maxScore,
        matches
      })
    }
    
    if (results.length >= limit) {
      break
    }
  }
  
  // Sort by relevance score
  results.sort((a, b) => b.score - a.score)
  
  return results.slice(0, limit)
}

/**
 * Find string matches in text
 */
function findStringMatches(text: string, searchTerm: string): [number, number][] {
  const matches: [number, number][] = []
  let index = text.indexOf(searchTerm)
  
  while (index !== -1) {
    matches.push([index, index + searchTerm.length])
    index = text.indexOf(searchTerm, index + 1)
  }
  
  return matches
}

/**
 * Find regex matches in text
 */
function findRegexMatches(text: string, regex: RegExp): [number, number][] {
  const matches: [number, number][] = []
  let match: RegExpExecArray | null
  
  // Reset regex
  regex.lastIndex = 0
  
  while ((match = regex.exec(text)) !== null) {
    matches.push([match.index, match.index + match[0].length])
  }
  
  return matches
}

/**
 * Search in object recursively
 */
function searchInObject(
  obj: Record<string, unknown>,
  searchTerm: string,
  searchRegex: RegExp | null,
  caseSensitive: boolean,
  path: string = ''
): Array<{ path: string; value: string; indices: [number, number][] }> {
  const results: Array<{ path: string; value: string; indices: [number, number][] }> = []
  
  for (const [key, value] of Object.entries(obj)) {
    const currentPath = path ? `${path}.${key}` : key
    
    if (typeof value === 'string') {
      const text = caseSensitive ? value : value.toLowerCase()
      const matches = searchRegex
        ? findRegexMatches(value, searchRegex)
        : findStringMatches(text, searchTerm)
      
      if (matches.length > 0) {
        results.push({
          path: currentPath,
          value,
          indices: matches
        })
      }
    } else if (value && typeof value === 'object' && !Array.isArray(value)) {
      results.push(...searchInObject(
        value as Record<string, unknown>,
        searchTerm,
        searchRegex,
        caseSensitive,
        currentPath
      ))
    }
  }
  
  return results
}

/**
 * Calculate similarity between two strings (Levenshtein distance based)
 */
function calculateSimilarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2
  const shorter = str1.length > str2.length ? str2 : str1
  
  if (longer.length === 0) {
    return 1.0
  }
  
  const editDistance = levenshteinDistance(longer, shorter)
  return (longer.length - editDistance) / longer.length
}

/**
 * Calculate Levenshtein distance between two strings
 */
function levenshteinDistance(str1: string, str2: string): number {
  const matrix: number[][] = []
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i]
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        )
      }
    }
  }
  
  return matrix[str2.length][str1.length]
}