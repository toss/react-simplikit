import { useDoubleClick } from 'react-simplikit';

const handleClick = useDoubleClick({ ...base, onDoubleClick: zoom });
