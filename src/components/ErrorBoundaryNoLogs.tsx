/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';

interface IProps {
  children: React.ReactNode;
  errorView: JSX.Element;
}

interface IState {
  hasError: boolean;
}

export default class ErrorBoundaryNoLogs extends React.Component<
  IProps,
  IState
> {
  readonly state: IState = { hasError: false };

  constructor(props: IProps) {
    super(props);
  }

  componentDidCatch() {
    // Display fallback UI
    this.setState({ hasError: true });
  }
  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.errorView;
    }
    return this.props.children;
  }
}
