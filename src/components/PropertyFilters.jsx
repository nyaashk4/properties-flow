import { useFilter } from "../context/useFilter";
import "./PropertyFilters.css";

function PropertyFilters({ cities, roomOptions, onFilterChange }) {
  const {
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
  } = useFilter();

  function handleChange(setter) {
    return (event) => {
      setter(event.target.value);
      onFilterChange();
    };
  }

  function handleReset() {
    resetFilters();
    onFilterChange();
  }

  const isInvalidPriceRange =
    (minPrice !== "" && Number(minPrice) <= 0) ||
    (maxPrice !== "" && Number(maxPrice) <= 0) ||
    (minPrice !== "" && maxPrice !== "" && Number(minPrice) > Number(maxPrice));

  const isInvalidAreaRange =
    (minArea !== "" && Number(minArea) <= 0) ||
    (maxArea !== "" && Number(maxArea) <= 0) ||
    (minArea !== "" && maxArea !== "" && Number(minArea) > Number(maxArea));

  const hasActiveFilters =
    city !== "all" ||
    rooms !== "all" ||
    sort !== "default" ||
    maxPrice !== "" ||
    minPrice !== "" ||
    minArea !== "" ||
    maxArea !== "" ||
    maxMetroMinutes !== "all";

  return (
    <section className="property-filters">
      <div className="filter-group">
        <label htmlFor="city">Город</label>
        <select id="city" value={city} onChange={handleChange(setCity)}>
          <option value="all">Все города</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="rooms">Комнаты</label>
        <select id="rooms" value={rooms} onChange={handleChange(setRooms)}>
          <option value="all">Любое количество</option>
          {roomOptions.map((room) => (
            <option key={room} value={room}>
              {room}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="maxPrice">Максимальная цена (млн ₽)</label>
        <input
          id="maxPrice"
          type="number"
          min="0"
          step="0.5"
          placeholder="Например, 10"
          value={maxPrice}
          onChange={handleChange(setMaxPrice)}
        />
      </div>

      <div className="filter-group">
        <label htmlFor="minPrice">Минимальная цена (млн ₽)</label>
        <input
          id="minPrice"
          type="number"
          min="0"
          step="0.5"
          placeholder="Например, 3"
          value={minPrice}
          onChange={handleChange(setMinPrice)}
        />
      </div>

      <div className="filter-group">
        <label htmlFor="minArea">Минимальная площадь (м²)</label>
        <input
          type="number"
          id="minArea"
          min="0"
          step="1"
          placeholder="Например, 15"
          value={minArea}
          onChange={handleChange(setMinArea)}
        ></input>
      </div>

      <div className="filter-group">
        <label htmlFor="maxArea">Максимальная площадь (м²)</label>
        <input
          type="number"
          id="maxArea"
          min="0"
          step="1"
          placeholder="Например, 15"
          value={maxArea}
          onChange={handleChange(setMaxArea)}
        ></input>
      </div>

      <div className="filter-group">
        <label htmlFor="metro">До метро пешком</label>
        <select
          id="metro"
          value={maxMetroMinutes}
          onChange={handleChange(setMaxMetroMinutes)}
        >
          <option value="all">Не важно</option>
          <option value="5">До 5 минут</option>
          <option value="10">До 10 минут</option>
          <option value="15">До 15 минут</option>
          <option value="20">До 20 минут</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="sort">Сортировка</label>
        <select id="sort" value={sort} onChange={handleChange(setSort)}>
          <option value="default">Без сортировки</option>
          <option value="LowToHighProp">Сначала дешевле</option>
          <option value="HighToLowProp">Сначала дороже</option>
          <option value="LowToHighArea">Меньше площадь</option>
          <option value="HighToLowArea">Больше площадь</option>
          <option value="NearestMetro">Сначала ближе к метро</option>
        </select>
      </div>

      <button
        type="button"
        className="reset-button"
        onClick={handleReset}
        disabled={!hasActiveFilters}
      >
        Сбросить фильтры
      </button>

      {isInvalidPriceRange && (
        <p className="price-range-error">
          Минимальная цена не может быть выше максимальной.
        </p>
      )}

      {isInvalidAreaRange && (
        <p className="area-range-error">
          Минимальная площадь не может быть выше максимальной.
        </p>
      )}
    </section>
  );
}

export default PropertyFilters;
