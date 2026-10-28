import { useDoubleClick } from 'react-simplikit';

export function Card() {
  const handleClick = useDoubleClick({
    delayMs: 300,
    onClick: () => select(),
    onDoubleClick: () => zoom(),
  });

  return <div onClick={handleClick} />;
}
