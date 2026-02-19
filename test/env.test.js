import { describe, it, expect } from 'vitest';

describe('Testing Environment', () => {
  it('should have access to JSDOM', () => {
    const div = document.createElement('div');
    div.innerHTML = 'Hello Chakra';
    expect(div.textContent).toBe('Hello Chakra');
  });
});
