import { Button, Form, Input, Table, Select, DatePicker, message } from 'antd';
import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  PlusOutlined
} from '@ant-design/icons';
// import 'moment/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';
import { positiveIntegerRegPoint, cardNumberRge } from '@/utils/reg'


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
  maxLength,
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

  const save = async (dataIndex) => {
    try {
      const values = await form.validateFields();
      let inputValue = values.certificateNumber
      if (dataIndex === 'certificateNumber') {
        if (cardNumberRge.test(inputValue) || inputValue === '') {
          setStatus('')
          toggleEdit();
          handleSave({ ...record, ...values });
        } else {
          setStatus('error')
          message.warning('请输入正确证书编号');
        }
      } else {
        toggleEdit();
        handleSave({ ...record, ...values });
      }
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
                onBlur={() => save(dataIndex)}
                maxLength={maxLength}
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
    if (type === 'testScores') {
      let inputValue = e.target.value
      if (positiveIntegerRegPoint.test(inputValue) || inputValue === '') {
        setStatus('')
        form.setFieldValue(type, inputValue)
      } else {
        let errorLength = ''
        if (inputValue.split('.')[1]) {
          errorLength = inputValue.split('.')[1].length
        }
        if (errorLength === 3) {
          setStatus('')
        } else {
          setStatus('error')
        }
        form.setFieldValue(type, dealInputVal(inputValue))
      }
    }
    if (type === 'certificateNumber') {
      let inputValue = e.target.value
      if (cardNumberRge.test(inputValue) || inputValue === '') {
        setStatus('')
        form.setFieldValue(type, inputValue)
      } else {
        setStatus('error')
        form.setFieldValue(type, inputValue)
      }
    }
  }
  const dealInputVal = (value) => {
    value = value.replace(/^0*(0\.|[1-9])/, "$1");
    value = value.replace(/[^\d.]/g, ""); // 清除"数字"和"."以外的字符
    value = value.replace(/^\./g, ""); // 验证第一个字符是数字而不是字符
    value = value.replace(/\.{1,}/g, "."); // 只保留第一个.清除多余的
    value = value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
    value = value.replace(/^(\-)*(\d*)\.(\d\d).*$/, "$1$2.$3"); // 只能输入两个小数
    value =
      value.indexOf(".") > 0
        ? value.split(".")[0].substring(0, 10) + "." + value.split(".")[1]
        : value.substring(0, 10);
    return value;
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
      maxLength: 64,
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
      dataIndex: 'issuingAuthority',
      editable: true,
      align: 'center',
      maxLength: 64,
      render: (text, record, index) =>
        <Input style={{
          width: 150,
        }} value={record.issuingAuthority} />
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
      sex: '',
      post: '',
      trainDate: '',
      testScores: '',
      issuingAuthority: '',
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