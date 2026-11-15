import {
  createContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";

const FilterContext = createContext();

function readSavedFilters() {
  try {
    const savedFilters = JSON.parse(localStorage.getItem("filters"));

    if (
      !savedFilters ||
      typeof savedFilters !== "object" ||
      Array.isArray(savedFilters)
    ) {
      return null;
    }

    const allowedSortValues = [
      "default",
      "LowToHighProp",
      "HighToLowProp",
      "LowToHighArea",
      "HighToLowArea",
      "NearestMetro",
    ];

    const allowedMetroValues = ["all", "5", "10", "15", "20"];

    const city =
      typeof savedFilters.city === "string" ? savedFilters.city : "all";

    const rooms =
      savedFilters.rooms === "all" ||
      (typeof savedFilters.rooms === "string" &&
        /^[1-9]\d*$/.test(savedFilters.rooms))
        ? savedFilters.rooms
        : "all";

    const sort = allowedSortValues.includes(savedFilters.sort)
      ? savedFilters.sort
      : "default";

    const maxPrice =
      typeof savedFilters.maxPrice === "string" &&
      savedFilters.maxPrice.trim() !== "" &&
      Number.isFinite(Number(savedFilters.maxPrice)) &&
      Number(savedFilters.maxPrice) > 0
        ? savedFilters.maxPrice
        : "";

    const minPrice =
      typeof savedFilters.minPrice === "string" &&
      savedFilters.minPrice.trim() !== "" &&
      Number.isFinite(Number(savedFilters.minPrice)) &&
      Number(savedFilters.minPrice) > 0
        ? savedFilters.minPrice
        : "";

    const minArea =
      typeof savedFilters.minArea === "string" &&
      savedFilters.minArea.trim() !== "" &&
      Number.isFinite(Number(savedFilters.minArea)) &&
      Number(savedFilters.minArea) > 0
        ? savedFilters.minArea
        : "";

    const maxArea =
      typeof savedFilters.maxArea === "string" &&
      savedFilters.maxArea.trim() !== "" &&
      Number.isFinite(Number(savedFilters.maxArea)) &&
      Number(savedFilters.maxArea) > 0
        ? savedFilters.maxArea
        : "";

    const maxMetroMinutes = allowedMetroValues.includes(
      savedFilters.maxMetroMinutes,
    )
      ? savedFilters.maxMetroMinutes
      : "all";

    return {
      city,
      rooms,
      sort,
      maxPrice,
      minPrice,
      minArea,
      maxArea,
      maxMetroMinutes,
    };
  } catch {
    return null;
  }
}

export function FilterProvider({ children }) {
  const [savedFilters] = useState(readSavedFilters);

  const [city, setCity] = useState(savedFilters?.city || "all");

  const [rooms, setRooms] = useState(savedFilters?.rooms || "all");

  const [sort, setSort] = useState(savedFilters?.sort || "default");

  const [maxPrice, setMaxPrice] = useState(savedFilters?.maxPrice || "");
  const [minPrice, setMinPrice] = useState(savedFilters?.minPrice || "");

  const [minArea, setMinArea] = useState(savedFilters?.minArea || "");
  const [maxArea, setMaxArea] = useState(savedFilters?.maxArea || "");

  const [maxMetroMinutes, setMaxMetroMinutes] = useState(
    savedFilters?.maxMetroMinutes || "all",
  );

  const resetFilters = useCallback(() => {
    setCity("all");
    setRooms("all");
    setSort("default");
    setMaxPrice("");
    setMinPrice("");
    setMinArea("");
    setMaxArea("");
    setMaxMetroMinutes("all");
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "filters",
      JSON.stringify({
        city,
        rooms,
        sort,
        maxPrice,
        minPrice,
        minArea,
        maxArea,
        maxMetroMinutes,
      }),
    );
  }, [
    city,
    rooms,
    sort,
    maxPrice,
    minPrice,
    minArea,
    maxArea,
    maxMetroMinutes,
  ]);

  const value = useMemo(
    () => ({
      city,
      setCity,
      rooms,
      setRooms,
      sort,
      setSort,
      maxPrice,
      setMaxPrice,
      minPrice,
      setMinPrice,
      minArea,
      setMinArea,
      maxArea,
      setMaxArea,
      maxMetroMinutes,
      setMaxMetroMinutes,
      resetFilters,
    }),
    [
      city,
      rooms,
      sort,
      maxPrice,
      minPrice,
      minArea,
      maxArea,
      maxMetroMinutes,
      resetFilters,
    ],
  );

  return (
    <FilterContext.Provider value={value}>{children}</FilterContext.Provider>
  );
}

export default FilterContext;
