import { describe, it, expect } from 'vitest';

describe('Smoke Test', () => {
    it('should pass basic math', () => {
        expect(1 + 1).toBe(2);
    });

    it('should have localStorage mocked', () => {
        localStorage.setItem('test', 'value');
        expect(localStorage.getItem('test')).toBe('value');
        localStorage.removeItem('test');
        expect(localStorage.getItem('test')).toBeNull();
    });
});
