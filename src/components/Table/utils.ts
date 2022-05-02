import Taro from '@tarojs/taro';
import { Columns, Fixed } from '.';
import { DefaultData } from './types';

export const getSize = (size: string | number): string => {
  if (typeof size === 'number') {
    return Taro.pxTransform((size as number) * 2);
  } else {
    return String(size);
  }
};

/**
 * 固定列的时候计算偏移量
 * @param options
 */
export function calculateFixedDistance(options: {
  fixedType: Fixed;
  index: number;
  columns: Columns[];
}) {
  const { fixedType, index, columns } = options;
  let result: number;
  if (fixedType === 'left') {
    result = columns.reduce(function(prev, cur, i) {
      if (i + 1 <= index) {
        return prev + (cur.width || DefaultData.ColWidth);
      } else {
        return prev;
      }
    }, 0);
  } else {
    result = columns.reduceRight(function(prev, cur, i) {
      if (i - 1 >= index) {
        return prev + (cur.width || DefaultData.ColWidth);
      } else {
        return prev;
      }
    }, 0);
  }
  return getSize(result);
}
