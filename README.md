
# taro-react-table

基于Taro3、React的H5和微信小程序多端表格组件
- 兼容H5、微信小程序
- 自定义样式
- 固定表头
- 滚动上拉加载

![](https://raw.githubusercontent.com/qiuweikangdev/taro-react-table/master/images/demo.gif)


# 安装
```bash
npm install taro-react-table
````
# 引入组件
```js
import Table from 'taro-react-table'
import 'taro-react-table/dist/index.css'
```
# 使用
```js
import { useRef, useState } from 'react';
import { View } from '@tarojs/components';
import Table from 'taro-react-table'
import 'taro-react-table/dist/index.css'

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

```

# 参数说明

## Table

| 参数             | 描述                                        | 类型                               | 必传 | 默认值 |
| ---------------- | ------------------------------------------- | ---------------------------------- | ---- | ------ |
| `dataSource`     | `数据源`                                    | object[]                           | 是   | `[]`   |
| `columns`        | `表格列的配置描述，具体项见下表`            | Columns[]                          | 是   | `[]`   |
| `rowKey`         | `表格行 key 的取值，可以是字符串或一个函数` | string \| function(record): string | 是   | `key`  |
| `wrapperClass`   | `外层容器的类名`                            | string                             | 否   |        |
| `wrapperStyle`   | `外层容器的样式`                            | object                             | 否   |        |
| `className`      | `ScrollView容器类名`                        | string                             | 否   |        |
| `style`          | `ScrollView容器样式`                        | object                             | 否   |        |
| `rowClassName`   | `行类名`                                    | string                             | 否   |        |
| `rowStyle`       | `行样式`                                    | object                             | 否   |        |
| `colClassName`   | `单元格类名`                                | string                             | 否   |        |
| `colStyle`       | `单元格样式`                                | object                             | 否   |        |
| `titleStyle`     | `标题样式`                                  | object                             | 否   |        |
| `titleClassName` | `标题类名`                                  | string                             | 否   |        |
| `titleClassName` | `标题类名`                                  | string                             | 否   |        |
| `loading`        | `是否显示加载`                              | boolean                            | 否   |        |
| `loadStatus`     | `加载状态`                                  | loading \| noMore \| null          | 否   | null   |
| `onLoad`         | `滚动底部触发，用于上拉加载`                | Function                           | 否   |        |



## Column

| 参数        | 描述                                                         | 类型                               | 必传        | 默认值   |
| ----------- | ------------------------------------------------------------ | ---------------------------------- | ----------- | -------- |
| `title`     | `标题`                                                       | string                             | JSX.Element | 是       |
| `dataIndex` | `列数据在数据项中对应的路径`                                 | string                             | 是          | `[]`     |
| `key`       | `表格行 key 的取值，可以是字符串或一个函数`                  | string \| function(record): string | 否          | `key`    |
| `align`     | `设置该列文本对齐方式`                                       | string                             | 否          | 'center' |
| `style`     | `标题样式`                                                   | object                             | 否          |          |
| `align`     | `外层容器的类名`                                             | string                             | 否          |          |
| `className` | `标题类名`                                                   | string                             | 否          |          |
| `render`    | `生成复杂数据的渲染函数，参数分别为当前行的值，当前行数据，行索引` | function(text, record, index) {}   | 否          |          |
| `width`     | `ScrollView容器类名`                                         | string                             | 否          |          |
| `fixed`     | `固定列`                                                     | left \| right                      | 否          |          |

