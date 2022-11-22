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
      // console.log(dataIndex)
      if (dataIndex === 'time') {
        timeRef.current.focus();
      }

      if (dataIndex !== 'aaa' && dataIndex !== 'bbb') {
        console.log(inputRef)
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
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
    }
  };
  let childNode = children;
  if (editable) {
    childNode = editing ? (
      <Form.Item name={dataIndex} style={{ margin: 0 }}>
        {
          dataIndex === 'aaa' ?
            <Select
              autoFocus={true}
              open={editing}
              onChange={(e) => onaaaChange(e, dataIndex, index)}
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
            (
              dataIndex === 'time' ?
                <RangePicker
                  ref={timeRef}
                  locale={locale}
                  autoFocus={true}
                  open={timeOpen}
                  style={{ width: 250 }}
                  onChange={(e) => onTimeChange(e, dataIndex, index)}
                  onOpenChange={changeTime}
                /> :
                (
                  dataIndex === 'bbb' ?
                    <Select
                      autoFocus={true}
                      open={editing}
                      onBlur={save}
                      style={{
                        width: 150,
                      }}
                    >{
                        options.map((item, index) => {
                          return <Select.Option key={index} value={item.value}>{item.label}</Select.Option>
                        })
                      }
                    </Select> :
                    <Input style={{
                      width: 150,
                    }} ref={inputRef}
                      onPressEnter={save}
                      onBlur={save}
                      onChange={(e) => onInputChange(e, dataIndex)}
                      placeholder='请输入正整数'
                      status={status}
                    />
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
    if (type === 'personNumber') {
      const reg = /^[1-9]([0-9])*$/;
      let inputValue = e.target.value
      if (reg.test(inputValue) || inputValue === '') {
        setStatus('')
        form.setFieldValue(type, inputValue)
      } else {
        setStatus('error')
        form.setFieldValue(type, '')
      }
    }
  }
  const onTimeChange = async (e, type, ind) => {
    try {
      const values = await form.validateFields();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      // console.log('Save failed:', errInfo);
    }
  }
  const onaaaChange = async (e, type, ind) => {
    try {
      const values = await form.validateFields();
      // console.log(values)
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
      dataIndex: 'mainWorkTypeName',
      editable: true,
      align: 'center',
      render: (text, record, index) =>
        <Input style={{
          width: 150,
        }} value={record.mainWorkTypeName} />
    },
    {
      title: '自动装置采用情况',
      dataIndex: 'personNumber',
      editable: true,
      align: 'center',
      render: (text, record, index) =>
        <Input style={{
          width: 150,
        }} placeholder='请输入正整数' value={record.personNumber} />
    },
    {
      title: '设计时以满足自动控制要求',
      dataIndex: 'bbb',
      editable: true,
      align: 'center',
      render: (text, record, index) =>
        <Select
          value={record.bbb}
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
      dataIndex: 'aaa',
      editable: true,
      align: 'center',
      render: (text, record, index) =>
        <Select
          value={record.aaa}
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
      dataIndex: 'personNumber',
      editable: true,
      align: 'center',
      render: (text, record, index) =>
        <DatePicker disabled={record.aaa} style={{
          width: 150,
        }} />
      // <Input  placeholder='请输入正整数' value={record.personNumber} />
    },
    {
      title: '尚未整改（预计开始及结束时间）',
      dataIndex: 'time',
      editable: true,
      align: 'center',
      render: (text, record, index) =>
        <RangePicker style={{
          width: 250,
        }} />
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
      mainWorkTypeName: '',
      personNumber: '',
      holdCertificate: '',
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