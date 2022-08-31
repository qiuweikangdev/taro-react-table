import { createSelectorQuery, NodesRef, SelectorQuery } from '@tarojs/taro'
import { TaroElement } from '@tarojs/runtime'
import { useCallback, useRef } from 'react'

export type SelectorMethod = {
  getRefSize: getRefSizeType
}

export type getBoundingClientRectType = (
  selector: string,
) => Promise<NodesRef.BoundingClientRectCallbackResult>

export type getRefSizeType = (
  element: TaroElement | HTMLElement,
) => Promise<NodesRef.BoundingClientRectCallbackResult>

function useQuery(): [SelectorQuery, SelectorMethod] {
  const query = useRef<SelectorQuery>(createSelectorQuery())

  const querySelector = useCallback(
    (selector: string): NodesRef => {
      return query.current.select(selector)
    },
    [query],
  )

  const getRefSize = useCallback<getRefSizeType>(
    (element: TaroElement) => {
      return new Promise((resolve, reject) => {
        if (!element) {
          reject({})
        } else {
          try {
            let selectorQuery = querySelector('#' + element.id).boundingClientRect(result =>
              resolve(result),
            )
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
      getRefSize,
    },
  ]
}

export default useQuery
