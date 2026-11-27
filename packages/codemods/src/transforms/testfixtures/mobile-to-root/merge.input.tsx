'use client';
/**
 * Bottom sheet.
 */
import { useState } from 'react';
import { useToggle } from 'react-simplikit';
import {
  useKeyboardHeight,
  useSafeAreaInset, // insets for the notch
} from '@react-simplikit/mobile';
import { isIOS as isApple } from '@react-simplikit/mobile';
import type { SafeAreaInset } from "@react-simplikit/mobile";

export function Sheet<T extends object>({ items }: { items: T[] }) {
	const [open, toggle] = useToggle();
	const [n] = useState(0);
	const { keyboardHeight } = useKeyboardHeight();
	const inset: SafeAreaInset = useSafeAreaInset();
	return <div onClick={toggle}>{isApple() && open ? keyboardHeight + inset.bottom + n : items.length}</div>;
}
