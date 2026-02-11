import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import "../assets/styles/MapWithPoints.css";
import {Tooltip} from 'react-leaflet/Tooltip';
import {getDocumentsByField,getCollection} from '../firebase/firebase.js';

const styles = {
container: {
display: "flex",
justifyContent: "center",
width: "100%",
maxWidth: "600px",
margin: "0 auto",
},
scrollArea: {
height: "500px", // 👈 controls how tall the scroll area is
overflowY: "auto",
paddingRight: "8px",
width: "100%",
},
card: {
backgroundColor: "#fff",
borderRadius: "10px",
boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
padding: "15px",
marginBottom: "15px",
},
header: {
display: "flex",
justifyContent: "space-between",
alignItems: "center",
marginBottom: "5px",
},
name: {
margin: 0,
fontSize: "16px",
fontWeight: "600",
},
driverId: {
fontSize: "12px",
color: "#888",
},
comment: {
marginTop: "5px",
fontSize: "14px",
},
timestamp: {
display: "block",
marginTop: "5px",
fontSize: "12px",
color: "#777",
},
};

export default function MapWithPoints() {
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [map, setMap] = useState(null);
  const [points, setPoints] = useState([]);
  const [filters, setFilters] = useState({});
  const [appliedFilters, setAppliedFilters] = useState({});
  const [hoveredDriver, setHoveredDriver] = useState(null);
  const navigate = useNavigate();

  /* ---------------- FETCH DATA ---------------- */
  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const drivers = await getCollection("drivers");
        const users = await getCollection("users");

        console.log("drivers:", drivers);
        console.log("users:", users);
        
        const merged = drivers
          .map((driver) => {
            const user = users.find((u) => u.uid === driver.uid);
            if (!user || !user.locationSet) return null;

            return {
              id: driver.uid,
              lat: user.latitude,
              lng: user.longitude,
              name: `${user.firstName} ${user.lastName}`,
              profilePic: user.image64,
              vehicle: driver.vehicleType,
              schools: driver.supportedSchools || [],
              max_passengers: driver.vehicleCapacity,
              available_seats: driver.availableSeats,
              price: driver.pricePerMonth,
            };
          })
          .filter(Boolean);

        setPoints(merged);
        console.log(points)
      } catch (err) {
        console.error("Error loading drivers:", err);
      }
    };

    fetchDrivers();
  }, []);

  /* ---------------- MAP FLY ---------------- */
  useEffect(() => {
    if (map && selectedPoint) {
      map.flyTo([selectedPoint.lat, selectedPoint.lng], 13, {
        duration: 1.5,
      });
    }
  }, [selectedPoint, map]);

  /* ---------------- ACTIONS ---------------- */
  const handleMessageDriver = () => {
    if (!selectedPoint) return;
    const parentId = "Parent123";
    navigate(`/messagedriver/${selectedPoint.id}/${parentId}`, {
      state: { role: "parent", userId: parentId },
    });
  };

  const handleReportDriver = () => {
    if (!selectedPoint) return;
    navigate(`/reportdriver/${selectedPoint.id}`, {
      state: { driver: selectedPoint },
    });
  };

  /* ---------------- FILTERING ---------------- */
  const filteredPoints = points.filter((point) => {
    return Object.entries(appliedFilters).every(([key, value]) => {
      if (!value) return true;
      const pointValue = point[key];

      if (Array.isArray(pointValue)) {
        return pointValue.some((v) =>
          v.toLowerCase().includes(value.toLowerCase())
        );
      }
      return String(pointValue)
        .toLowerCase()
        .includes(value.toLowerCase());
    });
  });

  const buttonStyle = {
    marginTop: "0.5rem",
    padding: "8px 12px",
    borderRadius: 6,
    border: "none",
    backgroundColor: "#000",
    color: "#fff",
    cursor: "pointer",
    width: "60%",
  };

  return (
    <div style={{ padding: "1rem" }}>
      <FilterBar
        filters={filters}
        setFilters={setFilters}
        onApply={() => setAppliedFilters(filters)}
      />

      <div style={{ display: "flex", gap: "1rem" }}>
        {/* ---------------- MAP ---------------- */}
        <div style={{ flex: 1 }}>
          <MapContainer
            center={[-33.92, 18.42]}
            zoom={13}
            style={{ height: 400, borderRadius: 8 }}
            whenCreated={setMap}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {filteredPoints.map((point) => (
              <Marker
                key={point.id}
                position={[point.lat, point.lng]}
                eventHandlers={{
                  click: () => setSelectedPoint(point),
                  mouseover: () => setHoveredDriver(point),
                  mouseout: () => setHoveredDriver(null),
                }}
              >
                <Tooltip
                  direction="top"
                  offset={[0, -10]}
                  opacity={1}
                  permanent={hoveredDriver?.id === point.id}
                >
                  <DriverCard
                    name={point.name}
                    profilePic={point.profilePic}
                  />
                </Tooltip>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* ---------------- DETAIL PANEL ---------------- */}
        <div
          style={{
            flex: 1,
            border: "1px solid #ccc",
            padding: "1.5rem",
            borderRadius: 8,
          }}
        >
          {selectedPoint ? (
            <>
              <img
                src={selectedPoint.profilePic}
                alt={selectedPoint.name}
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "3px solid #000",
                }}
              />
              <h3>{selectedPoint.name}</h3>

              <p><strong>Vehicle:</strong> {selectedPoint.vehicle}</p>
              <p><strong>Schools:</strong> {selectedPoint.schools.join(", ")}</p>
              <p><strong>Vehicle Capacity:</strong> {selectedPoint.max_passengers}</p>
              <p><strong>Available Seats:</strong> {selectedPoint.available_seats}</p>
              <p><strong>Price / Month:</strong> R{selectedPoint.price}</p>
              <p><strong>Latitude:</strong> {selectedPoint.lat}</p>
              <p><strong>Longitude:</strong> {selectedPoint.lng}</p>

              <button onClick={handleMessageDriver} style={buttonStyle}>
                Message Driver
              </button>
              <br />
              <button onClick={handleReportDriver} style={buttonStyle}>
                Report Driver
              </button>
            </>
          ) : (
            <p>Select a driver to view details</p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------- FILTER BAR ---------------- */
function FilterBar({ filters, setFilters, onApply }) {
  const handleChange = (field, value) =>
    setFilters((prev) => ({ ...prev, [field]: value }));

  return (
    <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
      {["vehicle", "schools", "max_passengers", "available_seats"].map(
        (field) => (
          <input
            key={field}
            type="text"
            placeholder={field.replace("_", " ").toUpperCase()}
            value={filters[field] || ""}
            onChange={(e) => handleChange(field, e.target.value)}
          />
        )
      )}
      <button onClick={onApply}>Filter</button>
    </div>
  );
}

/* ---------------- DRIVER CARD ---------------- */
function DriverCard({ name, profilePic }) {
  return (
    <div style={{ display: "flex", gap: 8 }}>
      <img
        src={profilePic}
        alt={name}
        style={{ width: 30, height: 30, borderRadius: "50%" }}
      />
      <span>{name}</span>
    </div>
  );
}

