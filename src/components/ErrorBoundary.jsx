import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '40px 20px',
          maxWidth: '600px',
          margin: '40px auto',
          textAlign: 'center',
          fontFamily: 'serif',
          background: '#FFF9F6',
          border: '1px solid #FECDD3',
          borderRadius: '24px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.08)'
        }}>
          <h2 style={{ fontSize: '24px', color: '#9F1239', marginBottom: '12px' }}>
            O mică clipă de răgaz...
          </h2>
          <p style={{ color: '#4A3B40', fontSize: '16px', lineHeight: '1.6' }}>
            Am întâmpinat o mică eroare la încărcarea efectelor grafice. Apasă pe butonul de mai jos pentru a reîncărca experiența în siguranță.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '20px',
              padding: '12px 28px',
              background: '#BE123C',
              color: '#fff',
              border: 'none',
              borderRadius: '9999px',
              fontSize: '15px',
              cursor: 'pointer'
            }}
          >
            Reîncarcă pagina
          </button>
          {process.env.NODE_ENV !== 'production' && this.state.error && (
            <pre style={{
              marginTop: '20px',
              textAlign: 'left',
              background: '#fff',
              padding: '16px',
              borderRadius: '8px',
              fontSize: '12px',
              overflow: 'auto',
              color: '#dc2626'
            }}>
              {this.state.error.toString()}
              {'\n'}
              {this.state.errorInfo?.componentStack}
            </pre>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
