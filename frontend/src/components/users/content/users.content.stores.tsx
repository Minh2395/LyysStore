"use client";

import { useEffect, useState } from "react";
import "../../../static/css/map/map.css";

export default function UsersContentStores() {
  const [stores, setStores] = useState<any[]>([]);
  const [selectedStore, setSelectedStore] = useState<any>(null);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/stores`,
        );
        const json = await res.json();

        // 🔥 CHECK AN TOÀN
        const storesData = json?.data;

        if (!Array.isArray(storesData)) {
          console.error("Invalid API response:", json);
          return;
        }

        setStores(storesData);

        if (storesData.length > 0) {
          setSelectedStore(storesData[0]);
        }
      } catch (err) {
        console.error("Error loading stores:", err);
      }
    };

    fetchStores();
  }, []);

  const mapUrl = selectedStore
    ? `https://maps.google.com/maps?q=${encodeURIComponent(
        selectedStore.address,
      )}&t=&z=16&output=embed`
    : "";

  return (
    <div className="store-layout">
      {/* LEFT */}
      <div className="store-list">
        <h2 className="store-title">Danh sách cửa hàng Lyys Store</h2>

        {stores.map((store) => {
          const isActive = selectedStore?._id === store._id;

          return (
            <div
              key={store._id}
              onClick={() => setSelectedStore(store)}
              className={`store-card ${isActive ? "active" : ""}`}
            >
              <h4 className="store-name">{store.name}</h4>
              <p className="store-text">📍 {store.address}</p>
              <p className="store-text">📞 {store.phone}</p>
            </div>
          );
        })}
      </div>

      {/* RIGHT */}
      <div className="store-map">
        {selectedStore ? (
          <iframe
            width="100%"
            height="100%"
            src={mapUrl}
            loading="lazy"
            className="map-frame"
          />
        ) : (
          <div className="map-empty">No store selected</div>
        )}
      </div>
    </div>
  );
}
