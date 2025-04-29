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


const Category = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [form] = Form.useForm();
    const [auth, setAuth] = useAuth();
    const auth1 = JSON.parse(localStorage.getItem('auth'));

    // console.log(auth?.user._id);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await axios.get(baseurl + "/api/catagory/get-categories");

            console.log("----data-----", res.data);
            setData(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setEditingCategory(null);
        form.resetFields();
        setIsModalOpen(true);
    };

    const handleEdit = (record) => {
        setEditingCategory(record);
        console.log(record.email);
        form.setFieldsValue({
            name: record.name,
            title: record.title,
            para: record.para,
            
            // dob:record.dateOfBirth,
        });
        setIsModalOpen(true);
    };

    const handleStatusToggle = async (record) => {
        try {
            const response = await axios.patch(
                `${baseurl}/api/catagory/toggled/${record?._id}`
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
             const response = await axios.delete(`${baseurl}/api/catagory/delete-categories/${record}`)
             if (response) {
                message.success("Status updated succesfully");
                fetchData();
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handlePost = async (values) => {
        const postData = {
            name: values.name,
            title: values.title,
            para: values.para,

        };

        try {
            const response = await axios.post(
                baseurl + "/api/catagory/create-categories",
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
            title: values.title,
            para: values.para,
        };

        try {
            const response = await axios.put(
                `${baseurl}/api/catagory/update-categories/${editingCategory?._id}`,
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
        if (editingCategory) {
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
            title: "Title",
            dataIndex: "title",
            key: "title",
        },

        {
            title: "Description",
            dataIndex: "para",
            key: "para",
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

        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <>
                    <Button onClick={() => handleEdit(record)}>Update</Button>
                </>
            ),
        },

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


    const columns1 = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Title",
            dataIndex: "title",
            key: "title",
        },

        {
            title: "Description",
            dataIndex: "para",
            key: "para",
        },


        // specialization

        // {
        //   title: "Status",
        //   key: "Status",
        //   render: (_, record) => (
        //     <Switch
        //       checked={record.Status === "Active"}
        //       onChange={() => handleStatusToggle(record)}
        //       checkedChildren="Active"
        //       unCheckedChildren="Inactive"
        //     />
        //   ),
        // },

        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <>
                    <Button onClick={() => handleEdit(record)}>Update</Button>
                </>
            ),
        },
    ];

    return (
        <div>
            <Button type="primary" onClick={handleAdd} style={{ marginBottom: 16 }}>
                Add Category
            </Button>
            {
                           auth1?.user?.role==='superAdmin'?(<><Table
                               columns={columns}
                               dataSource={data}
                               loading={loading}
               
               
                           // rowKey="_id"
                           /></>):(<>
                           <Table
                               columns={columns1}
                               dataSource={data}
                               loading={loading}
               
               
                           // rowKey="_id"
                           />
                           </>)
                       }
            <Modal
                title={editingCategory ? "Edit Category" : "Add Category"}
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
                        name="title"
                        label="Title"
                        rules={[{ required: true, message: "Please enter your Title!" }]}
                    >
                        <Input placeholder="Title" />
                    </Form.Item>


                    <Form.Item
                        name="para"
                        label="Description"
                        rules={[{ required: true, message: 'Please enter your Description!' }]}
                    >
                        <Input.TextArea
                            placeholder="Description"
                            style={{ height: 200, resize: 'none' }} // You can change 'resize' if needed
                        />
                    </Form.Item>


                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            {editingCategory ? "Update" : "Submit"}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Category;
