"use client";

import { useState } from "react";
import {
  Button,
  Card,
  Col,
  Flex,
  Image,
  Input,
  Row,
  Select,
  Space,
  Table,
  Tree,
  Typography,
  Modal,
} from "antd";
import {
  FolderOpenOutlined,
  FolderOutlined,
  ReloadOutlined,
  SearchOutlined,
  UploadOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  FileImageOutlined,
} from "@ant-design/icons";
import { ColumnsType } from "antd/es/table/interface";

const { Title } = Typography;

interface IUpload {
  _id: string;
  name: string;
  url: string;
  type: string;
  size: string;
  entity: string;
  product: string;
  uploadedBy: string;
  createdAt: string;
}

const UploadTable = () => {
  const [loading] = useState(false);

  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total] = useState(0);

  const [search, setSearch] = useState("");

  const [entity, setEntity] = useState<string>();

  const [product, setProduct] = useState<string>();

  const [openUpload, setOpenUpload] = useState(false);

  const [openPreview, setOpenPreview] = useState(false);

  const [previewImage, setPreviewImage] = useState("");

  const [uploads] = useState<IUpload[]>([]);

  const treeData = [
    {
      title: "uploads",
      key: "uploads",
      icon: <FolderOpenOutlined />,
      children: [
        {
          title: "products",
          key: "products",
          icon: <FolderOutlined />,
        },
        {
          title: "users",
          key: "users",
          icon: <FolderOutlined />,
        },
        {
          title: "banners",
          key: "banners",
          icon: <FolderOutlined />,
        },
      ],
    },
  ];

  const columns: ColumnsType<IUpload> = [
    {
      title: "Preview",
      width: 90,
      render: (_: any, record: IUpload) => (
        <Image
          width={60}
          height={60}
          src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${record.url}`}
          style={{
            objectFit: "cover",
            borderRadius: 8,
          }}
          preview={false}
        />
      ),
    },
    {
      title: "ID",
      dataIndex: "id",
      width: 120,
    },
    {
      title: "URL",
      dataIndex: "url",
      ellipsis: true,
    },
    {
      title: "Type",
      dataIndex: "type",
      width: 120,
    },
    {
      title: "Size",
      dataIndex: "size",
      width: 120,
      render: (size: number) => `${(size / 1024).toFixed(2)} KB`,
    },
    {
      title: "Entity",
      dataIndex: "entity_type",
      width: 140,
    },
    {
      title: "Entity ID",
      dataIndex: "entity_id",
      width: 260,
      render: (value: any) =>
        typeof value === "string" ? value : (value?._id ?? value),
    },
    {
      title: "Uploaded By",
      dataIndex: "uploaded_by",
      width: 260,
      render: (value: any) =>
        typeof value === "string" ? value : (value?._id ?? value),
    },
    {
      title: "Action",
      width: 180,
      fixed: "right",
      render: (_: any, record: IUpload) => (
        <Space>
          <Button
            type="link"
            onClick={() => {
              setPreviewImage(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}${record.url}`,
              );
              setOpenPreview(true);
            }}
          >
            View
          </Button>

          <Button type="link">Edit</Button>

          <Button danger type="link">
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Flex
        justify="space-between"
        align="center"
        style={{
          marginBottom: 20,
        }}
      >
        <Title
          level={4}
          style={{
            margin: 0,
          }}
        >
          Manager Uploads
        </Title>

        <Space wrap>
          <Input
            style={{
              width: 250,
            }}
            allowClear
            value={search}
            placeholder="Search..."
            prefix={<SearchOutlined />}
            onChange={(e) => setSearch(e.target.value)}
          />

          <Select
            allowClear
            placeholder="Entity"
            style={{
              width: 180,
            }}
            value={entity}
            onChange={setEntity}
            options={[
              {
                label: "Product",
                value: "PRODUCT",
              },
              {
                label: "User",
                value: "USER",
              },
              {
                label: "Banner",
                value: "BANNER",
              },
            ]}
          />

          <Select
            allowClear
            placeholder="Select Product"
            style={{
              width: 220,
            }}
            value={product}
            onChange={setProduct}
            options={[]}
          />

          <Button icon={<ReloadOutlined />}>Refresh</Button>

          <Button
            type="primary"
            icon={<UploadOutlined />}
            onClick={() => setOpenUpload(true)}
          >
            Upload File
          </Button>

          <Button
            type="primary"
            icon={<FolderOpenOutlined />}
            onClick={() => setOpenUpload(true)}
          >
            Upload Folder
          </Button>
        </Space>
      </Flex>

      <Row gutter={16}>
        <Col xs={24} lg={6}>
          <Card
            title="Folders"
            style={{
              height: "100%",
            }}
          >
            <Tree showIcon defaultExpandAll treeData={treeData} />
          </Card>
        </Col>

        <Col xs={24} lg={18}>
          <Card>
            <Table
              bordered
              loading={loading}
              rowKey="_id"
              columns={columns}
              dataSource={uploads}
              scroll={{
                x: 1500,
              }}
              pagination={{
                current,
                pageSize,
                total,
                showSizeChanger: true,
                onChange(page, size) {
                  setCurrent(page);
                  setPageSize(size || 10);
                },
              }}
            />
          </Card>
        </Col>
      </Row>

      <Modal
        open={openUpload}
        width={700}
        title="Upload File"
        footer={null}
        onCancel={() => setOpenUpload(false)}
      >
        <div
          style={{
            border: "2px dashed #d9d9d9",
            borderRadius: 10,
            padding: 60,
            textAlign: "center",
          }}
        >
          <FileImageOutlined
            style={{
              fontSize: 50,
              marginBottom: 20,
            }}
          />

          <br />

          <Button type="primary" icon={<UploadOutlined />}>
            Select File
          </Button>

          <br />
          <br />

          <Button icon={<FolderOpenOutlined />}>Select Folder</Button>
        </div>
      </Modal>

      <Modal
        open={openPreview}
        footer={null}
        width={900}
        onCancel={() => setOpenPreview(false)}
      >
        <Image width="100%" src={previewImage} />
      </Modal>
    </>
  );
};

export default UploadTable;
