import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoadingComponent from '@/components/LoadingComponent';

describe('LoadingComponent', () => {
  // Test default props for our loading component
  it('renders loading component with default text and no loading dots', () => {
    render(<LoadingComponent />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.queryByTestId('loading-ellipsis')).not.toBeInTheDocument();
  });

  // Test custom text
  it('renders loading component with custom text', () => {
    render(<LoadingComponent text="Banana..." />);
    expect(screen.getByText('Banana...')).toBeInTheDocument();
  });

  // Test loading dots
  it('renders loading component with dots', () => {
    render(<LoadingComponent text="Loading..." withDots />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.getByTestId('loading-ellipsis')).toBeInTheDocument();
  });

  // Test loading dots animation
  it('renders the loading animation', () => {
    render(<LoadingComponent />);
    const image = screen.getByTestId('loading-image');
    expect(image).toBeInTheDocument();
  });
});
