import { useEffect, useState } from "react"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { toQuery, type Filters } from "@/lib/filters"
import { fetchJobs, type Job, type Pagination } from "@/lib/jobs-api"

export function useJobs(filters: Filters, page: number, reloadKey = 0) {
  const debouncedQuery = useDebouncedValue(filters.query, 300)
  const { location, type, salary } = filters
  const [state, setState] = useState<{
    jobs: Job[]
    pagination: Pagination | null
    loading: boolean
    error: boolean
  }>({ jobs: [], pagination: null, loading: true, error: false })

  useEffect(() => {
    const controller = new AbortController()
    setState((s) => ({ ...s, loading: true, error: false }))
    fetchJobs(toQuery({ query: debouncedQuery, location, type, salary }, page), controller.signal)
      .then((res) => setState({ jobs: res.data, pagination: res.pagination, loading: false, error: false }))
      .catch((err) => {
        if (controller.signal.aborted) return
        console.error(err)
        setState({ jobs: [], pagination: null, loading: false, error: true })
      })
    return () => controller.abort()
  }, [debouncedQuery, location, type, salary, page, reloadKey])

  return state
}
