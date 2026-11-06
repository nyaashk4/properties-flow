import { useContext } from "react";
import FilterContext from "./FilterContext";

export function useFilter() {
  const context = useContext(FilterContext);

  if (!context) {
    throw new Error("useFilter должен использоваться внутри FilterProvider");
  }
  return context;
}
