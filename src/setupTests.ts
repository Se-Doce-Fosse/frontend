// Polyfill para TextEncoder/TextDecoder no ambiente de testes do Jest
import { TextEncoder, TextDecoder } from 'util';
if (typeof global.TextEncoder === 'undefined') {
  // @ts-expect-error: Jest pode não ter TextDecoder, então fazemos o polyfill
  global.TextEncoder = TextEncoder;
}
if (typeof global.TextDecoder === 'undefined') {
  // @ts-expect-error: Jest pode não ter TextDecoder, então fazemos o polyfill
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
