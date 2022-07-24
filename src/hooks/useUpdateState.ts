import { Dispatch, SetStateAction, useEffect, useState } from 'react'

export default function useUpdateState<T = unknown>(value): [T, Dispatch<SetStateAction<T>>] {
  const [state, setState] = useState<T>(value)
  useEffect(() => {
    setState(value)
  }, [value])
  return [state, setState]
}
