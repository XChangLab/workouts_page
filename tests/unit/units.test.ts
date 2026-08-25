import { describe, it, expect } from 'vitest'
import { mToKm, mToMi, mToFt, formatDistance, formatElevation, formatGrade } from '../../src/utils/units'

describe('mToKm', () => {
  it('converts 1000 m to 1 km', () => expect(mToKm(1000)).toBe(1))
  it('converts 0 m to 0 km', () => expect(mToKm(0)).toBe(0))
  it('converts 17100 m to 17.1 km', () => expect(mToKm(17100)).toBeCloseTo(17.1, 5))
})

describe('mToMi', () => {
  it('converts 1609.344 m to 1 mi', () => expect(mToMi(1609.344)).toBeCloseTo(1, 5))
  it('converts 0 m to 0 mi', () => expect(mToMi(0)).toBe(0))
})

describe('mToFt', () => {
  it('converts 1 m to ~3.28084 ft', () => expect(mToFt(1)).toBeCloseTo(3.28084, 4))
  it('converts 0 m to 0 ft', () => expect(mToFt(0)).toBe(0))
  it('converts 1404 m to ~4606 ft (approx)', () => expect(mToFt(1404)).toBeCloseTo(4605.9, 0))
})

describe('formatDistance', () => {
  it('formats metric distance', () => expect(formatDistance(17100, 'metric')).toBe('17.10 km'))
  it('formats imperial distance', () => expect(formatDistance(1609.344, 'imperial')).toBe('1.00 mi'))
})

describe('formatElevation', () => {
  it('formats metric elevation', () => expect(formatElevation(1404, 'metric')).toBe('1,404 m'))
  it('formats imperial elevation', () => {
    const result = formatElevation(1404, 'imperial')
    expect(result).toContain('ft')
  })
})

describe('formatGrade', () => {
  it('formats grade as percentage string', () => expect(formatGrade(7.4)).toBe('7.4%'))
  it('formats negative grade', () => expect(formatGrade(-3.2)).toBe('-3.2%'))
  it('is the same in both unit systems', () => {
    expect(formatGrade(5.0)).toBe('5.0%')
  })
})
