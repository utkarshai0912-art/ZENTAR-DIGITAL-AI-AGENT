import { useQuery } from '@tanstack/react-query'

import { getZentarConfigRecord } from '@/zentar'
import { queryClient, writeCache } from '@/lib/query-client'
import type { ZentarConfigRecord } from '@/types/zentar'

// One shared cache for the whole profile config record (`GET /api/config`).
// Every settings surface (MCP, model, config) reads and writes through this key
// so a save in one shows in the others, and revisiting a tab paints the cache
// instead of blanking on a fresh fetch.
//
// Distinct from session/hooks/use-zentar-config.ts, which is side-effecting —
// it pushes personality/cwd/voice/… into the session stores for live chat.
export const ZENTAR_CONFIG_KEY = ['zentar-config-record'] as const

// staleTime 0 → serve cache instantly, background-revalidate on every mount.
export const useZentarConfigRecord = () =>
  useQuery({ queryKey: ZENTAR_CONFIG_KEY, queryFn: getZentarConfigRecord, staleTime: 0 })

export const setZentarConfigCache = writeCache<ZentarConfigRecord>(ZENTAR_CONFIG_KEY)

export const invalidateZentarConfig = () => queryClient.invalidateQueries({ queryKey: ZENTAR_CONFIG_KEY })
