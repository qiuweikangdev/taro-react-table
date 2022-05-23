import { memo } from 'react';
import classNames from 'classnames';
import { View, Text } from '@tarojs/components';
import { calculateFixedDistance, getSize } from './utils';
import { DefaultData, Columns, RowProps } from './types';
import './index.less';

function Row(props: RowProps) {
  const {
    dataSourceItem,
    rowStyle = {},
    rowClassName = '',
    colClassName = '',
    colStyle = {},
    columns,
    index
  } = props;
  return (
    <View
      className={classNames(['taro-table-row', rowClassName])}
      style={rowStyle}
    >
      {columns.map(
        (columnItem: Columns, colIndex: number): JSX.Element => {
          const text = dataSourceItem[columnItem.dataIndex];
          let result;

          if (columnItem.render) {
            const render = (
              <Text className='taro-table-col-text'>
                {columnItem.render(text, dataSourceItem, index)}
              </Text>
            );

            if (typeof render !== 'object') {
              result = <Text className='taro-table-col-text'>{render}</Text>;
            } else {
              result = render;
            }
          } else {
            result = (
              <Text className='taro-table-col-text'>{String(text)}</Text>
            );
          }

          return (
            <View
              key={columnItem.key || columnItem.dataIndex}
              className={classNames(['taro-table-col'], {
                'taro-table-col-fixed': columnItem.fixed,
                [colClassName]: true
              })}
              style={{
                textAlign: columnItem.align || 'center',
                width: getSize(columnItem.width || DefaultData.ColWidth),
                [columnItem.fixed as string]:
                  columnItem.fixed &&
                  calculateFixedDistance({
                    fixedType: columnItem.fixed,
                    index: colIndex,
                    columns
                  }),
                ...colStyle
              }}
            >
              {result}
            </View>
          );
        }
      )}
    </View>
  );
}

export default memo(Row);
