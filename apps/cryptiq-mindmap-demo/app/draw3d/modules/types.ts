export type DoodleCanvasHandle = {
  clear(): void
  undo(): void
  toCanvas(): HTMLCanvasElement | null
}
