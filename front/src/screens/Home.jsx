import { useEffect } from "react";
import useTitle from "../hooks/useTitle";

const Home = () => {
  const { setTitle } = useTitle();

  useEffect(() => {
    setTitle("Home");
  }, []);

  return <p>This is the home page.</p>;
};

export default Home;
