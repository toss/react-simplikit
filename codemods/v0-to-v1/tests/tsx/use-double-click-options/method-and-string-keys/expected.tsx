import { useDoubleClick } from 'react-simplikit';

const handleClick = useDoubleClick({
  onClick() {
    select();
  },
  onDoubleClick: zoom,
});
