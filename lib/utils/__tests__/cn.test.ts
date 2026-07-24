import { cn } from '../cn';

describe('cn utility', () => {
    it('merges class names correctly', () => {
        expect(cn('p-4', 'bg-red-500')).toBe('p-4 bg-red-500');
    });

    it('handles conditional classes', () => {
        const isTrue = true;
        const isFalse = false;
        expect(cn('p-4', isTrue && 'bg-red-500', isFalse && 'text-white')).toBe(
            'p-4 bg-red-500'
        );
    });

    it('merges tailwind conflicts', () => {
        expect(cn('p-4', 'p-6')).toBe('p-6');
        expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
    });

    it('handles arrays and objects', () => {
        expect(cn(['px-2', 'py-2'])).toBe('px-2 py-2');
        expect(cn({ 'bg-red-500': true, 'text-white': false })).toBe('bg-red-500');
    });
});
