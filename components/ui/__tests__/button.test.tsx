import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../button';

describe('Button', () => {
    it('renders correctly', () => {
        render(<Button>Click me</Button>);
        const button = screen.getByRole('button', { name: /click me/i });
        expect(button).toBeInTheDocument();
        expect(button).toHaveClass('bg-primary');
    });

    it('handles click events', () => {
        const handleClick = jest.fn();
        render(<Button onClick={handleClick}>Click me</Button>);
        fireEvent.click(screen.getByRole('button'));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('shows loading state', () => {
        render(<Button isLoading>Click me</Button>);
        const button = screen.getByRole('button');
        expect(button).toBeDisabled();
        // Check for loader by class name or other means. button.tsx uses Loader2 which likely renders an SVG
        // We can check if the button contains a spinner
        expect(document.querySelector('.animate-spin')).toBeInTheDocument();
    });



    it('applies variants correctly', () => {
        render(<Button variant="destructive">Delete</Button>);
        expect(screen.getByRole('button')).toHaveClass('bg-destructive');
    });
});
