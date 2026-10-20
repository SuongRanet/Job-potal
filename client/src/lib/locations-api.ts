import { api } from "@/lib/axios"

export interface Location {
  id: string
  name: string
  slug: string
  type: "capital" | "province"
}

export async function fetchLocations(signal?: AbortSignal) {
  const { data } = await api.get<{ data: Location[] }>("/locations", { signal })
  return data.data
}
