import { render, screen, fireEvent } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import { OrgAddressForm } from '../org-address-form';
import React from 'react';

// Wrapper component to provide React Hook Form context
const Wrapper = ({ defaultValues = {}, onSubmit = jest.fn() }) => {
    const { register, formState: { errors }, handleSubmit } = useForm({
        defaultValues,
        mode: 'onChange'
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <OrgAddressForm register={register} errors={errors} prefix="address" />
            <button type="submit">Submit</button>
        </form>
    );
};

describe('OrgAddressForm', () => {
    test('renders all address fields correctly', () => {
        render(<Wrapper />);

        // Using getByLabelText with regex to match varying labels
        // Assuming labels from usage in Step 84
        expect(screen.getByLabelText(/Adresse \(Rue\/Quartier\)/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Ville/i)).toBeInTheDocument();
        // Country maps to 'Pays' usually
        expect(screen.getByLabelText(/Pays/i)).toBeInTheDocument();
    });

    test('accepts user input', () => {
        render(<Wrapper />);

        const cityInput = screen.getByLabelText(/Ville/i);
        fireEvent.change(cityInput, { target: { value: 'Douala' } });
        expect(cityInput).toHaveValue('Douala');
    });

    test('renders prepopulated values', () => {
        const defaultValues = {
            address: {
                city: 'Yaoundé',
                countryCode: 'CM'
            }
        };
        render(<Wrapper defaultValues={defaultValues} />);

        expect(screen.getByLabelText(/Ville/i)).toHaveValue('Yaoundé');
    });
});
