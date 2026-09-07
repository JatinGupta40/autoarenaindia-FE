export interface DrupalTerm {
  type: string;
  id: string;
  name: string;
  path?: { alias: string | null };
}

export interface DrupalImage {
  type: string;
  id: string;
  filename: string;
  uri: { url: string };
  resourceIdObjMeta?: { alt?: string; width?: number; height?: number };
}

interface DrupalPath {
  alias: string | null;
}

interface JsonApiResourceBase {
  langcode: string;
  status: boolean;
}

export interface Car extends JsonApiResourceBase {
  type: "node--cars";
  id: string;
  title: string;
  path: DrupalPath;
  field_brand: DrupalTerm;
  field_car_model: DrupalTerm;
  field_body_type: DrupalTerm;
  field_fuel_type: DrupalTerm[];
  field_transmission: DrupalTerm[];
  field_year_start: number;
  field_year_end: number | null;
  field_engine_capacity: string;
  field_mileage: string;
  field_price: string;
  field_car_images: DrupalImage[];
  body?: { value: string; summary?: string; processed?: string };
}

export interface CarVariant {
  type: "node--car_variants";
  id: string;
  title: string;
  field_car: Car;
  field_price: string;
  body?: { value: string; processed?: string };
}

export interface News extends JsonApiResourceBase {
  type: "node--news";
  id: string;
  title: string;
  path: DrupalPath;
  created: string;
  field_type_of_news: DrupalTerm;
  field_images: DrupalImage[];
  field_related_car?: Car;
  body?: { value: string; summary?: string; processed?: string };
}

export interface Article extends JsonApiResourceBase {
  type: "node--article";
  id: string;
  title: string;
  path: DrupalPath;
  created: string;
  field_tags: DrupalTerm[];
  field_image?: DrupalImage;
  field_related_car?: Car;
  body?: { value: string; summary?: string; processed?: string };
}
