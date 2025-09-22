import React from 'react';

class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h1>发生错误，请刷新页面或联系支持。</h1>
          <p>错误详情: {this.state.error?.message}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;