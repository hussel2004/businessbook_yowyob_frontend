import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SearchFilters } from '../search-filters';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

// Mock dependencies
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
    useSearchParams: jest.fn(),
}));

jest.mock('@tanstack/react-query', () => ({
    useQuery: jest.fn(),
}));

describe('SearchFilters', () => {
    const mockPush = jest.fn();
    const mockCategories = [
        { id: '1', name: 'Technology', slug: 'tech' },
        { id: '2', name: 'Food', slug: 'food' },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
        (useQuery as jest.Mock).mockReturnValue({
            data: mockCategories,
            isLoading: false,
        });
    });

    test('renders with initial values from URL params', () => {
        (useSearchParams as jest.Mock).mockReturnValue({
            get: (key: string) => {
                const params: Record<string, string> = {
                    q: 'Bakery',
                    city: 'Douala',
                    category: 'food',
                    verified: 'true',
                };
                return params[key] || null;
            },
            toString: () => 'q=Bakery&city=Douala&category=food&verified=true',
        });

        render(<SearchFilters />);

        // Check Input values
        expect(screen.getByLabelText(/Nom de l'entreprise/)).toHaveValue('Bakery');
        expect(screen.getByLabelText(/Ville/)).toHaveValue('Douala');

        // Check Select value (needs to be found effectively)
        const select = screen.getByRole('combobox'); // Assuming native select uses combobox role or we find by other means
        // The custom Select component renders a native <select>
        expect(select).toHaveValue('food');

        // Check Checkbox
        const checkbox = screen.getByLabelText(/Entreprises certifiées uniquement/);
        expect(checkbox).toBeChecked();

        // Check active filter Reset button showing
        expect(screen.getByText('Réinitialiser')).toBeInTheDocument();
    });

    test('renders empty state correctly', () => {
        (useSearchParams as jest.Mock).mockReturnValue({
            get: () => null,
            toString: () => '',
        });

        render(<SearchFilters />);

        expect(screen.getByLabelText(/Nom de l'entreprise/)).toHaveValue('');
        expect(screen.queryByText('Réinitialiser')).not.toBeInTheDocument();
    });

    test('calls router.push with correct params on Apply', () => {
        (useSearchParams as jest.Mock).mockReturnValue({
            get: () => null,
            toString: () => '',
        });

        render(<SearchFilters />);

        // Fill form
        fireEvent.change(screen.getByLabelText(/Nom de l'entreprise/), { target: { value: 'NewSearch' } });
        fireEvent.click(screen.getByText('Appliquer les filtres'));

        expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('q=NewSearch'));
    });

    test('Clear filters resets state and URL', () => {
        (useSearchParams as jest.Mock).mockReturnValue({
            get: (key: string) => (key === 'q' ? 'Something' : null),
            toString: () => 'q=Something',
        });

        render(<SearchFilters />);

        // Check initial presence
        expect(screen.getByLabelText(/Nom de l'entreprise/)).toHaveValue('Something');

        // Click Reset
        fireEvent.click(screen.getByText('Réinitialiser'));

        // Should modify internal state (reflected in UI usually) and push clean URL
        expect(mockPush).toHaveBeenCalledWith('/search');
        expect(screen.getByLabelText(/Nom de l'entreprise/)).toHaveValue('');
    });

    test('renders categories options', () => {
        (useSearchParams as jest.Mock).mockReturnValue({
            get: () => null,
            toString: () => '',
        });

        render(<SearchFilters />);

        expect(screen.getByText('Toutes les catégories')).toBeInTheDocument();
        expect(screen.getByText('Technology')).toBeInTheDocument();
        expect(screen.getByText('Food')).toBeInTheDocument();
    });
});
