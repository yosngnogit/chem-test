import { Button, Form, Input, Table, Select, DatePicker } from 'antd';
import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  PlusOutlined
} from '@ant-design/icons';
// import 'moment/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';

const EditableContext = React.createContext(null);
const options = [
  {
    label: '男',
    value: '男'
  },
  {
    label: '女',
    value: '女'
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
  const timeRef = useRef(null);
  const [timeOpen, setTimeOpen] = useState(true);


  const [status, setStatus] = useState('')
  useEffect(() => {
    if (editing) {
      if (dataIndex === 'trainDate' || dataIndex === 'issuingDate' || dataIndex === 'reviewDate') {
        timeRef.current.focus();
      } else if (dataIndex !== 'sex') {
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
          dataIndex === 'sex' ?
            <Select
              autoFocus={true}
              open={editing}
              onChange={save}
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
              (dataIndex === 'trainDate' || dataIndex === 'issuingDate' || dataIndex === 'reviewDate') ? <DatePicker
                ref={timeRef}
                locale={locale}
                autoFocus={true}
                open={timeOpen}
                style={{ width: 150 }}
                onChange={(e) => onTimeChange(e, dataIndex, index)}
                onOpenChange={changeTime}
              /> : <Input style={{
                width: 150,
              }} ref={inputRef}
                onPressEnter={save}
                onBlur={save}
                maxLength='64'
                status={status}
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
      title: '姓名',
      dataIndex: 'name',
      editable: true,
      align: 'center',
      render: (text, record, index) =>
        <Input style={{
          width: 150,
        }} value={record.name} />
    },
    {
      title: '性别',
      dataIndex: 'sex',
      editable: true,
      align: 'center',
      render: (text, record, index) =>
        <Select
          value={record.sex}
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
      render: (text, record, index) =>
        <Input style={{
          width: 150,
        }} value={record.post} />
    },
    {
      title: '培训日期',
      dataIndex: 'trainDate',
      editable: true,
      align: 'center',
      render: (text, record, index) =>
        <DatePicker style={{
          width: 150,
        }} value={record.trainDate} />
    },
    {
      title: '考试成绩',
      dataIndex: 'testScores',
      editable: true,
      align: 'center',
      render: (text, record, index) =>
        <Input style={{
          width: 150,
        }} value={record.testScores} />
    },
    {
      title: '发证部门',
      dataIndex: 'personNumber',
      editable: true,
      align: 'center',
      render: (text, record, index) =>
        <Input style={{
          width: 150,
        }} value={record.personNumber} />
    },
    {
      title: '发证日期',
      dataIndex: 'issuingDate',
      editable: true,
      align: 'center',
      render: (text, record, index) =>
        <DatePicker style={{
          width: 150,
        }} value={record.issuingDate} />
    },
    {
      title: '证书编号',
      dataIndex: 'certificateNumber',
      editable: true,
      align: 'center',
      render: (text, record, index) =>
        <Input style={{
          width: 150,
        }} value={record.certificateNumber} />
    },
    {
      title: '复审日期',
      dataIndex: 'reviewDate',
      editable: true,
      align: 'center',
      render: (text, record, index) =>
        <DatePicker style={{
          width: 150,
        }} value={record.reviewDate} />
    },
    {
      title: '备注',
      dataIndex: 'remark',
      editable: true,
      align: 'center',
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
      sex: '',
      post: '',
      trainDate: '',
      testScores: '',
      // 缺少发证部门
      issuingDate: '',
      certificateNumber: '',
      reviewDate: '',
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