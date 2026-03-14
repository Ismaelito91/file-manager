import { useEffect } from "react";
import useTitle from "../hooks/useTitle";

const Setting = () => {
  const { setTitle } = useTitle();

  useEffect(() => {
    setTitle("Settings");
  }, []);

  return <p>This is the settings page.</p>;
};

export default Setting;
