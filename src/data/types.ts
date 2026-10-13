// Shared types for the atlas data. Content lives in periods.ts, cities.ts,
// figures.ts, history.ts (timeline, library, search) and books.ts.

export interface Source {
  title: string;
  url: string;
  publisher: string;
}

/** A pointer into the bookshelf (books.ts) for "further reading". */
export interface BookRef {
  bookId: string;
  /** Which volume/part to read, when the book has several. */
  part?: string;
}

export interface Ruler {
  name: string;
  years: string;
  note?: string;
}

export interface Landmark {
  name: string;
  /** Display date, e.g. "999م" or "1184–1198م". */
  date?: string;
  note: string;
  cityId?: string;
  imageId?: string;
}

export interface Period {
  id: string;
  name: string;            // Arabic
  latinName: string;       // transliteration / English
  startYear: number;       // CE
  endYear: number;
  color: string;           // map accent color
  summary: string;         // Arabic
  description: string;     // Arabic, longer
  capital: string;         // Arabic
  rulers: Ruler[];
  rulersTitle?: string;    // heading for the rulers list (default "أبرز الحكّام")
  landmarks?: Landmark[];
  mapImageId?: string;
  furtherReading: BookRef[];
  sources: Source[];
}

export interface CityEvent {
  year: number;            // CE (negative = BCE)
  yearLabel: string;       // Arabic display, e.g. "756" or "2 يناير 1492"
  title: string;           // Arabic
  description: string;     // Arabic
  sources: Source[];
}

export interface City {
  id: string;
  name: string;            // Arabic primary
  latinName: string;       // Córdoba
  altNames: string[];      // alternative historical/Latin names
  lat: number;
  lng: number;
  founded?: string;        // Arabic description of founding
  foundedYear?: number;
  peakYear?: number;       // year of greatest importance
  endYear?: number;        // when it left Andalusian control
  significance: string;    // Arabic, one line
  description: string;     // Arabic, extended
  periods: string[];       // period ids this city belongs to
  capital?: boolean;       // was a capital
  majorCity?: boolean;     // shown in المدن الرئيسية panel
  imageId?: string;        // lead image
  gallery?: string[];      // further images, in display order
  landmarks?: Landmark[];
  events: CityEvent[];
  sources: Source[];
}

export interface TimelineEvent {
  id: string;
  year: number;
  yearLabel: string;
  title: string;           // Arabic
  description: string;     // Arabic
  category: "conquest" | "politics" | "culture" | "science" | "architecture" | "fall";
  cityId?: string;
  imageId?: string;
  lat?: number;
  lng?: number;
  sources: Source[];
}

export interface Figure {
  id: string;
  name: string;            // Arabic
  latinName: string;
  /** Other names people search for (Arabic or Latin forms). */
  aliases?: string[];
  born?: number;
  died?: number;
  /** Display life span when dates are approximate or disputed. */
  lifeLabel?: string;
  role: string;            // Arabic
  description: string;     // Arabic
  periodId: string;
  cityId?: string;
  /** Where the person was born/active when it is not one of the atlas cities. */
  place?: string;
  imageId?: string;
  works?: string[];
  sources: Source[];
}

export interface LibraryTopic {
  id: string;
  title: string;           // Arabic section title
  icon: string;            // icon key
  items: {
    title: string;
    description: string;
    cityId?: string;
    sources: Source[];
  }[];
}
