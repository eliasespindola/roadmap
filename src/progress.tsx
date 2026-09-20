import { createContext, useContext, useMemo, useState, type ReactNode } from "react"

const STORAGE_KEY = "roadmap-seen-v1"

type Bucket = "topics" | "challenges" | "lessons"

type Store = Record<Bucket, string[]>

const empty: Store = { topics: [], challenges: [], lessons: [] }

function readStore(): Store {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return empty
    const parsed = JSON.parse(raw) as Partial<Store>
    return {
      topics: Array.isArray(parsed.topics) ? parsed.topics : [],
      challenges: Array.isArray(parsed.challenges) ? parsed.challenges : [],
      lessons: Array.isArray(parsed.lessons) ? parsed.lessons : [],
    }
  } catch {
    return empty
  }
}

function writeStore(store: Store) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
}

type ProgressApi = {
  has: (bucket: Bucket, id: string) => boolean
  toggle: (bucket: Bucket, id: string) => void
  topics: Set<string>
  challenges: Set<string>
  lessons: Set<string>
}

const ProgressContext = createContext<ProgressApi | null>(null)

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [store, setStore] = useState<Store>(() =>
    typeof localStorage === "undefined" ? empty : readStore(),
  )

  const api = useMemo<ProgressApi>(() => {
    const topics = new Set(store.topics)
    const challenges = new Set(store.challenges)
    const lessons = new Set(store.lessons)
    const sets: Record<Bucket, Set<string>> = { topics, challenges, lessons }

    return {
      topics,
      challenges,
      lessons,
      has: (bucket, id) => sets[bucket].has(id),
      toggle: (bucket, id) => {
        setStore((current) => {
          const nextSet = new Set(current[bucket])
          if (nextSet.has(id)) nextSet.delete(id)
          else nextSet.add(id)
          const next = { ...current, [bucket]: [...nextSet] }
          writeStore(next)
          return next
        })
      },
    }
  }, [store])

  return <ProgressContext.Provider value={api}>{children}</ProgressContext.Provider>
}

export function useProgress() {
  const value = useContext(ProgressContext)
  if (!value) throw new Error("useProgress precisa do ProgressProvider")
  return value
}
