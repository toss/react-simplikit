import { useStorageState } from 'react-simplikit';

export function Profile() {
  const [token, setToken, refreshToken] = useStorageState<string>('token');
  const [theme, setValue] = useStorageState('theme', { defaultValue: 'light' });
  const [locale, , refresh] = useStorageState('locale');

  return null;
}
