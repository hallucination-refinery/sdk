import { describe, it, expect, beforeEach, vi } from 'vitest'
import { CommandQueue } from './command-queue'
import type { RendererCommand } from './types/renderer-commands'

describe('CommandQueue', () => {
  let queue: CommandQueue
  let subscriber: ReturnType<typeof vi.fn>

  beforeEach(() => {
    queue = new CommandQueue(0) // Synchronous
    subscriber = vi.fn()
  })

  describe('Basic operations', () => {
    it('should enqueue and flush commands immediately with 0 delay', () => {
      const unsubscribe = queue.subscribe(subscriber)
      const command: RendererCommand = { type: 'ADD_NODE', payload: { node: { id: '1', label: 'Test', metadata: {} } } }

      queue.enqueue(command)

      expect(subscriber).toHaveBeenCalledWith([command])
      expect(subscriber).toHaveBeenCalledTimes(1)
      unsubscribe()
    })

    it('should batch commands with delay', () => {
      vi.useFakeTimers()
      queue = new CommandQueue(100) // 100ms delay
      const unsubscribe = queue.subscribe(subscriber)

      const command1: RendererCommand = { type: 'ADD_NODE', payload: { node: { id: '1', label: 'Test 1', metadata: {} } } }
      const command2: RendererCommand = { type: 'ADD_NODE', payload: { node: { id: '2', label: 'Test 2', metadata: {} } } }

      queue.enqueue(command1)
      queue.enqueue(command2)

      expect(subscriber).not.toHaveBeenCalled()

      vi.advanceTimersByTime(100)

      expect(subscriber).toHaveBeenCalledWith([command1, command2])
      expect(subscriber).toHaveBeenCalledTimes(1)

      unsubscribe()
      vi.useRealTimers()
    })

    it('should enqueue batch of commands', () => {
      const unsubscribe = queue.subscribe(subscriber)
      const commands: RendererCommand[] = [
        { type: 'ADD_NODE', payload: { node: { id: '1', label: 'Test 1', metadata: {} } } },
        { type: 'ADD_EDGE', payload: { edge: { id: 'e1', source: '1', target: '2' } } }
      ]

      queue.enqueueBatch(commands)

      expect(subscriber).toHaveBeenCalledWith(commands)
      unsubscribe()
    })

    it('should handle multiple subscribers', () => {
      const subscriber2 = vi.fn()
      const unsubscribe1 = queue.subscribe(subscriber)
      const unsubscribe2 = queue.subscribe(subscriber2)

      const command: RendererCommand = { type: 'CLEAR_SELECTION' }
      queue.enqueue(command)

      expect(subscriber).toHaveBeenCalledWith([command])
      expect(subscriber2).toHaveBeenCalledWith([command])

      unsubscribe1()
      unsubscribe2()
    })

    it('should handle unsubscribe correctly', () => {
      const unsubscribe = queue.subscribe(subscriber)
      unsubscribe()

      const command: RendererCommand = { type: 'CLEAR_SELECTION' }
      queue.enqueue(command)

      expect(subscriber).not.toHaveBeenCalled()
    })
  })

  describe('Error handling', () => {
    it('should continue notifying other subscribers if one throws', () => {
      const errorSubscriber = vi.fn(() => {
        throw new Error('Test error')
      })
      const subscriber2 = vi.fn()

      queue.subscribe(errorSubscriber)
      queue.subscribe(subscriber2)

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const command: RendererCommand = { type: 'CLEAR_SELECTION' }

      queue.enqueue(command)

      expect(errorSubscriber).toHaveBeenCalled()
      expect(subscriber2).toHaveBeenCalledWith([command])
      expect(consoleSpy).toHaveBeenCalled()

      consoleSpy.mockRestore()
    })
  })

  describe('Queue management', () => {
    it('should clear pending commands', () => {
      vi.useFakeTimers()
      queue = new CommandQueue(100)
      const unsubscribe = queue.subscribe(subscriber)

      const command: RendererCommand = { type: 'CLEAR_SELECTION' }
      queue.enqueue(command)

      queue.clear()
      vi.advanceTimersByTime(100)

      expect(subscriber).not.toHaveBeenCalled()

      unsubscribe()
      vi.useRealTimers()
    })

    it('should get pending commands without flushing', () => {
      vi.useFakeTimers()
      queue = new CommandQueue(100)

      const commands: RendererCommand[] = [
        { type: 'ADD_NODE', payload: { node: { id: '1', label: 'Test', metadata: {} } } },
        { type: 'CLEAR_SELECTION' }
      ]

      queue.enqueueBatch(commands)

      const pending = queue.getPending()
      expect(pending).toEqual(commands)

      vi.useRealTimers()
    })

    it('should destroy queue properly', () => {
      const unsubscribe = queue.subscribe(subscriber)
      const command: RendererCommand = { type: 'CLEAR_SELECTION' }

      queue.enqueue(command)
      queue.destroy()

      // Should not call subscriber after destroy
      queue.enqueue(command)
      expect(subscriber).toHaveBeenCalledTimes(1) // Only the first call

      unsubscribe()
    })
  })

  describe('Batching behavior', () => {
    it('should reset timer when new commands arrive', () => {
      vi.useFakeTimers()
      queue = new CommandQueue(100)
      const unsubscribe = queue.subscribe(subscriber)

      const command1: RendererCommand = { type: 'ADD_NODE', payload: { node: { id: '1', label: 'Test 1', metadata: {} } } }
      const command2: RendererCommand = { type: 'ADD_NODE', payload: { node: { id: '2', label: 'Test 2', metadata: {} } } }

      queue.enqueue(command1)
      vi.advanceTimersByTime(50)
      queue.enqueue(command2)
      vi.advanceTimersByTime(50)

      expect(subscriber).not.toHaveBeenCalled()

      vi.advanceTimersByTime(50)

      expect(subscriber).toHaveBeenCalledWith([command1, command2])

      unsubscribe()
      vi.useRealTimers()
    })

    it('should not flush empty command list', () => {
      const unsubscribe = queue.subscribe(subscriber)

      // Clear immediately after enqueueing
      queue.enqueue({ type: 'CLEAR_SELECTION' })
      queue.clear()

      expect(subscriber).toHaveBeenCalledTimes(1) // Only from the enqueue before clear

      unsubscribe()
    })
  })
})