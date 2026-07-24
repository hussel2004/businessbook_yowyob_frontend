import { render, screen, fireEvent } from '@testing-library/react';
import { OrgReviews } from '@/components/features/organization/org-reviews';
import { useAuthStore } from '@/lib/auth/auth-store';
import { useRouter } from 'next/navigation';
import { Review } from '@/lib/api/public';

// Mock dependencies
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

jest.mock('@/lib/auth/auth-store', () => ({
    useAuthStore: jest.fn(),
}));

jest.mock('@/components/features/reviews/review-form', () => ({
    ReviewForm: () => <div data-testid="review-form">Form</div>
}));

describe('OrgReviews', () => {
    const mockRouter = { push: jest.fn() };
    const mockReviews: Review[] = [
        { id: '1', organizationId: 'org1', rating: 5, content: 'Great!', actorName: 'User 1', createdAt: new Date().toISOString(), isVerifiedPurchase: true },
        { id: '2', organizationId: 'org1', rating: 3, content: 'Okay', actorName: 'User 2', createdAt: new Date().toISOString() }
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        (useRouter as jest.Mock).mockReturnValue(mockRouter);
    });

    it('renders reviews list', () => {
        (useAuthStore as jest.Mock).mockReturnValue({ isAuthenticated: false, user: null });

        render(<OrgReviews reviews={mockReviews} organizationId="org1" />);

        expect(screen.getByText('Great!')).toBeInTheDocument();
        expect(screen.getByText('Okay')).toBeInTheDocument();
        expect(screen.getByText('User 1')).toBeInTheDocument();
    });

    it('rendering write review button redirects to login if not authenticated', () => {
        (useAuthStore as jest.Mock).mockReturnValue({ isAuthenticated: false, user: null });

        render(<OrgReviews reviews={[]} organizationId="org1" />);

        const writeBtn = screen.getByText('Écrire un avis');
        fireEvent.click(writeBtn);

        expect(mockRouter.push).toHaveBeenCalledWith('/login?redirect=/business/org1');
    });

    it('opens modal if authenticated', () => {
        (useAuthStore as jest.Mock).mockReturnValue({ isAuthenticated: true, user: { emailVerified: true } });

        render(<OrgReviews reviews={[]} organizationId="org1" />);

        const writeBtn = screen.getByText('Écrire un avis');
        fireEvent.click(writeBtn);

        expect(screen.getByTestId('review-form')).toBeInTheDocument();
    });

    it('redirects to verify if email not verified', () => {
        (useAuthStore as jest.Mock).mockReturnValue({ isAuthenticated: true, user: { emailVerified: false } });

        render(<OrgReviews reviews={[]} organizationId="org1" />);

        const writeBtn = screen.getByText('Écrire un avis');
        fireEvent.click(writeBtn);

        expect(mockRouter.push).toHaveBeenCalledWith('/resend-verification');
    });

    it('hides write button for owner', () => {
        (useAuthStore as jest.Mock).mockReturnValue({ isAuthenticated: true, user: { actorId: 'owner1' } });

        render(<OrgReviews reviews={[]} organizationId="org1" ownerId="owner1" />);

        expect(screen.queryByText('Écrire un avis')).not.toBeInTheDocument();
    });
});
