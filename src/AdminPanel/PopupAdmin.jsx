// ===== FRONTEND: Popup CRUD Page (React + AntD) =====
import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Upload,
  List,
  Space,
  message,
} from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import axios from "axios";
// import { baseurl } from "../helper/Helper";

const { Dragger } = Upload;

const PopupAdmin = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [images, setImages] = useState([]);
  const [form] = Form.useForm();
const baseurl = "https://api.shopsmaart.com";

  const auth1 = JSON.parse(localStorage.getItem('auth'));
  

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const res = await axios.get(`${baseurl}/api/popup/getAll`);
    


    const data = res.data.filter((item)=>{
       return item?.websiteName==='jobkitayaari'
    })

    setData(data);
    setLoading(false);
  };

  const openAdd = () => {
    setEditing(null);
    setImages([]);
    form.resetFields();

    // always add one empty link field
    form.setFieldsValue({ linkArray: [""] });

    setIsModalOpen(true);
  };

  const openEdit = (record) => {
    setEditing(record);
    setImages(record.images || []);

    // ensure at least one empty link field exists
    const links = record.linkArray && record.linkArray.length > 0 
      ? record.linkArray 
      : [""];

    form.setFieldsValue({
      ...record,
      linkArray: links,
    });

    setIsModalOpen(true);
  };

  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append("image", file.file);

    try {
      const res = await axios.post(
        `${baseurl}/api/catagory/uploadImage`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (res.data.imageUrl) {
        setImages((prev) => [...prev, res.data.imageUrl]);
        message.success("Uploaded successfully");
      }
    } catch (e) {
      message.error("Upload failed");
    }
    return false;
  };

  const removeImage = (img) => {
    setImages(images.filter((i) => i !== img));
  };

  const submitForm = async (values) => {
    const payload = {
      ...values,
      images,
      linkArray: values.linkArray?.filter((i) => i && i.trim() !== "") || [],
    };

    if (editing) {
      await axios.put(`${baseurl}/api/popup/update/${editing._id}`, payload);
      message.success("Updated");
    } else {
      await axios.post(`${baseurl}/api/popup/create`, payload);
      message.success("Created");
    }

    setIsModalOpen(false);
    loadData();
  };

  const deletePopup = async (id) => {
    await axios.delete(`${baseurl}/api/popup/delete/${id}`);
    message.success("Deleted");
    loadData();
  };

  const columns = [
    { title: "Website", dataIndex: "websiteName" },
    { title: "Status", dataIndex: "status" },
    {
      title: "Actions",
      render: (_, r) => (
        <Space>
          <Button onClick={() => openEdit(r)}>Edit</Button>
          <Button danger onClick={() => deletePopup(r._id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>


      {
       auth1?.user?.role==='superAdmin'?( <Button type="primary" onClick={openAdd} style={{ marginBottom: 16 }}>
        Add Popup
      </Button>):(<></>)
      }
     

      <Table columns={columns} dataSource={data} loading={loading} rowKey="_id" />

      <Modal
        title={editing ? "Edit Popup" : "Add Popup"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={submitForm}>
          
          <Form.Item
            name="websiteName"
            label="Website Name"
            rules={[{ required: true }]}
          >
            <Input placeholder="Enter website name" />
          </Form.Item>

          {/* Upload Images */}
          <Form.Item label="Upload Images">
            <Dragger customRequest={handleUpload} multiple showUploadList={false}>
              <PlusOutlined /> Upload
            </Dragger>
          </Form.Item>

          <Form.Item label="Uploaded Images">
            <List
              dataSource={images}
              renderItem={(img) => (
                <List.Item
                  actions={[
                    <Button danger onClick={() => removeImage(img)}>
                      Remove
                    </Button>,
                  ]}
                >
                  <img
                    src={`${baseurl}${img}`}
                    style={{ width: 100, height: 100 }}
                    alt=""
                  />
                </List.Item>
              )}
            />
          </Form.Item>

          {/* Link Array */}
          <Form.List name="linkArray">
            {(fields, { add, remove }) => (
              <>
                <label><b>Links</b></label>
                {fields.map(({ key, name, ...rest }) => (
                  <Space key={key} style={{ display: "flex", marginBottom: 8 }}>
                    <Form.Item {...rest} name={name}>
                      <Input placeholder="Enter link (https://...)" />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}

                <Button onClick={() => add()} icon={<PlusOutlined />}>
                  Add Link
                </Button>
              </>
            )}
          </Form.List>

          {/* <Form.Item name="status" label="Status">
            <Input placeholder="Active / Inactive" />
          </Form.Item> */}

          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editing ? "Update" : "Submit"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PopupAdmin;
