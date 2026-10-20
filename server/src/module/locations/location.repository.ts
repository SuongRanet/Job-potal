import Location from "./location.model.js";

export const listLocationsRepository = async () => {
  return Location.find().sort({ type: 1, name: 1 });
};

export const findLocationBySlugRepository = async (slug: string) => {
  return Location.findOne({ slug });
};

export const findLocationByIdRepository = async (id: string) => {
  return Location.findById(id);
};
