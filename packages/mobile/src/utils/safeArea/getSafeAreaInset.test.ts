import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { getSafeAreaInset } from './getSafeAreaInset.ts';

describe('getSafeAreaInset', () => {
  let mockDiv: HTMLDivElement;

  beforeEach(() => {
    mockDiv = document.createElement('div');
    vi.spyOn(document, 'createElement').mockReturnValue(mockDiv);
    vi.spyOn(document.body, 'appendChild').mockReturnValue(mockDiv);
    vi.spyOn(document.body, 'removeChild').mockReturnValue(mockDiv);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('basic functionality', () => {
    it('should return object with all zeros when safe area inset is not supported', () => {
      vi.spyOn(window, 'getComputedStyle').mockReturnValue({
        getPropertyValue: () => '',
      } as unknown as CSSStyleDeclaration);

      expect(getSafeAreaInset()).toEqual({ top: 0, bottom: 0, left: 0, right: 0 });
    });

    it('should return the safe area inset values as object', () => {
      vi.spyOn(window, 'getComputedStyle').mockReturnValue({
        getPropertyValue: (prop: string) => {
          if (prop === 'padding-top') return '47px';
          if (prop === 'padding-bottom') return '34px';
          if (prop === 'padding-left') return '0px';
          if (prop === 'padding-right') return '0px';
          return '0px';
        },
      } as unknown as CSSStyleDeclaration);

      expect(getSafeAreaInset()).toEqual({ top: 47, bottom: 34, left: 0, right: 0 });
    });

    it('should return 0 for non-numeric values', () => {
      vi.spyOn(window, 'getComputedStyle').mockReturnValue({
        getPropertyValue: () => 'auto',
      } as unknown as CSSStyleDeclaration);

      expect(getSafeAreaInset()).toEqual({ top: 0, bottom: 0, left: 0, right: 0 });
    });
  });

  describe('DOM manipulation', () => {
    it('should create a temporary div element', () => {
      vi.spyOn(window, 'getComputedStyle').mockReturnValue({
        getPropertyValue: () => '34px',
      } as unknown as CSSStyleDeclaration);

      getSafeAreaInset();

      expect(document.createElement).toHaveBeenCalledWith('div');
    });

    it('should set position to fixed on the div', () => {
      vi.spyOn(window, 'getComputedStyle').mockReturnValue({
        getPropertyValue: () => '34px',
      } as unknown as CSSStyleDeclaration);

      getSafeAreaInset();

      expect(mockDiv.style.position).toBe('fixed');
    });

    it('should append and remove the div from document body', () => {
      vi.spyOn(window, 'getComputedStyle').mockReturnValue({
        getPropertyValue: () => '34px',
      } as unknown as CSSStyleDeclaration);

      getSafeAreaInset();

      expect(document.body.appendChild).toHaveBeenCalledWith(mockDiv);
      expect(document.body.removeChild).toHaveBeenCalledWith(mockDiv);
    });

    it('should set all env() properties at once', () => {
      vi.spyOn(window, 'getComputedStyle').mockReturnValue({
        getPropertyValue: () => '0px',
      } as unknown as CSSStyleDeclaration);

      const setPropertySpy = vi.spyOn(mockDiv.style, 'setProperty');

      getSafeAreaInset();

      expect(setPropertySpy).toHaveBeenCalledWith('padding-top', 'env(safe-area-inset-top)');
      expect(setPropertySpy).toHaveBeenCalledWith('padding-bottom', 'env(safe-area-inset-bottom)');
      expect(setPropertySpy).toHaveBeenCalledWith('padding-left', 'env(safe-area-inset-left)');
      expect(setPropertySpy).toHaveBeenCalledWith('padding-right', 'env(safe-area-inset-right)');
    });

    it('should only create one DOM element for all values', () => {
      vi.spyOn(window, 'getComputedStyle').mockReturnValue({
        getPropertyValue: () => '0px',
      } as unknown as CSSStyleDeclaration);

      getSafeAreaInset();

      expect(document.createElement).toHaveBeenCalledTimes(1);
      expect(document.body.appendChild).toHaveBeenCalledTimes(1);
      expect(document.body.removeChild).toHaveBeenCalledTimes(1);
    });
  });

  describe('typical device values', () => {
    it('should handle Dynamic Island device (iPhone 14 Pro)', () => {
      vi.spyOn(window, 'getComputedStyle').mockReturnValue({
        getPropertyValue: (prop: string) => {
          if (prop === 'padding-top') return '59px';
          if (prop === 'padding-bottom') return '34px';
          return '0px';
        },
      } as unknown as CSSStyleDeclaration);

      expect(getSafeAreaInset()).toEqual({ top: 59, bottom: 34, left: 0, right: 0 });
    });

    it('should handle notch device (iPhone X/11/12/13)', () => {
      vi.spyOn(window, 'getComputedStyle').mockReturnValue({
        getPropertyValue: (prop: string) => {
          if (prop === 'padding-top') return '47px';
          if (prop === 'padding-bottom') return '34px';
          return '0px';
        },
      } as unknown as CSSStyleDeclaration);

      expect(getSafeAreaInset()).toEqual({ top: 47, bottom: 34, left: 0, right: 0 });
    });

    it('should handle landscape mode with side insets', () => {
      vi.spyOn(window, 'getComputedStyle').mockReturnValue({
        getPropertyValue: (prop: string) => {
          if (prop === 'padding-top') return '0px';
          if (prop === 'padding-bottom') return '21px';
          if (prop === 'padding-left') return '47px';
          if (prop === 'padding-right') return '47px';
          return '0px';
        },
      } as unknown as CSSStyleDeclaration);

      expect(getSafeAreaInset()).toEqual({ top: 0, bottom: 21, left: 47, right: 47 });
    });

    it('should handle no inset (desktop or older devices)', () => {
      vi.spyOn(window, 'getComputedStyle').mockReturnValue({
        getPropertyValue: () => '0px',
      } as unknown as CSSStyleDeclaration);

      expect(getSafeAreaInset()).toEqual({ top: 0, bottom: 0, left: 0, right: 0 });
    });
  });
});
