import { useToggle, useDoubleClick as useDbl } from "react-simplikit";

function Card({ click, zoom }) {
  const handleClick = useDbl({ onClick: click, onDoubleClick: zoom });
  return <div onClick={handleClick} />;
}
