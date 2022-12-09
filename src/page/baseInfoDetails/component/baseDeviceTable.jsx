import { Button, Form, Input, Table, Select, DatePicker } from 'antd';
import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  PlusOutlined
} from '@ant-design/icons';
// import 'moment/locale/zh-cn';
import 'moment/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';
const EditableContext = React.createContext(null);

const { RangePicker } = DatePicker;
const options = [
  {
    label: '是',
    value: true
  },
  {
    label: '否',
    value: false
  }
]
// const monthFormat = ['YYYY-MM', 'YYYY-MM'];

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};
const EditableCell = ({
  title,
  index,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  maxLength,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const timeRef = useRef(null);

  // const selectRef = useRef(null);
  const form = useContext(EditableContext);
  const [status, setStatus] = useState('')
  const [timeOpen, setTimeOpen] = useState(true);
  useEffect(() => {
    if (editing) {
      // const values =  { ...record  }
      // console.log(values.completeRectification)
      if (dataIndex === 'notRectification' || dataIndex === 'inRectification') {
        timeRef.current.focus();
      }

      else if (dataIndex !== 'completeRectification' && dataIndex !== 'autoControlAsk') {
        // console.log(inputRef)
        inputRef.current.focus();
      }
    }
  }, [editing, dataIndex]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };
  const changeTime = (val) => {
    setTimeOpen(val)
  }
  const save = async () => {
    // console.log(editing)
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
    }
  };
  const onSelectChange = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
    }
    // setEditing(false);
  }
  let childNode = children;
  if (editable) {
    childNode = editing ? (
      <Form.Item name={dataIndex} style={{ margin: 0 }}>
        {
          dataIndex === 'completeRectification' ?
            <Select
              autoFocus={true}
              open={editing}
              onChange={(e) => onSelectChange(e, dataIndex, index)}
              onBlur={save}
              style={{
                width: 150,
              }}
            >{
                options.map((item, index) => {
                  return <Select.Option key={index} value={item.value}>{item.label}</Select.Option>
                })
              }
            </Select>
            :
            // 时间段
            (
              dataIndex === 'notRectification' ?
                <RangePicker
                  ref={timeRef}
                  locale={locale}
                  autoFocus={true}
                  open={timeOpen}
                  style={{ width: 250 }}
                  disabled={record.completeRectification || record.completeRectification === ''}
                  onChange={(e) => onTimeChange(e, dataIndex, index)}
                  onOpenChange={changeTime}
                /> :
                (
                  dataIndex === 'autoControlAsk' ?
                    <Select
                      autoFocus={true}
                      open={editing}
                      onChange={onSelectChange}
                      style={{
                        width: 150,
                      }}
                    >{
                        options.map((item, index) => {
                          return <Select.Option key={index} value={item.value}>{item.label}</Select.Option>
                        })
                      }
                    </Select> :
                    (
                      dataIndex === 'inRectification' ? <DatePicker
                        ref={timeRef}
                        style={{
                          width: 150,
                        }}
                        disabled={record.completeRectification || record.completeRectification === ''}
                        locale={locale}
                        autoFocus={true}
                        open={timeOpen}
                        onChange={(e) => onTimeChange(e, dataIndex, index)}
                        onOpenChange={changeTime}
                      /> :
                        <Input style={{
                          width: 150,
                        }} ref={inputRef}
                          onPressEnter={save}
                          onBlur={save}
                          onChange={(e) => onInputChange(e, dataIndex)}
                          maxLength={maxLength}
                        />
                    )
                )
            )
        }
      </Form.Item>
    ) : (
      <div onClick={toggleEdit}>
        {children}
      </div>
    );
  }
  const onInputChange = (e, type) => {
    let inputValue = e.target.value
    form.setFieldValue(type, inputValue)
  }
  const onTimeChange = async (e, type, ind) => {
    try {
      const values = await form.validateFields();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      // console.log('Save failed:', errInfo);
    }
  }
  return <td {...restProps}>{childNode}</td>;
};

