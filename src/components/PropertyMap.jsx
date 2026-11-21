import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { Link } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Исправление для стандартных иконок маркеров в сборщиках (Vite/Webpack)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
  iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
  shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href,
});

function PropertyMap({ properties }) {
  const center = [55.751244, 37.618423]; // Центр карты (Москва)

  return (
    <MapContainer
      center={center}
      zoom={10}
      style={{ height: '500px', width: '100%', borderRadius: '12px', marginTop: '30px' }}
    >
      <TileLayer
        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MarkerClusterGroup>
        {properties.map((property) => (
          <Marker
            key={property.id}
            position={[property.lat, property.lng]}
          >
            <Popup>
              <div>
                <h3>{property.title}</h3>
                <p>{property.price.toLocaleString('ru-RU')} ₽</p>
                <Link to={`/properties/${property.id}`}>Подробнее</Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
}

export default PropertyMap;