import { useState } from "react";

const useBoxHeight = () => {
  const [height, setHeight] = useState(0);

  return { height, setHeight };
};

export default useBoxHeight;
