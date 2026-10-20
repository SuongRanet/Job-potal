import { useEffect, useState } from "react"
import { fetchLocations, type Location } from "@/lib/locations-api"

export function useLocations() {
  const [locations, setLocations] = useState<Location[]>([])

  useEffect(() => {
    const controller = new AbortController()
    fetchLocations(controller.signal)
      .then(setLocations)
      .catch((err) => {
        if (!controller.signal.aborted) console.error(err)
      })
    return () => controller.abort()
  }, [])

  return locations
}
