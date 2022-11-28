import { Button, Form, Input, Table, Select } from 'antd';
import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  PlusOutlined
} from '@ant-design/icons';
// import 'moment/locale/zh-cn';
const EditableContext = React.createContext(null);
const options = [
  {
    label: '一级危险源（A级）',
    value: '一级危险源（A级）'
  },
  {
    label: '二级危险源（B级）',
    value: '二级危险源（B级）'
  },
  {
    label: '三级危险源（C级）',
    value: '三级危险源（C级）'
  },
  {
    label: '四级危险源（D级）',
    value: '四级危险源（D级）'
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
  const [status, setStatus] = useState('')
  useEffect(() => {
    if (editing) {
      if (dataIndex === 'level') {
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
          dataIndex === 'level' ?
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
            (
              dataIndex === 'dangerPosition' ? <Input style={{
                width: 150,
              }} ref={inputRef}
                onPressEnter={save}
                onBlur={save}
                onChange={(e) => onInputChange(e, dataIndex)}

                status={status}
              /> : <Input style={{
                width: 150,
              }} ref={inputRef}
                onPressEnter={save}
                onBlur={save}
                maxLength='64'
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
    if (type === 'dangerPosition') {
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
  return <td {...restProps}>{childNode}</td>;
};

const AnswerTable = (props) => {
  const [dataSource, setDataSource] = useState(props.dataSource);
  const [count, setCount] = useState(1);

  const defaultColumns = [
    {
      title: '单位名称',
      dataIndex: 'unitName',
      editable: true,
      align: 'center',
      render: (text, record, index) =>
        <Input style={{
          width: 150,
        }} value={record.unitName} />
    },
    {
      title: '危险源(点)名称',
      dataIndex: 'dangerPosition',
      editable: true,
      align: 'center',
      render: (text, record, index) =>
        <Input style={{
          width: 150,
        }} value={record.dangerPosition} />
    },
    {
      title: '级别',
      dataIndex: 'level',
      editable: true,
      align: 'center',
      render: (text, record, index) =>
        <Select
          value={record.level}
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
      title: '所在部位',
      dataIndex: 'inPosition',
      editable: true,
      align: 'center',
      render: (text, record, index) =>
        <Input style={{
          width: 150,
        }} value={record.inPosition} />
    },
    {
      title: '等级评定机构名称',
      dataIndex: 'levelJudgeMechanismName',
      editable: true,
      align: 'center',
      render: (text, record, index) =>
        <Input style={{
          width: 150,
        }} value={record.levelJudgeMechanismName} />
    },
    {
      title: '危险因素',
      dataIndex: 'riskFactors',
      editable: true,
      align: 'center',
      render: (text, record, index) =>
        <Input style={{
          width: 150,
        }} value={record.riskFactors} />
    },
    {
      title: '可能发生的危险（害）',
      dataIndex: 'possibleDanger',
      editable: true,
      align: 'center',
      render: (text, record, index) =>
        <Input style={{
          width: 150,
        }} value={record.possibleDanger} />
    },
    {
      title: '第一责任人',
      dataIndex: 'mainLiablePerson',
      editable: true,
      align: 'center',
      render: (text, record, index) =>
        <Input style={{
          width: 150,
        }} value={record.mainLiablePerson} />
    },
    {
      title: '监控责任人',
      dataIndex: 'monitorLiablePerson',
      editable: true,
      align: 'center',
      render: (text, record, index) =>
        <Input style={{
          width: 150,
        }} value={record.monitorLiablePerson} />
    },
    {
      title: '监测情况',
      dataIndex: 'detection',
      editable: true,
      align: 'center',
      render: (text, record, index) =>
        <Input style={{
          width: 150,
        }} value={record.detection} />
    },
    {
      title: '评估情况',
      dataIndex: 'assessment',
      editable: true,
      align: 'center',
      render: (text, record, index) =>
        <Input style={{
          width: 150,
        }} value={record.assessment} />
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
      unitName: '',
      dangerPosition: '',
      level: '',
      inPosition: '',
      levelJudgeMechanismName: '',
      riskFactors: '',
      possibleDanger: '',
      mainLiablePerson: '',
      monitorLiablePerson: '',
      detection: '',
      assessment: ''
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