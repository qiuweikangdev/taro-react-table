
# taro-react-table

基于Taro3、React的H5和微信小程序多端表格组件
- 兼容H5、微信小程序
- 自定义样式
- 自定义排序
- 固定表头
- 滚动上拉加载


![](https://raw.githubusercontent.com/qiuweikangdev/taro-react-table/master/images/demo.gif)


# 安装
```bash
npm install taro-react-table
````
# 配置

- config/index.js配置
- 让taro去通过postcss编译处理 `taro-react-table`模块, 需要对 `taro-react-table` 里的样式单位进行转换适配

```js
// config/index.js
const config = {
	h5:{
       esnextModules: ['taro-react-table']
    }
}
```

# 导入组件

```js
import Table from 'taro-react-table'
import 'taro-react-table/dist/index.css'
```

# 参数说明

## Table

| 参数             | 描述                                                         | 类型                               | 必传 | 默认值 |
| ---------------- | ------------------------------------------------------------ | ---------------------------------- | ---- | ------ |
| 本身参数         | 参考[ScrollView](https://taro-docs.jd.com/taro/docs/components/viewContainer/scroll-view) |                                    |      |        |
| `dataSource`     | 数据源                                                       | object[]                           | 是   | `[]`   |
| `columns`        | 表格列的配置描述，具体项见下表                               | Columns[]                          | 是   | `[]`   |
| `rowKey`         | 表格行 key 的取值，可以是字符串或一个函数                    | string \| function(record): string | 是   | `key`  |
| `wrapperClass`   | 外层容器的类名                                               | string                             | 否   |        |
| `wrapperStyle`   | 外层容器的样式                                               | object                             | 否   |        |
| `className`      | ScrollView容器类名                                           | string                             | 否   |        |
| `style`          | ScrollView容器样式                                           | object                             | 否   |        |
| `rowClassName`   | 行类名                                                       | string                             | 否   |        |
| `rowStyle`       | 行样式                                                       | object                             | 否   |        |
| `colClassName`   | 单元格类名                                                   | string                             | 否   |        |
| `colStyle`       | 单元格样式                                                   | object                             | 否   |        |
| `titleStyle`     | 标题样式                                                     | object                             | 否   |        |
| `titleClassName` | 标题类名                                                     | string                             | 否   |        |
| `titleClassName` | 标题类名                                                     | string                             | 否   |        |
| `loading`        | 是否显示加载                                                 | boolean                            | 否   |        |
| `loadStatus`     | 加载状态                                                     | loading \| noMore \| null          | 否   | null   |
| `colWidth`       | 列宽度                                                       | *number*                           | 否   | 120    |
| `unsort`         | 设置是否取消排序 (一般需求不需要取消排序，设置true可开启取消排序) | boolean                            | 否   | false  |



## Events

| 事件名     | 描述                       | 类型                                    | 必传 | 默认值 |
| ---------- | -------------------------- | --------------------------------------- | ---- | ------ |
| `onLoad`   | 滚动底部触发，用于上拉加载 | Function                                | 否   |        |
| `onSorter` | 点击表头按钮触发排序       | ({ column, field, order }: SorterEvent) | 否   |        |



## Column

| 参数        | 描述                                                         | 类型                               | 必传        | 默认值 |
| ----------- | ------------------------------------------------------------ | ---------------------------------- | ----------- | ------ |
| `title`     | 标题                                                         | string                             | JSX.Element | 是     |
| `dataIndex` | 列数据在数据项中对应的路径                                   | string                             | 是          | `[]`   |
| `key`       | 表格行 key 的取值，可以是字符串或一个函数                    | string \| function(record): string | 否          | `key`  |
| `align`     | 设置该列文本对齐方式                                         | string                             | 否          | center |
| `style`     | 标题样式                                                     | object                             | 否          |        |
| `align`     | 外层容器的类名                                               | string                             | 否          |        |
| `className` | 标题类名                                                     | string                             | 否          |        |
| `render`    | 生成复杂数据的渲染函数，参数分别为当前行的值，当前行数据，行索引 | function(text, record, index) {}   | 否          |        |
| `width`     | ScrollView容器类名                                           | string                             | 否          |        |
| `fixed`     | 固定列                                                       | left \| right                      | 否          |        |
| `sorter`    | 排序函数，本地排序使用一个函数(参考 [Array.sort](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) 的 compareFunction)，需要服务端排序可设为 true | CompareFn                          | 否          |        |
| `sortOrder` | 排序的受控属性，外界可用此控制列的排序，可设置为 `ascend` `descend` false | boolean \| string                  |             |        |

# 使用

```jsx
import { useState } from 'react'
import Table,{ Columns, LoadStatus, SorterEvent } from 'taro-react-table'

export default function Demo() {
  const [loading, setLoading] = useState(false)
  const [dataSource, setDataSource] = useState([
    {
      name1: '无人之境1',
      name2: '打回原形1',
      name3: '防不胜防1',
      name4: '十面埋伏1',
    },
    {
      name1: '无人之境2',
      name2: '打回原形2',
      name3: '防不胜防2',
      name4: '十面埋伏2',
    },
    {
      name1: '无人之境3',
      name2: '打回原形3',
      name3: '防不胜防3',
      name4: '十面埋伏3',
    },
    {
      name1: '无人之境4',
      name2: '打回原形4',
      name3: '防不胜防4',
      name4: '十面埋伏4',
    },
    {
      name1: '无人之境5',
      name2: '打回原形5',
      name3: '防不胜防5',
      name4: '十面埋伏5',
    },
    {
      name1: '无人之境6',
      name2: '打回原形6',
      name3: '防不胜防6',
      name4: '十面埋伏6',
    },
  ])
  const [loadStatus, setLoadStatus] = useState<LoadStatus>(null)
  const [sortInfo, setSortInfo] = useState<Omit<SorterEvent, 'column'>>({
    field: 'name1',
    order: 'ascend',
  })

  const columns: Columns[] = [
    {
      title: '陈奕迅1',
      dataIndex: 'name1',
      sorter: true,
      fixed: 'left',
      sortOrder: sortInfo.field == 'name1' && sortInfo.order,
    },
    {
      title: '陈奕迅2',
      dataIndex: 'name2',
    },
    {
      title: '陈奕迅3',
      dataIndex: 'name3',
    },
    {
      title: '陈奕迅4',
      dataIndex: 'name4',
    },
  ]

  const getList = async (): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const list = [...dataSource]
        for (let i = 1; i < 10; i++) {
          const size = list.length + 1
          list.push({
            name1: `无人之境${size}`,
            name2: `打回原形${size}`,
            name3: `防不胜防${size}`,
            name4: `十面埋伏${size}`,
          })
        }
        resolve(list)
      }, 1000)
    })
  }

  const onLoad = async e => {
    setLoadStatus('loading')
    const list = await getList()
    setDataSource(list)
    setLoadStatus(list.length > 20 ? 'noMore' : null)
  }

  // 排序回调
  const onSorter = ({ column, field, order }: SorterEvent) => {
    console.log(column, field, order)
    // 模拟排序加载效果
    setLoading(state => !state)
    setSortInfo({ order, field })
    const tempList = [...dataSource]
    setTimeout(() => {
      setLoading(false)
      tempList.reverse()
      setDataSource(tempList)
    }, 1000)
  }

  return (
    <Table
      loading={loading}
      dataSource={dataSource}
      columns={columns}
      style={{ height: '250px' }}
      onLoad={onLoad}
      loadStatus={loadStatus}
      onSorter={onSorter}
    ></Table>
  )
}

```
