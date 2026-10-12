import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { cities, getCity, getPeriod, periodAtYear, type City } from "../data/history";
import { Icon } from "./Icon";

// Fix Leaflet's default marker icon paths under bundlers.
interface MapViewProps {
  selectedCityId: string | null;
  selectedYear: number | null;
  onSelectCity: (city: City) => void;
}

const IBERIA_BOUNDS: L.LatLngBoundsExpression = [
  [35.0, -10.0],
  [44.5, 4.5],
];

export function MapView({ selectedCityId, selectedYear, onSelectCity }: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const [tilesError, setTilesError] = useState(false);
  const [mapReady, setMapReady] = useState(false);

  // init map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [39.5, -4.0],
      zoom: 6,
      minZoom: 5,
      maxZoom: 12,
      attributionControl: true,
      zoomControl: true,
      scrollWheelZoom: true,
      maxBounds: IBERIA_BOUNDS,
      maxBoundsViscosity: 0.8,
    });

    const tiles = L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 19,
        crossOrigin: true,
      },
    );

    tiles.on("tileerror", () => setTilesError(true));
    tiles.on("load", () => setTilesError(false));
    tiles.addTo(map);
    tileLayerRef.current = tiles;
    mapRef.current = map;
    setMapReady(true);

    // cleanup
    return () => {
      map.remove();
      mapRef.current = null;
      markersRef.current.clear();
    };
  }, []);

  // render markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;

    // clear old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current.clear();

    cities.forEach((city) => {
      const selected = city.id === selectedCityId;
      const capital = !!city.capital;
      const icon = L.divIcon({
        className: "city-marker",
        html: `
          <span class="city-marker__pin ${capital ? "city-marker__pin--capital" : ""} ${
            selected ? "city-marker__pin--selected" : ""
          }" aria-hidden="true"></span>
          <span class="city-marker__label">${city.name}${
            selected && city.latinName ? ` · ${city.latinName}` : ""
          }</span>
        `,
        iconSize: [0, 0],
        iconAnchor: [0, -8],
      });

      const marker = L.marker([city.lat, city.lng], { icon, title: city.name }).addTo(map);

      const period = periodAtYear(selectedYear ?? 1000);
      const inPeriod = period ? city.periods.includes(period.id) : true;

      marker.bindPopup(
        `<div dir="rtl" style="font-family:inherit">
          <strong style="font-size:1rem;color:#132a4a">${city.name}</strong>
          ${city.latinName ? `<div style="font-size:0.75rem;color:#7a6650">${city.latinName}</div>` : ""}
          <p style="margin:6px 0 0;font-size:0.82rem">${city.significance}</p>
        </div>`,
        { className: "city-popup", offset: [0, -4] },
      );

      marker.on("click", () => onSelectCity(city));
      if (!inPeriod) {
        marker.setOpacity(0.45);
      } else {
        marker.setOpacity(1);
      }
      markersRef.current.set(city.id, marker);
    });
  }, [mapReady, selectedCityId, selectedYear, onSelectCity]);

  // fly to selected city
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedCityId || !mapReady) return;
    const city = getCity(selectedCityId);
    if (!city) return;
    const zoom = Math.max(map.getZoom(), 7);
    map.flyTo([city.lat, city.lng], zoom, { duration: 0.8 });
    const marker = markersRef.current.get(selectedCityId);
    if (marker) setTimeout(() => marker.openPopup(), 850);
  }, [selectedCityId, mapReady]);

  const period = periodAtYear(selectedYear ?? 1000);
  const periodName = getPeriod(period?.id ?? "")?.name;

  return (
    <div className="map-wrap">
      <div id="map" ref={containerRef} role="application" aria-label="خريطة الأندلس التفاعلية" />
      {tilesError && (
        <div className="map-tiles-error">
          <Icon name="alert" size={28} />
          <p>تعذّر تحميل طبقة الخريطة الأساسية.</p>
          <p style={{ fontSize: "0.8rem" }}>
            لا تزال علامات المدن التاريخية قابلة للنقر، والتفاصيل متاحة في لوحة المعلومات.
          </p>
        </div>
      )}
      <div className="map-overlay-note" aria-hidden="true">
        {periodName ? (
          <>الخط الأساسي يمثّل الجغرافيا الحديثة. الحدود السياسية للفترات التاريخية موضّحة في لوحة الأحداث، وهي تقريبية.</>
        ) : (
          <>خريطة مرجعية حديثة مع علامات المدن التاريخية.</>
        )}
      </div>
    </div>
  );
}
