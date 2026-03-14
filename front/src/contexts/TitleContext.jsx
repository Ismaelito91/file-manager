import { createContext, useEffect, useState } from "react";

export const TitleContext = createContext();

const TitleProvider = ({ children }) => {
  const [title, setTitle] = useState(null);

  return (
    <TitleContext.Provider value={{ title, setTitle }}>
      {children}
    </TitleContext.Provider>
  );
};

export default TitleProvider;
