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


const RecentJob = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSubCategory, setEditingSubCategory] = useState(null);
    const [form] = Form.useForm();
    const [auth, setAuth] = useAuth();
    const [categories, setCategoris] = useState([])
    const auth1 = JSON.parse(localStorage.getItem('auth'));
    // console.log(auth?.user._id);

    useEffect(() => {
        fetchData();
        fetchData1()
    }, []);




    const fetchData1 = async () => {
        try {
            const res = await axios.get(baseurl + "/api/job/getAllJob");
            // console.log("----data data-----", res.data);

            const data1 = res?.data?.reverse()
            setCategoris(data1);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
            setLoading(false);
        }
    };

    const fetchData = async () => {
        try {
            const res = await axios.get(baseurl + "/api/recentJob/getAllRecentJOb");

            // console.log("----data-----", res.data);

            
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
        form.setFieldsValue({
            title: record.title,
            jobs: record.jobs.map(c => c._id)

            // dob:record.dateOfBirth,
        });
        setIsModalOpen(true);
    };

    const handleStatusToggle = async (record) => {
        try {
            const response = await axios.patch(
                `${baseurl}/api/tops-shorts/toggled/${record?._id}`
            );

            if (response) {
                message.success("Status updated succesfully");
                fetchData();
            }
        } catch (error) {
            console.log(error);
        }
    };


    const handleDelete = async (record) => {
        try {
            const response = await axios.delete(`${baseurl}/api/recentJob/deleteRecentJob/${record}`)
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
            jobs: values.jobs,
            title: values.title,

        };

        try {
            const response = await axios.post(
                baseurl + "/api/recentJob/createRecentJob",
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
            jobs: values.jobs,
            title: values.title,
        };

        try {
            const response = await axios.put(
                `${baseurl}/api/recentJob/updateRecentJb/${editingSubCategory?._id}`,
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
            title: "Title",
            dataIndex: "title",
            key: "title",
        },

        // {
        //     title: "CompBlog Titles",
        //     key: "compBlogTitles",
        //     render: (_, record) => {
        //       if (!Array.isArray(record.compBlog)) return "No Blogs";
        //       return (
        //         <ul style={{ paddingLeft: 20, margin: 0 }}>
        //           {record.compBlog.map((blog) => (
        //             <li key={blog._id}>{blog.title}</li>
        //           ))}
        //         </ul>
        //       );
        //     },
        //   },




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
            title: "Title",
            dataIndex: "title",
            key: "title",
          },

        //   {
        //     title: "CompBlog Titles",
        //     key: "compBlogTitles",
        //     render: (_, record) => {
        //       if (!Array.isArray(record.compBlog)) return "No Blogs";
        //       return (
        //         <ul style={{ paddingLeft: 20, margin: 0 }}>
        //           {record.compBlog.map((blog) => (
        //             <li key={blog._id}>{blog.title}</li>
        //           ))}
        //         </ul>
        //       );
        //     },
        //   },




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
                Add Best Job
            </Button>



            {
                auth1?.user?.role === 'superAdmin' ? (<>            <Table
                    columns={columns}
                    dataSource={data}
                    loading={loading}
                    scroll={{ x: 'max-content' }}
                // rowKey="_id"
                /></>) : (<>
                    <Table
                        columns={columns1}
                        dataSource={data}
                        loading={loading}
                        scroll={{ x: 'max-content' }}
                    // rowKey="_id"
                    />
                </>)
            }

            <Modal
                title={editingSubCategory ? "Edit Best Job" : "Add Best Job"}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
            >
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    <Form.Item
                        name="title"
                        label="title"
                        rules={[{ required: true, message: "Please input the name!" }]}
                    >
                        <Input placeholder="Enter Name" />
                    </Form.Item>


                    <Form.Item
                        label="Jobs"
                        name="jobs"
                        rules={[{ required: true, message: 'Please select the Comp blogs' }]}
                    >
                        <Select
                            mode="multiple"
                            placeholder="Select Blogs"

                        >
                            {categories?.map((cat) => (
                                <Option key={cat._id} value={cat._id}>
                                    {cat?.postName}
                                </Option>
                            ))}
                        </Select>
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

export default RecentJob;
