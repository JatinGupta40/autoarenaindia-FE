import { DrupalJsonApiParams } from "drupal-jsonapi-params";
import { drupal } from "@/lib/drupal";
import type { Article, Car, DrupalTerm, News } from "@/types/drupal";

export async function getTaxonomyTerms(vocabulary: string): Promise<DrupalTerm[]> {
  const params = new DrupalJsonApiParams().addSort("name", "ASC").addPageLimit(50);
  return drupal.getResourceCollection<DrupalTerm[]>(`taxonomy_term--${vocabulary}`, {
    params: params.getQueryObject(),
  });
}

const CAR_INCLUDES = [
  "field_brand",
  "field_car_model",
  "field_body_type",
  "field_fuel_type",
  "field_transmission",
  "field_car_images",
  "field_car_variants",
];

export interface CarFilters {
  brand?: string;
  bodyType?: string;
  fuel?: string;
  /** Free-text match against the car title (brand + model). */
  q?: string;
  limit?: number;
}

export async function getFeaturedCars(limit = 6): Promise<Car[]> {
  const params = new DrupalJsonApiParams()
    .addInclude(CAR_INCLUDES)
    .addFilter("promote", "1")
    .addFilter("status", "1")
    .addSort("created", "DESC")
    .addPageLimit(limit);

  return drupal.getResourceCollection<Car[]>("node--cars", {
    params: params.getQueryObject(),
  });
}

export async function getCars(filters: CarFilters = {}): Promise<Car[]> {
  const params = new DrupalJsonApiParams()
    .addInclude(CAR_INCLUDES)
    .addFilter("status", "1")
    .addSort("field_year_start", "DESC")
    .addPageLimit(filters.limit ?? 48);

  if (filters.brand) {
    params.addFilter("field_brand.name", filters.brand);
  }
  if (filters.bodyType) {
    params.addFilter("field_body_type.name", filters.bodyType);
  }
  if (filters.fuel) {
    params.addFilter("field_fuel_type.name", filters.fuel);
  }
  if (filters.q) {
    params.addFilter("title", filters.q, "CONTAINS");
  }

  return drupal.getResourceCollection<Car[]>("node--cars", {
    params: params.getQueryObject(),
  });
}

export async function getCarByPath(slug: string): Promise<Car | null> {
  const params = new DrupalJsonApiParams().addInclude(CAR_INCLUDES);
  const path = await drupal.translatePath(`/cars/${slug}`);
  if (!path) return null;

  return drupal.getResource<Car>("node--cars", path.entity.uuid, {
    params: params.getQueryObject(),
  });
}

/** Other generations of the same nameplate (same brand + model), for the "other generations" panel. */
export async function getCarGenerations(car: Car): Promise<Car[]> {
  const params = new DrupalJsonApiParams()
    .addInclude(CAR_INCLUDES)
    .addFilter("field_brand.id", car.field_brand.id)
    .addFilter("field_car_model.id", car.field_car_model.id)
    .addFilter("id", car.id, "<>")
    .addSort("field_year_start", "ASC");

  return drupal.getResourceCollection<Car[]>("node--cars", {
    params: params.getQueryObject(),
  });
}

/** Cars of the same body type, excluding this nameplate, for the "similar cars" rail. */
export async function getRelatedCars(car: Car, limit = 6): Promise<Car[]> {
  if (!car.field_body_type?.id) return [];
  const params = new DrupalJsonApiParams()
    .addInclude(CAR_INCLUDES)
    .addFilter("status", "1")
    .addFilter("field_body_type.id", car.field_body_type.id)
    .addFilter("field_car_model.id", car.field_car_model.id, "<>")
    .addSort("field_year_start", "DESC")
    .addPageLimit(limit);

  return drupal.getResourceCollection<Car[]>("node--cars", {
    params: params.getQueryObject(),
  });
}

export interface NewsFilters {
  type?: string;
  limit?: number;
}

const NEWS_INCLUDES = [
  "field_images",
  "field_type_of_news",
  "field_related_car",
  "field_related_car.field_brand",
  "field_related_car.field_car_model",
  "field_related_car.field_car_images",
];

export async function getNews(filters: NewsFilters = {}): Promise<News[]> {
  const params = new DrupalJsonApiParams()
    .addInclude(NEWS_INCLUDES)
    .addFilter("status", "1")
    .addSort("created", "DESC")
    .addPageLimit(filters.limit ?? 24);

  if (filters.type) {
    params.addFilter("field_type_of_news.name", filters.type);
  }

  return drupal.getResourceCollection<News[]>("node--news", {
    params: params.getQueryObject(),
  });
}

export async function getNewsByRelatedCar(carId: string, limit = 3): Promise<News[]> {
  const params = new DrupalJsonApiParams()
    .addInclude(NEWS_INCLUDES)
    .addFilter("status", "1")
    .addFilter("field_related_car.id", carId)
    .addSort("created", "DESC")
    .addPageLimit(limit);

  return drupal.getResourceCollection<News[]>("node--news", {
    params: params.getQueryObject(),
  });
}

export async function getNewsByPath(slug: string): Promise<News | null> {
  const params = new DrupalJsonApiParams().addInclude(NEWS_INCLUDES);
  const path = await drupal.translatePath(`/news/${slug}`);
  if (!path) return null;

  return drupal.getResource<News>("node--news", path.entity.uuid, {
    params: params.getQueryObject(),
  });
}

const ARTICLE_INCLUDES = [
  "field_image",
  "field_tags",
  "field_related_car",
  "field_related_car.field_brand",
  "field_related_car.field_car_model",
];

export async function getArticles(limit = 24): Promise<Article[]> {
  const params = new DrupalJsonApiParams()
    .addInclude(ARTICLE_INCLUDES)
    .addFilter("status", "1")
    .addSort("created", "DESC")
    .addPageLimit(limit);

  return drupal.getResourceCollection<Article[]>("node--article", {
    params: params.getQueryObject(),
  });
}

export async function getArticleByPath(slug: string): Promise<Article | null> {
  const params = new DrupalJsonApiParams().addInclude(ARTICLE_INCLUDES);
  const path = await drupal.translatePath(`/blog/${slug}`);
  if (!path) return null;

  return drupal.getResource<Article>("node--article", path.entity.uuid, {
    params: params.getQueryObject(),
  });
}
