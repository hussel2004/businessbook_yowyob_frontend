import { render, screen, fireEvent } from '@testing-library/react'
import { OrgHeader } from '../org-header'

// Mock lucide-react
jest.mock('lucide-react', () => ({
    BadgeCheck: () => <svg data-testid="icon-badge-check" />,
    MapPin: () => <svg data-testid="icon-map-pin" />,
    Globe: () => <svg data-testid="icon-globe" />,
    Phone: () => <svg data-testid="icon-phone" />,
    Mail: () => <svg data-testid="icon-mail" />,
    Share2: () => <svg data-testid="icon-share2" />,
    Heart: () => <svg data-testid="icon-heart" />,
    ArrowLeft: () => <svg data-testid="icon-arrow-left" />,
    MessageCircle: () => <svg data-testid="icon-message-circle" />,
}))

// Mock Image component from next/image
jest.mock('next/image', () => ({
    __esModule: true,
    default: (props: any) => <img {...props} />,
}))

// Mock Next Link
jest.mock('next/link', () => ({
    __esModule: true,
    default: ({ children, href }: any) => <a href={href}>{children}</a>,
}))

// Mock UI components
jest.mock('@/components/ui/badge', () => ({
    Badge: ({ children }: any) => <div data-testid="badge">{children}</div>,
}))

jest.mock('@/components/ui/button', () => ({
    Button: ({ children, onClick }: any) => <button onClick={onClick}>{children}</button>,
}))

jest.mock('@/components/ui/star-rating', () => ({
    StarRating: ({ rating }: any) => <div data-testid="stars">{rating}</div>,
}))

// Define a valid mock organization
const mockOrg = {
    id: '123',
    name: 'TechCorp Africa',
    longName: 'TechCorp Africa',
    shortName: 'TechCorp',
    slug: 'techcorp-africa',
    description: 'Best tech company',
    categoryId: 'cat-1',
    categoryName: 'Technology',
    averageRating: 4.5,
    reviewCount: 10,
    isVerified: true,
    coverImageUrl: '/cover.jpg',
    logoUrl: '/logo.jpg',
    yearFounded: 2020,
    primaryPhone: '+237699999999',
    primaryEmail: 'contact@techcorp.com',
    websiteUrl: 'https://techcorp.com',
    status: 'ACTIVE',
    isFeatured: false,
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01',
}

describe('OrgHeader', () => {
    it('renders organization details correctly', () => {
        render(<OrgHeader org={mockOrg as any} />)

        // Name
        expect(screen.getByText('TechCorp Africa')).toBeInTheDocument()

        // Category
        expect(screen.getByText('Technology')).toBeInTheDocument()

        // Year Founded
        expect(screen.getByText('Depuis 2020')).toBeInTheDocument()

        // Contact Info
        expect(screen.getByText('+237699999999')).toBeInTheDocument()
        expect(screen.getByText('contact@techcorp.com')).toBeInTheDocument()

        // Rating
        expect(screen.getAllByText('4.5').length).toBeGreaterThan(0)
        expect(screen.getByText('(10 avis)')).toBeInTheDocument()
    })

    it('renders placeholder logo when no logo provided', () => {
        const orgNoLogo = { ...mockOrg, logoUrl: undefined }
        render(<OrgHeader org={orgNoLogo as any} />)

        // Should show first letter
        expect(screen.getByText('T')).toBeInTheDocument()
    })

    it('handles interaction buttons', () => {
        const onShare = jest.fn()
        const onFavorite = jest.fn()

        render(<OrgHeader org={mockOrg as any} onShare={onShare} onFavorite={onFavorite} />)

        fireEvent.click(screen.getByText('Partager'))
        expect(onShare).toHaveBeenCalledTimes(1)

        fireEvent.click(screen.getByText('Ajouter'))
        expect(onFavorite).toHaveBeenCalledTimes(1)
    })
})
