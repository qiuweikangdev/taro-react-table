import { useRef, useState } from 'react';
import { View } from '@tarojs/components';
import Table, { LoadStatus } from '../../components/Table';

export default function Demo() {
  const [dataSource, setDataSource] = useState([
    {
      name1: '单车1',
      name2: '够钟1',
      name3: '追1',
      name4: '幼稚完1'
    },
    {
      name1: '单车2',
      name2: '够钟2',
      name3: '追2',
      name4: '幼稚完2'
    },
    {
      name1: '单车3',
      name2: '够钟3',
      name3: '追3',
      name4: '幼稚完3'
    },
    {
      name1: '单车4',
      name2: '够钟4',
      name3: '追4',
      name4: '幼稚完4'
    },
    {
      name1: '单车5',
      name2: '够钟5',
      name3: '追5',
      name4: '幼稚完5'
    },
    {
      name1: '单车6',
      name2: '够钟6',
      name3: '追6',
      name4: '幼稚完6'
    }
  ]);
  const [loadStatus, setLoadStatus] = useState<LoadStatus>(null);

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

  const getList = async (): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const list = [...dataSource];
        for (let i = 1; i < 10; i++) {
          const size = list.length + 1;
          list.push({
            name1: `单车${size}`,
            name2: `够钟${size}`,
            name3: `追${size}`,
            name4: `幼稚完${size}`
          });
        }
        resolve(list);
      }, 1000);
    });
  };

  const onLoad = async e => {
    setLoadStatus('loading');
    const list = await getList();
    setDataSource(list);
    setLoadStatus(list.length > 20 ? 'noMore' : null);
  };

  return (
    <View>
      <Table
        dataSource={dataSource}
        columns={columns}
        style={{ height: '250px' }}
        onLoad={onLoad}
        loadStatus={loadStatus}
      ></Table>
    </View>
  );
}
