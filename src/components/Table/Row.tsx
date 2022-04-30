import { memo } from 'react';
import classNames from 'classnames';
import { View, Text } from '@tarojs/components';
import { calculateFixedDistance, getSize } from './utils';
import { DEFAULTDATA, Columns, RowProps } from './types';
import './index.less';

function Row(props: RowProps) {
  const { dataSourceItem, rowKey, columns, index } = props;
  return (
    <View key={dataSourceItem[rowKey]} className={classNames('taro-table-row')}>
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
                'taro-table-col-fixed': columnItem.fixed
              })}
              style={{
                textAlign: columnItem.align || 'center',
                width: getSize(columnItem.width || DEFAULTDATA.ColWidth),
                [columnItem.fixed as string]:
                  columnItem.fixed &&
                  calculateFixedDistance({
                    fixedType: columnItem.fixed,
                    index: colIndex,
                    columns
                  })
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
