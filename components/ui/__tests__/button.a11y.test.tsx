import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Button } from '../button';

expect.extend(toHaveNoViolations);

describe('Button Accessibility', () => {
    it('should have no violations', async () => {
        const { container } = render(<Button>Click me</Button>);
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });

    it('should have no violations with variants', async () => {
        const { container } = render(<Button variant="destructive">Delete</Button>);
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
});
