import { Button, Form, Input, Table, Select, DatePicker, message } from 'antd';
import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  PlusOutlined
} from '@ant-design/icons';

// import 'moment/locale/zh-cn';
import { positiveIntegerReg, positiveIntegerRegPoint } from '@/utils/reg'

import locale from 'antd/es/date-picker/locale/zh_CN';

const EditableContext = React.createContext(null);
const options = [
  '物体打击', '车辆伤害', '机械伤害', '起重伤害', '触电', '淹溺', '灼烫', '火灾', '高处坠落', '坍塌',
  '冒顶片帮', '透水', '放炮', '火药爆炸', '瓦斯爆炸', '锅炉爆炸', '容器爆炸', '其他爆炸', '中毒和窒息', '其他伤害'
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
      if (dataIndex === 'happenTime' || dataIndex === 'accidentAnalysisTime') {
        timeRef.current.focus();
      } else if (dataIndex !== 'sex' && dataIndex !== 'accidentCategory') {
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
          dataIndex === 'accidentCategory' ?
            <Select
              autoFocus={true}
              open={editing}
              onChange={save}
              ref={selectRef}
              style={{
                width: 150,
              }}
            >{
                options.map((item, index) => {
                  return <Select.Option key={index} value={item}>{item}</Select.Option>
                })
              }
            </Select>
            :
            (
              dataIndex === 'sex' ? <Select
                autoFocus={true}
                open={editing}
                onChange={save}
                ref={selectRef}
                style={{
                  width: 150,
                }}
              >  <Select.Option key='1' value='男'>男</Select.Option>
                <Select.Option key='2' value='女'>女</Select.Option>
              </Select> :
                (
                  dataIndex === 'happenTime' || dataIndex === 'accidentAnalysisTime' ? <DatePicker
                    ref={timeRef}
                    locale={locale}
                    autoFocus={true}
                    open={timeOpen}
                    style={{ width: 180 }}
                    showTime
                    onChange={(e) => onTimeChange(e, dataIndex, index)}
                    onOpenChange={changeTime}
                  /> : <Input style={{
                    width: 150,
                  }} ref={inputRef}
                    onPressEnter={save}
                    onBlur={save}
                    maxLength={maxLength}
                    status={status}
                    onChange={(e) => onInputChange(e, dataIndex)}
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
    if (type === 'age') {
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
    if (type === 'workYear') {
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
      title: '发生时间',
      dataIndex: 'happenTime',
      editable: true,
      align: 'center',
      render: (text, record, index) =>
        <DatePicker
          style={{ width: 180 }}
          showTime
          value={record.happenTime} />
    },
    {
      title: '部门',
      dataIndex: 'dept',
      editable: true,
      align: 'center',
      maxLength: 64,
      render: (text, record, index) =>
        <Input style={{
          width: 150,
        }} value={record.dept} />
    },
    {
      title: '伤亡者姓名',
      dataIndex: 'casualtiesName',
      editable: true,
      align: 'center',
      maxLength: 64,

      render: (text, record, index) =>
        <Input style={{
          width: 150,
        }} value={record.casualtiesName} />
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
          {/* {
            options.map((item, index) => {
              return <Select.Option key={index} value={item.value}>{item.label}</Select.Option>
            })
          } */}
          <Select.Option key='1' value='男'>男</Select.Option>
          <Select.Option key='2' value='女'>女</Select.Option>
        </Select>
    },
    {
      title: '年龄',
      dataIndex: 'age',
      editable: true,
      align: 'center',
      render: (text, record, index) =>
        <Input style={{
          width: 150,
        }} value={record.age} />
    },
    {
      title: '工种',
      dataIndex: 'workType',
      editable: true,
      align: 'center',
      maxLength: 64,

      render: (text, record, index) =>
        <Input style={{
          width: 150,
        }} value={record.workType} />
    },
    {
      title: '工龄',
      dataIndex: 'workYear',
      editable: true,
      align: 'center',
      render: (text, record, index) =>
        <Input style={{
          width: 150,
        }} value={record.workYear} />
    },
    {
      title: '事故简介',
      dataIndex: 'accidentProfile',
      editable: true,
      align: 'center',
      maxLength: 200,

      render: (text, record, index) =>
        <Input style={{
          width: 150,
        }} value={record.accidentProfile} />
    },
    {
      title: '事故分析时间',
      dataIndex: 'accidentAnalysisTime',
      editable: true,
      align: 'center',
      render: (text, record, index) =>
        <DatePicker style={{ width: 180 }} showTime value={record.accidentAnalysisTime} />
    },
    {
      title: '事故分析性质',
      dataIndex: 'accidentAnalysisNature',
      editable: true,
      align: 'center',
      maxLength: 200,

      render: (text, record, index) =>
        <Input style={{
          width: 150,
        }} value={record.accidentAnalysisNature} />
    },
    {
      title: '事故损失',
      dataIndex: 'accidentLoss',
      editable: true,
      align: 'center',
      maxLength: 200,

      render: (text, record, index) =>
        <Input style={{
          width: 180,
        }} value={record.accidentLoss} />
    },
    {
      title: '事故类别',
      dataIndex: 'accidentCategory',
      editable: true,
      align: 'center',
      render: (text, record, index) =>
        <Select
          value={record.accidentCategory}
          style={{
            width: 150,
          }}
        >
          {
            options.map((item, index) => {
              return <Select.Option key={index} value={item}>{item}</Select.Option>
            })
          }
        </Select>
    },
    {
      title: '事故责任人',
      dataIndex: 'accidentLiablePerson',
      editable: true,
      align: 'center',
      maxLength: 64,

      render: (text, record, index) =>
        <Input style={{
          width: 180,
        }} value={record.accidentLiablePerson} />
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
      happenTime: '',
      dept: '',
      casualtiesName: '',
      sex: '',
      age: '',
      workType: '',
      workYear: '',
      accidentProfile: '',
      accidentAnalysisTime: '',
      accidentAnalysisNature: '',
      accidentLoss: '',
      accidentCategory: '',
      accidentLiablePerson: '',
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
        maxLength: col.maxLength,
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