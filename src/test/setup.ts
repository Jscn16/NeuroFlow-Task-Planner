import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
    cleanup();
});

// Mock localStorage
const localStorageMock = (function () {
    let store: Record<string, string> = {};
    return {
        getItem: function (key: string) {
            return store[key] || null;
        },
        setItem: function (key: string, value: string) {
            store[key] = value.toString();
        },
        clear: function () {
            store = {};
        },
        removeItem: function (key: string) {
            delete store[key];
        },
        key: function (index: number) {
            return Object.keys(store)[index] || null;
        },
        length: 0
    };
})();

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock
});

// Mock AudioContext for playSuccessSound
Object.defineProperty(window, 'AudioContext', {
    value: vi.fn().mockImplementation(() => ({
        createOscillator: vi.fn().mockImplementation(() => ({
            connect: vi.fn(),
            start: vi.fn(),
            stop: vi.fn(),
            type: 'sine',
            frequency: { value: 0 },
        })),
        createGain: vi.fn().mockImplementation(() => ({
            connect: vi.fn(),
            gain: {
                setValueAtTime: vi.fn(),
                linearRampToValueAtTime: vi.fn(),
                exponentialRampToValueAtTime: vi.fn(),
            },
        })),
        currentTime: 0,
        destination: {},
    })),
});
