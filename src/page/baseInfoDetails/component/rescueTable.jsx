import { Button, Form, Input, Table, message } from 'antd';
import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  PlusOutlined
} from '@ant-design/icons';
// import 'moment/locale/zh-cn';
import { tellReg } from '@/utils/reg'
const deleteList = []

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

  const save = async (dataIndex) => {
    try {
      const values = await form.validateFields();
      if (dataIndex === 'telephone') {
        if (tellReg.test(values.telephone) || values.telephone === '') {
          setStatus('')
          form.setFieldValue(dataIndex, values.telephone)
          toggleEdit();
          handleSave({ ...record, ...values });
        } else {
          setStatus('error')
          form.setFieldValue(dataIndex, values.telephone)
          message.warning('请输入正确号码！');
        }
      } else {
        toggleEdit();
        handleSave({ ...record, ...values });
      }
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
            onBlur={() => save(dataIndex)}
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
    if (type === 'telephone') {
      let inputValue = e.target.value
      if (tellReg.test(inputValue) || inputValue === '') {
        setStatus('')
        form.setFieldValue(type, inputValue)
      } else {
        setStatus('error')
        form.setFieldValue(type, inputValue)
      }
    }
  }
  return <td {...restProps}>{childNode}</td>;
};

const AnswerTable = (props) => {
  const [dataSource, setDataSource] = useState(props.dataSource);
  // const [deleteList, setDeleteList] = useState([]);
  const [count, setCount] = useState(1);
  const tableType = props.tableType
  // const deleteList = []
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
      title: '应急工作职务',
      dataIndex: 'emergencyWork',
      editable: true,
      align: 'center',
      maxLength: 64,

      render: (text, record, index) =>
        <Input style={{
          width: 150,
        }} value={record.emergencyWork} />
    },
    {
      title: '职责划分',
      dataIndex: 'liableDivide',
      editable: true,
      align: 'center',
      maxLength: 200,

      render: (text, record, index) =>
        <Input style={{
          width: 150,
        }} value={record.liableDivide} />
    },
    {
      title: '电话号码',
      dataIndex: 'telephone',
      editable: true,
      align: 'center',
      render: (text, record, index) =>
        <Input style={{
          width: 150,
        }} value={record.telephone} />
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
      render: (text, record, index) =>
        dataSource.length > 1 ?
          <Button type="link" danger onClick={() => handleDelete(text, record.key)}> 删除 </Button>
          : <div style={{
            width: 70,
          }}></div>,
    },
  ];
  const handleAdd = () => {
    const newData = {
      key: count,
      name: '',
      remark: '',
      liableDivide: '',
      telephone: '',
      emergencyWork: '',
    };
    setDataSource([...dataSource, newData]);
    setCount(count + 1)
  };

  const handleDelete = (row, key) => {
    // console.log(row)
    if (row.id) deleteList.push(row.id)
    // const deleteInnerList = dataSource.filter((item) => item.id === row.id);
    const newData = dataSource.filter((item) => item.key !== key);
    // setDeleteList(val => [...val, ...deleteInnerList])
    setDataSource(newData);
    Array.from(new Set(deleteList))
    props.setTableData(newData, tableType, deleteList)
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