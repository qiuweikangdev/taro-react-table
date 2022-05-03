import { memo } from 'react';
import { View, Text } from '@tarojs/components';
import Loading from '../Loading';
import './index.less';

export type LoadMoreProps = {
  status?: 'loading' | 'noMore' | null;
  loadingText?: string;
  noMoreText?: string;
};

function LoadMore({ status, loadingText, noMoreText }: LoadMoreProps) {
  return (
    <View className='load-more'>
      {status === 'loading' && <Loading text={loadingText}></Loading>}
      {status == 'noMore' && (
        <Text className='no-more-text'>{noMoreText || '没有更多了'}</Text>
      )}
    </View>
  );
}

export default memo(LoadMore);
