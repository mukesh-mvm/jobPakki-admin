import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
  Upload,
  Switch,
  DatePicker,
  Popconfirm
} from "antd";
import { baseurl } from "../helper/Helper";
import axios from "axios";
import Password from "antd/es/input/Password";
// import { baseurl } from "../helper/Helper";
import { useAuth } from "../context/auth";
const { Option } = Select;


const Users = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();
  const [auth, setAuth] = useAuth();
  const auth1 = JSON.parse(localStorage.getItem('auth'));

  // console.log(auth?.user._id);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(baseurl + "/api/auth/getAllAdmin");

      console.log(res.data.users);
      setData(res.data.users);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingUser(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (record) => {
    setEditingUser(record);
    console.log(record.email);
    form.setFieldsValue({
      name: record.name,
      username: record.email,
      phone: record.phone,
      specialization: record.specialization,
      // dob:record.dateOfBirth,
    });
    setIsModalOpen(true);
  };

  const handleStatusToggle = async (record) => {
    try {
      const response = await axios.patch(
        `${baseurl}/api/auth/toggled/${record?._id}`
      );
      console.log(response);

      if (response) {
        message.success("Status updated succesfully");
        fetchData();
      }
    } catch (error) {
      console.log(error);
    }
  };


  const handleDelete = async(record)=>{
    try {
         const response = await axios.delete(`${baseurl}/api/auth/deleteUser/${record}`)
         if (response) {
            message.success("Status updated succesfully");
            fetchData();
        }
    } catch (error) {
        console.log(error)
    }
}

  const handlePost = async (values) => {


    const date = new Date(values.dateOfBirth);

// Get date components
const day = String(date.getUTCDate()).padStart(2, '0');
const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are 0-indexed
const year = date.getUTCFullYear();

// Format as DD/MM/YYYY
const formatted = `${day}/${month}/${year}`;

    const postData = {
      name: values.name,
      email: values.email,
      password: values.password,
      dateOfBirth: formatted,
      specialization: values.specialization,
      phone: values.phone,
      role: values.role,

    };

   

    try {
      const response = await axios.post(
        baseurl + "/api/auth/register",
        postData
      );
      console.log(response.data);

      if (response.data) {
        setIsModalOpen(false);
        message.success("User created successfully!");
        fetchData();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlePut = async (values) => {
    const postData = {
      name: values.name,
      email: values.username,
      password: values.password,
      specialization: values.specialization,

    };

    try {
      const response = await axios.put(
        `${baseurl}/api/admin/update/${editingUser?._id}`,
        postData
      );
      console.log(response.data);

      if (response.data) {
        setIsModalOpen(false);
        fetchData();
        message.success("User update successfully!");
        form.resetFields();
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleSubmit = async (values) => {
    if (editingUser) {
      await handlePut(values);
    } else {
      await handlePost(values);
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },

    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },


    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    // specialization

    {
      title: "Status",
      key: "Status",
      render: (_, record) => (
        <Switch
          checked={record.status === "Active"}
          onChange={() => handleStatusToggle(record)}
          checkedChildren="Active"
          unCheckedChildren="Inactive"
        />
      ),
    },

    // {
    //   title: "Actions",
    //   key: "actions",
    //   render: (_, record) => (
    //     <>
    //       <Button onClick={() => handleEdit(record)}>Update</Button>
    //     </>
    //   ),
    // },


    {
      title: "Delete",
      render: (_, record) => (
          <>
              {auth1?.user?.role === 'superAdmin' && (
                  <Popconfirm
                      title="Are you sure you want to delete this blog?"
                      onConfirm={() => handleDelete(record._id)}
                      okText="Yes"
                      cancelText="No"
                  >
                      <Button type="link" danger>
                          Delete
                      </Button>
                  </Popconfirm>
              )}
          </>
      ),
  }
  ];

  return (
    <div>
      <Button type="primary" onClick={handleAdd} style={{ marginBottom: 16 }}>
        Add Admin
      </Button>
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
      // rowKey="_id"
      />

      <Modal
        title={editingUser ? "Edit User" : "Add User"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please input the name!" }]}
          >
            <Input placeholder="Enter Name" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: "Please enter your email!" }]}
          >
            <Input placeholder="Email" />
          </Form.Item>




          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please enter your password!" }]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>


          <Form.Item
            name="phone"
            rules={[{ required: true, message: "Please enter your phone!" }]}
          >
            <Input placeholder="phone" />
          </Form.Item>


          <Form.Item
            name="specialization"
            rules={[{ required: true, message: "Please select your specialization!" }]}
            label="Specialization"
          >
            <Select placeholder="Select specialization">
              <Option value="tech">Tech</Option>
              <Option value="govern">Govt</Option>
              <Option value="bank">Bank</Option>
            </Select>
          </Form.Item>

          <Form.Item>



            <Form.Item
              name="dateOfBirth"
              label="Date of Birth"
              rules={[{ required: true, message: "Please select your date of birth!" }]}
            >
              <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
            </Form.Item>


            <Form.Item
            name="role"
            rules={[{ required: true, message: "Please Select Role!" }]}
            label="Role"
          >
            <Select placeholder="Select specialization">
              <Option value="admin">Admin</Option>
              <Option value="superAdmin">Super Admin</Option>
              <Option value="seoAdmin">Seo Admin</Option>
            </Select>
          </Form.Item>


            <Button type="primary" htmlType="submit">
              {editingUser ? "Update" : "Submit"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Users;
