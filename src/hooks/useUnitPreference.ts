import { useState } from 'react'
import type { UnitSystem } from '../types/segment'

interface UnitPreferenceHook {
  system: UnitSystem
  toggle: () => void
}

export function useUnitPreference(): UnitPreferenceHook {
  const [system, setSystem] = useState<UnitSystem>('metric')

  function toggle() {
    setSystem((s) => (s === 'metric' ? 'imperial' : 'metric'))
  }

  return { system, toggle }
}
