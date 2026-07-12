export function logError(error: unknown): void {
  if (!process.env.ZENTAR_INK_DEBUG_ERRORS) {
    return
  }

  console.error(error)
}
