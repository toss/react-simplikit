import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { getSafeAreaInset } from './getSafeAreaInset.ts';

describe('getSafeAreaInset', () => {
  let mockDiv: HTMLDivElement;
  let appendChildSpy: ReturnType<typeof vi.spyOn>;
  let removeChildSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    mockDiv = document.createElement('div');
    vi.spyOn(document, 'createElement').mockReturnValue(mockDiv);
    appendChildSpy = vi.spyOn(document.body, 'appendChild').mockReturnValue(mockDiv);
    removeChildSpy = vi.spyOn(document.body, 'removeChild').mockReturnValue(mockDiv);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('basic functionality', () => {
    it('should return 0 when safe area inset is not supported', () => {
      vi.spyOn(window, 'getComputedStyle').mockReturnValue({
        getPropertyValue: () => '',
      } as CSSStyleDeclaration);

      expect(getSafeAreaInset('bottom')).toBe(0);
    });

    it('should return the safe area inset value as number', () => {
      vi.spyOn(window, 'getComputedStyle').mockReturnValue({
        getPropertyValue: () => '34px',
      } as CSSStyleDeclaration);

      expect(getSafeAreaInset('bottom')).toBe(34);
    });

    it('should return 0 for non-numeric values', () => {
      vi.spyOn(window, 'getComputedStyle').mockReturnValue({
        getPropertyValue: () => 'auto',
      } as CSSStyleDeclaration);

      expect(getSafeAreaInset('top')).toBe(0);
    });
  });

  describe('DOM manipulation', () => {
    it('should create a temporary div element', () => {
      vi.spyOn(window, 'getComputedStyle').mockReturnValue({
        getPropertyValue: () => '34px',
      } as CSSStyleDeclaration);

      getSafeAreaInset('bottom');

      expect(document.createElement).toHaveBeenCalledWith('div');
    });

    it('should set position to fixed on the div', () => {
      vi.spyOn(window, 'getComputedStyle').mockReturnValue({
        getPropertyValue: () => '34px',
      } as CSSStyleDeclaration);

      getSafeAreaInset('bottom');

      expect(mockDiv.style.position).toBe('fixed');
    });

    it('should append and remove the div from document body', () => {
      vi.spyOn(window, 'getComputedStyle').mockReturnValue({
        getPropertyValue: () => '34px',
      } as CSSStyleDeclaration);

      getSafeAreaInset('bottom');

      expect(appendChildSpy).toHaveBeenCalledWith(mockDiv);
      expect(removeChildSpy).toHaveBeenCalledWith(mockDiv);
    });
  });

  describe('position-specific behavior', () => {
    it('should set env(safe-area-inset-top) for top position', () => {
      vi.spyOn(window, 'getComputedStyle').mockReturnValue({
        getPropertyValue: () => '47px',
      } as CSSStyleDeclaration);

      const setPropertySpy = vi.spyOn(mockDiv.style, 'setProperty');

      getSafeAreaInset('top');

      expect(setPropertySpy).toHaveBeenCalledWith('padding-top', 'env(safe-area-inset-top)');
    });

    it('should set env(safe-area-inset-bottom) for bottom position', () => {
      vi.spyOn(window, 'getComputedStyle').mockReturnValue({
        getPropertyValue: () => '34px',
      } as CSSStyleDeclaration);

      const setPropertySpy = vi.spyOn(mockDiv.style, 'setProperty');

      getSafeAreaInset('bottom');

      expect(setPropertySpy).toHaveBeenCalledWith('padding-bottom', 'env(safe-area-inset-bottom)');
    });

    it('should set env(safe-area-inset-left) for left position', () => {
      vi.spyOn(window, 'getComputedStyle').mockReturnValue({
        getPropertyValue: () => '0px',
      } as CSSStyleDeclaration);

      const setPropertySpy = vi.spyOn(mockDiv.style, 'setProperty');

      getSafeAreaInset('left');

      expect(setPropertySpy).toHaveBeenCalledWith('padding-left', 'env(safe-area-inset-left)');
    });

    it('should set env(safe-area-inset-right) for right position', () => {
      vi.spyOn(window, 'getComputedStyle').mockReturnValue({
        getPropertyValue: () => '0px',
      } as CSSStyleDeclaration);

      const setPropertySpy = vi.spyOn(mockDiv.style, 'setProperty');

      getSafeAreaInset('right');

      expect(setPropertySpy).toHaveBeenCalledWith('padding-right', 'env(safe-area-inset-right)');
    });

    it('should read correct padding property for each position', () => {
      const positions = ['top', 'bottom', 'left', 'right'] as const;

      for (const position of positions) {
        vi.spyOn(window, 'getComputedStyle').mockReturnValue({
          getPropertyValue: (prop: string) => {
            if (prop === `padding-${position}`) {
              return '10px';
            }
            return '0px';
          },
        } as CSSStyleDeclaration);

        expect(getSafeAreaInset(position)).toBe(10);
        vi.restoreAllMocks();

        mockDiv = document.createElement('div');
        vi.spyOn(document, 'createElement').mockReturnValue(mockDiv);
        vi.spyOn(document.body, 'appendChild').mockReturnValue(mockDiv);
        vi.spyOn(document.body, 'removeChild').mockReturnValue(mockDiv);
      }
    });
  });

  describe('typical device values', () => {
    it('should handle Dynamic Island top inset (59px)', () => {
      vi.spyOn(window, 'getComputedStyle').mockReturnValue({
        getPropertyValue: () => '59px',
      } as CSSStyleDeclaration);

      expect(getSafeAreaInset('top')).toBe(59);
    });

    it('should handle notch top inset (47px)', () => {
      vi.spyOn(window, 'getComputedStyle').mockReturnValue({
        getPropertyValue: () => '47px',
      } as CSSStyleDeclaration);

      expect(getSafeAreaInset('top')).toBe(47);
    });

    it('should handle home indicator bottom inset (34px)', () => {
      vi.spyOn(window, 'getComputedStyle').mockReturnValue({
        getPropertyValue: () => '34px',
      } as CSSStyleDeclaration);

      expect(getSafeAreaInset('bottom')).toBe(34);
    });

    it('should handle landscape bottom inset (21px)', () => {
      vi.spyOn(window, 'getComputedStyle').mockReturnValue({
        getPropertyValue: () => '21px',
      } as CSSStyleDeclaration);

      expect(getSafeAreaInset('bottom')).toBe(21);
    });

    it('should handle no inset (0px)', () => {
      vi.spyOn(window, 'getComputedStyle').mockReturnValue({
        getPropertyValue: () => '0px',
      } as CSSStyleDeclaration);

      expect(getSafeAreaInset('left')).toBe(0);
      expect(getSafeAreaInset('right')).toBe(0);
    });
  });
});
