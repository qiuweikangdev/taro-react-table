import { memo } from 'react';
import { View, Text } from '@tarojs/components';
import Loading from '../Loading';

export type LoadMoreProps = {
  /**
   * 组件状态，more 状态显示查看更多按钮，loading 状态显示加载状态，noMore 显示无更多数据
   * @default 'noMore'
   */
  status?: 'loading' | 'noMore';
  /**
   * loading 状态显示文案
   * @default '加载中'
   */
  loadingText?: string;
  /**
   * noMore 状态显示文案
   * @default '没有更多'
   */
  noMoreText?: string;
};

function LoadMore({ status, loadingText, noMoreText }: LoadMoreProps) {
  return (
    <View className='load-more'>
      {status === 'loading' && <Loading text={loadingText}></Loading>}
      <Text>{status == 'noMore' ? noMoreText : '没有更多了'}</Text>
    </View>
  );
}

export default memo(LoadMore);
