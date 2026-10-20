import type { ILocation } from "./location.model.js";
import { listLocationsRepository } from "./location.repository.js";

export const toPublicLocation = (location: ILocation) => ({
  id: location._id,
  name: location.name,
  slug: location.slug,
  type: location.type,
});

export const listLocationsService = async () => {
  const locations = await listLocationsRepository();
  return locations.map(toPublicLocation);
};
