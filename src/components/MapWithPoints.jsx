import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import "../assets/styles/MapWithPoints.css";
import {Tooltip} from 'react-leaflet/Tooltip';
import { getCollection } from '../firebase/firebase.js';
import schools from "../enums/Schools.json";
import languages from "../enums/Languages.json";
import races from "../enums/Races.json";
import Select from "react-select";
import { getCurrentUser } from "../utils/sessionUser.js";

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
              race:driver.race,
              languages: driver.languages || []
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

    const currentUser = getCurrentUser();
    const parentId = currentUser?.uid;

    if (!parentId) {
      alert("Please log in to chat with a driver.");
      navigate("/login");
      return;
    }

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
    if (!value || (Array.isArray(value) && value.length === 0)) return true;

    const pointValue = point[key];

    // If point value is an array (e.g., supported schools or languages)
    if (Array.isArray(pointValue)) {
      if (Array.isArray(value)) {
        // Check if any filter value exists in pointValue
        return value.some((filterVal) =>
          pointValue.some((v) => v.toLowerCase() === filterVal.toLowerCase())
        );
      } else {
        return pointValue.some((v) =>
          v.toLowerCase().includes(value.toLowerCase())
        );
      }
    }

    // Point value is a string/number
    if (Array.isArray(value)) {
      return value.some((v) =>
        String(pointValue).toLowerCase().includes(v.toLowerCase())
      );
    } else {
      return String(pointValue).toLowerCase().includes(value.toLowerCase());
    }
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
         onApply={(newFilters) => setAppliedFilters(newFilters || filters)}
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

              <p><strong>Vehicle Type:</strong> {selectedPoint.vehicle}</p>
              <p><strong>Supported Schools:</strong> {selectedPoint.schools.join(", ")}</p>
              <p><strong>Vehicle Capacity:</strong> {selectedPoint.max_passengers}</p>
              <p><strong>Available Seats:</strong> {selectedPoint.available_seats}</p>
              <p><strong>Price per month:</strong> R{selectedPoint.price}</p>
              <p><strong>Race:</strong> {selectedPoint.race}</p>
              <p><strong>Languages:</strong> {selectedPoint.languages.join(", ")}</p>
              

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

  const handleReset = () => {
    setFilters({});
     onApply({});
    };

  //convert JSON arrays to react-select options
  const toOptions = (arr) => arr.map((item) => ({ label: item, value: item }));

  // vehicle types
  const vehicleOptions = [
    { label: "Sedan", value: "Sedan" },
    { label: "SUV", value: "SUV" },
    { label: "Minibus", value: "Minibus" },
  ];

  const selectStyles = {
    container: (base) => ({ ...base, minWidth: 150 }),
    menuPortal: (base) => ({ ...base, zIndex: 9999 }), // dropdown above map
  };

  return (
    <div className="filterBar">
      {/* Vehicle */}
      <Select
        isMulti
        placeholder="VEHICLE"
        options={vehicleOptions}
        value={filters.vehicle ? { label: filters.vehicle, value: filters.vehicle } : null}
        onChange={(selected) => handleChange("vehicle", selected?.value || "")}
        menuPortalTarget={document.body}
        menuPosition="fixed"
        styles={selectStyles}
      />

      {/* Schools multi-select */}
      <Select
        isMulti
        placeholder="SCHOOLS"
        options={toOptions(schools)}
        value={filters.schools?.map((s) => ({ label: s, value: s })) || []}
        onChange={(selected) =>
          handleChange("schools", selected ? selected.map((s) => s.value) : [])
        }
        menuPortalTarget={document.body}
        menuPosition="fixed"
        styles={selectStyles}
      />

      {/* Languages single-select */}
      <Select
        isMulti
        placeholder="LANGUAGE"
        options={toOptions(languages)}
        value={filters.languages?.map((l) => ({ label: l, value: l })) || []}
        onChange={(selected) =>
          handleChange("languages", selected ? selected.map((l) => l.value) : [])
        }
        menuPortalTarget={document.body}
        menuPosition="fixed"
        styles={selectStyles}
      />

      {/* Races single-select */}
      <Select
        placeholder="RACE"
        options={toOptions(races)}
        value={filters.race ? { label: filters.race, value: filters.race } : null}
        onChange={(selected) => handleChange("race", selected?.value || "")}
        menuPortalTarget={document.body}
        menuPosition="fixed"
        styles={selectStyles}
      />

      {/* Max passengers */}
      <input
        type="number"
        placeholder="MAX PASSENGERS"
        value={filters.max_passengers || ""}
        onChange={(e) => handleChange("max_passengers", e.target.value)}
      />

      {/* Available seats */}
      <input
        type="number"
        placeholder="AVAILABLE SEATS"
        value={filters.available_seats || ""}
        onChange={(e) => handleChange("available_seats", e.target.value)}
      />

      {/* Buttons */}
      <button onClick={onApply}>Filter</button>
      <button onClick={handleReset}>Reset</button>
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
