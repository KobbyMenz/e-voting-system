import React from "react";
import Card from "../UI/Card/Card";

/**
 * ErrorBoundary Component - Catches errors in the component tree
 * ✅ CRITICAL FIX: Prevents entire app from crashing on component errors
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging
    console.error("Error caught by boundary:", error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
            backgroundColor: "#f5f5f5",
            padding: "20px",
          }}
        >
          <Card
            style={{
              padding: "40px",
              maxWidth: "600px",
              textAlign: "center",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <h1 style={{ color: "#d32f2f", marginBottom: "20px" }}>
              Oops! Something went wrong
            </h1>
            <p
              style={{ color: "#666", marginBottom: "20px", fontSize: "16px" }}
            >
              We're sorry, but something unexpected happened. Please try again
              or contact support.
            </p>

            {/*DEV TOOL: Show error details in development mode for debugging*/}
            {import.meta.env.DEV && this.state.error && (
              <details
                style={{
                  marginTop: "20px",
                  padding: "15px",
                  backgroundColor: "#f9f9f9",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  textAlign: "left",
                  cursor: "pointer",
                }}
              >
                <summary style={{ fontWeight: "bold", color: "#d32f2f" }}>
                  Error Details (Development Only)
                </summary>
                <pre
                  style={{
                    marginTop: "10px",
                    overflow: "auto",
                    fontSize: "12px",
                    color: "#666",
                  }}
                >
                  {this.state.error.toString()}
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}

            <button
              onClick={this.handleReset}
              style={{
                marginTop: "20px",
                padding: "10px 20px",
                backgroundColor: "#1976d2",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "bold",
              }}
            >
              Try Again
            </button>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
