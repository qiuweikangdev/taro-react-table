import { memo } from 'react';
import classNames from 'classnames';
import { View, Text } from '@tarojs/components';
import { getSize } from './utils';
import { DEFAULTDATA } from './types';
import { Columns } from '.';

export type TitleProps = {
  column: Columns;
  index: number;
  fixed?: boolean;
};

function Title(props: TitleProps) {
  const { column, index } = props;
  const handleClickTitle = (column, index) => {};

  return (
    <View
      onClick={() => handleClickTitle(column, index)}
      className={classNames(['taro-table-title'], {
        taro3table_fixed: column.fixed
      })}
      style={{
        // [column.fixed as string]:
        // column.fixed &&
        // calculateFixedDistance({ fixedType: column.fixed, index, columns }),
        width: getSize(column.width || DEFAULTDATA.ColWidth),
        ...column.titleStyle
      }}
      key={column.key || column.dataIndex}
    >
      <Text>{column.title}</Text>
    </View>
  );
}

export default memo(Title);
