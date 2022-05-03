import { View, Text } from '@tarojs/components';
import './index.less';

export type LoadingProps = {
  text?: string;
};

function Loading({ text }: LoadingProps) {
  return (
    <View className='loading-wrapper'>
      <View className='loading'></View>
      <Text className='loading-text'>{text || '加载中...'}</Text>
    </View>
  );
}

export default Loading;
