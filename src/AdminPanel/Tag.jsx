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


const Tag = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSubCategory, setEditingSubCategory] = useState(null);
    const [form] = Form.useForm();
    const [auth, setAuth] = useAuth();
    const [categories, setCategoris] = useState([])
    const auth1 = JSON.parse(localStorage.getItem('auth'));

    const[search,setSearch] = useState("")
      const[seachloading,setSearchLoading] = useState(false);
    // console.log(auth?.user._id);

    useEffect(() => {
        // fetchData();
        fetchData1()
    }, []);


    useEffect(() => {
        fetchData();
    }, [seachloading]);




    const fetchData1 = async () => {
        try {
            const res = await axios.get(baseurl + "/category");
            // console.log("----data-----", res.data);
            setCategoris(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
            setLoading(false);
        }
    };

    const fetchData = async () => {
        try {
            const res = await axios.get(baseurl + "/api/tag/getAllTag");

        if(seachloading){
        const filtered = res?.data.filter(job =>job.name.toLowerCase().includes(search.toLowerCase()));
         setData(filtered);
        }else{
         setData(res?.data);
        }

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
        // console.log(record.email);
        form.setFieldsValue({
            name: record.name,

            // dob:record.dateOfBirth,
        });
        setIsModalOpen(true);
    };

    const handleStatusToggle = async (record) => {
        try {
            const response = await axios.patch(
                `${baseurl}/api/tag/toggled/${record?._id}`
            );
            // console.log(response);

            if (response) {
                message.success("Status updated succesfully");
                fetchData();
            }
        } catch (error) {
            console.log(error);
        }
    };


       const handleSeach = ()=>{
        setSearchLoading(true)
       
  }

  const ClearSeach = ()=>{
     setSearchLoading(false)
     setSearch("")

  }

  // console.log("---loading---",seachloading)

  const handleChange= (value)=>{
          setSearch(value)

          // console.log("----seach----",value)
  }


    const handleDelete = async (record) => {
        try {
            const response = await axios.delete(`${baseurl}/api/tag/delete/${record}`)
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

        };

        try {
            const response = await axios.post(
                baseurl + "/api/tag/create",
                postData
            );
            // console.log(response.data);

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

        };

        try {
            const response = await axios.put(
                `${baseurl}/api/tag/update/${editingSubCategory?._id}`,
                postData
            );
            // console.log(response.data);

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
                Add Tag
            </Button>

            <div className="search">
                           <Input type="text" value={search} onChange={(e)=>{handleChange(e.target.value)}} placeholder="Enter SubCategory Name"/>
                           <Button onClick={handleSeach}> Search</Button>
                            <Button onClick={ClearSeach}> Clear Filter</Button>
                       </div>



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
                title={editingSubCategory ? "Edit Tag" : "Add Tag"}
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

export default Tag;
