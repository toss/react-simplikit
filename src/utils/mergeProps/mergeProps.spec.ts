/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, expect, it } from 'vitest';

import { mergeProps } from './mergeProps.ts';

describe('mergeProps', () => {
  it('should return the same props when a single set of props is passed', () => {
    const props = {
      onClick: () => {},
      onKeyDown: () => {},
      className: 'className',
    };

    expect(mergeProps(props)).toEqual(props);
  });

  it('should combine props of different names', () => {
    const onClick = () => {};
    const onFocus = () => {};
    const onKeyDown = () => {};

    const props = mergeProps({ onClick }, { onFocus }, { onKeyDown });

    expect(props).toHaveProperty('onClick', onClick);
    expect(props).toHaveProperty('onFocus', onFocus);
    expect(props).toHaveProperty('onKeyDown', onKeyDown);
  });

  it('should concatenate classNames', () => {
    const props = mergeProps({ className: 'one' }, { className: 'two' });
    expect(props).toHaveProperty('className', 'one two');
  });

  it('should merge styles', () => {
    const props = mergeProps({ style: { display: 'none' } }, { style: { color: 'red' } });
    expect(props).toHaveProperty('style', { display: 'none', color: 'red' });
  });

  it('should call duplicate event handlers in sequence', () => {
    let tape = '';
    const one = () => (tape += 'one ');
    const two = () => (tape += 'two ');
    const three = () => (tape += 'three');
    mergeProps({ onClick: one }, { onClick: two }, { onClick: three }).onClick();

    expect(tape).toBe('one two three');
  });

  it('should pass arguments to functions', () => {
    const argsCalled = {
      one: [null],
      two: [null],
    };

    const one = (...args: any[]) => (argsCalled.one = args);
    const two = (...args: any[]) => (argsCalled.two = args);
    const args = [{}, {}];
    mergeProps({ onClick: one }, { onClick: two }).onClick(...args);

    expect(argsCalled.one[0]).toBe(args[0]);
    expect(argsCalled.one[1]).toBe(args[1]);
    expect(argsCalled.two[0]).toBe(args[0]);
    expect(argsCalled.two[1]).toBe(args[1]);
  });

  it('should pass through the first instance of unknown prop', () => {
    const unknown = {};
    expect(mergeProps({ unknown }).unknown).toBe(unknown);
  });

  it('should skip undefined functions', () => {
    let tape = '';
    const one = () => (tape += 'only one');

    const props = mergeProps({ onClick: one }, { onClick: undefined } as { onClick?: () => void });
    expect(props.onClick()).toBe('only one');
  });

  it('should skip undefined values', () => {
    expect(mergeProps({ isDisabled: undefined }, { isDisabled: true }, { isDisabled: undefined })).toStrictEqual({
      isDisabled: true,
    });
  });

  it('should return empty object when no input passed', () => {
    expect(mergeProps()).toEqual({});
  });
});
