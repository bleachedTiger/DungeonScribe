import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ErrorMessage from '../../components/ErrorMessage';

describe('ErrorMessage', () => {
  it('should render the error message', () => {
    render(<ErrorMessage message="Something went wrong" />);
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  })

 it('should not render retry button when onRetry is not provided', () => {
    render(<ErrorMessage message="Something went wrong" />);
    expect(screen.queryByText('Retry')).not.toBeInTheDocument();
  })

  it('should render the retry button when onRetry is provided', () => {
    const handleRetry = vi.fn();
    render(<ErrorMessage message="Something went wrong" onRetry={handleRetry} />)
    expect(screen.getByText('Retry')).toBeInTheDocument();
  })

  it('should call onRetry when the retry button is clicked', async () => {
    const handleRetry = vi.fn();
    render(<ErrorMessage message="Something went wrong" onRetry={handleRetry} />);
    await userEvent.click(screen.getByText('Retry'));
    expect(handleRetry).toHaveBeenCalledTimes(1);
  })

})