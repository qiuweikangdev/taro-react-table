import { memo } from 'react'
import classNames from 'classnames'
import { View } from '@tarojs/components'
import { calculateFixedDistance, getNumberSize, getSize, isNil, showStriped } from '../../utils'
import { Columns, RowProps } from './types'
import './index.less'

function Row(props: RowProps) {
  const {
    dataSourceItem,
    rowStyle = {},
    rowClassName = '',
    colClassName = '',
    colStyle = {},
    columns,
    index,
    cellEmptyText = '-',
    onRow,
    striped = false,
    size,
    colWidth,
  } = props

  return (
    <View
      id={`taro-table-row-${index}`}
      className={classNames(['taro-table-row', rowClassName])}
      style={rowStyle}
    >
      {columns.map((columnItem: Columns, colIndex: number): JSX.Element => {
        const text = dataSourceItem[columnItem.dataIndex]
        let width: string | number = colWidth
        let result
        if (columnItem.width) {
          width = columnItem.width
        }
        if (columnItem.render) {
          const render = columnItem.render(text, dataSourceItem, index)
          result = render
        } else {
          result = !isNil(text) ? String(text) : cellEmptyText
        }

        return (
          <View
            key={columnItem.key || columnItem.dataIndex}
            className={classNames(['taro-table-col'], {
              ['taro-table-col-fixed']: columnItem.fixed,
              ['taro-table-col-striped']: showStriped(striped, index),
              [colClassName]: true,
            })}
            style={{
              width: getSize(width),
              padding: `${getSize(0)} ${getSize(getNumberSize(size))}`,
              textAlign: columnItem.align || 'center',
              [columnItem.fixed as string]:
                columnItem.fixed &&
                calculateFixedDistance({
                  fixedType: columnItem.fixed,
                  index: colIndex,
                  columns,
                  colWidth,
                }),
              ...colStyle,
            }}
            onClick={() => onRow?.(dataSourceItem, index)}
          >
            <View
              className={classNames('taro-table-col-text', {
                'taro-table-col-text-ellipsis': columnItem.ellipsis,
              })}
              onClick={() => columnItem?.onCell?.(dataSourceItem, index)}
            >
              {result}
            </View>
          </View>
        )
      })}
    </View>
  )
}

export default memo(Row)
