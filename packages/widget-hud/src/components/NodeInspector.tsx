import React, { useState, useEffect } from 'react'
import { useHUDTheme } from '../theme/HUDThemeProvider'
import type { NodeInspectorProps } from '../types'
import type { IdeaNode } from '@refinery/schema'

export function NodeInspector({
  node,
  onNodeUpdate,
  onClose,
  readonly = false,
  className,
}: NodeInspectorProps) {
  const theme = useHUDTheme()
  const [editedNode, setEditedNode] = useState<Partial<IdeaNode>>({})
  
  useEffect(() => {
    if (node) {
      setEditedNode({
        label: node.label,
        metadata: node.metadata,
      })
    }
  }, [node])
  
  if (!node) {
    return (
      <div
        className={className}
        style={{
          padding: theme.spacing.md,
          textAlign: 'center',
          color: theme.colors.textSecondary,
        }}
      >
        No node selected
      </div>
    )
  }
  
  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedNode(prev => ({ ...prev, label: e.target.value }))
  }
  
  const handleSave = () => {
    if (onNodeUpdate && editedNode) {
      onNodeUpdate(node.id, editedNode)
    }
  }
  
  const fieldStyle: React.CSSProperties = {
    marginBottom: theme.spacing.md,
  }
  
  const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: theme.spacing.xs,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.textSecondary,
  }
  
  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: theme.spacing.sm,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.borderRadius.md,
    fontSize: theme.typography.fontSize.base,
    backgroundColor: readonly ? theme.colors.surface : theme.colors.background,
    color: theme.colors.text,
  }
  
  return (
    <div className={className}>
      <div style={fieldStyle}>
        <label htmlFor="node-id" style={labelStyle}>
          ID
        </label>
        <input
          id="node-id"
          type="text"
          value={node.id}
          readOnly
          style={{
            ...inputStyle,
            backgroundColor: theme.colors.surface,
            color: theme.colors.textSecondary,
          }}
        />
      </div>
      
      <div style={fieldStyle}>
        <label htmlFor="node-label" style={labelStyle}>
          Label
        </label>
        <input
          id="node-label"
          type="text"
          value={editedNode.label || ''}
          onChange={handleLabelChange}
          readOnly={readonly}
          style={inputStyle}
        />
      </div>
      
      <div style={fieldStyle}>
        <label style={labelStyle}>Position</label>
        <div style={{ display: 'flex', gap: theme.spacing.sm }}>
          <input
            type="text"
            value={`X: ${node.position?.x.toFixed(2) || 0}`}
            readOnly
            style={{ ...inputStyle, flex: 1 }}
          />
          <input
            type="text"
            value={`Y: ${node.position?.y.toFixed(2) || 0}`}
            readOnly
            style={{ ...inputStyle, flex: 1 }}
          />
          <input
            type="text"
            value={`Z: ${node.position?.z.toFixed(2) || 0}`}
            readOnly
            style={{ ...inputStyle, flex: 1 }}
          />
        </div>
      </div>
      
      <div style={fieldStyle}>
        <label style={labelStyle}>Created</label>
        <input
          type="text"
          value={node.createdAt ? new Date(node.createdAt).toLocaleString() : 'Unknown'}
          readOnly
          style={{
            ...inputStyle,
            backgroundColor: theme.colors.surface,
          }}
        />
      </div>
      
      {!readonly && (
        <div style={{ display: 'flex', gap: theme.spacing.sm, marginTop: theme.spacing.lg }}>
          <button
            onClick={handleSave}
            style={{
              flex: 1,
              padding: theme.spacing.sm,
              backgroundColor: theme.colors.primary,
              color: theme.colors.background,
              border: 'none',
              borderRadius: theme.borderRadius.md,
              fontSize: theme.typography.fontSize.base,
              fontWeight: theme.typography.fontWeight.medium,
              cursor: 'pointer',
            }}
          >
            Save Changes
          </button>
          
          {onClose && (
            <button
              onClick={onClose}
              style={{
                padding: theme.spacing.sm,
                backgroundColor: theme.colors.surface,
                color: theme.colors.text,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: theme.borderRadius.md,
                fontSize: theme.typography.fontSize.base,
                fontWeight: theme.typography.fontWeight.medium,
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          )}
        </div>
      )}
    </div>
  )
}