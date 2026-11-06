import { useFilter } from "../context/useFilter";
import "./PropertyFilters.css";

function PropertyFilters({ cities, roomOptions }) {
  const {
    city,
    setCity,
    rooms,
    setRooms,
    sort,
    setSort,
    maxPrice,
    setMaxPrice,
    maxMetroMinutes,
    setMaxMetroMinutes,
    resetFilters,
  } = useFilter();

  const hasActiveFilters =
    city !== "all" ||
    rooms !== "all" ||
    sort !== "default" ||
    maxPrice !== "" ||
    maxMetroMinutes !== "all";

  return (
    <section className="property-filters">
      <div className="filter-group">
        <label htmlFor="city">Город</label>
        <select
          id="city"
          value={city}
          onChange={(event) => setCity(event.target.value)}
        >
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
        <select
          id="rooms"
          value={rooms}
          onChange={(event) => setRooms(event.target.value)}
        >
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
          onChange={(event) => setMaxPrice(event.target.value)}
        />
      </div>

      <div className="filter-group">
        <label htmlFor="metro">До метро пешком</label>
        <select
          id="metro"
          value={maxMetroMinutes}
          onChange={(event) => setMaxMetroMinutes(event.target.value)}
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
        <select
          id="sort"
          value={sort}
          onChange={(event) => setSort(event.target.value)}
        >
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
        onClick={resetFilters}
        disabled={!hasActiveFilters}
      >
        Сбросить фильтры
      </button>
    </section>
  );
}

export default PropertyFilters;
