import { useDoubleClick } from 'react-simplikit';

export function Card() {
  const handleClick = useDoubleClick({
    delay: 300,
    click: () => select(),
    doubleClick: () => zoom(),
  });

  return <div onClick={handleClick} />;
}
