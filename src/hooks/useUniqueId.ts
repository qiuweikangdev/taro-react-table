import { useCallback } from 'react'

const prefix = 'taro-react-table'

const useUniqueId = () => {
  const genId = useCallback((id: string | number) => {
    return `${prefix}__${Number(
      Math.random()
        .toString()
        .substring(2) + Date.now(),
    ).toString(36)}_${id}`
  }, [])

  return genId
}

export default useUniqueId
