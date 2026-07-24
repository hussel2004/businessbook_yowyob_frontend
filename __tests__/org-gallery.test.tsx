import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { OrgGallery } from '@/components/features/organization/org-gallery';
import { MediaItem } from '@/lib/api/public';

describe('OrgGallery', () => {
    const mockMedia: MediaItem[] = [
        { id: '1', organizationId: 'org1', fileUrl: '/img1.jpg', fileName: 'Img 1', fileType: 'image' },
        { id: '2', organizationId: 'org1', fileUrl: '/img2.jpg', fileName: 'Img 2', fileType: 'image' },
        { id: '3', organizationId: 'org1', fileUrl: '/doc.pdf', fileName: 'Doc 1', fileType: 'document' } // Should be filtered out
    ];

    it('renders images only', () => {
        render(<OrgGallery media={mockMedia} organizationName="Test Org" />);

        const images = screen.getAllByRole('img');
        expect(images).toHaveLength(2); // Only 2 images
    });

    it('opens lightbox on click', async () => {
        render(<OrgGallery media={mockMedia} organizationName="Test Org" />);

        const firstImageBtn = screen.getAllByRole('button')[0];
        fireEvent.click(firstImageBtn);

        // Wait for lightbox to open (look for increased image count)
        await waitFor(() => {
            const allImages = screen.getAllByRole('img');
            expect(allImages.length).toBeGreaterThan(2);
        });
    });

    it('does not render if no images', () => {
        const { container } = render(<OrgGallery media={[]} organizationName="Test Org" />);
        expect(container).toBeEmptyDOMElement();
    });
});