const AnswerTable = (props) => {
  const [dataSource, setDataSource] = useState(props.dataSource);
  const [count, setCount] = useState(1);

  const defaultColumns = [
    {
      title: '序号',
      dataIndex: '',
      align: 'center',
      width: 50,
      render: (text, record, index) =>
        <div style={{
          width: 50,
        }}>{index + 1}</div>
    },
    {
      title: '高危生产装置名称',
      dataIndex: 'dangerProductDeviceName',
      editable: true,
      align: 'center',
      maxLength: 64,
      render: (text, record, index) =>
        <Input style={{
          width: 150,
        }} value={record.dangerProductDeviceName} />
    },
    {
      title: '自动装置采用情况',
      dataIndex: 'autoControlUseSituation',
      editable: true,
      align: 'center',
      maxLength: 200,
      render: (text, record, index) =>
        <Input style={{
          width: 150,
        }} value={record.autoControlUseSituation} />
    },
    {
      title: '设计时以满足自动控制要求',
      dataIndex: 'autoControlAsk',
      editable: true,
      align: 'center',
      render: (text, record, index) =>
        <Select
          value={record.autoControlAsk}
          style={{
            width: 150,
          }}
        >
          {
            options.map((item, index) => {
              return <Select.Option key={index} value={item.value}>{item.label}</Select.Option>
            })
          }
        </Select>
    },
    {
      title: '已整改完毕',
      dataIndex: 'completeRectification',
      editable: true,
      align: 'center',
      render: (text, record, index) =>
        <Select
          value={record.completeRectification}
          style={{
            width: 150,
          }}
        >
          {
            options.map((item, index) => {
              return <Select.Option key={index} value={item.value}>{item.label}</Select.Option>
            })
          }
        </Select>
    },
    {
      title: '正在整改（预计完成时间）',
      dataIndex: 'inRectification',
      editable: true,
      align: 'center',
      render: (text, record, index) =>
        <DatePicker disabled={record.completeRectification || record.completeRectification === ''} style={{
          width: 150,
        }} value={record.inRectification} />
    },
    {
      title: '尚未整改（预计开始及结束时间）',
      dataIndex: 'notRectification',
      editable: true,
      align: 'center',
      render: (text, record, index) =>
        <RangePicker disabled={record.completeRectification || record.completeRectification === ''} style={{
          width: 250,
        }} value={record.notRectification} />
      // <Input style={{
      //   width: 150,
      // }} placeholder='请输入正整数' value={record.personNumber} />
    },
    {
      title: '操作',
      dataIndex: '',
      align: 'center',
      width: 70,
      render: (_, record, index) =>
        dataSource.length > 1 ?
          <Button type="link" danger onClick={() => handleDelete(record.key)}> 删除 </Button>
          : <div style={{
            width: 70,
          }}></div>,
    },
  ];
  const handleAdd = () => {
    const newData = {
      key: count,
      dangerProductDeviceName: '',
      autoControlUseSituation: '',
      autoControlAsk: '',//布尔
      completeRectification: '',//布尔值
      inRectification: '',//时间
      notRectification: []//时间段
    };
    setDataSource([...dataSource, newData]);
    setCount(count + 1)
  };

  const handleDelete = (key) => {
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
    props.setTableData(newData)
  };
  const handleSave = (row) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });
    setDataSource(newData);
    // newData.forEach(item => {
    //   // console.log(item)
    //   if (item.inRectification !== '') {
    //     item.inRectification.format('YYYY-MM-DD')
    //   }
    // })
    // console.log(1111111,newData)
    props.setTableData(newData)
  };
  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };
  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record, index) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        index,
        maxLength: col.maxLength,
        handleSave,
      }),
    };
  });
  useEffect(() => {
    if (props.dataSource) {
      setDataSource(props.dataSource)
    }
  }, [props])
  return (
    <div>
      <Table
        components={components}
        rowClassName={() => 'editable-row'}
        bordered
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        scroll={{
          x: '100%',
        }}
      />
      <Button
        onClick={handleAdd}
        style={{ margin: '16px 0' }}
      >
        <PlusOutlined />
        增 加
      </Button>
    </div>
  );
};

export default AnswerTable;