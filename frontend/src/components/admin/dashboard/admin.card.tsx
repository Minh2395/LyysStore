"use client";

import { Card, Col, Row } from "antd";

interface IAdminCardItem {
  title: string;
  value: string | number;
  description?: string;
}

interface Props {
  items?: IAdminCardItem[];
}

const AdminCard = ({ items = [] }: Props) => {
  return (
    <Row gutter={[16, 16]}>
      {items.map((item, index) => (
        <Col key={index} xs={24} sm={12} md={8} lg={6}>
          <Card bordered={false}>
            <h3 style={{ margin: 0 }}>{item.title}</h3>
            <h2 style={{ margin: "10px 0" }}>{item.value}</h2>
            {item.description && (
              <p style={{ color: "#888" }}>{item.description}</p>
            )}
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default AdminCard;
