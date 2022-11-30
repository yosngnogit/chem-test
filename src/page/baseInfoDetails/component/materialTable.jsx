import { Button, Form, Input, Table, message, DatePicker } from 'antd';
import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  PlusOutlined
} from '@ant-design/icons';
// import 'moment/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';
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
  maxLength,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const selectRef = useRef(null);
  const form = useContext(EditableContext);
  const timeRef = useRef(null);
  const [timeOpen, setTimeOpen] = useState(true);
  const [status, setStatus] = useState('')
  useEffect(() => {
    if (editing) {
      if (dataIndex === 'purchaseDate' || dataIndex === 'replaceTime') {
        timeRef.current.focus();
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
  const changeTime = (val) => {
    setTimeOpen(val)
  }
  let childNode = children;
  if (editable) {
    childNode = editing ? (
      <Form.Item name={dataIndex} style={{ margin: 0 }}>
        {
          dataIndex === 'purchaseDate' || dataIndex === 'replaceTime' ? <DatePicker
            ref={timeRef}
            locale={locale}
            autoFocus={true}
            open={timeOpen}
            style={{ width: 180 }}
            onChange={(e) => onTimeChange(e, dataIndex, index)}
            onOpenChange={changeTime}
          />
            :
            <Input style={{
              width: 150,
            }} ref={inputRef}
              onPressEnter={save}
              onBlur={save}
              status={status}
              maxLength={maxLength}
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
  const onTimeChange = async (e, type, ind) => {
    try {
      const values = await form.validateFields();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
    }
  }
  return <td {...restProps}>{childNode}</td>;
};

const AnswerTable = (props) => {
  const [dataSource, setDataSource] = useState(props.dataSource);
  const [count, setCount] = useState(1);

  const defaultColumns = [
    {
      title: '器材名称',
      dataIndex: 'equipmentName',
      editable: true,
      align: 'center',
      maxLength: 64,
      render: (text, record, index) =>
        <Input style={{
          width: 150,
        }} value={record.equipmentName} />
    },
    {
      title: '购置日期',
      dataIndex: 'purchaseDate',
      editable: true,
      align: 'center',
      render: (text, record, index) =>
        <DatePicker
          style={{ width: 150 }}
          value={record.purchaseDate} />
    },
    {
      title: '安放位置',
      dataIndex: 'placementPosition',
      editable: true,
      align: 'center',
      maxLength: 64,

      render: (text, record, index) =>
        <Input style={{
          width: 150,
        }} value={record.placementPosition} />
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
      title: '使用部门',
      dataIndex: 'useDept',
      editable: true,
      align: 'center',
      maxLength: 64,

      render: (text, record, index) =>
        <Input style={{
          width: 150,
        }} value={record.useDept} />
    },
    {
      title: '器材管理负责人',
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
      title: '更换时间',
      dataIndex: 'replaceTime',
      editable: true,
      align: 'center',
      render: (text, record, index) =>
        <DatePicker
          style={{ width: 150 }}
          value={record.replaceTime} />
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
      equipmentName: '',
      purchaseDate: '',
      placementPosition: '',
      number: '',
      useDept: '',
      liablePerson: '',
      replaceTime: '',
      remark: ''
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