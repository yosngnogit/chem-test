import { Button, Form, Input, Table, Select, DatePicker, message } from 'antd';
import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  PlusOutlined
} from '@ant-design/icons';
// import 'moment/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';
import { positiveIntegerRegPoint, cardNumberRge, idCardReg } from '@/utils/reg'


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
      if (dataIndex === 'birthday' || dataIndex === 'trainingTime' || dataIndex === 'reviewTime') {
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
  const changeTime = (val) => {
    setTimeOpen(val)
  }

  const save = async (dataIndex) => {
    try {
      const values = await form.validateFields();
      let inputValue1 = values.operationCertificateNumber
      let inputValue2 = values.cardNumber

      if (dataIndex === 'operationCertificateNumber') {
        if (cardNumberRge.test(inputValue1) || inputValue1 === '') {
          setStatus('')
          toggleEdit();
          handleSave({ ...record, ...values });
        } else {
          setStatus('error')
          message.warning('请输入正确操作证号码');
        }
      }
      if (dataIndex === 'cardNumber') {
        if (idCardReg.test(inputValue2) || inputValue2 === '') {
          setStatus('')
          toggleEdit();
          handleSave({ ...record, ...values });
        } else {
          setStatus('error')
          message.warning('请输入正确身份证号码');
        }
      }
      else {
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
              (dataIndex === 'birthday' || dataIndex === 'trainingTime' || dataIndex === 'reviewTime') ? <DatePicker
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
    if (type === 'workingSeniority' || type === 'thisPostSeniority') {
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
    if (type === 'operationCertificateNumber') {
      let inputValue = e.target.value
      if (cardNumberRge.test(inputValue) || inputValue === '') {
        setStatus('')
        form.setFieldValue(type, inputValue)
      } else {
        setStatus('error')
        form.setFieldValue(type, inputValue)
      }
    }
    if (type === 'cardNumber') {
      let inputValue = e.target.value
      if (idCardReg.test(inputValue) || inputValue === '') {
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
      // console.log('Save failed:', errInfo);
    }
  }
  return <td {...restProps}>{childNode}</td>;
};

const AnswerTable = (props) => {
  const [dataSource, setDataSource] = useState(props.dataSource);
  const [count, setCount] = useState(1);

  const defaultColumns = [
    // {
    //   title: '序号',
    //   dataIndex: '',
    //   align: 'center',
    //   width: 80,
    //   render: (text, record, index) =>
    //     <span>{index + 1}</span>
    // },
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
      title: '出生年月',
      dataIndex: 'birthday',
      editable: true,
      align: 'center',
      render: (text, record, index) =>
        <DatePicker style={{
          width: 150,
        }} value={record.birthday} />
    },
    {
      title: '工作年限',
      dataIndex: 'workingSeniority',
      editable: true,
      align: 'center',
      render: (text, record, index) =>
        <Input style={{
          width: 150,
        }} value={record.personNumber} />
    },
    {
      title: '现任岗位',
      dataIndex: 'currentPosition',
      editable: true,
      align: 'center',
      maxLength: 64,

      render: (text, record, index) =>
        <Input style={{
          width: 150,
        }} value={record.personNumber} />
    },
    {
      title: '从事本岗位年限',
      dataIndex: 'thisPostSeniority',
      editable: true,
      align: 'center',
      render: (text, record, index) =>
        <Input style={{
          width: 150,
        }} value={record.personNumber} />
    },
    {
      title: '培训时间',
      dataIndex: 'trainingTime',
      editable: true,
      align: 'center',
      render: (text, record, index) =>
        <DatePicker style={{
          width: 150,
        }} value={record.trainingTime} />
    },
    {
      title: '复审时间',
      dataIndex: 'reviewTime',
      editable: true,
      align: 'center',
      render: (text, record, index) =>
        <DatePicker style={{
          width: 150,
        }} value={record.reviewTime} />
    },
    {
      title: '发证单位',
      dataIndex: 'issueUnit',
      editable: true,
      align: 'center',
      maxLength: 128,
      render: (text, record, index) =>
        <Input style={{
          width: 150,
        }} value={record.issueUnit} />
    },
    {
      title: '操作证号码',
      dataIndex: 'operationCertificateNumber',
      editable: true,
      align: 'center',
      render: (text, record, index) =>
        <Input style={{
          width: 150,
        }} value={record.operationCertificateNumber} />
    },
    {
      title: '身份证号码',
      dataIndex: 'cardNumber',
      editable: true,
      align: 'center',
      render: (text, record, index) =>
        <Input style={{
          width: 150,
        }} value={record.cardNumber} />
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
      birthday: '',
      workingSeniority: '',
      currentPosition: '',
      thisPostSeniority: '',
      trainingTime: '',
      reviewTime: '',
      issueUnit: '',
      operationCertificateNumber: '',
      cardNumber: ''
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