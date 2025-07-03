/**
 * Async slice - manages background jobs and loading states
 */

import { produce } from 'immer'
import type { AsyncState, AsyncJob } from '../types/state'

export interface AsyncSlice extends AsyncState {
  // Job management
  startJob: (job: Omit<AsyncJob, 'status' | 'progress' | 'startedAt'>) => void
  updateJobProgress: (jobId: string, progress: number) => void
  completeJob: (jobId: string, result?: any) => void
  failJob: (jobId: string, error: string) => void
  cancelJob: (jobId: string) => void
  clearCompletedJobs: () => void
  
  // Loading state
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
  
  // Query methods
  getJob: (jobId: string) => AsyncJob | undefined
  getActiveJobs: () => AsyncJob[]
  getCompletedJobs: () => AsyncJob[]
  getFailedJobs: () => AsyncJob[]
}

export const createAsyncSlice = (set: any, get: any): AsyncSlice => ({
  // Initial state
  jobs: new Map(),
  isLoading: false,
  error: null,

  // Job management
  startJob: (jobData) => {
    const job: AsyncJob = {
      ...jobData,
      status: 'pending',
      progress: 0,
      startedAt: Date.now()
    }
    
    set(
      produce((state: AsyncSlice) => {
        state.jobs.set(job.id, job)
        state.isLoading = true
      })
    )
    
    // Start the job as running after a tick
    setTimeout(() => {
      set(
        produce((state: AsyncSlice) => {
          const existingJob = state.jobs.get(job.id)
          if (existingJob && existingJob.status === 'pending') {
            existingJob.status = 'running'
          }
        })
      )
    }, 0)
  },

  updateJobProgress: (jobId, progress) => {
    set(
      produce((state: AsyncSlice) => {
        const job = state.jobs.get(jobId)
        if (job && job.status === 'running') {
          job.progress = Math.min(100, Math.max(0, progress))
        }
      })
    )
  },

  completeJob: (jobId, result) => {
    set(
      produce((state: AsyncSlice) => {
        const job = state.jobs.get(jobId)
        if (job) {
          job.status = 'completed'
          job.progress = 100
          job.result = result
          job.completedAt = Date.now()
        }
        
        // Update loading state if no more active jobs
        const hasActiveJobs = Array.from(state.jobs.values()).some(
          j => j.status === 'pending' || j.status === 'running'
        )
        state.isLoading = hasActiveJobs
      })
    )
  },

  failJob: (jobId, error) => {
    set(
      produce((state: AsyncSlice) => {
        const job = state.jobs.get(jobId)
        if (job) {
          job.status = 'failed'
          job.error = error
          job.completedAt = Date.now()
        }
        
        // Update loading state if no more active jobs
        const hasActiveJobs = Array.from(state.jobs.values()).some(
          j => j.status === 'pending' || j.status === 'running'
        )
        state.isLoading = hasActiveJobs
        state.error = error
      })
    )
  },

  cancelJob: (jobId) => {
    set(
      produce((state: AsyncSlice) => {
        const job = state.jobs.get(jobId)
        if (job && (job.status === 'pending' || job.status === 'running')) {
          job.status = 'failed'
          job.error = 'Cancelled'
          job.completedAt = Date.now()
        }
        
        // Update loading state if no more active jobs
        const hasActiveJobs = Array.from(state.jobs.values()).some(
          j => j.status === 'pending' || j.status === 'running'
        )
        state.isLoading = hasActiveJobs
      })
    )
  },

  clearCompletedJobs: () => {
    set(
      produce((state: AsyncSlice) => {
        const completedJobIds = Array.from(state.jobs.entries())
          .filter(([_, job]) => job.status === 'completed')
          .map(([id]) => id)
        
        completedJobIds.forEach(id => state.jobs.delete(id))
      })
    )
  },

  // Loading state
  setLoading: (isLoading) => {
    set(
      produce((state: AsyncSlice) => {
        state.isLoading = isLoading
      })
    )
  },

  setError: (error) => {
    set(
      produce((state: AsyncSlice) => {
        state.error = error
      })
    )
  },

  // Query methods
  getJob: (jobId) => get().jobs.get(jobId),
  
  getActiveJobs: () => {
    const jobs = Array.from(get().jobs.values()) as AsyncJob[]
    return jobs.filter(job => job.status === 'pending' || job.status === 'running')
  },
  
  getCompletedJobs: () => {
    const jobs = Array.from(get().jobs.values()) as AsyncJob[]
    return jobs.filter(job => job.status === 'completed')
  },
  
  getFailedJobs: () => {
    const jobs = Array.from(get().jobs.values()) as AsyncJob[]
    return jobs.filter(job => job.status === 'failed')
  }
})