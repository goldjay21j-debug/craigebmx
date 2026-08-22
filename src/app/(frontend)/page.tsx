import { getBikes, selectFeatured } from "../../lib/catalogue";
import { HomeClient } from "./home-client";

// Re-read the catalogue at most once a minute, so a bike edited in the admin
// appears on the homepage without anyone triggering a rebuild.
export const revalidate = 60;

export default async function HomePage() {
  const bikes = await getBikes();
  // Featured bikes come from the admin's Featured checkbox and its position
  // field, replacing the hardcoded ID list this page used to carry.
  const featuredBikes = selectFeatured(bikes);

  return <HomeClient bikes={bikes} featuredBikes={featuredBikes} />;
}
