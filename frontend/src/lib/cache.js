const cache = new Map()

export function clearCache() {
  cache.clear()
}

export function invalidate(key) {
  cache.delete(key)
}

export async function getCached(key, fetcher, ttl = 5 * 60 * 1000) {
  const now = Date.now()
  const entry = cache.get(key)

  if (entry) {
    // still valid
    if (now - entry.t < entry.ttl) {
      return await entry.v
    }
    // expired — fallthrough to refetch
  }

  const p = (async () => {
    const res = await fetcher()
    return res
  })()

  cache.set(key, { v: p, t: now, ttl })
  try {
    return await p
  } catch (err) {
    // remove failed promise so next call can retry
    if (cache.get(key)?.v === p) cache.delete(key)
    throw err
  }
}

export default { getCached, invalidate, clearCache }
