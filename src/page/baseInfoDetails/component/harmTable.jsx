import { Button, Form, Input, Table, Select, message } from 'antd';
import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  PlusOutlined
} from '@ant-design/icons';
// import 'moment/locale/zh-cn';
import { positiveIntegerReg } from '@/utils/reg'

const EditableContext = React.createContext(null);
const hazardCategoryOptions = [
  '粉尘类', '放射性物质类', '化学物质类', '物理类', '生物类', '其他类'
]
const occupationalDiseasesCategoryOptions = [
  '职业性尘肺病及其他呼吸系统疾病', '职业性皮肤病', '职业性眼病', '职业性耳鼻喉口腔疾病', '职业性化学中毒',
  '物理因素所致职业病', '职业性放射性疾病', '职业性传染病', '职业性肿瘤', '其他职业病'
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
  maxLength,
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
      if (dataIndex === 'place' || dataIndex === 'contactNumber' || dataIndex === 'remark') {
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
          dataIndex === 'hazardCategory' ?
            <Select
              autoFocus={true}
              open={editing}
              onChange={save}
              ref={selectRef}
              style={{
                width: 150,
              }}
            >{
                hazardCategoryOptions.map((item, index) => {
                  return <Select.Option key={index} value={item}>{item}</Select.Option>
                })
              }
            </Select>
            :
            (
              dataIndex === 'occupationalDiseasesCategory' ? <Select
                autoFocus={true}
                open={editing}
                onChange={save}
                ref={selectRef}
                style={{
                  width: 200,
                }}
              >{
                  occupationalDiseasesCategoryOptions.map((item, index) => {
                    return <Select.Option key={index} value={item}>{item}</Select.Option>
                  })
                }
              </Select>
                : (
                  dataIndex === 'checkInspection' ? <Select
                    autoFocus={true}
                    open={editing}
                    onChange={save}
                    ref={selectRef}
                    style={{
                      width: 150,
                    }}
                  >
                    <Select.Option key='1' value='已检测'>已检测</Select.Option>
                    <Select.Option key='2' value='未检测'>未检测</Select.Option>
                  </Select> : <Input style={{
                    width: 150,
                  }} ref={inputRef}
                    onPressEnter={save}
                    addonAfter={dataIndex === 'contactNumber' ? '人' : ''}
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
    if (type === 'contactNumber') {
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

  const defaultColumns = [
    {
      title: '场所（岗位）',
      dataIndex: 'place',
      editable: true,
      align: 'center',
      maxLength: 64,
      render: (text, record, index) =>
        <Input style={{
          width: 150,
        }} value={record.place} />
    },
    {
      title: '危害种类',
      dataIndex: 'hazardCategory',
      editable: true,
      align: 'center',
      render: (text, record, index) =>
        <Select
          value={record.hazardCategory}
          style={{
            width: 150,
          }}
        >
          {
            hazardCategoryOptions.map((item, index) => {
              return <Select.Option key={index} value={item}>{item}</Select.Option>
            })
          }
        </Select>
    },
    {
      title: '职业病种类',
      dataIndex: 'occupationalDiseasesCategory',
      editable: true,
      align: 'center',
      render: (text, record, index) =>
        <Select
          value={record.occupationalDiseasesCategory}
          style={{
            width: 200,
          }}
        >
          {
            occupationalDiseasesCategoryOptions.map((item, index) => {
              return <Select.Option key={index} value={item}>{item}</Select.Option>
            })
          }
        </Select>
    },
    {
      title: '检测情况',
      dataIndex: 'checkInspection',
      editable: true,
      align: 'center',
      render: (text, record, index) =>
        <Select
          value={record.checkInspection}
          style={{
            width: 150,
          }}
        >
          <Select.Option key='1' value='已检测'>已检测</Select.Option>
          <Select.Option key='2' value='未检测'>未检测</Select.Option>
        </Select>
    },
    {
      title: '接触人',
      dataIndex: 'contactNumber',
      editable: true,
      align: 'center',
      render: (text, record, index) =>
        <Input style={{
          width: 150,
        }} addonAfter='人' value={record.contactNumber} />
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
      place: '',
      hazardCategory: '',
      occupationalDiseasesCategory: '',
      checkInspection: '',
      contactNumber: '',
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