import React, { useState, useEffect, useRef } from "react";
import dayjs from 'dayjs';
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
  InputNumber,
  Space,
  Popconfirm
} from "antd";

import {
  BellOutlined,
  TranslationOutlined,
  TruckOutlined,
  CloseCircleOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { UploadOutlined } from "@ant-design/icons";
import { baseurl } from "../helper/Helper";
import axios from "axios";
import Password from "antd/es/input/Password";
// import { baseurl } from "../helper/Helper";
import { useAuth } from "../context/auth";
import JoditEditor from "jodit-react";
import { Content } from "antd/es/layout/layout";

const { Option } = Select;

const { TextArea } = Input;
const Job = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompBlog, setEditingCompBlog] = useState(null);
  const [form] = Form.useForm();
  const [auth, setAuth] = useAuth();
  const [categories, setCategoris] = useState([])
  const [subcategories, setSubCategoris] = useState([])
  const [company, setCompany] = useState([])
  const [image1, setImage] = useState();
  const [photo, setPhoto] = useState("");
  const [cross, setCross] = useState(true);
  const [record1, setRecord] = useState();
  const [imageTrue, setImageTrue] = useState(false);
  const [tag, setTag] = useState([])
  const [user, setUser] = useState([])
  const editor = useRef(null);
  const [editorContent, setEditorContent] = useState("");
  const auth1 = JSON.parse(localStorage.getItem('auth'));

  const [selectedCategory, setSelectedCategory] = useState(null); // store in a variable
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);

  const handleCategoryChange = (value) => {
    setSelectedCategory(value); // save selected category ID to variable
    console.log("Selected Category ID:", value);
  };


  const handleCategoryChange1 = (value) => {
    setSelectedSubCategory(value); // save selected category ID to variable
    console.log("Selected Category ID:", value);
  };





  const handleRowClick = (record) => {
    console.log("Clicked row data:", record);
    setRecord(record);
    setImage(record?.image)
    setCross(true);

    // Access the clicked row's data here
    // You can now use 'record' to get the details of the clicked row
  };

  const handleCross = () => {
    setCross(false);
  };

  // console.log(auth?.user._id);

  useEffect(() => {
    fetchData();
    fetchData1()
    fetchData3()
    fetchData4()


  }, []);


  useEffect(() => {
    fetchData2()
  }, [selectedCategory])







  const fetchData1 = async () => {
    try {
      const res = await axios.get(baseurl + "/api/catagory/get-categories");
      // console.log("----data-----", res.data);
      setCategoris(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };



  const fetchData2 = async () => {
    try {
      const res = await axios.get(`${baseurl}/api/subcatagory/getSubCategoryByCatId/${selectedCategory}`);
      // console.log("----data-----", res.data);
      setSubCategoris(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };





  const fetchData3 = async () => {
    try {
      const res = await axios.get(baseurl + "/api/tag/getAllTag");
      console.log("----data tag-----", res.data);
      setTag(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };




  const fetchData4 = async () => {
    try {
      const res = await axios.get(baseurl + "/api/auth/getAllUsers");
      // console.log("----data user-----", res.data);
      setUser(res.data.users);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };





  const fetchData = async () => {
    try {
      const res = await axios.get(baseurl + "/api/job/getAllJob");

      console.log("----data-----", res.data);
      setData(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingCompBlog(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (record) => {
    setImageTrue(true);
    setEditingCompBlog(record);
    console.log(record);
    setSelectedCategory(record?.category?._id)
    const jobDescription = record?.jobDescription?.join('\n')
    const skill = record?.skill?.join('\n')
    const requirementdata = record?.requirementdata?.join('\n')
    const ageLimit = record?.ageLimit?.join('\n')
    form.setFieldsValue({
      postName: record?.postName,
      Jobtype: record?.Jobtype,
      title3: record?.title3,
      title1: record?.title1,
      title2: record?.title2,
      postDate: record.postDate ? dayjs(record.postDate, 'DD/MM/YYYY') : null,
      lastDate: record.lastDate ? dayjs(record.lastDate, 'DD/MM/YYYY') : null,
      correctionDate: record.correctionDate ? dayjs(record.correctionDate, 'DD/MM/YYYY') : null,
      adminCardDate: record.adminCardDate ? dayjs(record.adminCardDate, 'DD/MM/YYYY') : null,
      shortInformation: record?.shortInformation,
      slug: record?.slug,
      applicationfeesG_O_EWs: record?.applicationfeesG_O_EWs,
      applicationfees_SC_ST: record?.applicationfees_SC_ST,
      paymentMode: record?.paymentMode,
      totalPost: record?.totalPost,
      applylink: record?.applylink,
      officialwebsitelink: record?.officialwebsitelink,
      downloadDetailsNotification: record?.downloadDetailsNotification,
      downloadSllabus: record?.downloadSllabus,
      location: record?.location,
      experience: record?.experience,
      jobDescription:jobDescription,
      skill:skill,
      requirementdata:requirementdata,
      ageLimit:ageLimit,
      salary: record?.salary,
      mtitle: record?.mtitle,
      mdescription: record?.mdescription,
      category: record?.category?._id,
      subCategory: record?.subCategory?._id,
      alt: record?.alt,
      companyName: record?.companyName
      // dob:record.dateOfBirth,
    });
    setIsModalOpen(true);
  };

  const handleStatusToggle = async (record) => {
    try {
      const response = await axios.patch(
        `${baseurl}/api/job/toggled/${record?._id}`
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


  const handleDelete = async (record) => {
    try {
      const response = await axios.delete(`${baseurl}/api/job/deleteJob/${record}`)
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
      }

      return response.data.imageUrl; // Assuming the API returns the image URL in the 'url' field
    } catch (error) {
      message.error("Error uploading image. Please try again later.");
      console.error("Image upload error:", error);
      return null;
    }
  };

  const handlePost = async (values) => {
    const jobDescription = values?.jobDescription?.split('\n')
    const skill = values?.skill?.split('\n')
    const requirementdata = values?.requirementdata?.split('\n')
    const ageLimit = values?.ageLimit?.split('\n')

    const postData = {
      postName: values?.postName,
      Jobtype: values?.Jobtype,
      title3: values?.title3,
      title1: values?.title1,
      title2: values?.title2,
      postDate: values?.postDate ? dayjs(values.postDate).format('DD/MM/YYYY') : null,
     lastDate: values?.lastDate ? dayjs(values.lastDate).format('DD/MM/YYYY') : null,
      correctionDate: values?.correctionDate ? dayjs(values.correctionDate).format('DD/MM/YYYY') : null,
       adminCardDate: values?.adminCardDate ? dayjs(values.adminCardDate).format('DD/MM/YYYY') : null,
      shortInformation: values?.shortInformation,
      slug: values?.slug,
      applicationfeesG_O_EWs: values?.applicationfeesG_O_EWs,
      applicationfees_SC_ST: values?.applicationfees_SC_ST,
      paymentMode: values?.paymentMode,
      totalPost: values?.totalPost,
      applylink: values?.applylink,
      officialwebsitelink: values?.officialwebsitelink,
      downloadDetailsNotification: values?.downloadDetailsNotification,
      downloadSllabus: values?.downloadSllabus,
      location: values?.location,
      experience: values?.experience,
      jobDescription:jobDescription,
      skill:skill,
      requirementdata:requirementdata,
      ageLimit:ageLimit,
      salary: values?.salary,
      mtitle: values?.mtitle,
      mdescription: values?.mdescription,
      category: values?.category,
      subCategory: values?.subCategory,
      alt: values?.alt,
      companyName: values?.companyName,
      image: image1,
    };

    console.log(postData)

    try {
      const response = await axios.post(
        baseurl + "/api/job/createJob",
        postData
      );
      console.log(response.data);

      if (response.data) {
        setIsModalOpen(false);
        message.success("User created successfully!");
        setPhoto("");
        fetchData();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlePut = async (values) => {
    
    console.log("----category----",values?.category)
    console.log("----subcat-----",values?.subCategory)

    const jobDescription = values?.jobDescription?.split('\n')
    const skill = values?.skill?.split('\n')
    const requirementdata = values?.requirementdata?.split('\n')
    const ageLimit = values?.ageLimit?.split('\n')

    const postData = {
      postName: values?.postName,
      Jobtype: values?.Jobtype,
      title3: values?.title3,
      title1: values?.title1,
      title2: values?.title2,
      postDate: values?.postDate ? dayjs(values.postDate).format('DD/MM/YYYY') : null,
lastDate: values?.lastDate ? dayjs(values.lastDate).format('DD/MM/YYYY') : null,
correctionDate: values?.correctionDate ? dayjs(values.correctionDate).format('DD/MM/YYYY') : null,
adminCardDate: values?.adminCardDate ? dayjs(values.adminCardDate).format('DD/MM/YYYY') : null,
      shortInformation: values?.shortInformation,
      slug: values?.slug,
      applicationfeesG_O_EWs: values?.applicationfeesG_O_EWs,
      applicationfees_SC_ST: values?.applicationfees_SC_ST,
      paymentMode: values?.paymentMode,
      totalPost: values?.totalPost,
      applylink: values?.applylink,
      officialwebsitelink: values?.officialwebsitelink,
      downloadDetailsNotification: values?.downloadDetailsNotification,
      downloadSllabus: values?.downloadSllabus,
      location: values?.location,
      experience: values?.experience,
      jobDescription:jobDescription,
      skill:skill,
      requirementdata:requirementdata,
      ageLimit:ageLimit,
      salary: values?.salary,
      mtitle: values?.mtitle,
      mdescription: values?.mdescription,
      category: values?.category,
      subCategory: values?.subCategory,
      alt: values?.alt,
      companyName: values?.companyName,
      image: imageTrue ? image1 : values.logo,

    };

   


    // console.log("----post data----", postData)

    try {
      const response = await axios.put(
        `${baseurl}/api/job/updateJob/${editingCompBlog?._id}`,
        postData
      );
      console.log(response.data);

      if (response.data) {
        setIsModalOpen(false);
        fetchData();
        message.success("User update successfully!");
        form.resetFields();
        setPhoto("");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleSubmit = async (values) => {
    if (editingCompBlog) {
      await handlePut(values);
    } else {
      await handlePost(values);
    }
  };

  const columns = [
    {
      title: "Job Title",
      dataIndex: "postName",
      key: "postName",
    },

    {
      title: "Categories",
      dataIndex: ['category', 'name'],
      key: "name",
    },

    {
      title: "Subcategories",
      dataIndex: ['subCategory', 'name'],
      key: "subcategories",
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
      title: "Blog Title",
      dataIndex: "title",
      key: "title",
    },

    {
      title: "Categories",
      dataIndex: ['category', 'name'],
      key: "name",
    },

    {
      title: "Subcategories",
      dataIndex: ['subCategory', 'name'],
      key: "subcategories",
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
        Add Job
      </Button>
      {
        auth1?.user?.role === 'superAdmin' ? (<><Table
          columns={columns}
          dataSource={data}
          loading={loading}
          rowKey={(record) => record._id}
          onRow={(record) => ({
            onClick: () => {
              handleRowClick(record); // Trigger the click handler
            },
          })}

        />
        </>) : (<>
          <Table
            columns={columns1}
            dataSource={data}
            loading={loading}
            rowKey={(record) => record._id}
            onRow={(record) => ({
              onClick: () => {
                handleRowClick(record); // Trigger the click handler
              },
            })}

          />

        </>)
      }

      <Modal
        title={editingCompBlog ? "Edit Job" : "Add Job"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>


          <Form.Item
            name="postName"
            label="Post Name "
            rules={[{ required: true, message: 'Please Enter Post Name!' }]}

          >
            <Input placeholder="Enter Post Name" />
          </Form.Item>

          <Form.Item
            name="companyName"
            label="Company Name "
            rules={[{ required: true, message: 'Please Enter Company Name!' }]}

          >
            <Input placeholder="Enter Post Name" />
          </Form.Item>



          <Form.Item
            name="title1"
            label="Title 1"

          >
            <Input placeholder="Enter Blog Title" />
          </Form.Item>
          <Form.Item
            name="title2"
            label="Title 2"

          >
            <Input placeholder="Enter Blog Title" />
          </Form.Item>
          <Form.Item
            name="title3"
            label="Title 3"

          >
            <Input placeholder="Enter Blog Title" />
          </Form.Item>


          <Form.Item
            name="mtitle"
            label="Job Meta Title"
            rules={[{ required: true, message: "Please input the meta tile !" }]}
          >
            <Input placeholder="Enter Blog Meta Title" />
          </Form.Item>


          <Form.Item
            name="mdescription"
            label="Job Meta Description"
            rules={[{ required: true, message: "Please input the job meta description!" }]}
          >
            <Input placeholder="Enter Job Meta Description" />
          </Form.Item>

          <Form.Item
            name="slug"
            label="Slug"
            rules={[{ required: true, message: "Please enter slug!" }]}
          >
            <Input placeholder="Enter Job Slug" />
          </Form.Item>


          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: 'Please select a category!' }]}
          >
            <Select placeholder="Select a category" loading={loading} onChange={handleCategoryChange}>
              {categories.map((cat) => (
                <Option key={cat._id} value={cat._id}>
                  {cat.name}
                </Option>
              ))}
            </Select>
          </Form.Item>




          <Form.Item
            name="subCategory"
            label="SubCategories"
            rules={[{ required: true, message: 'Please select a category!' }]}
          >
            <Select placeholder="Select a subcategories" loading={loading} onChange={handleCategoryChange1}>
              {subcategories?.map((cat) => (
                <Option key={cat._id} value={cat._id}>
                  {cat.name}
                </Option>
              ))}
            </Select>
          </Form.Item>




          <Form.Item
            name="Jobtype"
            rules={[{ required: true, message: "Please select jon type!" }]}
            label="Job Type"
          >
            <Select placeholder="Select Job Type">
              <Option value="private">Private</Option>
              <Option value="goven">Govt</Option>

            </Select>
          </Form.Item>


          <Form.Item
            name="postDate"
            label="Post Date"
            rules={[{ required: true, message: "Please Enter posted date" }]}
          >
            <DatePicker
              format="DD/MM/YYYY"
              style={{ width: '100%' }}
              placeholder="Select Post Date"
            />
          </Form.Item>

          <Form.Item
            name="lastDate"
            label="Last Date"
          >
            <DatePicker
              format="DD/MM/YYYY"
              style={{ width: '100%' }}
              placeholder="Select Last Date"
            />
          </Form.Item>

          <Form.Item
            name="correctionDate"
            label="Correction Date"
          >
            <DatePicker
              format="DD/MM/YYYY"
              style={{ width: '100%' }}
              placeholder="Select Correction Date"
            />
          </Form.Item>

          <Form.Item
            name="adminCardDate"
            label="Admin Card Date"
          >
            <DatePicker
              format="DD/MM/YYYY"
              style={{ width: '100%' }}
              placeholder="Select Admin Card Date"
            />
          </Form.Item>



          <Form.Item
            name="applicationfeesG_O_EWs"
            label="Application Fees Genral OBC EWS"
            
          >
            <Input placeholder="Enter Job Fess" />
          </Form.Item>


          <Form.Item
            name="applicationfees_SC_ST"
            label="Application Fees SC ST"
            
          >
            <Input placeholder="Enter Job Fess" />
          </Form.Item>


          <Form.Item
            name="paymentMode"
            label="Payment Mode"
            
          >
            <Input placeholder="Enter Payment Mode" />
          </Form.Item>


  <Form.Item
  name="totalPost"
  label="Total Post"
>
  <InputNumber
    placeholder="Enter Payment Mode"
    style={{ width: '100%' }}
  />
</Form.Item>


                       <Form.Item
                        name="ageLimit"
                        label="Age Limit"
                        
                    >
                        <TextArea placeholder="Enter Benifits each in new  line" style={{ height: 150 }} />
                    </Form.Item>


                    {/* <Form.Item
            name="requirementHeading"
            label="Requirement Heading"
            
          >
            <Input placeholder="Enter Payment Mode" />
          </Form.Item> */}

           

                 <Form.Item
                        name="requirementdata"
                        label="Requirement"
                        
                    >
                        <TextArea placeholder="Enter Requirement each in new  line" style={{ height: 150 }} />
                    </Form.Item>


                 <Form.Item
                        name="jobDescription"
                        label="Job Description"
                        
                    >
                        <TextArea placeholder="Enter Requirement each in new  line" style={{ height: 150 }} />
                    </Form.Item>

                 <Form.Item
                        name="skill"
                        label="Skill"
                        
                    >
                        <TextArea placeholder="Enter Requirement each in new  line" style={{ height: 150 }} />
                    </Form.Item>



                    <Form.Item
            name="applylink"
            label="Apply link"
            rules={[{ required: true, message: 'Please Enter Apply Link' }]}
            
          >
            <Input placeholder="Enter Apply Link" />
          </Form.Item>


          <Form.Item
            name="officialwebsitelink"
            label="Official Website link"
            rules={[{ required: true, message: 'Please Enter Official Website Link' }]}
            
          >
            <Input placeholder="Enter Official Website Link" />
          </Form.Item>


          <Form.Item
            name="downloadDetailsNotification"
            label="Notification Link"
            
          >
            <Input placeholder="Enter Notification Link" />
          </Form.Item>


          <Form.Item
            name="downloadSllabus"
            label="Sllabus Link"
            
          >
            <Input placeholder="Enter Sllabus Link" />
          </Form.Item>


          <Form.Item
            name="location"
            label="Location"
            
          >
            <Input placeholder="Enter Location" />
          </Form.Item>


          <Form.Item
            name="experience"
            label="Experience"
            
          >
            <Input placeholder="Enter Experience" />
          </Form.Item>

          <Form.Item
            name="salary"
            label="Salary"
            rules={[{ required: true, message: 'Please Enter salary!' }]}
          >
            <Input placeholder="Enter Salary" />
          </Form.Item>



          {editingCompBlog ? (
            <>
              {cross ? (
                <>
                  <CloseCircleOutlined
                    style={{ width: "30px" }}
                    onClick={handleCross}
                  />
                  <img
                    src={`${baseurl}${record1.image}`}
                    alt=""
                    style={{ width: "100px", height: "100px" }}
                  />
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


          {/* <Form.Item
            name="alt"
            label="Alt"
            rules={[{ required: true, message: "Please input the name!" }]}
          >
            <Input placeholder="Enter Image alt" />
          </Form.Item> */}



          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingCompBlog ? "Update" : "Submit"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Job;
