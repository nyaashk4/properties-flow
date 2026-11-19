import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import PropertyList from "../components/PropertyList";
import PropertyFilters from "../components/PropertyFilters";
import { fetchProperties } from "../api/propertiesApi";
import { useFilter } from "../context/useFilter";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";
import "./Home.css";

function Home() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const {
    city,
    rooms,
    sort,
    setRooms,
    maxPrice,
    minPrice,
    minArea,
    maxArea,
    maxMetroMinutes,
  } = useFilter();

  const isInvalidPriceRange =
    minPrice !== "" && maxPrice !== "" && Number(minPrice) > Number(maxPrice);

  const isInvalidAreaRange =
    minArea !== "" && maxArea !== "" && Number(minArea) > Number(maxArea);

  const { data, isLoading, error } = useQuery({
    queryKey: ["properties"],
    queryFn: fetchProperties,
  });

  const cities = useMemo(
    () => (data ? [...new Set(data.map((property) => property.city))] : []),
    [data],
  );

  const roomOptions = useMemo(
    () =>
      data
        ? [...new Set(data.map((property) => property.rooms))].sort(
            (a, b) => a - b,
          )
        : [],
    [data],
  );

  const filteredProperties = useMemo(() => {
    if (!data) return [];
    if (isInvalidPriceRange || isInvalidAreaRange) {
      return [];
    }
    const normalizedSearch = search.trim().toLowerCase();

    return data.filter((property) => {
      const matchesCity = city === "all" || property.city === city;

      const matchesRooms = rooms === "all" || property.rooms === Number(rooms);

      const matchesSearch =
        property.title.toLowerCase().includes(normalizedSearch) ||
        property.city.toLowerCase().includes(normalizedSearch) ||
        property.district.toLowerCase().includes(normalizedSearch);

      const matchesPrice =
        maxPrice === "" || property.price <= Number(maxPrice) * 1_000_000;

      const matchesMinPrice =
        minPrice === "" || property.price >= Number(minPrice) * 1_000_000;

      const matchesMinArea = minArea === "" || property.area >= Number(minArea);

      const matchesMaxArea = maxArea === "" || property.area <= Number(maxArea);

      const matchesMetro =
        maxMetroMinutes === "all" ||
        (property.metroMinutes !== undefined &&
          property.metroMinutes <= Number(maxMetroMinutes));

      return (
        matchesCity &&
        matchesRooms &&
        matchesSearch &&
        matchesPrice &&
        matchesMinPrice &&
        matchesMinArea &&
        matchesMaxArea &&
        matchesMetro
      );
    });
  }, [
    data,
    city,
    rooms,
    search,
    maxPrice,
    minPrice,
    minArea,
    maxArea,
    maxMetroMinutes,
    isInvalidPriceRange,
    isInvalidAreaRange,
  ]);

  const sortedProperties = useMemo(() => {
    const result = [...filteredProperties];

    if (sort === "LowToHighProp") {
      result.sort((a, b) => a.price - b.price);
    }

    if (sort === "HighToLowProp") {
      result.sort((a, b) => b.price - a.price);
    }

    if (sort === "LowToHighArea") {
      result.sort((a, b) => a.area - b.area);
    }

    if (sort === "HighToLowArea") {
      result.sort((a, b) => b.area - a.area);
    }
    if (sort === "NearestMetro") {
      result.sort((a, b) => {
        const aHasMetro = a.metroMinutes !== undefined;
        const bHasMetro = b.metroMinutes !== undefined;

        if (!aHasMetro && !bHasMetro) return 0;
        if (!aHasMetro) return 1;
        if (!bHasMetro) return -1;

        return a.metroMinutes - b.metroMinutes;
      });
    }

    return result;
  }, [sort, filteredProperties]);

  const propertiesPerPage = 6;
  const totalPages = Math.max(
    1,
    Math.ceil(sortedProperties.length / propertiesPerPage),
  );
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * propertiesPerPage;
  const endIndex = startIndex + propertiesPerPage;
  const currentProperties = sortedProperties.slice(startIndex, endIndex);

  const hasPropertiesInCity =
    city !== "all" && Boolean(data?.some((property) => property.city === city));

  function handleShowAllInCity() {
    setSearch("");
    setRooms("all");
    setCurrentPage(1);
  }

  function handleResetSearch() {
    setSearch("");
    setCurrentPage(1);
  }

  if (isLoading) {
    return <Loader message="Загрузка недвижимости..." />;
  }
  if (error) {
    return <ErrorMessage message="Ошибка загрузки недвижимости" />;
  }

  return (
    <main className="home">
      <section className="home-header">
        <div>
          <h1>Недвижимость</h1>

          <p>
            Найдено объектов: <strong>{sortedProperties.length}</strong>
          </p>
        </div>
      </section>
      <div className="property-search">
        <input
          type="search"
          placeholder="Поиск по названию, городу или району..."
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setCurrentPage(1);
          }}
        />
      </div>
      <PropertyFilters
        cities={cities}
        roomOptions={roomOptions}
        onFilterChange={() => setCurrentPage(1)}
      />
      {isInvalidAreaRange ? (
        <div className="empty-results">
          <h2>Проверьте диапазон площади</h2>

          <p>Минимальное значение не может быть больше максимального.</p>
        </div>
      ) : isInvalidPriceRange ? (
        <div className="empty-results">
          <h2>Проверьте диапазон цены</h2>

          <p>Минимальное значение не может быть больше максимального.</p>
        </div>
      ) : sortedProperties.length > 0 ? (
        <>
          <PropertyList properties={currentProperties} />
          <div className="pagination">
            {safePage > 1 ? (
              <button
                className="pagination-btn"
                onClick={() => setCurrentPage(safePage - 1)}
              >
                Назад
              </button>
            ) : null}
            <p className="pagination-info">
              Страница {safePage} из {totalPages}
            </p>
            {safePage < totalPages ? (
              <button
                className="pagination-btn"
                onClick={() => setCurrentPage(safePage + 1)}
              >
                Вперед
              </button>
            ) : null}
          </div>
        </>
      ) : city !== "all" && !hasPropertiesInCity ? (
        <div className="empty-results">
          <div className="empty-results-icon">⌂</div>
          <h2>Пока нет объектов в этом городе</h2>
          <p>
            В городе {city} пока нет предложений недвижимости. Попробуйте
            посмотреть объекты в других городах.
          </p>
        </div>
      ) : city !== "all" && hasPropertiesInCity ? (
        <div className="empty-results">
          <div className="empty-results-icon">⌕</div>
          <h2>Подходящих объектов не найдено</h2>
          <p>
            В городе {city} есть другие варианты недвижимости. Попробуйте
            изменить фильтры или максимальную цену.
          </p>
          <button type="button" onClick={handleShowAllInCity}>
            Показать все объекты города
          </button>
        </div>
      ) : (
        <div className="empty-results">
          <div className="empty-results-icon">⌕</div>
          <h2>Ничего не найдено</h2>
          <p>
            {search.trim()
              ? `По запросу «${search}» нет подходящих объектов. Попробуйте изменить поисковый запрос.`
              : "По выбранным критериям нет подходящих объектов. Попробуйте изменить фильтры."}
          </p>

          {search.trim() && (
            <button type="button" onClick={handleResetSearch}>
              Очистить поиск
            </button>
          )}
        </div>
      )}
    </main>
  );
}

export default Home;
