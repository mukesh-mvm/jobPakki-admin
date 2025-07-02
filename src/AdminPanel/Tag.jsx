import React, { useState, useEffect } from "react";







import { Editor } from "react-draft-wysiwyg";
import { EditorState } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

// import { Editor } from "@tinymce/tinymce-react";
// import { useRef } from "react";
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


    //  const editorRef = useRef(null);
    //   const [content, setContent] = useState("");

     const [editorState, setEditorState] = useState(EditorState.createEmpty());

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




 {/* <Editor
      apiKey="obw2bhjogwkhemtx2ph1q1auya9byet1i80ateu397sicqv6"
      value={content}
      onEditorChange={(newContent) => setContent(newContent)}
      onInit={(evt, editor) => (editorRef.current = editor)}
      init={{
        height: 500,
        menubar: true,

        plugins: [
          "advlist autolink lists link image charmap preview anchor",
          "searchreplace visualblocks code fullscreen",
          "insertdatetime media table code help wordcount",
        ],

        toolbar:
          "undo redo | formatselect | bold italic backcolor | " +
          "alignleft aligncenter alignright alignjustify | " +
          "bullist numlist outdent indent | link image media table | help",

        // ✅ Enable image & media uploads
        automatic_uploads: true,
        file_picker_types: "image media",

        // ✅ Open link in new tab
        link_target_list: [
          { title: "None", value: "" },
          { title: "Open in new tab", value: "_blank" },
        ],
        target_list: true,

        // ✅ File picker to upload image/video
        file_picker_callback: function (callback, value, meta) {
          const input = document.createElement("input");
          input.setAttribute("type", "file");

          if (meta.filetype === "image") {
            input.setAttribute("accept", "image/*");
          } else if (meta.filetype === "media") {
            input.setAttribute("accept", "video/*");
          }

          input.onchange = async function () {
            const file = this.files[0];
            const formData = new FormData();
            formData.append("image", file);

            const response = await fetch("https://api.top5shots.com/api/uploadImage", {
              method: "POST",
              body: formData,
            });

            const result = await response.json();
            if (!response.ok || !result.imageUrl) {
              alert("Upload failed");
              return;
            }

            // Insert uploaded file's URL
            callback(result.imageUrl, { title: file.name });
          };

          input.click();
        },
      }}
    /> */}


     <Editor
        editorState={editorState}
        onEditorStateChange={setEditorState}
        wrapperClassName="demo-wrapper"
        editorClassName="demo-editor"
      />




   



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
