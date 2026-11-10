import { useDoubleClick } from 'react-simplikit';

const handleClick = useDoubleClick({
  click() {
    select();
  },
  'doubleClick': zoom,
});
