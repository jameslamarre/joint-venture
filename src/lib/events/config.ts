const readEnv = (key: string, legacyKey?: string): string | undefined => {
  const primaryValue = process.env[key]

  if (typeof primaryValue === 'string' && primaryValue.trim().length > 0) {
    return primaryValue.trim()
  }

  if (!legacyKey) {
    return undefined
  }

  const legacyValue = process.env[legacyKey]
  return typeof legacyValue === 'string' && legacyValue.trim().length > 0
    ? legacyValue.trim()
    : undefined
}

const parseEnvNumber = (
  key: string,
  fallback: number,
  legacyKey?: string
): number => {
  const rawValue = readEnv(key, legacyKey)

  if (!rawValue) {
    return fallback
  }

  if (/^\d+$/.test(rawValue)) {
    return Number(rawValue)
  }

  if (/^\d+(\s*\*\s*\d+)+$/.test(rawValue)) {
    return rawValue
      .split('*')
      .map(part => Number(part.trim()))
      .reduce((acc, current) => acc * current, 1)
  }

  const parsed = Number(rawValue)
  return Number.isFinite(parsed) ? parsed : fallback
}

export const GLU_EXAMPLE_FILM_ID = parseEnvNumber(
  'GLU_EXAMPLE_FILM_ID',
  391297,
  'MOVIEGLU_EXAMPLE_FILM_ID'
)

export const GLU_RESULTS_LIMIT = parseEnvNumber(
  'GLU_RESULTS_LIMIT',
  1,
  'MOVIEGLU_RESULTS_LIMIT'
)

export const GLU_LOOKAHEAD_DAYS = parseEnvNumber(
  'GLU_LOOKAHEAD_DAYS',
  1,
  'MOVIEGLU_LOOKAHEAD_DAYS'
)

export const GLU_LISTINGS_CACHE_TTL_MS = parseEnvNumber(
  'GLU_LISTINGS_CACHE_TTL_MS',
  30 * 60 * 1000,
  'MOVIEGLU_LISTINGS_CACHE_TTL_MS'
)

export const GLU_PURCHASE_CACHE_TTL_MS = parseEnvNumber(
  'GLU_PURCHASE_CACHE_TTL_MS',
  15 * 60 * 1000,
  'MOVIEGLU_PURCHASE_CACHE_TTL_MS'
)

export const GLU_RATE_LIMIT_COOLDOWN_MS = parseEnvNumber(
  'GLU_RATE_LIMIT_COOLDOWN_MS',
  10 * 60 * 1000,
  'MOVIEGLU_RATE_LIMIT_COOLDOWN_MS'
)
