import { DefaultTheme } from 'vitepress';

export function sortByText(items: DefaultTheme.SidebarItem[]): DefaultTheme.SidebarItem[] {
  return items.map(item => ({
    ...item,
    items: item.items ? [...item.items].sort((a, b) => a.text?.localeCompare(b.text || '') || 0) : undefined,
  }));
}
