import { memo } from 'react'
import classNames from 'classnames'
import { View, Text } from '@tarojs/components'
import { calculateFixedDistance, getSize, isNil } from '../../utils'
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
    colWidth = 0,
    cellEmptyText = '-',
    onRow,
    widthMap = {},
    ellipsis = false,
    striped = false,
  } = props

  return (
    <View
      className={classNames([
        'taro-table-row',
        rowClassName,
        {
          ['taro-table-row-striped']: striped,
        },
      ])}
      style={rowStyle}
    >
      {columns.map((columnItem: Columns, colIndex: number): JSX.Element => {
        const text = dataSourceItem[columnItem.dataIndex]
        let width: string | number = widthMap[colIndex]
        let result
        if (columnItem.width) {
          width = getSize(columnItem.width)
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
              'taro-table-col-fixed': columnItem.fixed,
              [colClassName]: true,
            })}
            style={{
              textAlign: columnItem.align || 'center',
              width,
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
            <Text
              className={classNames('taro-table-col-text', {
                'taro-table-col-text-ellipsis': ellipsis,
              })}
              onClick={() => columnItem?.onCell?.(dataSourceItem, index)}
            >
              {result}
            </Text>
          </View>
        )
      })}
    </View>
  )
}

export default memo(Row)
