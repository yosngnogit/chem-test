import { Button, Form, Input, Table, message } from 'antd';
import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  PlusOutlined
} from '@ant-design/icons';
// import 'moment/locale/zh-cn';
import { positiveIntegerReg } from '@/utils/reg'

const EditableContext = React.createContext(null);
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

  const form = useContext(EditableContext);
  const [status, setStatus] = useState('')
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
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
          <Input style={{
            width: 150,
          }} ref={inputRef}
            onPressEnter={save}
            onBlur={save}
            maxLength={maxLength}
            status={status}
            onChange={(e) => onInputChange(e, dataIndex)}
          />
        }
      </Form.Item>
    ) : (
      <div onClick={toggleEdit}>
        {children}
      </div>
    );
  }
  const onInputChange = (e, type) => {
    if (type === 'number') {
      let inputValue = e.target.value
      if (positiveIntegerReg.test(inputValue) || inputValue === '') {
        setStatus('')
        form.setFieldValue(type, inputValue)
      } else {
        setStatus('error')
        if (inputValue.includes('.') && inputValue.length === 2) {
          message.warning('请输入正整数！');
        } else {
        }
        form.setFieldValue(type, '')
      }
    }
  }
  return <td {...restProps}>{childNode}</td>;
};

const AnswerTable = (props) => {
  const [dataSource, setDataSource] = useState(props.dataSource);
  const [count, setCount] = useState(1);
  const tableType = props.tableType
  const defaultColumns = [
    {
      title: '姓名',
      dataIndex: 'name',
      editable: true,
      align: 'center',
      maxLength: 64,
      render: (text, record, index) =>
        <Input style={{
          width: 150,
        }} value={record.name} />
    },
    {
      title: '数量',
      dataIndex: 'number',
      editable: true,
      align: 'center',
      render: (text, record, index) =>
        <Input style={{
          width: 150,
        }} value={record.number} />
    },
    {
      title: '规格型号',
      dataIndex: 'specification',
      editable: true,
      align: 'center',
      maxLength: 64,

      render: (text, record, index) =>
        <Input style={{
          width: 150,
        }} value={record.specification} />
    },
    {
      title: '存放地点',
      dataIndex: 'storageLocation',
      editable: true,
      align: 'center',
      maxLength: 128,

      render: (text, record, index) =>
        <Input style={{
          width: 150,
        }} value={record.storageLocation} />
    },
    {
      title: '维护情况或有效期',
      dataIndex: 'maintainOrValid',
      editable: true,
      align: 'center',
      maxLength: 200,

      render: (text, record, index) =>
        <Input style={{
          width: 150,
        }} value={record.maintainOrValid} />
    },
    {
      title: '用途',
      dataIndex: 'purpose',
      editable: true,
      align: 'center',
      maxLength: 200,

      render: (text, record, index) =>
        <Input style={{
          width: 150,
        }} value={record.purpose} />
    },
    {
      title: '责任人',
      dataIndex: 'liablePerson',
      editable: true,
      align: 'center',
      maxLength: 64,

      render: (text, record, index) =>
        <Input style={{
          width: 150,
        }} value={record.liablePerson} />
    },
    {
      title: '备注',
      dataIndex: 'remark',
      editable: true,
      align: 'center',
      maxLength: 200,

      render: (text, record, index) =>
        <Input style={{
          width: 150,
        }} value={record.remark} />
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
      name: '',
      number: '',
      specification: '',
      storageLocation: '',
      maintainOrValid: '',
      purpose: '',
      liablePerson: '',
      type: tableType
    };
    setDataSource([...dataSource, newData]);
    setCount(count + 1)
  };

  const handleDelete = (key) => {
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
    newData.map(item => {
      item.type = tableType
      return item
    })
    props.setTableData(newData, tableType)
  };
  const handleSave = (row) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });
    setDataSource(newData);
    newData.map(item => {
      item.type = tableType
      return item
    })
    props.setTableData(newData, tableType)
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