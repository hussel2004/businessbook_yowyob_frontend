import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import VerifyEmailPage from '../page';
import { confirmEmailVerification } from '@/lib/api/auth';
import { useRouter, useSearchParams } from 'next/navigation';
import '@testing-library/jest-dom';

// Mock everything
jest.mock('@/lib/api/auth');
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
    useSearchParams: jest.fn(),
}));

describe('VerifyEmailPage', () => {
    const mockRouter = { push: jest.fn() };

    beforeEach(() => {
        jest.clearAllMocks();
        (useRouter as jest.Mock).mockReturnValue(mockRouter);
    });

    it('shows loading state initially', () => {
        (useSearchParams as jest.Mock).mockReturnValue({ get: () => 'valid-token' });
        (confirmEmailVerification as jest.Mock).mockImplementation(() => new Promise(() => { })); // Hang promise

        render(<VerifyEmailPage />);
        expect(screen.getByText(/vérification de votre email/i)).toBeInTheDocument();
    });

    it('calls confirmEmailVerification with verificationToken', async () => {
        (useSearchParams as jest.Mock).mockReturnValue({ get: () => 'valid-token' });
        (confirmEmailVerification as jest.Mock).mockResolvedValue({ success: true, data: null, message: 'Email verified.' });

        render(<VerifyEmailPage />);

        await waitFor(() => {
            expect(confirmEmailVerification).toHaveBeenCalledWith('valid-token');
        });
    });

    it('shows success message and button on success', async () => {
        (useSearchParams as jest.Mock).mockReturnValue({ get: () => 'valid-token' });
        (confirmEmailVerification as jest.Mock).mockResolvedValue({ success: true, data: null, message: 'Email verified.' });

        render(<VerifyEmailPage />);

        await waitFor(() => {
            expect(screen.getByText(/email vérifié/i)).toBeInTheDocument();
            expect(screen.getByText(/continuer vers/i)).toBeInTheDocument();
        });
    });

    it('shows error state on failure', async () => {
        (useSearchParams as jest.Mock).mockReturnValue({ get: () => 'invalid-token' });
        (confirmEmailVerification as jest.Mock).mockRejectedValue(new Error('Invalid token'));

        render(<VerifyEmailPage />);

        await waitFor(() => {
            expect(screen.getByText(/échec de la vérification/i)).toBeInTheDocument();
            expect(screen.getByText(/renvoyer le lien/i)).toBeInTheDocument();
        });
    });

    it('shows missing token state', () => {
        (useSearchParams as jest.Mock).mockReturnValue({ get: () => null });
        render(<VerifyEmailPage />);
        expect(screen.getByText(/jeton de vérification manquant/i)).toBeInTheDocument();
    });
});
