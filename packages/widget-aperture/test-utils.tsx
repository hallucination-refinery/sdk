import React from 'react'
import { render } from '@testing-library/react'
import { enableMapSet } from 'immer'

// Ensure Immer supports Map and Set during widget tests
enableMapSet()

export function renderWithAperture(ui: React.ReactElement) {
  return render(ui)
}
