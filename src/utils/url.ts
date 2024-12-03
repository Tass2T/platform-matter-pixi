export const getStateFromParams = (): string | null => {
  const queries = new URLSearchParams(window.location.search)
  return queries.get('state')
}
