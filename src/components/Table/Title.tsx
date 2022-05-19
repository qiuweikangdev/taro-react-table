import { CSSProperties, memo } from 'react';
import classNames from 'classnames';
import { View, Text } from '@tarojs/components';
import { getSize } from './utils';
import { DefaultData, Columns, SortOrder, SorterEvent } from './types';

export type TitleProps = {
  columns: Columns[];
  column: Columns;
  setColumns?: any;
  index: number;
  fixed?: boolean;
  titleStyle?: CSSProperties;
  titleClassName?: string;
  onSorter?: ({ column, field, order }: SorterEvent) => void;
  unsort?: boolean;
};

function Title(props: TitleProps) {
  const {
    setColumns,
    columns,
    column,
    index,
    titleStyle = {},
    titleClassName = '',
    unsort,
    onSorter
  } = props;

  const handleClickTitle = (col: Columns, colIndex: number) => {
    if (col.sorter) {
      const tempColumns = [...columns];
      tempColumns.forEach((j: Columns, i: number): void => {
        if (i !== colIndex) {
          delete j.sortOrder;
        }
      });
      /**
       * 排序有三种状态：点击升序、点击降序、取消排序。一般需求只需要升序和降序，不需要取消排序
       * 可通过unsort来设置 是否支持取消排序
       */
      let curCol: SortOrder[] = ['ascend', 'descend'];
      if (unsort) {
        // undefined/false：取消排序，ascend：升序，descend：降序
        curCol = ['ascend', 'descend', undefined];
      }
      const curIndex: number = curCol.indexOf(tempColumns[colIndex].sortOrder);
      const next: SortOrder = (tempColumns[colIndex].sortOrder =
        curCol[(curIndex + 1) % curCol.length]);
      setColumns(tempColumns);
      onSorter?.({ column, field: col.dataIndex, order: next });
    }
  };

  return (
    <View
      onClick={() => handleClickTitle(column, index)}
      className={classNames(['taro-table-title'], {
        ['taro-table-fixed']: column.fixed,
        [titleClassName]: true
      })}
      style={{
        // [column.fixed as string]:
        // column.fixed &&
        // calculateFixedDistance({ fixedType: column.fixed, index, columns }),
        width: getSize(column.width || DefaultData.ColWidth),
        ...column.titleStyle,
        ...titleStyle
      }}
      key={column.key || column.dataIndex}
    >
      <Text>{column.title}</Text>
      {column.sorter && (
        <View className='taro-table-title-sort-wrwapper'>
          <View
            className={classNames({
              ['title-sort-btn']: true,
              ['title-ascend']: true,
              ['title-ascend-active']: column.sortOrder === 'ascend'
            })}
          />
          <View
            className={classNames({
              ['title-sort-btn']: true,
              ['title-descend']: true,
              ['title-descend-active']: column.sortOrder === 'descend'
            })}
          />
        </View>
      )}
    </View>
  );
}

export default memo(Title);
