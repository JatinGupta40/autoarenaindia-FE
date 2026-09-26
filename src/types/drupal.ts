export interface DrupalTerm {
  type: string;
  id: string;
  name: string;
  drupal_internal__tid?: number;
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
  /** Derived by the backend from published variants; never edited by hand. */
  field_price_min: number | null;
  field_price_max: number | null;
  field_car_variants: CarVariant[];
  field_car_images: DrupalImage[];
  body?: { value: string; summary?: string; processed?: string };
}

/**
 * One engine + transmission combination a variant is sold with. Fuel and
 * transmission are taxonomy term IDs (custom_field sub-fields are not JSON:API
 * relationships); resolve them against the car's own field_fuel_type /
 * field_transmission terms, which always cover every published powertrain.
 */
export interface Powertrain {
  engine_name: string | null;
  fuel_type: number | null;
  transmission: number | null;
  engine_cc: number | null;
  /** Decimal sub-fields arrive from JSON:API as strings, e.g. "18.20". */
  power_bhp: string | null;
  torque_nm: string | null;
  mileage_kmpl: string | null;
  ex_showroom_price: number | null;
}

export interface CarVariant {
  type: "paragraph--variant";
  id: string;
  status: boolean;
  field_variant_name: string;
  field_variant_description?: { value: string; processed?: string } | null;
  field_powertrains: Powertrain[];
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
