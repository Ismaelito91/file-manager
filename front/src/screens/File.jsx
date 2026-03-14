import { useEffect } from "react";
import useTitle from "../hooks/useTitle";

const File = () => {
  const { setTitle } = useTitle();

  useEffect(() => {
    setTitle("Files");
  }, []);

  return <p>This the files page.</p>;
};

export default File;
