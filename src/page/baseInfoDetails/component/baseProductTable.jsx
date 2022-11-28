import { Button, Form, Input, Table, Select } from 'antd';
import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  PlusOutlined
} from '@ant-design/icons';
// import 'moment/locale/zh-cn';
import { positiveIntegerRegPoint } from '@/utils/reg'

const EditableContext = React.createContext(null);

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
  const [status, setStatus] = useState('')
  useEffect(() => {
    if (editing) {
      if (dataIndex === 'holdCertificate') {
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
      <Form.Item name={dataIndex} style={{ margin: 0 }}
      >
        {
          dataIndex === 'yearYield' ? <Input style={{
            width: 200,
          }} ref={inputRef}
            onPressEnter={save}
            onBlur={save}
            onChange={(e) => onInputChange(e, dataIndex)}
            status={status}
          /> : <Input style={{
            width: 400,
          }} ref={inputRef}
            onPressEnter={save}
            onBlur={save}
            maxLength={maxLength}
            onChange={(e) => onInputChange(e, dataIndex)}
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
    if (type === 'yearYield') {
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
      title: '产品名称',
      dataIndex: 'name',
      editable: true,
      align: 'center',
      width: 500,
      maxLength: 64,
      render: (text, record, index) =>
        <Input style={{
          width: 400,
        }} value={record.name} />
    },
    {
      title: '年产量（T）/年用量（T）',
      dataIndex: 'yearYield',
      editable: true,
      align: 'center',
      render: (text, record, index) =>
        <Input style={{
          width: 200,
        }} value={record.yearYield} />
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
      name: '',
      yearYield: '',
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