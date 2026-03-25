import {render, screen} from '@testing-library/react';
import LoadingSpinner from '../components/LoadingSpinner';  

describe('LoadingSpinner', () => {
    it('should render with default message', () => {
        render(<LoadingSpinner />);
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    })
    
    it('should render with custom message', () => {
        render(<LoadingSpinner message="Loading your campaigns..." />)
        expect(screen.getByText('Loading your campaigns...')).toBeInTheDocument()
    })

    it('should render the spinner element', () => {
        render(<LoadingSpinner />)
        expect(screen.getByText('Loading...')).toBeInTheDocument()
    })
})