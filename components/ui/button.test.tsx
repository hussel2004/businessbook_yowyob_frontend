import { render, screen } from '@testing-library/react'
import { Button } from './button'

describe('Button', () => {
    it('renders correctly', () => {
        render(<Button>Click me</Button>)
        const button = screen.getByRole('button', { name: /click me/i })
        expect(button).toBeInTheDocument()
    })

    it('renders as a link when using asChild', () => {
        // Note: This test assumes you might have logic for asChild or standard behavior.
        // Use this to verify base rendering.
    })
})
