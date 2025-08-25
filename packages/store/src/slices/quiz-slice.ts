import { produce } from 'immer'
import type { RendererCommand } from '../types/renderer-commands'
import type { Node } from '@refinery/schema'

export interface QuizPackOptionEffect {
  conceptKey: string
  deltaWeight: number
  category?: string
  label?: string
}

export interface QuizPackOption {
  id: string
  label?: string
  image?: string
  tags: string[]
  effects: QuizPackOptionEffect[]
}

export interface QuizQuestion {
  id: string
  type: 'choice' | 'image-choice' | 'slider'
  prompt: string
  options: QuizPackOption[]
}

export interface QuizArchetypeDef {
  key: string
  label: string
  group: 'Passion' | 'Morals' | 'Methods' | 'Judgment' | 'Daring'
  description: string
}

export interface QuizPack {
  id: string
  title: string
  slug: string
  theme: string
  archetypes: QuizArchetypeDef[]
  questions: QuizQuestion[]
  resultMapping?: { compositeTop?: number; threshold?: number }
}

export interface QuizState {
  activePack: QuizPack | null
  responses: Record<string, string> // questionId -> optionId
  scores: Record<string, number> // archetypeKey -> score
  analysis: number // 0..100
  startedAt: number | null
  completedAt: number | null
}

export interface QuizSlice extends QuizState {
  loadPack: (pack: QuizPack) => RendererCommand
  answer: (questionId: string, optionId: string) => RendererCommand
  resetQuiz: () => RendererCommand
  computeResult: () => { type: string; payload: { top: { key: string; score: number }[] } }
  upsertConceptsFromResponses: () => RendererCommand
}

export const createQuizSlice = (set: any, get: any): QuizSlice => ({
  activePack: null,
  responses: {},
  scores: {},
  analysis: 0,
  startedAt: null,
  completedAt: null,

  loadPack: (pack) => {
    queueMicrotask(() => {
      set(
        produce((state: QuizSlice) => {
          state.activePack = pack
          state.responses = {}
          state.scores = {}
          state.analysis = 0
          state.startedAt = Date.now()
          state.completedAt = null
        })
      )
    })
    return { type: 'QUIZ_LOAD_PACK', payload: { packId: pack.id } }
  },

  answer: (questionId, optionId) => {
    queueMicrotask(() => {
      set(
        produce((state: any) => {
          const s = state as QuizSlice & { addConcept?: (n: Node) => RendererCommand; updateConcept?: (id: string, u: Partial<Node>) => RendererCommand }
          const pack = s.activePack
          if (!pack) return
          s.responses[questionId] = optionId

          // update analysis
          const total = pack.questions.length
          const answered = Object.keys(s.responses).length
          s.analysis = Math.min(100, Math.round((answered / total) * 100))

          // apply option effects → local concept deltas and archetype scores
          const q = pack.questions.find(q => q.id === questionId)
          const opt = q?.options.find(o => o.id === optionId)
          if (opt) {
            // bump archetype tags
            for (const tag of opt.tags) {
              s.scores[tag] = (s.scores[tag] || 0) + 1
            }

            // upsert concept weights into mindmap slice (Node minimal)
            const addConcept = (state as any).addConcept as ((n: Node) => any) | undefined
            const updateConcept = (state as any).updateConcept as ((id: string, u: Partial<Node>) => any) | undefined
            if (addConcept && updateConcept) {
              for (const eff of opt.effects) {
                const id = `quiz:${eff.conceptKey}`
                const existing = (state as any).concepts.get(id) as Node | undefined
                const category = eff.category || 'other'
                const weight = Math.max(0, Math.min(1, (existing?.size as number | undefined || 0) + eff.deltaWeight))
                const updates: Partial<Node> = {
                  id,
                  label: eff.label || eff.conceptKey,
                  size: weight,
                  color: undefined,
                  metadata: { ...(existing?.metadata || {}), category }
                } as any
                if (existing) {
                  updateConcept(id, updates)
                } else {
                  addConcept(updates as Node)
                }
              }
            }
          }

          if (s.analysis === 100) s.completedAt = Date.now()
        })
      )
    })
    return { type: 'QUIZ_ANSWER', payload: { questionId, optionId } }
  },

  computeResult: () => {
    const s = get() as QuizSlice
    const topN = s.activePack?.resultMapping?.compositeTop ?? 5
    const threshold = s.activePack?.resultMapping?.threshold ?? 0
    const entries = Object.entries(s.scores)
    const sum = entries.reduce((a, [, v]) => a + v, 0) || 1
    const normalized = entries.map(([k, v]) => ({ key: k, score: v / sum }))
      .filter(x => x.score >= threshold)
      .sort((a, b) => b.score - a.score)
      .slice(0, topN)
    return { type: 'QUIZ_RESULT', payload: { top: normalized } }
  },

  upsertConceptsFromResponses: () => {
    queueMicrotask(() => {
      // no-op here because answer() already applies effects incrementally
    })
    return { type: 'QUIZ_UPSERT_CONCEPTS' }
  },

  resetQuiz: () => {
    queueMicrotask(() => {
      set(
        produce((state: QuizSlice) => {
          state.activePack = null
          state.responses = {}
          state.scores = {}
          state.analysis = 0
          state.startedAt = null
          state.completedAt = null
        })
      )
    })
    return { type: 'QUIZ_RESET' }
  }
})


