'use client';
import React from 'react';

const lenses: Array<{
  id: 'causal' | 'affinity' | 'temporal';
  label: string;
  color: string;
}> = [
  { id: 'causal', label: 'Causal', color: '#FF6B35' },
  { id: 'affinity', label: 'Affinity', color: '#9B59B6' },
  { id: 'temporal', label: 'Temporal', color: '#3498DB' },
];

interface LensSelectorProps {
  activeLens: 'causal' | 'affinity' | 'temporal';
  onLensChange: (lens: 'causal' | 'affinity' | 'temporal') => void;
}

export default function LensSelector({ activeLens, onLensChange }: LensSelectorProps) {

  return (
    <div
      style={{
        position: 'fixed',
        top: '24px',
        right: '24px',
        zIndex: 150,
        padding: '12px 16px',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        border: '1px solid rgba(0, 0, 0, 0.1)',
      }}
    >
      <span
        style={{
          fontSize: '12px',
          fontWeight: '500',
          color: '#666',
          marginRight: '4px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}
      >
        Lens
      </span>
      {lenses.map((lens) => (
        <button
          key={lens.id}
          onClick={() => onLensChange(lens.id)}
          style={{
            padding: '6px 14px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            border: 'none',
            backgroundColor: activeLens === lens.id ? lens.color : '#f3f4f6',
            color: activeLens === lens.id ? 'white' : '#374151',
            transform: activeLens === lens.id ? 'scale(1.05)' : 'scale(1)',
            boxShadow:
              activeLens === lens.id ? '0 2px 8px rgba(0, 0, 0, 0.15)' : 'none',
          }}
          onMouseEnter={(e) => {
            if (activeLens !== lens.id) {
              e.currentTarget.style.backgroundColor = '#e5e7eb';
            }
          }}
          onMouseLeave={(e) => {
            if (activeLens !== lens.id) {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
            }
          }}
        >
          {lens.label}
        </button>
      ))}
    </div>
  );
}
