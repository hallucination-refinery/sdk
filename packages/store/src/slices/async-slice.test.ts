import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createAsyncSlice } from './async-slice'
import type { AsyncJob } from '../types/state'

describe('AsyncSlice', () => {
  let slice: ReturnType<typeof createAsyncSlice>
  let setState: any
  let _getState: any
  let state: any

  beforeEach(() => {
    vi.useFakeTimers()
    
    // Initialize state
    state = {
      jobs: new Map(),
      isLoading: false,
      error: null
    }
    
    // Mock setState to update the state
    setState = (fn: any) => {
      const updater = typeof fn === 'function' ? fn : () => fn
      // Apply the updater to the state
      state = updater(state)
      // Update slice object with new state
      Object.assign(slice, state)
    }
    
    // Create slice with mocked functions
    const sliceActions = createAsyncSlice(setState, () => state)
    
    // Merge state and actions
    slice = { ...state, ...sliceActions }
    
    // Update getState to return current state after slice is created
    _getState = () => state
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('Job management', () => {
    it('should start a job', () => {
      const jobData: Omit<AsyncJob, 'status' | 'progress' | 'startedAt'> = {
        id: 'job-1',
        type: 'import'
      }

      slice.startJob(jobData)

      const job = slice.getJob('job-1')
      expect(job).toBeDefined()
      expect(job?.status).toBe('pending')
      expect(job?.progress).toBe(0)
      expect(job?.startedAt).toBeDefined()
      expect(slice.isLoading).toBe(true)
    })

    it('should set job to running after a tick', () => {
      slice.startJob({ id: 'job-1', type: 'export' })

      vi.runAllTimers()

      const job = slice.getJob('job-1')
      expect(job?.status).toBe('running')
    })

    it('should update job progress', () => {
      slice.startJob({ id: 'job-1', type: 'layout' })
      vi.runAllTimers()

      slice.updateJobProgress('job-1', 50)

      const job = slice.getJob('job-1')
      expect(job?.progress).toBe(50)
    })

    it('should clamp job progress between 0 and 100', () => {
      slice.startJob({ id: 'job-1', type: 'analysis' })
      vi.runAllTimers()

      slice.updateJobProgress('job-1', 150)
      expect(slice.getJob('job-1')?.progress).toBe(100)

      slice.updateJobProgress('job-1', -50)
      expect(slice.getJob('job-1')?.progress).toBe(0)
    })

    it('should complete a job', () => {
      slice.startJob({ id: 'job-1', type: 'import' })
      const result = { nodeCount: 10 }

      slice.completeJob('job-1', result)

      const job = slice.getJob('job-1')
      expect(job?.status).toBe('completed')
      expect(job?.progress).toBe(100)
      expect(job?.result).toEqual(result)
      expect(job?.completedAt).toBeDefined()
      expect(slice.isLoading).toBe(false)
    })

    it('should fail a job', () => {
      slice.startJob({ id: 'job-1', type: 'export' })

      slice.failJob('job-1', 'Network error')

      const job = slice.getJob('job-1')
      expect(job?.status).toBe('failed')
      expect(job?.error).toBe('Network error')
      expect(job?.completedAt).toBeDefined()
      expect(slice.error).toBe('Network error')
    })

    it('should cancel a job', () => {
      slice.startJob({ id: 'job-1', type: 'layout' })
      vi.runAllTimers()

      slice.cancelJob('job-1')

      const job = slice.getJob('job-1')
      expect(job?.status).toBe('failed')
      expect(job?.error).toBe('Cancelled')
    })

    it('should not cancel completed jobs', () => {
      slice.startJob({ id: 'job-1', type: 'import' })
      slice.completeJob('job-1')

      slice.cancelJob('job-1')

      const job = slice.getJob('job-1')
      expect(job?.status).toBe('completed')
    })

    it('should clear completed jobs', () => {
      slice.startJob({ id: 'job-1', type: 'import' })
      slice.startJob({ id: 'job-2', type: 'export' })
      slice.startJob({ id: 'job-3', type: 'layout' })

      slice.completeJob('job-1')
      slice.completeJob('job-2')
      vi.runAllTimers() // job-3 is still running

      slice.clearCompletedJobs()

      expect(slice.jobs.has('job-1')).toBe(false)
      expect(slice.jobs.has('job-2')).toBe(false)
      expect(slice.jobs.has('job-3')).toBe(true)
    })
  })

  describe('Loading state management', () => {
    it('should track loading state with multiple jobs', () => {
      expect(slice.isLoading).toBe(false)

      slice.startJob({ id: 'job-1', type: 'import' })
      expect(slice.isLoading).toBe(true)

      slice.startJob({ id: 'job-2', type: 'export' })
      expect(slice.isLoading).toBe(true)

      slice.completeJob('job-1')
      expect(slice.isLoading).toBe(true) // job-2 still running

      slice.completeJob('job-2')
      expect(slice.isLoading).toBe(false)
    })

    it('should manually set loading state', () => {
      slice.setLoading(true)
      expect(slice.isLoading).toBe(true)

      slice.setLoading(false)
      expect(slice.isLoading).toBe(false)
    })

    it('should set and clear error', () => {
      slice.setError('Something went wrong')
      expect(slice.error).toBe('Something went wrong')

      slice.setError(null)
      expect(slice.error).toBe(null)
    })
  })

  describe('Query methods', () => {
    beforeEach(() => {
      slice.startJob({ id: 'job-1', type: 'import' })
      slice.startJob({ id: 'job-2', type: 'export' })
      slice.startJob({ id: 'job-3', type: 'layout' })
      slice.startJob({ id: 'job-4', type: 'analysis' })

      vi.runAllTimers()

      slice.completeJob('job-1')
      slice.failJob('job-2', 'Error')
      // job-3 is running
      // job-4 is running
    })

    it('should get job by id', () => {
      const job = slice.getJob('job-1')
      expect(job?.id).toBe('job-1')
      expect(job?.status).toBe('completed')
    })

    it('should return undefined for non-existent job', () => {
      expect(slice.getJob('non-existent')).toBeUndefined()
    })

    it('should get active jobs', () => {
      const activeJobs = slice.getActiveJobs()
      expect(activeJobs).toHaveLength(2)
      expect(activeJobs.map(j => j.id)).toContain('job-3')
      expect(activeJobs.map(j => j.id)).toContain('job-4')
    })

    it('should get completed jobs', () => {
      const completedJobs = slice.getCompletedJobs()
      expect(completedJobs).toHaveLength(1)
      expect(completedJobs[0].id).toBe('job-1')
    })

    it('should get failed jobs', () => {
      const failedJobs = slice.getFailedJobs()
      expect(failedJobs).toHaveLength(1)
      expect(failedJobs[0].id).toBe('job-2')
    })
  })
})