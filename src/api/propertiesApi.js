async function fetchProperties() {
  const response = await fetch("/db.json");

  if (!response.ok) {
    throw new Error("Ошибка загрузки недвижимости");
  }

  const data = await response.json();
  return data.properties;
}

async function fetchProperty(id) {
  const response = await fetch("/db.json");

  if (!response.ok) {
    throw new Error("SERVER_ERROR");
  }

  const data = await response.json();
  const property = data.properties.find((item) => item.id === Number(id));

  if (!property) {
    throw new Error("NOT_FOUND");
  }

  return property;
}

export { fetchProperties, fetchProperty };
