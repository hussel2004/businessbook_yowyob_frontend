import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginForm } from '@/components/features/auth/login-form';
import { useAuth } from '@/lib/auth/hooks';
import { useSearchParams } from 'next/navigation';

// Mock dependencies
jest.mock('next/navigation', () => ({
    useSearchParams: jest.fn(),
    useRouter: jest.fn(),
}));

jest.mock('@/lib/auth/hooks', () => ({
    useAuth: jest.fn(),
}));

describe('LoginForm', () => {
    const mockLogin = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useAuth as jest.Mock).mockReturnValue({ login: mockLogin, isLoggingIn: false });
        (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams());
    });

    it('submits form with valid data', async () => {
        render(<LoginForm />);

        fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText(/Mot de passe/i), { target: { value: 'password123' } });

        const submitBtn = screen.getByRole('button', { name: /Se connecter/i });
        fireEvent.click(submitBtn);

        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith(
                { email: 'test@example.com', password: 'password123' },
                undefined
            );
        });
    });

    it('shows validation errors', async () => {
        render(<LoginForm />);

        const submitBtn = screen.getByRole('button', { name: /Se connecter/i });
        fireEvent.click(submitBtn);

        await waitFor(() => {
            // Match "email invalide" OR "invalid email" OR similar
            expect(screen.getByText(/email|valide/i)).toBeInTheDocument();
        });
    });

    it('toggles password visibility', () => {
        render(<LoginForm />);
        const passwordInput = screen.getByLabelText(/Mot de passe/i);
        const toggleBtn = screen.getAllByRole('button')[0]; // First button is eye icon usually

        expect(passwordInput).toHaveAttribute('type', 'password');
        fireEvent.click(toggleBtn);
        expect(passwordInput).toHaveAttribute('type', 'text');
    });

    it('displays error from hook', async () => {
        mockLogin.mockRejectedValue(new Error('Auth failed'));

        render(<LoginForm />);

        fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText(/Mot de passe/i), { target: { value: 'password123' } });
        fireEvent.click(screen.getByRole('button', { name: /Se connecter/i }));

        await waitFor(() => {
            expect(screen.getByText(/Une erreur est survenue/i)).toBeInTheDocument();
        });
    });
});
