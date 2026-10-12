import { cities, type City } from "../data/history";
import { Icon } from "./Icon";

interface CityPanelProps {
  selectedCityId: string | null;
  onSelectCity: (city: City) => void;
}

export function CityPanel({ selectedCityId, onSelectCity }: CityPanelProps) {
  return (
    <aside className="city-panel" aria-label="المدن الرئيسية">
      <h2 className="panel-title">
        <Icon name="map-pin" /> المدن الرئيسية
      </h2>
      <ul className="city-list">
        {cities.map((city) => (
          <li key={city.id}>
            <button
              type="button"
              className="city-list__item"
              aria-pressed={city.id === selectedCityId}
              onClick={() => onSelectCity(city)}
            >
              {city.name}
              {city.capital && <span aria-label="عاصمة"> ★</span>}
              <span className="city-list__latin">{city.latinName}</span>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
