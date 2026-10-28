import { useToggle, useDoubleClick as useDbl } from "react-simplikit";

function Card({ click, zoom }) {
  const handleClick = useDbl({ click, doubleClick: zoom });
  return <div onClick={handleClick} />;
}
