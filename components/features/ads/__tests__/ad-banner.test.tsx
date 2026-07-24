import { render, screen } from '@testing-library/react';
import { AdBanner } from '../ad-banner';
import '@testing-library/jest-dom';

describe('AdBanner', () => {
    it('renders the banner with "Sponsorisé" badge', () => {
        render(<AdBanner format="leaderboard" />);
        expect(screen.getByText('Sponsorisé')).toBeInTheDocument();
    });

    it('renders in correct format classes', () => {
        const { container } = render(<AdBanner format="leaderboard" />);
        // leaderboard has h-24 md:h-32 w-full
        expect(container.firstChild).toHaveClass('h-24 md:h-32 w-full');
    });

    it('renders rectangle format correctly', () => {
        const { container } = render(<AdBanner format="rectangle" />);
        // rectangle has h-64 w-full md:w-80
        expect(container.firstChild).toHaveClass('h-64 w-full md:w-80');
    });

    it('includes data-slot-id attribute', () => {
        const { container } = render(<AdBanner format="leaderboard" slotId="test-slot" />);
        expect(container.firstChild).toHaveAttribute('data-slot-id', 'test-slot');
    });
});
