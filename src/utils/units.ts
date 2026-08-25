import type { UnitSystem } from '../types/segment'

export function mToKm(metres: number): number {
  return metres / 1000
}

export function mToMi(metres: number): number {
  return metres / 1609.344
}

export function mToFt(metres: number): number {
  return metres * 3.28084
}

export function formatDistance(metres: number, system: UnitSystem): string {
  if (system === 'imperial') {
    return `${mToMi(metres).toFixed(2)} mi`
  }
  return `${mToKm(metres).toFixed(2)} km`
}

export function formatElevation(metres: number, system: UnitSystem): string {
  if (system === 'imperial') {
    return `${Math.round(mToFt(metres)).toLocaleString()} ft`
  }
  return `${Math.round(metres).toLocaleString()} m`
}

export function formatGrade(pct: number): string {
  return `${pct.toFixed(1)}%`
}
