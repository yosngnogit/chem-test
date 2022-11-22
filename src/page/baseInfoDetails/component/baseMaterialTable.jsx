import { Button, Form, Input, Table, Select } from 'antd';
import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  PlusOutlined
} from '@ant-design/icons';
// import 'moment/locale/zh-cn';
const EditableContext = React.createContext(null);
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
  const selectRef = useRef(null);
  const form = useContext(EditableContext);
  const [status, setStatus] = useState('')
  useEffect(() => {
    if (editing) {
      if (dataIndex === 'holdCertificate') {
        selectRef.current.focus();

      } else {
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
          dataIndex === 'holdCertificate' ?
            <Select
              autoFocus={true}
              open={editing}
              onBlur={save}
              ref={selectRef}
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
              dataIndex === 'personNumber' ? <Input style={{
                width: 150,
              }} ref={inputRef}
                onPressEnter={save}
                onBlur={save}
                onChange={(e) => onInputChange(e, dataIndex)}
                placeholder='请输入正整数'
                status={status}
              /> : <Input style={{
                width: 150,
              }} ref={inputRef}
                onPressEnter={save}
                onBlur={save}
                maxLength='64'
                onChange={(e) => onInputChange(e, dataIndex)}
              />
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
      width: 70,
      render: (text, record, index) =>
        <span>{index + 1}</span>
    },
    {
      title: '主要原料名称',
      dataIndex: 'mainWorkTypeName',
      editable: true,
      align: 'center',
      width: 500,
      render: (text, record, index) =>
        <Input style={{
          width: 400,
        }} value={record.mainWorkTypeName} />
    },
    {
      title: '年产量（T）',
      dataIndex: 'personNumber',
      editable: true,
      align: 'center',
      render: (text, record, index) =>
        <Input style={{
          width: 150,
        }} placeholder='请输入正整数' value={record.personNumber} />
    },
    {
      title: '操作',
      dataIndex: '',
      align: 'center',
      width: 80,
      render: (_, record, index) =>
        dataSource.length > 1 ?
          <Button type="link" danger onClick={() => handleDelete(record.key)}> 删除 </Button>
          : null,
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