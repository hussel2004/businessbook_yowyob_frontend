'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

import { cn } from '@/lib/utils/cn';
import { Button } from './button';

export interface PaginationProps extends React.HTMLAttributes<HTMLElement> {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    siblingCount?: number;
    showFirstLast?: boolean;
}

const range = (start: number, end: number) => {
    const length = end - start + 1;
    return Array.from({ length }, (_, idx) => idx + start);
};

const Pagination = ({
    className,
    currentPage,
    totalPages,
    onPageChange,
    siblingCount = 1,
    showFirstLast = true,
    ...props
}: PaginationProps) => {
    const paginationRange = React.useMemo(() => {
        const totalPageNumbers = siblingCount + 5; // firstPage + ... + siblingPages + currentPage + siblingPages + ... + lastPage

        // Case 1: Total pages less than page numbers we want to show
        if (totalPageNumbers >= totalPages) {
            return range(1, totalPages);
        }

        const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
        const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

        const shouldShowLeftDots = leftSiblingIndex > 2;
        const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

        const firstPageIndex = 1;
        const lastPageIndex = totalPages;

        // Case 2: No left dots, but right dots
        if (!shouldShowLeftDots && shouldShowRightDots) {
            const leftItemCount = 3 + 2 * siblingCount;
            const leftRange = range(1, leftItemCount);
            return [...leftRange, 'dots-right', totalPages];
        }

        // Case 3: Left dots, but no right dots
        if (shouldShowLeftDots && !shouldShowRightDots) {
            const rightItemCount = 3 + 2 * siblingCount;
            const rightRange = range(totalPages - rightItemCount + 1, totalPages);
            return [firstPageIndex, 'dots-left', ...rightRange];
        }

        // Case 4: Both left and right dots
        if (shouldShowLeftDots && shouldShowRightDots) {
            const middleRange = range(leftSiblingIndex, rightSiblingIndex);
            return [firstPageIndex, 'dots-left', ...middleRange, 'dots-right', lastPageIndex];
        }

        return [];
    }, [totalPages, siblingCount, currentPage]);

    if (totalPages <= 1) return null;

    return (
        <nav
            role="navigation"
            aria-label="Pagination"
            className={cn('flex items-center justify-center gap-1', className)}
            {...props}
        >
            {/* Previous button */}
            <Button
                variant="outline"
                size="icon"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Page précédente"
            >
                <ChevronLeft className="h-4 w-4" />
            </Button>

            {/* Page numbers */}
            <div className="flex items-center gap-1">
                {paginationRange.map((pageNumber) => {
                    if (typeof pageNumber === 'string') {
                        return (
                            <span
                                key={pageNumber}
                                className="flex h-9 w-9 items-center justify-center"
                            >
                                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                            </span>
                        );
                    }

                    return (
                        <Button
                            key={pageNumber}
                            variant={pageNumber === currentPage ? 'default' : 'outline'}
                            size="icon"
                            onClick={() => onPageChange(pageNumber)}
                            aria-label={`Page ${pageNumber}`}
                            aria-current={pageNumber === currentPage ? 'page' : undefined}
                        >
                            {pageNumber}
                        </Button>
                    );
                })}
            </div>

            {/* Next button */}
            <Button
                variant="outline"
                size="icon"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Page suivante"
            >
                <ChevronRight className="h-4 w-4" />
            </Button>
        </nav>
    );
};
Pagination.displayName = 'Pagination';

export { Pagination };
