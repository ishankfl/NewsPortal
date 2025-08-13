import React, { createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
// import { getCategories } from "../../api/category-services";
import { getCategories } from "../api/category-services";
const CategoriesContext = createContext({
  categories: [],
  isLoading: false,
  isError: false,
  error: null,
});

export const CategoriesProvider = ({ children }) => {
  const { data: categories = [], isLoading, isError, error } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    staleTime: 1000 * 60 * 10,  // 10 min
    cacheTime: 1000 * 60 * 60,  // 1 hour
  });

  return (
    <CategoriesContext.Provider value={{ categories, isLoading, isError, error }}>
      {children}
    </CategoriesContext.Provider>
  );
};

export const useCategories = () => useContext(CategoriesContext);
