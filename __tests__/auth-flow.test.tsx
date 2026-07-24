import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginForm } from '@/components/features/auth/login-form';
import { ApiException } from '@/lib/api/client';

// Mock hooks
const mockLogin = jest.fn();
const mockIsLoggingIn = false;

jest.mock('@/lib/auth/hooks', () => ({
    useAuth: () => ({
        login: mockLogin,
        isLoggingIn: mockIsLoggingIn,
    }),
}));

const mockGet = jest.fn();
jest.mock('next/navigation', () => ({
    useSearchParams: () => ({
        get: mockGet,
    }),
}));

describe('LoginForm', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockGet.mockReturnValue(null);
    });

    it('renders login form correctly', () => {
        render(<LoginForm />);
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/mot de passe/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /se connecter/i })).toBeInTheDocument();
    });

    it('shows validation errors for empty fields', async () => {
        render(<LoginForm />);

        const submitButton = screen.getByRole('button', { name: /se connecter/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText("L'email est requis")).toBeInTheDocument();
            expect(screen.getByText("Le mot de passe est requis")).toBeInTheDocument();
        });
    });

    it('calls login with correct data on submission', async () => {
        render(<LoginForm />);

        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText(/mot de passe/i);
        const submitButton = screen.getByRole('button', { name: /se connecter/i });

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'Password123!' } });

        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith(
                { email: 'test@example.com', password: 'Password123!' },
                undefined
            );
        });
    });

    it('displays error message on login failure', async () => {
        mockLogin.mockRejectedValue(new ApiException('Invalid credentials', 401, 'INVALID_CREDENTIALS'));

        render(<LoginForm />);

        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText(/mot de passe/i);
        const submitButton = screen.getByRole('button', { name: /se connecter/i });

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'Password123!' } });

        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
        });
    });
});
