import { Button, Form, Input, Table, Select, message } from 'antd';
import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  PlusOutlined
} from '@ant-design/icons';
// import 'moment/locale/zh-cn';
import { positiveIntegerRegPoint, cardNumberRge } from '@/utils/reg'
const EditableContext = React.createContext(null);
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
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const selectRef = useRef(null);
  const form = useContext(EditableContext);
  const [status, setStatus] = useState('')
  useEffect(() => {
    if (editing) {
      if (dataIndex === 'education') {
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

  const save = async (dataIndex) => {
    try {
      const values = await form.validateFields();
      let inputValue = values.safeCertificatesCode
      if (dataIndex === 'safeCertificatesCode') {
        if (cardNumberRge.test(inputValue) || inputValue === '') {
          setStatus('')
          toggleEdit();
          handleSave({ ...record, ...values });
        } else {
          setStatus('error')
          message.warning('请输入正确安全培训号');
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
      <Form.Item name={dataIndex} style={{ margin: 0 }}
      >
        {
          dataIndex === 'education' ?
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
                  return <Select.Option key={index} value={item.value}>{item.label}</Select.Option>
                })
              }
            </Select>
            :
            <Input style={{
              width: 150,
            }} ref={inputRef}
              onPressEnter={save}
              onBlur={() => save(dataIndex)}
              onChange={(e) => onInputChange(e, dataIndex)}
              status={status}
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
    if (type === 'workingSeniority') {
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
    if (type === 'safeCertificatesCode') {
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
      title: '危险岗位名称',
      dataIndex: 'dangerPostName',
      editable: true,
      align: 'center',
      maxLength: 64,
      render: (text, record, index) =>
        <Input style={{
          width: 150,
        }} value={record.dangerPostName} />
    },
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
      title: '专业',
      dataIndex: 'major',
      editable: true,
      align: 'center',
      maxLength: 64,
      render: (text, record, index) =>
        <Input style={{
          width: 150,
        }} value={record.major} />
    },
    {
      title: '化工从业年限',
      dataIndex: 'workingSeniority',
      editable: true,
      align: 'center',
      render: (text, record, index) =>
        <Input style={{
          width: 150,
        }} value={record.workingSeniority} />
    },
    {
      title: '安全培训证号',
      dataIndex: 'safeCertificatesCode',
      editable: true,
      align: 'center',
      render: (text, record, index) =>
        <Input style={{
          width: 150,
        }} value={record.safeCertificatesCode} />
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
      dangerPostName: '',
      name: '',
      education: '',//
      major: '',//
      workingSeniority: '',//
      safeCertificatesCode: ''
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