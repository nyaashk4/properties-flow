async function fetchProperties() {
  const response = await fetch("/api/properties");

  if (!response.ok) {
    throw new Error("Ошибка загрузки недвижимости");
  }

  return response.json();
}

async function fetchProperty(id) {
  const response = await fetch(`/api/properties/${id}`);

  if (response.status === 404) {
    throw new Error("NOT_FOUND");
  }

  if (!response.ok) {
    throw new Error("SERVER_ERROR");
  }

  return response.json();
}

export { fetchProperties, fetchProperty };
