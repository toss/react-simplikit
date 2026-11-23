'use client';
/**
 * Bottom sheet.
 */
import { useState } from 'react';
import { useToggle, isIOS as isApple } from 'react-simplikit';
import {
  useKeyboardHeight,
  useSafeAreaInset, // insets for the notch
} from 'react-simplikit';
import type { SafeAreaInset } from "react-simplikit";

export function Sheet<T extends object>({ items }: { items: T[] }) {
	const [open, toggle] = useToggle();
	const [n] = useState(0);
	const { keyboardHeight } = useKeyboardHeight();
	const inset: SafeAreaInset = useSafeAreaInset();
	return <div onClick={toggle}>{isApple() && open ? keyboardHeight + inset.bottom + n : items.length}</div>;
}
