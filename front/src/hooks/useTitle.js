import { useContext } from "react";
import { TitleContext } from "../contexts/TitleContext";

const useTitle = () => {
  return useContext(TitleContext);
};

export default useTitle;
