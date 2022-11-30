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
    label: '是',
    value: true
  },
  {
    label: '否',
    value: false
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
  const timeRef = useRef(null);
  const [timeOpen, setTimeOpen] = useState(true);
  const form = useContext(EditableContext);
  const [status, setStatus] = useState('')
  useEffect(() => {
    if (editing) {
      if (dataIndex === 'startDate') {
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
          dataIndex === 'startDate' ? <DatePicker
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
          />

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
      title: '设备名称',
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
      title: '规格、型号',
      dataIndex: 'specification',
      editable: true,
      align: 'center',
      maxLength: 64,
      render: (text, record, index) =>
        <Input style={{
          width: 150,
        }} value={record.specification} />
    },
    {
      title: '制造单位',
      dataIndex: 'manufacturerUnit',
      editable: true,
      align: 'center',
      maxLength: 128,
      render: (text, record, index) =>
        <Input style={{
          width: 150,
        }} value={record.manufacturerUnit} />
    },
    {
      title: '安装单位',
      dataIndex: 'installationUnit',
      editable: true,
      align: 'center',
      maxLength: 128,
      render: (text, record, index) =>
        <Input style={{
          width: 150,
        }} value={record.installationUnit} />
    },
    {
      title: '启用日期',
      dataIndex: 'startDate',
      editable: true,
      align: 'center',
      render: (text, record, index) =>
        <DatePicker style={{
          width: 150,
        }} value={record.trainDate} />
    },
    {
      title: '定期检测情况',
      dataIndex: 'regularInspection',
      editable: true,
      align: 'center',
      maxLength: 200,
      render: (text, record, index) =>
        <Input style={{
          width: 150,
        }} value={record.regularInspection} />
    },
    {
      title: '保养及检查情况',
      dataIndex: 'maintenanceInspection',
      editable: true,
      align: 'center',
      maxLength: 200,
      render: (text, record, index) =>
        <Input style={{
          width: 150,
        }} value={record.maintenanceInspection} />
    },
    {
      title: '监控管理负责人',
      dataIndex: 'monitorLiablePerson',
      editable: true,
      align: 'center',
      maxLength: 64,
      render: (text, record, index) =>
        <Input style={{
          width: 150,
        }} value={record.monitorLiablePerson} />
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
      specification: '',
      manufacturerUnit: '',
      installationUnit: '',
      startDate: '',
      regularInspection: '',
      maintenanceInspection: '',
      monitorLiablePerson: '',
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