import { createSelectorQuery, NodesRef, SelectorQuery } from '@tarojs/taro'
import { useCallback, useRef } from 'react'

export type SelectorMethod = {
  getBoundingClientRect: getBoundingClientRectType
}

export type getBoundingClientRectType = (
  selector: string,
) => Promise<NodesRef.BoundingClientRectCallbackResult>

function useQuery(): [SelectorQuery, SelectorMethod] {
  const query = useRef<SelectorQuery>(createSelectorQuery())

  const querySelector = useCallback(
    (selector: string): NodesRef => {
      return query.current.select(selector)
    },
    [query],
  )

  const getBoundingClientRect = useCallback<getBoundingClientRectType>(
    (selector) => {
      return new Promise((resolve, reject) => {
        if (!selector) {
          reject({})
        } else {
          try {
            let selectorQuery = querySelector(selector).boundingClientRect(resolve)
            selectorQuery.exec()
          } catch (e) {
            reject(e)
          }
        }
      })
    },
    [querySelector],
  )

  return [
    query.current,
    {
      getBoundingClientRect,
    },
  ]
}

export default useQuery
