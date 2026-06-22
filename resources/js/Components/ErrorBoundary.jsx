import { Component } from "react";

export default class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // Log to console for debugging — in production you could send this to a logging service
        console.error("SmartVisitor caught an error:", error, errorInfo);
    }

    handleReload = () => {
        window.location.href = "/";
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="error-boundary">
                    <div className="error-boundary-card">
                        <span className="error-boundary-icon">⚠️</span>
                        <h2>Something went wrong</h2>
                        <p>
                            This page hit an unexpected error. Your data is safe
                            — try going back to the dashboard.
                        </p>
                        {process.env.NODE_ENV === "development" &&
                            this.state.error && (
                                <pre className="error-boundary-details">
                                    {this.state.error.toString()}
                                </pre>
                            )}
                        <button
                            className="btn btn-primary"
                            onClick={this.handleReload}
                        >
                            ← Back to Home
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
