import { createContext, useState, useContext  } from "react";

export const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [searchCity , setSearchCity] = useState("");

  return (
    <SearchContext.Provider value={{ searchCity , setSearchCity }}>
      {children}
    </SearchContext.Provider>
  );
};

// Custom hook to consume the city context easily
export const useCity = () => useContext(SearchContext);