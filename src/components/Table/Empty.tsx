import { memo } from 'react';
import { View, Text } from '@tarojs/components';

function Empty(props) {
  return (
    <View className='table-empty'>
      <Text>暂无数据</Text>
    </View>
  );
}

export default memo(Empty);
