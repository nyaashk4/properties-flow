import PropertyCard from "./PropertyCard";
import "./PropertyList.css";

function PropertyList({ properties }) {
  return (
    <div className="property-list">
      {properties.map((property) => {
        return <PropertyCard key={property.id} property={property} />;
      })}
    </div>
  );
}

export default PropertyList;
