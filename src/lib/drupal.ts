import { DrupalClient } from "next-drupal";

if (!process.env.NEXT_PUBLIC_DRUPAL_BASE_URL) {
  throw new Error("NEXT_PUBLIC_DRUPAL_BASE_URL is not set");
}

// DDEV's mkcert certificate is trusted by the OS (and curl/browsers) but not by
// Node's fetch, which ignores the OS trust store. Dev-only, gated on NODE_ENV so
// it can never affect a production build.
if (process.env.NODE_ENV === "development") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

export const drupal = new DrupalClient(process.env.NEXT_PUBLIC_DRUPAL_BASE_URL, {
  apiPrefix: "/jsonapi",
  withAuth: false,
});
