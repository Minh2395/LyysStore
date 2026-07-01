"use client";

import { useEffect, useState } from "react";
import "../../static/css/news/news.content.css";

interface INews {
  id: string;
  title: string;
  description: string;
  image: string;
  url: string;
  publishedAt: string;
  source: {
    name: string;
  };
}

export default function NewsContent() {
  const [news, setNews] = useState<INews[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/news`,
        );

        const result = await res.json();

        setNews(Array.isArray(result?.data) ? result.data : []);
      } catch (error) {
        console.error("Fetch news error:", error);
        setNews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return <div className="news-loading">Đang tải tin tức...</div>;
  }

  return (
    <div className="news-page">
      <div className="news-header">
        <h1>FASHION & EYEWEAR NEWS</h1>
        <p>Cập nhật xu hướng kính mắt, thời trang và người mẫu mới nhất</p>
      </div>

      <div className="news-grid">
        {news.map((item) => (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="news-card"
          >
            <div className="news-image">
              <img
                src={item.image || "/images/no-image.jpg"}
                alt={item.title}
              />
            </div>

            <div className="news-body">
              <span className="news-source">{item.source?.name}</span>

              <h3>{item.title}</h3>

              <p>{item.description}</p>

              <div className="news-date">
                {new Date(item.publishedAt).toLocaleDateString("vi-VN")}
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
