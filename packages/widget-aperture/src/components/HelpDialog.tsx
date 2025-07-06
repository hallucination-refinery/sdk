import React from 'react'

interface HelpDialogProps {
  showHelp: boolean
}

export function HelpDialog({ showHelp }: HelpDialogProps) {
  if (!showHelp) return null

  // Since getKeyboardInstructions returns a simple string, we don't need to map it.
  // We can just render it inside a div. A more complex help dialog might parse this.
  return (
    <div
      className="refinery-aperture-help-dialog"
      role="dialog"
      aria-modal="true"
      aria-labelledby="help-dialog-title"
      data-testid="aperture-help-dialog"
    >
      <h2 id="help-dialog-title">Keyboard Navigation</h2>
      <p>Use arrow keys to navigate. Press Enter to select.</p>
    </div>
  )
}
