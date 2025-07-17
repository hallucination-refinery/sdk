import { describe, it, expect } from 'vitest'

describe('SDK Data Handling', () => {
  it('should ensure cloned graph data is mutable for physics engines', () => {
    // 1. Simulate the frozen object coming from an Immer-based store
    const frozenNode = Object.freeze({ id: 'a', label: 'Node A' })

    // 2. Deep clone the object, simulating what happens before passing to d3-force
    const clonedNode =
      typeof structuredClone === 'function'
        ? structuredClone(frozenNode)
        : JSON.parse(JSON.stringify(frozenNode))

    // 3. Assert that the clone is not the same instance
    expect(clonedNode).not.toBe(frozenNode)

    // 4. Attempt to mutate the clone, simulating a d3-force operation (e.g., adding a 'vx' property)
    let mutationError: Error | null = null
    try {
      ;(clonedNode as any).vx = 0
    } catch (e) {
      mutationError = e as Error
    }

    // 5. Assert that the mutation succeeded without error
    expect(mutationError).toBeNull()
    expect((clonedNode as any).vx).toBe(0)
  })
})
