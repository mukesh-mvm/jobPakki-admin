import React, { useState, useEffect,useRef } from "react";
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
  Popconfirm,
 
} from "antd";
import { baseurl } from "../helper/Helper";
import axios from "axios";
import Password from "antd/es/input/Password";
// import { baseurl } from "../helper/Helper";
import { useAuth } from "../context/auth";
const { Option } = Select;
import JoditEditor from "jodit-react";
import { UploadOutlined } from "@ant-design/icons";
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

import {
  BellOutlined,
  TranslationOutlined,
  TruckOutlined,
  CloseCircleOutlined,
  PlusOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";


const Users = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();
  const [auth, setAuth] = useAuth();

    const [image1, setImage] = useState();
  const [photo, setPhoto] = useState("");
  const [cross, setCross] = useState(true);
  const [record1, setRecord] = useState();
  const [imageTrue, setImageTrue] = useState(false);
  const editor = useRef(null);
  const [editorContent, setEditorContent] = useState("");
  const auth1 = JSON.parse(localStorage.getItem('auth'));

  // console.log(auth?.user._id);



    const handleRowClick = (record) => {
    // console.log("Clicked row data:", record);
    setRecord(record);
    setImage(record?.image)
    setCross(true);

    // Access the clicked row's data here
    // You can now use 'record' to get the details of the clicked row
  };

  const handleCross = () => {
    setCross(false);
  };

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
  
     setImageTrue(true);
    setEditorContent(record?.shortBio)
    form.setFieldsValue({
      name: record?.name,
      email: record?.email,
      phone: record?.phone,
      specialization: record?.specialization,
      role:record?.role,
       socialMedia: {
        facebook: record?.socialMedia?.facebook || '',
        linkedin: record?.socialMedia?.linkedin || '',
        twitter: record?.socialMedia?.twitter || '',
        profile: record?.socialMedia?.profile || '',
      },
      tag: record?.tag,
      slug: record?.slug,
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


const uploadImage = async (file) => {
        console.log(file);
        const formData = new FormData();
        formData.append("image", file.file);
        // console.log(file.file.name);
    
        try {
          const response = await axios.post(
            `${baseurl}/api/subcatagory/uploadImage`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
    
          if (response) {
            message.success("Image uploaded successfully!");
            setImage(response.data.imageUrl);
             toast.success("image uploaded successfully", { position: "bottom-right" });
          }
    
          return response.data.imageUrl; // Assuming the API returns the image URL in the 'url' field
        } catch (error) {
          message.error("Error uploading image. Please try again later.");
          console.error("Image upload error:", error);
          return null;
        }
      };



  const handlePost = async (values) => {


    const date = new Date(values.dateOfBirth);

// Get date components
const day = String(date.getUTCDate()).padStart(2, '0');
const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are 0-indexed
const year = date.getUTCFullYear();

// Format as DD/MM/YYYY
const formatted = `${day}/${month}/${year}`;

// const b = String(formatted)

    const postData = {
      name: values.name,
      email: values.email,
      password: values.password,
      dateOfBirth: formatted,
      specialization: values.specialization,
      phone: values.phone,
      role: values.role,

       socialMedia: {
        facebook: values?.socialMedia?.facebook || '',
        linkedin: values?.socialMedia?.linkedin || '',
        twitter: values?.socialMedia?.twitter || '',
        profile: values?.socialMedia?.profile || '',
      },
      shortBio: editorContent,
      tag: values?.tag,
      slug: values?.slug,
      image: image1,

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
        setPhoto("");
        setEditorContent("")
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlePut = async (values) => {
    const postData = {
      name: values.name,
      email: values.email,
      specialization: values.specialization,
      role: values?.role,
       socialMedia: {
        facebook: values?.socialMedia?.facebook || '',
        linkedin: values?.socialMedia?.linkedin || '',
        twitter: values?.socialMedia?.twitter || '',
        profile: values?.socialMedia?.profile || '',
      },
      shortBio: editorContent,
      tag: values?.tag,
      slug: values?.slug,
      image: imageTrue ? image1 : values.logo,

    };

    try {
      const response = await axios.patch(
        `${baseurl}/api/auth/updateUser/${editingUser?._id}`,
        postData
      );
      console.log(response.data);

      if (response.data) {
        setIsModalOpen(false);
        fetchData();
        message.success("User update successfully!");
        form.resetFields();
        setPhoto("");
        setEditorContent("")
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

  return (
    <div>
      <Button type="primary" onClick={handleAdd} style={{ marginBottom: 16 }}>
        Add Admin
      </Button>
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        rowKey={(record) => record._id}
        onRow={(record) => ({
          onClick: () => {
            handleRowClick(record); // Trigger the click handler
          },
        })}
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




          {/* <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please enter your password!" }]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item> */}


             {
            !editingUser ? (<Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: "Please Enter Password!" }]}
            >
              <Input.Password placeholder="Password" />
            </Form.Item>
            ) : ("")
          }


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



            


              {
            !editingUser ? (<Form.Item
              name="dateOfBirth"
              label="Date of Birth"
              rules={[{ required: true, message: "Please select your date of birth!" }]}
            >
              <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
            </Form.Item>
            ) : ("")
          }


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


          
          <Form.Item
            name="slug"
            label="Slug"
            rules={[{ required: true, message: "Please Enter slug !" }]}
          >
            <Input placeholder="Enter slug like " />
          </Form.Item>


          <Form.Item
            name="tag"
            label="Tag"
            rules={[{ required: true, message: "Please Enter tag !" }]}
          >
            <Input placeholder="Enter tag like Finance and Travel " />
          </Form.Item>


          
            <Form.Item
              label="Facebook"
              name={['socialMedia', 'facebook']}
              rules={[{ type: 'url', message: 'Enter a valid URL' }]}
            >
              <Input placeholder="https://facebook.com/yourprofile" />
            </Form.Item>

            <Form.Item
              label="LinkedIn"
              name={['socialMedia', 'linkedin']}
              rules={[{ type: 'url', message: 'Enter a valid URL' }]}
            >
              <Input placeholder="https://linkedin.com/in/yourprofile" />
            </Form.Item>

            <Form.Item
              label="Twitter"
              name={['socialMedia', 'twitter']}
              rules={[{ type: 'url', message: 'Enter a valid URL' }]}
            >
              <Input placeholder="https://twitter.com/yourprofile" />
            </Form.Item>

            <Form.Item
              label="Personal Website"
              name={['socialMedia', 'profile']}
              rules={[{ type: 'url', message: 'Enter a valid URL' }]}
            >
              <Input placeholder="https://yourwebsite.com" />
            </Form.Item>



          <Form.Item label="Short Bio" required>
              <JoditEditor
                ref={editor}
                value={editorContent}
                onBlur={(newContent) => setEditorContent(newContent)}
                tabIndex={1}
                placeholder="Write your content here..."
                config={{
                  cleanHTML: {
                    removeEmptyTags: false,
                    fillEmptyParagraph: false,
                    removeEmptyBlocks: false,
                  },
                  uploader: {
                    url: `${baseurl}/api/amenities/uploadImage`, // Your image upload API endpoint
                    // This function handles the response
                    format: "json", // Specify the response format
                    isSuccess: function (resp) {
                      return !resp.error;
                    },
                    getMsg: function (resp) {
                      return resp.msg.join !== undefined
                        ? resp.msg.join(" ")
                        : resp.msg;
                    },
                    process: function (resp) {
                      return {
                        files: resp.files || [],
                        path: resp.files.url,
                        baseurl: resp.files.url,
                        error: resp.error || "error",
                        msg: resp.msg || "iuplfn",
                      };
                    },
                    defaultHandlerSuccess: function (data, resp) {
                      const files = data.files || [];
                      // console.log({ files });
                      if (files) {
                        this.selection.insertImage(files.url, null, 250);
                      }
                    },
                  },
                  // enter: "DIV",
                  defaultMode: "div",
                  removeButtons: ["font"],
                }}
              />



            </Form.Item>



          {editingUser ? (
              <>
                {cross ? (
                  <>
                    <CloseCircleOutlined
                      style={{ width: "30px" }}
                      onClick={handleCross}
                    />
                    {
                      record1?.image?.includes("res") ? (
                        <img
                          src={record1.image}
                          alt=""
                          style={{ width: "100px", height: "100px" }}
                        />
                      ) : (
                        <img
                          src={`${baseurl}${record1.image}`}
                          alt=""
                          style={{ width: "100px", height: "100px" }}
                        />
                      )
                    }
                  </>
                ) : (
                  <>
                    <Form.Item
                      label="Photo"
                      name="photo"
                      onChange={(e) => setPhoto(e.target.files[0])}
                      rules={[
                        {
                          required: true,
                          message: "Please upload the driver's photo!",
                        },
                      ]}
                    >
                      <Upload
                        listType="picture"
                        beforeUpload={() => false}
                        onChange={uploadImage}
                        showUploadList={false}
                        customRequest={({ file, onSuccess }) => {
                          setTimeout(() => {
                            onSuccess("ok");
                          }, 0);
                        }}
                      >
                        <Button icon={<UploadOutlined />}>Upload Photo</Button>
                      </Upload>
                    </Form.Item>
                    {photo && (
                      <div>
                        <img
                          src={URL.createObjectURL(photo)}
                          alt="Uploaded"
                          height="100px"
                          width="100px"
                        />
                      </div>
                    )}
                  </>
                )}
              </>
            ) : (
              <>
                <Form.Item
                  label="Photo"
                  name="photo"
                  onChange={(e) => setPhoto(e.target.files[0])}
                  rules={[
                    {
                      required: true,
                      message: "Please upload the driver's photo!",
                    },
                  ]}
                >
                  <Upload
                    listType="picture"
                    beforeUpload={() => false}
                    onChange={uploadImage}
                    showUploadList={false}
                    customRequest={({ file, onSuccess }) => {
                      setTimeout(() => {
                        onSuccess("ok");
                      }, 0);
                    }}
                  >
                    <Button icon={<UploadOutlined />}>Upload Photo</Button>
                  </Upload>
                </Form.Item>
                {photo && (
                  <div>
                    <img
                      src={URL.createObjectURL(photo)}
                      alt="Uploaded"
                      height="100px"
                      width="100px"
                    />
                  </div>
                )}
              </>
            )}


            <Button type="primary" htmlType="submit">
              {editingUser ? "Update" : "Submit"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

       <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Users;
