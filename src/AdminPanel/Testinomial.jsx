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
  InputNumber,
} from "antd";
import {
  BellOutlined,
  TranslationOutlined,
  TruckOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { UploadOutlined } from "@ant-design/icons";
import { baseurl } from "../helper/Helper";
import axios from "axios";
import Password from "antd/es/input/Password";
// import { baseurl } from "../helper/Helper";
import { useAuth } from "../context/auth";

const Testinomial = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTestinomial, setEditingTestinomial] = useState(null);
  const [image1, setImage] = useState();
  const [form] = Form.useForm();
  const [auth, setAuth] = useAuth();
  const [photo, setPhoto] = useState("");
  const [imageTrue, setImageTrue] = useState(false);
  const [cross, setCross] = useState(true);
  const [record1, setRecord] = useState();

  console.log(auth.user._id);

  // http://localhost:5000/api/amenities/getAmenties
  useEffect(() => {
    fetchAllTestinomial();
  }, []);

  const fetchAllTestinomial = async () => {
    setLoading(true);
    try {
      const respons = await axios.get(
        baseurl + "/api/testinomial/getTestinomial"
      );
      console.log(respons.data.testinomials);

      if (respons.data) {
        setData(respons.data.testinomials);
        // message.success('Amenities fetched successfully!');
      }

      //   message.success('Country codes fetched successfully!');
    } catch (error) {
      console.error("Error fetching Testinomial:", error);
      message.error("Error fetching Testinomial.");
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (record) => {
    console.log("Clicked row data:", record);
    setRecord(record);
    setImage(record?.image);
    setCross(true);

    // Access the clicked row's data here
    // You can now use 'record' to get the details of the clicked row
  };

  const handleCross = () => {
    setCross(false);
  };

  const handleStatusToggle = async (record) => {
    try {
      const response = await axios.patch(
        `${baseurl}/api/testinomial/toggled/${record._id}`
      );
      console.log(response);

      if (response) {
        message.success("Status updated succesfully");
        fetchAllTestinomial();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAdd = () => {
    setEditingTestinomial(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (record) => {
    setImageTrue(true);
    setEditingTestinomial(record);
    form.setFieldsValue({
      title: record.title,
      heading: record.heading,
      content: record.content,
      rating: record.rating,
    });
    setIsModalOpen(true);
  };

  const uploadImage = async (file) => {
    console.log(file);
    const formData = new FormData();
    formData.append("image", file.file);
    // console.log(file.file.name);

    try {
      const response = await axios.post(
        `${baseurl}/api/uploadImage`,
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
    const postdata = {
      image: image1,
      title: values.title,
      content: values.content,
      rating: values.rating,
      heading: values.heading,
    };

    try {
      const response = await axios.post(
        baseurl + "/api/testinomial/createTestinomial",
        postdata
      );
      console.log(response.data);

      if (response.data) {
        message.success("Testinomial Created Successfully!");
        setIsModalOpen(false);
        setPhoto("");
        fetchAllTestinomial();
      }

      // sdkhbfkshdbfk
    } catch (error) {
      console.log(error);
    }
  };

  const handlePut = async (values) => {
    const postdata = {
      image: imageTrue ? image1 : values.logo,
      title: values.title,
      content: values.content,
      rating: values.rating,
      heading: values.heading,
    };

    try {
      const response = await axios.put(
        `${baseurl}/api/testinomial/updateTestinomial/${editingTestinomial._id}`,
        postdata
      );
      console.log(response.data);

      if (response.data) {
        message.success("Testinomial Update Successfully!");
        setIsModalOpen(false);
        setPhoto("");
        fetchAllTestinomial();
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleSubmit = async (values) => {
    if (editingTestinomial) {
      await handlePut(values);
    } else {
      await handlePost(values);
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "title",
      key: "name",
    },

    {
      title: "Profile",
      dataIndex: "heading",
      key: "heading",
    },

    {
      title: "Description",
      dataIndex: "content",
      key: "content",
    },

    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
    },
    {
      title: "Photo",
      // dataIndex: "logo",
      key: "image",
      render: (_, record) => (
        <>
          <img
            src={`${baseurl}${record.image}`}
            alt=""
            style={{ width: "120px" }}
          />
        </>
      ),
    },

    {
      title: "Status",
      key: "status",
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
  ];

  return (
    <div>
      <Button type="primary" onClick={handleAdd} style={{ marginBottom: 16 }}>
        Add Testinomial
      </Button>
      <Table
        columns={columns}
        dataSource={data}
        rowKey={(record) => record._id}
        onRow={(record) => ({
          onClick: () => {
            handleRowClick(record); // Trigger the click handler
          },
        })}
        // loading={loading}
        // rowKey="_id"
      />

      <Modal
        title={editingTestinomial ? "Edit Testinomial" : "Add Testinomial"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="title"
            label="Name"
            rules={[{ required: true, message: "Please input the name!" }]}
          >
            <Input placeholder="Enter Name" />
          </Form.Item>

          <Form.Item
            name="heading"
            label="Profile"
            rules={[{ required: true, message: "Please input the Profile!" }]}
          >
            <Input placeholder="Enter Profile" />
          </Form.Item>

          <Form.Item
            name="rating"
            label="Rating"
            rules={[{ required: true, message: "Please input the rating!" }]}
          >
            <InputNumber placeholder="Enter Rating" style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="content"
            label="Description"
            rules={[
              { required: true, message: "Please input the description!" },
            ]}
          >
            <Input.TextArea placeholder="Enter Description" rows={4} />
          </Form.Item>

          {/* <Form.Item
            label="logo"
            name="logo"
            onChange={(e) => setPhoto(e.target.files[0])}
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
          </Form.Item> */}

          {/* {photo && (
            <div>
              <img
                src={URL.createObjectURL(photo)}
                alt="Uploaded"
                height="100px"
                width="100px"
              />
            </div>
          )} */}

          {editingTestinomial ? (
            <>
              {cross ? (
                <>
                  <CloseCircleOutlined
                    style={{ width: "30px" }}
                    onClick={handleCross}
                  />
                  <img
                    src={`${baseurl}${record1?.image}`}
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

          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingTestinomial ? "Update" : "Submit"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Testinomial;
