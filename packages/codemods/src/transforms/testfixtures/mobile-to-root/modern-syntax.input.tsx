import { useToggle, type UseToggleReturn } from 'react-simplikit';
import { useKeyboardHeight, type SafeAreaInset } from '@react-simplikit/mobile';

const conf = { open: false } satisfies { open: boolean };
class Store { @observable count = 0; }
declare function observable(...args: unknown[]): void;
export function C(): JSX.Element { const k = useKeyboardHeight(); return <>{String(conf.open)}{k.keyboardHeight}</>; }
export type T = [UseToggleReturn, SafeAreaInset, Store];
export { useToggle };
