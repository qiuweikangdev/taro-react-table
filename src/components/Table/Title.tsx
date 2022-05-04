import { CSSProperties, memo } from 'react';
import classNames from 'classnames';
import { View, Text } from '@tarojs/components';
import { getSize } from './utils';
import { DefaultData } from './types';
import { Columns } from '.';

export type TitleProps = {
  column: Columns;
  index: number;
  fixed?: boolean;
  titleStyle?: CSSProperties;
  titleClassName?: string;
};

function Title(props: TitleProps) {
  const { column, index, titleStyle = {}, titleClassName = '' } = props;
  const handleClickTitle = (column, index) => {};

  return (
    <View
      onClick={() => handleClickTitle(column, index)}
      className={classNames(['taro-table-title'], {
        taro3table_fixed: column.fixed,
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
    </View>
  );
}

export default memo(Title);
