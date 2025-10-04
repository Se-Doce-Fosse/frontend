// @ts-nocheck
// Polyfill global para TextEncoder/TextDecoder em ambiente de teste (Jest/jsdom)
import { TextEncoder, TextDecoder } from 'util';
if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder;
}
if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = TextDecoder;
}
import '@testing-library/jest-dom';

// Configurações globais para Jest
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock do fetch para testes
global.fetch = jest.fn();

// Reset fetch mock antes de cada teste
beforeEach(() => {
  (fetch as jest.Mock).mockClear();
});
