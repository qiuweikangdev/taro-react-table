import Taro from '@tarojs/taro'
import { Columns, Fixed, spaceSize, SpaceSize, StripedType } from '../components/Table/types'

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
  let result = 0
  if (fixedType === 'left') {
    // 计算当前列之前的列宽度总和
    result = columns.reduce((acc, cur, i) => {
      if (i + 1 <= index) {
        return acc + (cur.width || colWidth)
      } else {
        return acc
      }
    }, 0)
  } else {
    result = columns.reduceRight((acc, cur, i) => {
      // 计算当前列之后的列宽度总和
      if (i - 1 >= index) {
        return acc + (cur.width || colWidth)
      } else {
        return acc
      }
    }, 0)
  }
  return getSize(result)
}

export function isNil(value: unknown) {
  return value == null
}

export function pickValid(object: Record<string, unknown>) {
  const temp = { ...object }
  Object.keys(temp).forEach((item) => {
    const key = object[item]
    if (key === '' || key === null || key === undefined) {
      delete temp[item]
    }
  })
  return temp
}

export function getNumberSize(size: SpaceSize) {
  return typeof size === 'string' ? spaceSize[size] : size || 0
}

export function showStriped(striped: StripedType = false, index) {
  if ([true, 'even'].includes(striped)) {
    return index % 2 !== 0
  }
  return striped === 'odd' && index % 2 == 0
}
