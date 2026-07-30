// src/components/ErrorBoundary.tsx
import React from 'react';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('🔴 Error Boundary caught an error:', error, errorInfo);
    
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div style={{
          padding: '2rem',
          margin: '1rem',
          backgroundColor: '#fff5f5',
          border: '1px solid #feb2b2',
          borderRadius: '8px',
          textAlign: 'center',
          fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
          <h3 style={{ color: '#c53030', margin: '0 0 0.5rem 0' }}>
            Something went wrong
          </h3>
          <p style={{ color: '#742a2a', fontSize: '0.9rem', margin: '0 0 1rem 0' }}>
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          <button
            onClick={this.handleReset}
            style={{
              padding: '0.5rem 1.5rem',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: '#c53030',
              color: 'white',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.9rem'
            }}
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}