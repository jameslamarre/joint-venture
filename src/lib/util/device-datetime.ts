export const getDeviceDateTimeHeaderValue = (): string => {
  // Mirrors: pm.request.headers.upsert({ key: 'device-datetime', value: new Date().toISOString() })
  return new Date().toISOString()
}
