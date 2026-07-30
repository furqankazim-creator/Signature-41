export function mulberry32(seed: number) {
  let a = seed
  return function random() {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export type Random = ReturnType<typeof mulberry32>

export function randInt(rand: Random, min: number, max: number): number {
  return Math.floor(rand() * (max - min + 1)) + min
}

export function pick<T>(rand: Random, arr: readonly T[]): T {
  return arr[Math.floor(rand() * arr.length)]
}

export function shuffle<T>(rand: Random, arr: T[]): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}
