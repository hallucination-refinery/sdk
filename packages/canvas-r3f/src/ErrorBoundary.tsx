import React, { Component, ReactNode, ErrorInfo } from 'react'

export interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
  errorId: string
}

export interface ErrorBoundaryProps {
  children: ReactNode
  /** Fallback component to render when error occurs */
  fallback?: React.ComponentType<{ error: Error; errorId: string; retry: () => void }>
  /** Callback when error occurs */
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  /** Whether to show detailed error information (dev mode) */
  showDetails?: boolean
  /** Custom error message */
  errorMessage?: string
}

/**
 * Error boundary specifically designed for 3D canvas components
 */
export class Canvas3DErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      errorId: ''
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
      errorId: Date.now().toString(36)
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    })

    // Log error details
    console.error('Canvas3D Error Boundary caught an error:', error)
    console.error('Error Info:', errorInfo)
    
    // Call optional error callback
    this.props.onError?.(error, errorInfo)
  }

  retry = () => {
    this.setState({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
      errorId: ''
    })
  }

  render() {
    if (this.state.hasError && this.state.error) {
      // Custom fallback component
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback
        return (
          <FallbackComponent
            error={this.state.error}
            errorId={this.state.errorId}
            retry={this.retry}
          />
        )
      }

      // Default fallback UI
      return <DefaultErrorFallback
        error={this.state.error}
        errorId={this.state.errorId}
        retry={this.retry}
        showDetails={this.props.showDetails}
        errorMessage={this.props.errorMessage}
      />
    }

    return this.props.children
  }
}

/**
 * Default 3D error fallback component
 */
function DefaultErrorFallback({
  error,
  errorId,
  retry,
  showDetails = false,
  errorMessage = 'An error occurred'
}: {
  error: Error
  errorInfo?: ErrorInfo
  errorId: string
  retry: () => void
  showDetails?: boolean
  errorMessage?: string
}) {
  // Use parameters to avoid unused warnings
  React.useEffect(() => {
    if (showDetails) {
      console.error(`Error ${errorId}: ${error.name} - ${errorMessage}`)
    }
  }, [errorId, error.name, errorMessage, showDetails])
  
  return (
    <group onClick={retry}>
      {/* 3D Error indicator */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[20, 20, 20]} />
        <meshBasicMaterial color="#ff4444" wireframe transparent opacity={0.5} />
      </mesh>
      
      {/* Error text placeholder - actual text would require text geometry */}
      <mesh position={[0, 25, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="#ff4444" visible={false} />
      </mesh>
    </group>
  )
}

/**
 * 2D Error boundary for UI components
 */
export class UIErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      errorId: ''
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
      errorId: Date.now().toString(36)
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    })

    console.error('UI Error Boundary caught an error:', error)
    console.error('Error Info:', errorInfo)
    
    this.props.onError?.(error, errorInfo)
  }

  retry = () => {
    this.setState({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
      errorId: ''
    })
  }

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback
        return (
          <FallbackComponent
            error={this.state.error}
            errorId={this.state.errorId}
            retry={this.retry}
          />
        )
      }

      return <DefaultUIErrorFallback
        error={this.state.error}
        errorInfo={this.state.errorInfo}
        errorId={this.state.errorId}
        retry={this.retry}
        showDetails={this.props.showDetails}
        errorMessage={this.props.errorMessage}
      />
    }

    return this.props.children
  }
}

/**
 * Default UI error fallback component
 */
function DefaultUIErrorFallback({
  error,
  errorInfo,
  errorId,
  retry,
  showDetails = false,
  errorMessage = 'Something went wrong'
}: {
  error: Error
  errorInfo?: ErrorInfo
  errorId: string
  retry: () => void
  showDetails?: boolean
  errorMessage?: string
}) {
  return (
    <div className="error-boundary-fallback p-4 border border-red-300 rounded-lg bg-red-50">
      <div className="flex items-center space-x-2 mb-3">
        <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs">!</span>
        </div>
        <h3 className="text-red-800 font-semibold">{errorMessage}</h3>
      </div>
      
      <p className="text-red-700 text-sm mb-3">
        Error ID: <code className="bg-red-100 px-1 rounded">{errorId}</code>
      </p>
      
      <button
        onClick={retry}
        className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
      >
        Try Again
      </button>
      
      {showDetails && (
        <details className="mt-4">
          <summary className="text-red-700 cursor-pointer font-medium">
            Error Details
          </summary>
          <div className="mt-2 p-2 bg-red-100 rounded text-xs">
            <p className="font-semibold">{error.name}: {error.message}</p>
            {error.stack && (
              <pre className="mt-2 whitespace-pre-wrap text-red-800 overflow-auto max-h-40">
                {error.stack}
              </pre>
            )}
            {errorInfo && errorInfo.componentStack && (
              <div className="mt-2">
                <p className="font-semibold">Component Stack:</p>
                <pre className="whitespace-pre-wrap text-red-800">
                  {errorInfo.componentStack}
                </pre>
              </div>
            )}
          </div>
        </details>
      )}
    </div>
  )
}

/**
 * Higher-order component to wrap components with error boundary
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <UIErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </UIErrorBoundary>
  )
  
  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`
  return WrappedComponent
}

/**
 * Hook to manually trigger error boundary (for testing)
 */
export function useErrorHandler() {
  return (error: Error) => {
    throw error
  }
}

/**
 * Common error types for better error handling
 */
export class BrainMeshLoadError extends Error {
  constructor(message: string, public readonly modelPath: string) {
    super(message)
    this.name = 'BrainMeshLoadError'
  }
}

export class ConceptMappingError extends Error {
  constructor(message: string, public readonly conceptId: string) {
    super(message)
    this.name = 'ConceptMappingError'
  }
}

export class PerformanceError extends Error {
  constructor(message: string, public readonly metrics: Record<string, number>) {
    super(message)
    this.name = 'PerformanceError'
  }
}