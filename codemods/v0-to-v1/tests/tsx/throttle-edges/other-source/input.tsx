import { useThrottle } from './useThrottle';

export const save = useThrottle(persist, 1000, { edges: ['leading'] });
