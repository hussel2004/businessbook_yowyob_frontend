import { render, screen } from '@testing-library/react';
import { Badge } from '../badge';

describe('Badge', () => {
    it('renders correctly', () => {
        render(<Badge>Test Badge</Badge>);
        const badge = screen.getByText('Test Badge');
        expect(badge).toBeInTheDocument();
        expect(badge).toHaveClass('bg-primary'); // Default variant
    });

    it('renders variants correctly', () => {
        const { rerender } = render(<Badge variant="secondary">Secondary</Badge>);
        expect(screen.getByText('Secondary')).toHaveClass('bg-secondary');

        rerender(<Badge variant="destructive">Destructive</Badge>);
        expect(screen.getByText('Destructive')).toHaveClass('bg-destructive');

        rerender(<Badge variant="outline">Outline</Badge>);
        expect(screen.getByText('Outline')).toHaveClass('text-foreground');
    });

    it('applies custom className', () => {
        render(<Badge className="custom-class">Custom</Badge>);
        expect(screen.getByText('Custom')).toHaveClass('custom-class');
    });
});
