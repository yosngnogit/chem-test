import { Button, Form, Input, Table, Select, DatePicker } from 'antd';
import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  PlusOutlined
} from '@ant-design/icons';
// import moment from 'moment';
import 'moment/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';
const EditableContext = React.createContext(null);
// const { Option } = Select;
// const { DatePicker } = DatePicker;
const options = ['关键环节机器换人', '“平台+APPs”场景改造', '5G+工业互联网/AI 等场景应用', '成套自动化（智能化）生产线', '车间级数字化改造', '工厂级数字化改造', '特点环节/企业级/产业链级工业互联网平台']

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
  const timeRef = useRef(null);
  const monthFormat = ['YYYY-MM-DD'];

  const form = useContext(EditableContext);

  const [timeOpen, setTimeOpen] = useState(true);
  useEffect(() => {
    if (editing) {
      if (dataIndex === 'investScale') {
        inputRef.current.focus();
      }
      if (dataIndex === 'timeList') {
        timeRef.current.focus();
      }
    }
  }, [editing]);

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
          dataIndex === 'timeList' ?
            <DatePicker locale={locale}
              ref={timeRef} autoFocus={true}
              open={timeOpen}
              format={monthFormat}
              onChange={(e) => onTimeChange(e, dataIndex, index)}
              onOpenChange={changeTime}
            />
            :
            <Input ref={inputRef} onPressEnter={save} onBlur={save} />


        }
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
      title: '序号',
      dataIndex: '',
      align: 'center',
      width: 70,
      render: (text, record, index) =>
        <span>{index + 1}</span>
    },
    {
      title: '主要工种名称',
      dataIndex: 'projectType',
      editable: true,
      align: 'center',

      render: (text, record, index) =>
        <Input value={record.projectType} />
    },
    {
      title: '人数',
      dataIndex: 'investScale',
      editable: true,
      align: 'center',
      render: (text, record, index) =>
        <Input value={record.investScale} />
    },
    {
      title: '发证日期',
      dataIndex: 'timeList',
      editable: true,
      align: 'center',
      render: (text, record, index) =>
        <DatePicker value={record.timeList} />
    },
    {
      title: '持证情况（持证人数）',
      dataIndex: 'qqq',
      editable: true,
      align: 'center',
      render: (text, record, index) =>
        <Input value={record.qqq} />
    },
    {
      title: '操作',
      dataIndex: '',
      align: 'center',
      width: 80,
      render: (_, record, index) =>
        dataSource.length > 1 ?
          <Button type="link" danger onClick={() => handleDelete(record.key)}> 删除 </Button>
          : null,
    },
  ];
  const handleAdd = () => {
    const newData = {
      key: count,
      sysName: '',
      investScale: '',
      timeList: '',
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