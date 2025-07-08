'use client'

import { createContext, useContext, useReducer, type ReactNode, type Dispatch } from 'react'

// --- Types -------------------------------------------------------------
export interface InteractionState {
  activeLens: 'causal' | 'affinity' | 'temporal'
  masterGraphData?: any
  dialState?: any
  mouseSelectedNodeId?: string | null
  mouseHoveredNodeId?: string | null
  searchResultNodeIds?: string[]
  currentInteractionMode?: string
  gesturedNodeId?: string | null
  timelineDate?: string
  timeIndex: number
}

export type InteractionAction =
  | { type: 'SET_ACTIVE_LENS'; payload: { lens: InteractionState['activeLens'] } }
  | { type: 'SET_MASTER_GRAPH_DATA'; payload: any }
  | { type: 'SET_DIAL_STATE'; payload: any }
  | { type: 'MOUSE_SELECT_NODE'; payload: { nodeId: string | null } }
  | { type: 'SET_MOUSE_HOVERED_NODE'; payload: { nodeId: string | null } }
  | { type: 'SET_TIMELINE_DATE'; payload: { date: string } }
  | { type: 'SET_TIME_INDEX'; payload: { index: number } }

// --- Reducer -----------------------------------------------------------
const reducer = (state: InteractionState, action: InteractionAction): InteractionState => {
  switch (action.type) {
    case 'SET_ACTIVE_LENS':
      return { ...state, activeLens: action.payload.lens }
    case 'SET_MASTER_GRAPH_DATA':
      return { ...state, masterGraphData: action.payload }
    case 'SET_DIAL_STATE':
      return { ...state, dialState: action.payload }
    case 'MOUSE_SELECT_NODE':
      return { ...state, mouseSelectedNodeId: action.payload.nodeId }
    case 'SET_MOUSE_HOVERED_NODE':
      return { ...state, mouseHoveredNodeId: action.payload.nodeId }
    case 'SET_TIMELINE_DATE':
      return { ...state, timelineDate: action.payload.date }
    case 'SET_TIME_INDEX':
      return { ...state, timeIndex: action.payload.index }
    default:
      return state
  }
}

// --- Context -----------------------------------------------------------
const InteractionStateContext = createContext<InteractionState | undefined>(undefined)
const InteractionDispatchContext = createContext<Dispatch<InteractionAction> | undefined>(undefined)

// --- Provider ----------------------------------------------------------
export const InteractionProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, {
    activeLens: 'causal',
    timeIndex: 0,
  })

  return (
    <InteractionDispatchContext.Provider value={dispatch}>
      <InteractionStateContext.Provider value={state}>{children}</InteractionStateContext.Provider>
    </InteractionDispatchContext.Provider>
  )
}

// --- Hooks -------------------------------------------------------------
export const useInteractionDispatch = () => {
  const ctx = useContext(InteractionDispatchContext)
  if (!ctx) throw new Error('useInteractionDispatch must be used within InteractionProvider')
  return ctx
}

export const useInteractionState = () => {
  const ctx = useContext(InteractionStateContext)
  if (!ctx) throw new Error('useInteractionState must be used within InteractionProvider')
  return ctx
}

export const useTimeIndex = () => useInteractionState().timeIndex

// --- Action creators ---------------------------------------------------
export const setTimeIndex = (idx: number): InteractionAction => ({
  type: 'SET_TIME_INDEX',
  payload: { index: idx },
})
