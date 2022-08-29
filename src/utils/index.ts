import Taro from '@tarojs/taro'
import { Columns, Fixed } from '../components/Table/types'

export const getSize = (size: string | number): string => {
  if (typeof size === 'number') {
    return Taro.pxTransform((size as number) * 2)
  } else {
    return String(size)
  }
}

/**
 * 固定列的时候计算偏移量
 * @param options
 */
export function calculateFixedDistance(options: {
  fixedType: Fixed
  index: number
  columns: Columns[]
  colWidth: number
}) {
  const { fixedType, index, columns, colWidth = 0 } = options
  let result: number = 0
  if (fixedType === 'left') {
    result = columns.reduce(function (prev, cur, i) {
      if (i + 1 <= index) {
        return prev + (cur.width || colWidth)
      } else {
        return prev
      }
    }, 0)
  } else {
    result = columns.reduceRight(function (prev, cur, i) {
      if (i - 1 >= index) {
        return prev + (cur.width || colWidth)
      } else {
        return prev
      }
    }, 0)
  }
  return getSize(result)
}

export function genId(id) {
  return `taro-react-table__${Number(Math.random().toString().substring(2) + Date.now()).toString(36)}_${id}`
}
