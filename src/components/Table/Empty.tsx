import { memo } from 'react';
import { View, Text } from '@tarojs/components';
import './index.less';

function Empty(props) {
  return (
    <View className='taro-table-empty'>
      <Text>暂无数据</Text>
    </View>
  );
}

export default memo(Empty);
