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
  const { city, rooms, sort, setRooms, maxPrice, maxMetroMinutes } =
    useFilter();

  const { data, isLoading, error } = useQuery({
    queryKey: ["properties"],
    queryFn: fetchProperties,
  });

  const cities = data
    ? [...new Set(data.map((property) => property.city))]
    : [];

  const roomOptions = data
    ? [...new Set(data.map((property) => property.rooms))].sort((a, b) => a - b)
    : [];

  const filteredProperties = useMemo(() => {
    if (!data) return [];

    const normalizedSearch = search.trim().toLowerCase();

    return data.filter((property) => {
      const matchesCity = city === "all" || property.city === city;

      const matchesRooms = rooms === "all" || property.rooms === Number(rooms);

      const matchesSearch =
        property.title.toLowerCase().includes(normalizedSearch) ||
        property.city.toLowerCase().includes(normalizedSearch) ||
        property.district.toLowerCase().includes(normalizedSearch);

      const matchesPrice =
        maxPrice === "" ||
        property.price <= (Math.floor(Number(maxPrice)) + 1) * 1_000_000;

      const matchesMetro =
        maxMetroMinutes === "all" ||
        (property.metroMinutes !== undefined &&
          property.metroMinutes <= Number(maxMetroMinutes));

      return (
        matchesCity &&
        matchesRooms &&
        matchesSearch &&
        matchesPrice &&
        matchesMetro
      );
    });
  }, [data, city, rooms, search, maxPrice, maxMetroMinutes]);

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

  const hasPropertiesInCity =
    city !== "all" && Boolean(data?.some((property) => property.city === city));

  function handleShowAllInCity() {
    setSearch("");
    setRooms("all");
  }

  function handleResetSearch() {
    setSearch("");
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
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      <PropertyFilters cities={cities} roomOptions={roomOptions} />
      {sortedProperties.length > 0 ? (
        <PropertyList properties={sortedProperties} />
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
