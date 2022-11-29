import { Button, Form, Input, Table, Select, DatePicker } from 'antd';
import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  PlusOutlined
} from '@ant-design/icons';
import 'moment/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';

import { positiveIntegerReg } from '@/utils/reg'

const EditableContext = React.createContext(null);
const { RangePicker } = DatePicker;
const options = [
  {
    label: '小学',
    value: '小学'
  },
  {
    label: '初中',
    value: '初中'
  }, {
    label: '高中',
    value: '高中'
  }, {
    label: '专科',
    value: '专科'
  }, {
    label: '本科',
    value: '本科'
  }, {
    label: '研究生',
    value: '研究生'
  }, {
    label: '博士',
    value: '博士'
  },
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
  maxLength,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const selectRef = useRef(null);
  const timeRef = useRef(null);
  const [timeOpen, setTimeOpen] = useState(true);

  const form = useContext(EditableContext);
  const [status, setStatus] = useState('')
  useEffect(() => {
    if (editing) {
      if (dataIndex === 'appointmentTime') {
        // selectRef.current.focus();
        timeRef.current.focus();
      }
      else if(dataIndex !== 'education') {
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
        {(
          dataIndex === 'appointmentTime' ?
            <DatePicker
              ref={timeRef}
              locale={locale}
              autoFocus={true}
              open={timeOpen}
              style={{ width: 150 }}
              onChange={(e) => onTimeChange(e, dataIndex, index)}
              onOpenChange={changeTime}
            /> :
            (
              dataIndex === 'education' ?
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
                <Input style={{
                  width: 150,
                }} ref={inputRef}
                  onPressEnter={save}
                  onBlur={save}
                  maxLength={maxLength}
                />
            )
        )}
      </Form.Item>
    ) : (
      <div onClick={toggleEdit}>
        {children}
      </div>
    );
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
      title: '任命组织机构成员时间',
      dataIndex: 'appointmentTime',
      editable: true,
      align: 'center',
      render: (text, record, index) =>
        <DatePicker style={{
          width: 150,
        }} value={record.appointmentTime} />
    },
    {
      title: '成员姓名',
      dataIndex: 'memberName',
      editable: true,
      align: 'center',
      maxLength: 64,
      render: (text, record, index) =>
        <Input style={{
          width: 150,
        }} value={record.memberName} />
    },
    {
      title: '学历',
      dataIndex: 'education',
      editable: true,
      align: 'center',
      render: (text, record, index) =>
        <Select
          value={record.education}
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
      title: '职务',
      dataIndex: 'post',
      editable: true,
      align: 'center',
      maxLength: 64,

      render: (text, record, index) =>
        <Input style={{
          width: 150,
        }} value={record.post} />
    },
    {
      title: '职称',
      dataIndex: 'title',
      editable: true,
      align: 'center',
      maxLength: 64,

      render: (text, record, index) =>
        <Input style={{
          width: 150,
        }} value={record.title} />
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
      appointmentTime: '',
      memberName: '',
      education: '',
      post: '',
      title: '',
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