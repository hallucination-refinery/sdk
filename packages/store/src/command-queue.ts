/**
 * Command queue for batching and managing renderer commands
 */

import type { RendererCommand } from './types/renderer-commands'

export class CommandQueue {
  private commands: RendererCommand[] = []
  private subscribers: Array<(commands: RendererCommand[]) => void> = []
  private flushTimeout: NodeJS.Timeout | null = null
  private batchDelay: number

  constructor(batchDelay = 0) {
    this.batchDelay = batchDelay
  }

  enqueue(command: RendererCommand): void {
    this.commands.push(command)
    
    if (this.batchDelay === 0) {
      // Immediate flush for synchronous updates
      this.flush()
    } else {
      // Batch commands for performance
      this.scheduleFlush()
    }
  }

  enqueueBatch(commands: RendererCommand[]): void {
    this.commands.push(...commands)
    
    if (this.batchDelay === 0) {
      this.flush()
    } else {
      this.scheduleFlush()
    }
  }

  private scheduleFlush(): void {
    if (this.flushTimeout) {
      clearTimeout(this.flushTimeout)
    }

    this.flushTimeout = setTimeout(() => {
      this.flush()
    }, this.batchDelay)
  }

  private flush(): void {
    if (this.commands.length === 0) return

    const commands = [...this.commands]
    this.commands = []

    // Notify all subscribers
    this.subscribers.forEach(subscriber => {
      try {
        subscriber(commands)
      } catch (error) {
        console.error('Error in command queue subscriber:', error)
      }
    })
  }

  subscribe(callback: (commands: RendererCommand[]) => void): () => void {
    this.subscribers.push(callback)
    
    // Return unsubscribe function
    return () => {
      const index = this.subscribers.indexOf(callback)
      if (index >= 0) {
        this.subscribers.splice(index, 1)
      }
    }
  }

  clear(): void {
    this.commands = []
    if (this.flushTimeout) {
      clearTimeout(this.flushTimeout)
      this.flushTimeout = null
    }
  }

  destroy(): void {
    this.clear()
    this.subscribers = []
  }

  // Get pending commands without flushing
  getPending(): RendererCommand[] {
    return [...this.commands]
  }
}