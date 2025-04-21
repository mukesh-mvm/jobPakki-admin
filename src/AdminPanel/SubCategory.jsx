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
    DatePicker
} from "antd";
import { baseurl } from "../helper/Helper";
import axios from "axios";
import Password from "antd/es/input/Password";
// import { baseurl } from "../helper/Helper";
import { useAuth } from "../context/auth";
const { Option } = Select;


const SubCategory = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSubCategory, setEditingSubCategory] = useState(null);
    const [form] = Form.useForm();
    const [auth, setAuth] = useAuth();
    const [categories, setCategoris] = useState([])

    // console.log(auth?.user._id);

    useEffect(() => {
        fetchData();
        fetchData1()
    }, []);




    const fetchData1 = async () => {
        try {
            const res = await axios.get(baseurl + "/api/catagory/get-categories");

            console.log("----data-----", res.data);
            setCategoris(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
            setLoading(false);
        }
    };

    const fetchData = async () => {
        try {
            const res = await axios.get(baseurl + "/api/subcatagory/get-subcategories");

            console.log("----data-----", res.data);
            setData(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setEditingSubCategory(null);
        form.resetFields();
        setIsModalOpen(true);
    };

    const handleEdit = (record) => {
        setEditingSubCategory(record);
        console.log(record.email);
        form.setFieldsValue({
            name: record.name,
            title: record.title,
            para: record.para,
            parent:record.parent._id

            // dob:record.dateOfBirth,
        });
        setIsModalOpen(true);
    };

    const handleStatusToggle = async (record) => {
        try {
            const response = await axios.patch(
                `${baseurl}/api/admin/toggled/${record?._id}`
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

    const handlePost = async (values) => {
        const postData = {
            name: values.name,
            title: values.title,
            para: values.para,

        };

        try {
            const response = await axios.post(
                baseurl + "/api/subcatagory/create-subcategories",
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
                `${baseurl}/api/subcatagory/update-subcategories/${editingSubCategory?._id}`,
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
        if (editingSubCategory) {
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
            title: "Categories",
            dataIndex: ['parent','name'],
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
            render: (text) => {
              // If `para` is a string
              if (typeof text === "string") {
                return text.split('.').map((part, index) => 
                  part.trim() ? <span key={index}>{part.trim()}.<br /></span> : null
                );
              }
          
              // If `para` is an array of strings
              if (Array.isArray(text)) {
                return text.map((item, idx) => (
                  <div key={idx}>
                    {item.split('.').map((sentence, i) =>
                      sentence.trim() ? <span key={i}>{sentence.trim()}.<br /></span> : null
                    )}
                  </div>
                ));
              }
          
              return null;
            }
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
                Add SubCategory
            </Button>
            <Table
                columns={columns}
                dataSource={data}
                loading={loading}
                scroll={{ x: 'max-content' }} 
            // rowKey="_id"
            />

            <Modal
                title={editingSubCategory ? "Edit SubCategory" : "Add SubCategory"}
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
                        name="parent"
                        label="Category"
                        rules={[{ required: true, message: 'Please select a category!' }]}
                    >
                        <Select placeholder="Select a category" loading={loading}>
                            {categories.map((cat) => (
                                <Option key={cat._id} value={cat._id}>
                                    {cat.name}
                                </Option>
                            ))}
                        </Select>
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
                            {editingSubCategory ? "Update" : "Submit"}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default SubCategory;
