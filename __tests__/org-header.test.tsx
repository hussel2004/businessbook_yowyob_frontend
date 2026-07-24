import { render, screen, fireEvent } from '@testing-library/react';
import { OrgHeader } from '@/components/features/organization/org-header';

describe('OrgHeader', () => {
    const mockOrg = {
        id: '1',
        longName: 'Test Organization',
        slug: 'test-org',
        coverImageUrl: '/cover.jpg',
        logoUrl: '/logo.jpg',
        isVerified: true,
        tagline: 'Best place',
        categoryName: 'Tech',
        yearFounded: 2020,
        averageRating: 4.5,
        reviewCount: 10,
        primaryPhone: '123456789',
        primaryEmail: 'test@example.com',
        websiteUrl: 'https://example.com'
    };

    const mockHandlers = {
        onShare: jest.fn(),
        onFavorite: jest.fn(),
        onMessage: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders organization details correctly', () => {
        render(<OrgHeader org={mockOrg as any} {...mockHandlers} />);

        expect(screen.getByText('Test Organization')).toBeInTheDocument();
        expect(screen.getByText('Best place')).toBeInTheDocument();
        expect(screen.getByText('Tech')).toBeInTheDocument();
        expect(screen.getByText('Depuis 2020')).toBeInTheDocument();
        expect(screen.getByText('4.5')).toBeInTheDocument();
        expect(screen.getByText('(10 avis)')).toBeInTheDocument();
    });

    it('renders contact info', () => {
        render(<OrgHeader org={mockOrg as any} {...mockHandlers} />);

        expect(screen.getByText('123456789')).toBeInTheDocument();
        expect(screen.getByText('test@example.com')).toBeInTheDocument();
        expect(screen.getByText('Site web')).toBeInTheDocument();
    });

    it('handles action clicks', () => {
        render(<OrgHeader org={mockOrg as any} {...mockHandlers} isFavorite={false} />);

        fireEvent.click(screen.getByText('Partager'));
        expect(mockHandlers.onShare).toHaveBeenCalled();

        fireEvent.click(screen.getByText('Ajouter')); // Favoris button text when isFavorite=false
        expect(mockHandlers.onFavorite).toHaveBeenCalled();

        fireEvent.click(screen.getByText('Envoyer un message'));
        expect(mockHandlers.onMessage).toHaveBeenCalled();
    });

    it('shows Favoris text when isFavorite is true', () => {
        render(<OrgHeader org={mockOrg as any} {...mockHandlers} isFavorite={true} />);
        expect(screen.getByText('Favoris')).toBeInTheDocument();
    });
});
