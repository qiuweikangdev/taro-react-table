import { Component } from 'react';
import { View, Text } from '@tarojs/components';
import Table from '../../components/Table';

export default function Demo() {
  const dataSource = [
    {
      name1: '单车',
      name2: '够钟',
      name3: '风继续吹',
      name4: '幼稚完'
    },
    {
      name1: '十面埋伏',
      name2: '最好不过',
      name3: '怪你过分美丽',
      name4: '爱不久'
    }
  ];

  const columns = [
    {
      title: '陈奕迅',
      dataIndex: 'name1'
    },
    {
      title: '周柏豪',
      dataIndex: 'name2'
    },
    {
      title: '张国荣',
      dataIndex: 'name3'
    },
    {
      title: '林峯',
      dataIndex: 'name4'
    }
  ];

  return (
    <View style={{ padding: '20px' }}>
      <Table rowKey='rowKey' dataSource={dataSource} columns={columns}></Table>
    </View>
  );
}
