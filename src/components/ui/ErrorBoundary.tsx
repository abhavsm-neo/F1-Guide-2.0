import { Component, type ReactNode, type ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="card" style={{ textAlign: 'center', padding: '40px 20px', borderLeft: '3px solid #e10600' }}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>⚠️</div>
            <div style={{ fontFamily: 'Orbitron', fontSize: 12, color: '#e10600', letterSpacing: 2, marginBottom: 8 }}>
              SOMETHING WENT WRONG
            </div>
            <p style={{ fontSize: 12, color: 'var(--text3)', lineHeight: 1.7, marginBottom: 16 }}>
              {this.state.error?.message || 'An unexpected error occurred.'}
            </p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              style={{ padding: '8px 18px', background: '#e10600', border: 'none', color: '#fff', fontFamily: 'Orbitron', fontSize: 10, letterSpacing: 2, cursor: 'pointer', borderRadius: 20 }}
            >
              TRY AGAIN
            </button>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
