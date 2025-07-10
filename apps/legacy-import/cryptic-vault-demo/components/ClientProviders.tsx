'use client';

import { CanvasProvider } from '@refinery/sdk-core';
import { ReactNode } from 'react';

export function ClientProviders({ children }: { children: ReactNode }) {
  return <CanvasProvider>{children}</CanvasProvider>;
}