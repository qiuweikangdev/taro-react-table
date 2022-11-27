import { createSelectorQuery, NodesRef, SelectorQuery } from '@tarojs/taro'
import { TaroElement } from '@tarojs/runtime'
import { useCallback, useRef } from 'react'

export type SelectorMethod = {
  getRefSize: getRefSizeType
  getDoms: getDomsType
}

export type ElementRectType = Record<number | string, NodesRef.BoundingClientRectCallbackResult>

export type getRefSizeType = (
  element: TaroElement | HTMLElement,
) => Promise<NodesRef.BoundingClientRectCallbackResult>

export type getDomsType = (ids: string[]) => Promise<ElementRectType>

function useQuery(): [SelectorQuery, SelectorMethod] {
  const query = useRef<SelectorQuery>(createSelectorQuery())

  const querySelector = useCallback(
    (selector: string): NodesRef => {
      return query.current.select(selector)
    },
    [query],
  )

  const getRefSize = useCallback<getRefSizeType>(
    (element: TaroElement | HTMLElement) => {
      return new Promise((resolve, reject) => {
        if (!element) {
          reject({})
        } else {
          try {
            const selectorQuery = querySelector('#' + element.id).boundingClientRect((result) => {
              resolve(result || {})
            })
            selectorQuery.exec()
          } catch (e) {
            reject(e)
          }
        }
      })
    },
    [querySelector],
  )

  const getDoms = useCallback<getDomsType>(
    (ids: string[]) => {
      return new Promise((resolve, reject) => {
        if (!ids.length) {
          reject({})
        } else {
          try {
            const domsMap: ElementRectType = {}
            ids.forEach((id: string) => {
              const selectorQuery = querySelector('#' + id).boundingClientRect((result) => {
                domsMap[id] = result
              })
              selectorQuery.exec()
            })
            resolve(domsMap)
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
      getDoms,
    },
  ]
}

export default useQuery
