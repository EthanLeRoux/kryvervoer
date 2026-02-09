import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import "../assets/styles/MapWithPoints.css";
import {Tooltip} from 'react-leaflet/Tooltip';
import {getDocumentsByField} from '../firebase/firebase.js';

const points = [
  { id: 1, name: 'John Doe', lat: -33.9249, lng: 18.4241, status: 'Available', schools: ['Groote Schuur High'], vehicle: 'Renault Clio', languages: ['English','Afrikaans'], criminal_record: true, max_passengers: 2, gender: 'male', race: 'coloured', available_seats: 1, profilePic: 'https://randomuser.me/api/portraits/men/1.jpg' },
  { id: 2, name: 'Lebo Mokoena', lat: -33.9180, lng: 18.4210, status: 'Unavailable', schools: ['Claremont High'], vehicle: 'Toyota Quantum', languages: ['Zulu','English'], criminal_record: false, max_passengers: 12, gender: 'male', race: 'black', available_seats: 0, profilePic: 'https://randomuser.me/api/portraits/men/2.jpg' },
  { id: 3, name: 'Fatima Jacobs', lat: -33.9122, lng: 18.4321, status: 'Available', schools: ['South Peninsula High'], vehicle: 'Nissan Almera', languages: ['English'], criminal_record: false, max_passengers: 4, gender: 'female', race: 'coloured', available_seats: 2, profilePic: 'https://randomuser.me/api/portraits/women/3.jpg' },
  { id: 4, name: 'Ahmed Khan', lat: -33.9300, lng: 18.4500, status: 'Available', schools: ['Windsor High'], vehicle: 'Hyundai H1', languages: ['English','Arabic'], criminal_record: false, max_passengers: 8, gender: 'male', race: 'indian', available_seats: 5, profilePic: 'https://randomuser.me/api/portraits/men/4.jpg' },
  { id: 5, name: 'Sipho Dlamini', lat: -33.9400, lng: 18.4600, status: 'Unavailable', schools: ['Livingstone High'], vehicle: 'Ford Transit', languages: ['Xhosa','English'], criminal_record: false, max_passengers: 10, gender: 'male', race: 'black', available_seats: 0, profilePic: 'https://randomuser.me/api/portraits/men/5.jpg' },
  { id: 6, name: 'Nicole Smith', lat: -33.9350, lng: 18.4250, status: 'Available', schools: ['Plumstead High'], vehicle: 'VW Polo', languages: ['English'], criminal_record: false, max_passengers: 3, gender: 'female', race: 'white', available_seats: 1, profilePic: 'https://randomuser.me/api/portraits/women/6.jpg' },
  { id: 7, name: 'Tshepo Moloi', lat: -33.9275, lng: 18.4350, status: 'Available', schools: ['Heideveld High'], vehicle: 'Mazda 2', languages: ['Sotho','English'], criminal_record: true, max_passengers: 4, gender: 'male', race: 'black', available_seats: 2, profilePic: 'https://randomuser.me/api/portraits/men/7.jpg' },
  { id: 8, name: 'Zainab Parker', lat: -33.9170, lng: 18.4190, status: 'Unavailable', schools: ['Belgravia High'], vehicle: 'Chevrolet Aveo', languages: ['English','Afrikaans'], criminal_record: false, max_passengers: 4, gender: 'female', race: 'coloured', available_seats: 0, profilePic: 'https://randomuser.me/api/portraits/women/8.jpg' },
  { id: 9, name: 'Mohammed Patel', lat: -33.9210, lng: 18.4270, status: 'Available', schools: ['Islamia College'], vehicle: 'Toyota Corolla', languages: ['English','Urdu'], criminal_record: false, max_passengers: 4, gender: 'male', race: 'indian', available_seats: 3, profilePic: 'https://randomuser.me/api/portraits/men/9.jpg' },
  { id: 10, name: 'Thandiwe Ndlovu', lat: -33.9260, lng: 18.4220, status: 'Available', schools: ['Spine Road High'], vehicle: 'Kia Picanto', languages: ['Zulu','English'], criminal_record: false, max_passengers: 4, gender: 'female', race: 'black', available_seats: 1, profilePic: 'https://randomuser.me/api/portraits/women/10.jpg' },
  
  { id: 11, name: 'Alice van der Merwe', lat: -33.9185, lng: 18.4300, status: 'Available', schools: ['Rondebosch Primary'], vehicle: 'Toyota Yaris', languages: ['English'], criminal_record: false, max_passengers: 3, gender: 'female', race: 'white', available_seats: 2, profilePic: 'https://randomuser.me/api/portraits/women/11.jpg' },
  { id: 12, name: 'Brian Nkosi', lat: -33.9220, lng: 18.4400, status: 'Unavailable', schools: ['Kensington Primary'], vehicle: 'Ford Fiesta', languages: ['Zulu','English'], criminal_record: false, max_passengers: 4, gender: 'male', race: 'black', available_seats: 0, profilePic: 'https://randomuser.me/api/portraits/men/12.jpg' },
  { id: 13, name: 'Carla Botha', lat: -33.9150, lng: 18.4350, status: 'Available', schools: ['Sea Point Primary'], vehicle: 'VW Golf', languages: ['English','Afrikaans'], criminal_record: false, max_passengers: 3, gender: 'female', race: 'coloured', available_seats: 2, profilePic: 'https://randomuser.me/api/portraits/women/13.jpg' },
  { id: 14, name: 'Daniel Abrahams', lat: -33.9205, lng: 18.4215, status: 'Available', schools: ['Wynberg Primary'], vehicle: 'Nissan Micra', languages: ['English'], criminal_record: true, max_passengers: 2, gender: 'male', race: 'white', available_seats: 1, profilePic: 'https://randomuser.me/api/portraits/men/14.jpg' },
  { id: 15, name: 'Eliza Mthethwa', lat: -33.9188, lng: 18.4280, status: 'Unavailable', schools: ['Cape Town Primary'], vehicle: 'Hyundai i20', languages: ['Xhosa','English'], criminal_record: false, max_passengers: 4, gender: 'female', race: 'black', available_seats: 0, profilePic: 'https://randomuser.me/api/portraits/women/15.jpg' },
  { id: 16, name: 'Farouk Essop', lat: -33.9250, lng: 18.4370, status: 'Available', schools: ['Belgravia Primary'], vehicle: 'Toyota Corolla', languages: ['English'], criminal_record: false, max_passengers: 4, gender: 'male', race: 'indian', available_seats: 2, profilePic: 'https://randomuser.me/api/portraits/men/16.jpg' },
  { id: 17, name: 'Grace Petersen', lat: -33.9300, lng: 18.4300, status: 'Available', schools: ['Claremont Primary'], vehicle: 'Ford Focus', languages: ['English','Afrikaans'], criminal_record: false, max_passengers: 3, gender: 'female', race: 'coloured', available_seats: 1, profilePic: 'https://randomuser.me/api/portraits/women/17.jpg' },
  { id: 18, name: 'Hassan Khan', lat: -33.9320, lng: 18.4220, status: 'Unavailable', schools: ['Islamia Primary'], vehicle: 'VW Polo', languages: ['English','Urdu'], criminal_record: true, max_passengers: 4, gender: 'male', race: 'indian', available_seats: 0, profilePic: 'https://randomuser.me/api/portraits/men/18.jpg' },
  { id: 19, name: 'Isabella Jacobs', lat: -33.9190, lng: 18.4250, status: 'Available', schools: ['South Peninsula Primary'], vehicle: 'Renault Clio', languages: ['English'], criminal_record: false, max_passengers: 2, gender: 'female', race: 'white', available_seats: 2, profilePic: 'https://randomuser.me/api/portraits/women/19.jpg' },
  { id: 20, name: 'Jason Naidoo', lat: -33.9215, lng: 18.4190, status: 'Available', schools: ['Groote Schuur Primary'], vehicle: 'Nissan Micra', languages: ['English','Tamil'], criminal_record: false, max_passengers: 3, gender: 'male', race: 'indian', available_seats: 2, profilePic: 'https://randomuser.me/api/portraits/men/20.jpg' },
  
  { id: 21, name: 'Khomotso Molefe', lat: -33.9270, lng: 18.4180, status: 'Available', schools: ['Table View High'], vehicle: 'Ford Ranger', languages: ['Sotho','English'], criminal_record: false, max_passengers: 5, gender: 'male', race: 'black', available_seats: 3, profilePic: 'https://randomuser.me/api/portraits/men/21.jpg' },
  { id: 22, name: 'Lindsey van Wyk', lat: -33.9135, lng: 18.4230, status: 'Unavailable', schools: ['Sea Point High'], vehicle: 'VW Golf', languages: ['English','Afrikaans'], criminal_record: false, max_passengers: 3, gender: 'female', race: 'white', available_seats: 0, profilePic: 'https://randomuser.me/api/portraits/women/22.jpg' },
  { id: 23, name: 'Musa Khumalo', lat: -33.9285, lng: 18.4290, status: 'Available', schools: ['Khayelitsha High'], vehicle: 'Toyota Hilux', languages: ['Zulu','English'], criminal_record: true, max_passengers: 4, gender: 'male', race: 'black', available_seats: 2, profilePic: 'https://randomuser.me/api/portraits/men/23.jpg' },
  { id: 24, name: 'Nadia Petersen', lat: -33.9160, lng: 18.4310, status: 'Available', schools: ['Claremont High'], vehicle: 'Hyundai Accent', languages: ['English','Afrikaans'], criminal_record: false, max_passengers: 3, gender: 'female', race: 'coloured', available_seats: 2, profilePic: 'https://randomuser.me/api/portraits/women/24.jpg' },
  { id: 25, name: 'Omar Patel', lat: -33.9310, lng: 18.4380, status: 'Unavailable', schools: ['Islamia College'], vehicle: 'Toyota Corolla', languages: ['English','Urdu'], criminal_record: true, max_passengers: 4, gender: 'male', race: 'indian', available_seats: 0, profilePic: 'https://randomuser.me/api/portraits/men/25.jpg' },
  { id: 26, name: 'Patricia Smith', lat: -33.9200, lng: 18.4260, status: 'Available', schools: ['Plumstead High'], vehicle: 'Ford Fiesta', languages: ['English'], criminal_record: false, max_passengers: 3, gender: 'female', race: 'white', available_seats: 2, profilePic: 'https://randomuser.me/api/portraits/women/26.jpg' },
  { id: 27, name: 'Quinton Daniels', lat: -33.9240, lng: 18.4330, status: 'Available', schools: ['Heideveld High'], vehicle: 'Mazda 3', languages: ['English','Sotho'], criminal_record: false, max_passengers: 4, gender: 'male', race: 'black', available_seats: 3, profilePic: 'https://randomuser.me/api/portraits/men/27.jpg' },
  { id: 28, name: 'Riana Botha', lat: -33.9182, lng: 18.4205, status: 'Unavailable', schools: ['Belgravia High'], vehicle: 'VW Polo', languages: ['English','Afrikaans'], criminal_record: false, max_passengers: 3, gender: 'female', race: 'coloured', available_seats: 0, profilePic: 'https://randomuser.me/api/portraits/women/28.jpg' },
  { id: 29, name: 'Sibusiso Dlamini', lat: -33.9290, lng: 18.4240, status: 'Available', schools: ['Livingstone High'], vehicle: 'Ford Ranger', languages: ['Zulu','English'], criminal_record: false, max_passengers: 5, gender: 'male', race: 'black', available_seats: 4, profilePic: 'https://randomuser.me/api/portraits/men/29.jpg' },
  { id: 30, name: 'Tanya Jacobs', lat: -33.9175, lng: 18.4325, status: 'Available', schools: ['South Peninsula High'], vehicle: 'Toyota Corolla', languages: ['English'], criminal_record: false, max_passengers: 4, gender: 'female', race: 'coloured', available_seats: 2, profilePic: 'https://randomuser.me/api/portraits/women/30.jpg' },
  
  // IDs 31-50
  { id: 31, name: 'Umar Essop', lat: -33.9225, lng: 18.4410, status: 'Unavailable', schools: ['Windsor High'], vehicle: 'Hyundai H1', languages: ['English','Arabic'], criminal_record: false, max_passengers: 8, gender: 'male', race: 'indian', available_seats: 0, profilePic: 'https://randomuser.me/api/portraits/men/31.jpg' },
  { id: 32, name: 'Valerie Smith', lat: -33.9230, lng: 18.4270, status: 'Available', schools: ['Plumstead High'], vehicle: 'VW Polo', languages: ['English'], criminal_record: false, max_passengers: 3, gender: 'female', race: 'white', available_seats: 2, profilePic: 'https://randomuser.me/api/portraits/women/32.jpg' },
  { id: 33, name: 'Winston Mbatha', lat: -33.9265, lng: 18.4300, status: 'Available', schools: ['Heideveld High'], vehicle: 'Mazda 2', languages: ['Sotho','English'], criminal_record: true, max_passengers: 4, gender: 'male', race: 'black', available_seats: 2, profilePic: 'https://randomuser.me/api/portraits/men/33.jpg' },
  { id: 34, name: 'Xolani Dube', lat: -33.9195, lng: 18.4185, status: 'Unavailable', schools: ['Kensington Primary'], vehicle: 'Ford Fiesta', languages: ['Zulu','English'], criminal_record: false, max_passengers: 4, gender: 'male', race: 'black', available_seats: 0, profilePic: 'https://randomuser.me/api/portraits/men/34.jpg' },
  { id: 35, name: 'Yasmin Parker', lat: -33.9183, lng: 18.4245, status: 'Available', schools: ['Belgravia High'], vehicle: 'Chevrolet Aveo', languages: ['English','Afrikaans'], criminal_record: false, max_passengers: 4, gender: 'female', race: 'coloured', available_seats: 2, profilePic: 'https://randomuser.me/api/portraits/women/35.jpg' },
  { id: 36, name: 'Zane Patel', lat: -33.9212, lng: 18.4250, status: 'Available', schools: ['Islamia College'], vehicle: 'Toyota Corolla', languages: ['English','Urdu'], criminal_record: false, max_passengers: 4, gender: 'male', race: 'indian', available_seats: 3, profilePic: 'https://randomuser.me/api/portraits/men/36.jpg' },
  { id: 37, name: 'Amber Smith', lat: -33.9178, lng: 18.4328, status: 'Available', schools: ['Sea Point Primary'], vehicle: 'Renault Clio', languages: ['English'], criminal_record: false, max_passengers: 2, gender: 'female', race: 'white', available_seats: 2, profilePic: 'https://randomuser.me/api/portraits/women/37.jpg' },
  { id: 38, name: 'Bradley Nkosi', lat: -33.9248, lng: 18.4222, status: 'Available', schools: ['Table View High'], vehicle: 'Toyota Hilux', languages: ['Zulu','English'], criminal_record: true, max_passengers: 5, gender: 'male', race: 'black', available_seats: 3, profilePic: 'https://randomuser.me/api/portraits/men/38.jpg' },
  { id: 39, name: 'Carmen Botha', lat: -33.9152, lng: 18.4312, status: 'Unavailable', schools: ['Claremont Primary'], vehicle: 'VW Golf', languages: ['English','Afrikaans'], criminal_record: false, max_passengers: 3, gender: 'female', race: 'coloured', available_seats: 0, profilePic: 'https://randomuser.me/api/portraits/women/39.jpg' },
  { id: 40, name: 'Dumisani Dlamini', lat: -33.9302, lng: 18.4390, status: 'Available', schools: ['Livingstone High'], vehicle: 'Ford Ranger', languages: ['Zulu','English'], criminal_record: false, max_passengers: 5, gender: 'male', race: 'black', available_seats: 4, profilePic: 'https://randomuser.me/api/portraits/men/40.jpg' },
  { id: 41, name: 'Elena Jacobs', lat: -33.9174, lng: 18.4335, status: 'Available', schools: ['South Peninsula High'], vehicle: 'Toyota Corolla', languages: ['English'], criminal_record: false, max_passengers: 4, gender: 'female', race: 'coloured', available_seats: 2, profilePic: 'https://randomuser.me/api/portraits/women/41.jpg' },
  { id: 42, name: 'Fahad Essop', lat: -33.9236, lng: 18.4360, status: 'Unavailable', schools: ['Windsor High'], vehicle: 'Hyundai H1', languages: ['English','Arabic'], criminal_record: false, max_passengers: 8, gender: 'male', race: 'indian', available_seats: 0, profilePic: 'https://randomuser.me/api/portraits/men/42.jpg' },
  { id: 43, name: 'Gloria Smith', lat: -33.9312, lng: 18.4265, status: 'Available', schools: ['Plumstead High'], vehicle: 'VW Polo', languages: ['English'], criminal_record: false, max_passengers: 3, gender: 'female', race: 'white', available_seats: 2, profilePic: 'https://randomuser.me/api/portraits/women/43.jpg' },
  { id: 44, name: 'Hendrik Daniels', lat: -33.9273, lng: 18.4375, status: 'Available', schools: ['Heideveld High'], vehicle: 'Mazda 2', languages: ['English','Sotho'], criminal_record: false, max_passengers: 4, gender: 'male', race: 'black', available_seats: 2, profilePic: 'https://randomuser.me/api/portraits/men/44.jpg' },
  { id: 45, name: 'Imani Dube', lat: -33.9198, lng: 18.4195, status: 'Unavailable', schools: ['Kensington Primary'], vehicle: 'Ford Fiesta', languages: ['Zulu','English'], criminal_record: false, max_passengers: 4, gender: 'female', race: 'black', available_seats: 0, profilePic: 'https://randomuser.me/api/portraits/women/45.jpg' },
  { id: 46, name: 'Jamal Parker', lat: -33.9181, lng: 18.4275, status: 'Available', schools: ['Belgravia High'], vehicle: 'Chevrolet Aveo', languages: ['English','Afrikaans'], criminal_record: false, max_passengers: 4, gender: 'male', race: 'coloured', available_seats: 3, profilePic: 'https://randomuser.me/api/portraits/men/46.jpg' },
  { id: 47, name: 'Karla Patel', lat: -33.9218, lng: 18.4232, status: 'Available', schools: ['Islamia College'], vehicle: 'Toyota Corolla', languages: ['English','Urdu'], criminal_record: false, max_passengers: 4, gender: 'female', race: 'indian', available_seats: 3, profilePic: 'https://randomuser.me/api/portraits/women/47.jpg' },
  { id: 48, name: 'Lance Smith', lat: -33.9172, lng: 18.4322, status: 'Available', schools: ['Sea Point Primary'], vehicle: 'Renault Clio', languages: ['English'], criminal_record: false, max_passengers: 2, gender: 'male', race: 'white', available_seats: 2, profilePic: 'https://randomuser.me/api/portraits/men/48.jpg' },
  { id: 49, name: 'Megan Nkosi', lat: -33.9255, lng: 18.4205, status: 'Available', schools: ['Table View High'], vehicle: 'Toyota Hilux', languages: ['Zulu','English'], criminal_record: false, max_passengers: 5, gender: 'female', race: 'black', available_seats: 3, profilePic: 'https://randomuser.me/api/portraits/women/49.jpg' },
  { id: 50, name: 'Nico Botha', lat: -33.9155, lng: 18.4305, status: 'Available', schools: ['Claremont Primary'], vehicle: 'VW Golf', languages: ['English','Afrikaans'], criminal_record: false, max_passengers: 3, gender: 'male', race: 'coloured', available_seats: 2, profilePic: 'https://randomuser.me/api/portraits/men/50.jpg' },
];

const ReviewsList = ({ reviews }) => {
// Helper to render stars
const renderStars = (rating) => {
return (
<div style={{ color: "#f5c518" }}>
{Array.from({ length: 5 }, (_, i) => ( <span key={i}>{i < rating ? "★" : "☆"}</span>
))} </div>
);
};

const formatTimestamp = (timestamp) => {
if (!timestamp?.seconds) return "N/A";
const date = new Date(timestamp.seconds * 1000);
return date.toLocaleString();
};

return ( <div style={styles.container}> <div style={styles.scrollArea}>
{reviews.map((review) => ( <div key={review.id} style={styles.card}> <div style={styles.header}> <h3 style={styles.name}>{review.driverName}</h3> <span style={styles.driverId}>ID: {review.driverId}</span> </div>
{renderStars(review.rating)} <p style={styles.comment}>{review.comment}</p> <small style={styles.timestamp}>
{formatTimestamp(review.timestamp)} </small> </div>
))} </div> </div>
);
};

// 💅 Inline styles
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

// const styles = {
//   container: {
//     display: "flex",
//     flexDirection: "column",
//     gap: "15px",
//     padding: "20px",
//   },
//   card: {
//     border: "1px solid #ddd",
//     borderRadius: "10px",
//     padding: "15px",
//     backgroundColor: "#fff",
//     boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
//   },
//   name: {
//     marginBottom: "5px",
//   },
//   comment: {
//     margin: "8px 0",
//     fontStyle: "italic",
//   },
//   timestamp: {
//     color: "#777",
//   },
// };

export default function MapWithPoints() {
    const [selectedPoint, setSelectedPoint] = useState(null);
    const [map, setMap] = useState(null);
    const [filters, setFilters] = useState({});
    const [appliedFilters, setAppliedFilters] = useState({});
    const navigate = useNavigate();
    const [hoveredDriver, setHoveredDriver] = useState(null);
    const [driverId,setDriverId] = useState(null);
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        if (map && selectedPoint) {
            map.flyTo([selectedPoint.lat, selectedPoint.lng], 13, { duration: 1.5 });
        }
    }, [selectedPoint, map]);

    useEffect(() => {
        const fetchedReviews = async ()=>{
            const response = await getDocumentsByField('driver-reviews', 'driverId', selectedPoint?.id || 0);
        console.log("Fetched reviews for driver:", response);
        setReviews(response);
        }
        fetchedReviews();
    }, [selectedPoint]);

    const handleReviewDriver = () => {
        if (selectedPoint) {
            navigate(`/reviews/${selectedPoint.id}`, { state: { driver: selectedPoint } });
        }
    };

useEffect(() => {
  console.log("Driver info updated:", selectedPoint);
}, [selectedPoint]);


    const handleMessageDriver = () => {
  if (!selectedPoint) return;
  const parentId= "Parent123"; 
  navigate(`/messagedriver/${selectedPoint.id}/${parentId}`, {
  state: { role: "parent", userId: parentId }
});
};

  const handleReportDriver = () => {
    if (selectedPoint) {
        console.log("Navigating to report driver:", selectedPoint);
        navigate(`/reportdriver/${selectedPoint.id}`, { 
            state: { 
                driver: selectedPoint 
            } 
        });
    }
};
    const filteredPoints = points.filter(point => {
        return Object.entries(appliedFilters).every(([key, value]) => {
            if (!value) return true;
            const pointValue = point[key];
            if (Array.isArray(pointValue)) {
                return pointValue.some(v => v.toString().toLowerCase().includes(value.toLowerCase()));
            }
            return String(pointValue).toLowerCase().includes(value.toLowerCase());
        });
    });

    // Improved button styles
    const buttonStyle = {
        marginTop: "0.5rem",
        padding: "8px 12px",
        borderRadius: "4px",
        border: "none",
        backgroundColor: "#000000",
        color: "#fff",
        cursor: "pointer",
        width: "60%",
        fontSize: "14px",
        fontWeight: "500",
        transition: "all 0.2s ease"
    };

    const buttonHoverStyle = {
        ...buttonStyle,
        backgroundColor: "#333333",
        transform: "translateY(-1px)"
    };

    return (
        <div style={{ padding: "1rem", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
            <FilterBar 
                filters={filters} 
                setFilters={setFilters} 
                onApply={() => setAppliedFilters(filters)} 
            />

            <div className="container" style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                <div className="leftColumn" style={{ flex: 1 }}>
                    <MapContainer
                        center={[-33.92, 18.42]}
                        zoom={13}
                        className="mapContainer"
                        style={{ height: 400, borderRadius: 8 }}
                        whenCreated={(mapInstance) => setMap(mapInstance)}
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
                    // <Marker
                    // key={point.id}
                    // position={[point.lat, point.lng]}
                    // eventHandlers={{
                    //     click: () => setSelectedPoint(point),
                    //     mouseover: () => setHoveredDriver(point),
                    //     mouseout: () => setHoveredDriver(null),
                    // }}
                    // >
                    // <Tooltip
                    //     direction="top"
                    //     offset={[0, -10]}
                    //     opacity={1}
                    //     permanent={hoveredDriver?.id === point.id} 
                    // >
                    //     <DriverCard
                    //     name={point.name}
                    //     profilePic={point.profilePic}
                    //     />
                    // </Tooltip>
                    // </Marker>


                        ))}
                    </MapContainer>

                    <ul style={{
                        listStyle: "none",
                        padding: 0,
                        marginTop: "1rem",
                        maxHeight: 200,
                        overflowY: "auto",
                        border: "1px solid #ccc",
                        borderRadius: 8,
                        backgroundColor: "#f9f9f9",
                    }}>
                        {filteredPoints.map((point) => (
                            <li
                                key={point.id}
                                onClick={() => setSelectedPoint(point)}
                                style={{
                                    cursor: "pointer",
                                    padding: "0.5rem 1rem",
                                    marginBottom: "0.5rem",
                                    backgroundColor: selectedPoint?.id === point.id ? "#e0f7fa" : "#f5f5f5",
                                    borderRadius: 8,
                                    display: "flex",
                                    alignItems: "center",
                                    fontWeight: selectedPoint?.id === point.id ? 700 : 600,
                                    color: selectedPoint?.id === point.id ? "#007acc" : "#444",
                                }}
                            >
                                <img
                                    src={point.profilePic}
                                    alt={point.name}
                                    style={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: "50%",
                                        marginRight: 12,
                                        objectFit: "cover",
                                        border: "2px solid #007acc",
                                    }}
                                />
                                <div>
                                    <div>{point.name}</div>
                                    <div style={{ fontSize: "0.9rem", fontWeight: 400, color: "#555" }}>
                                        {point.vehicle}
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="detailView" style={{
                    flex: 1,
                    border: "1px solid #ccc",
                    padding: "1.5rem",
                    borderRadius: 8,
                    backgroundColor: "#fdfdfd",
                    minWidth: 300,
                }}>
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
                                    marginBottom: "1rem",
                                }}
                            />
                            <h3 style={{ marginBottom: "1rem" }}>{selectedPoint.name}</h3>
                            <p><strong>Driver ID:</strong> {selectedPoint.id}</p>
                            <p><strong>Status:</strong> {selectedPoint.status}</p>
                            <p><strong>Vehicle:</strong> {selectedPoint.vehicle}</p>
                            <p><strong>Schools:</strong> {selectedPoint.schools.join(", ")}</p>
                            <p><strong>Languages:</strong> {selectedPoint.languages.join(", ")}</p>
                            <p><strong>Criminal Record:</strong> {selectedPoint.criminal_record ? "Yes" : "No"}</p>
                            <p><strong>Max Passengers:</strong> {selectedPoint.max_passengers}</p>
                            <p><strong>Available Seats:</strong> {selectedPoint.available_seats}</p>
                            <p><strong>Gender:</strong> {selectedPoint.gender}</p>
                            <p><strong>Race:</strong> {selectedPoint.race}</p>
                            <p><strong>Latitude:</strong> {selectedPoint.lat}</p>
                            <p><strong>Longitude:</strong> {selectedPoint.lng}</p>
                            
                            <div style={{ marginTop: "1.5rem" }}>
                                <button 
                                    onClick={handleReviewDriver} 
                                    style={buttonStyle}
                                    onMouseOver={(e) => Object.assign(e.target.style, buttonHoverStyle)}
                                    onMouseOut={(e) => Object.assign(e.target.style, buttonStyle)}
                                >
                                    Review Driver
                                </button>
                                
                                <button 
                                    onClick={handleMessageDriver} 
                                    style={buttonStyle}
                                    onMouseOver={(e) => Object.assign(e.target.style, buttonHoverStyle)}
                                    onMouseOut={(e) => Object.assign(e.target.style, buttonStyle)}
                                >
                                    Message Driver
                                </button>
                                
                                <button 
                                    onClick={handleReportDriver} 
                                    style={buttonStyle}
                                    onMouseOver={(e) => Object.assign(e.target.style, buttonHoverStyle)}
                                    onMouseOut={(e) => Object.assign(e.target.style, buttonStyle)}
                                >
                                    Report Driver
                                </button>
                            </div>
                        </>
                    ) : <p>Select a driver to view details</p>}
                    <div style={{
  display: "flex",
  alignItems: "flex-start",
  gap: "1.5rem",
  flexWrap: "wrap"
}}>
  {/* LEFT: Driver Info */}
  <div style={{ flex: 1, minWidth: 250 }}>
    <img
      src={selectedPoint?.profilePic || "https://via.placeholder.com/80"}
      alt={selectedPoint?.name}
      style={{
        width: 80,
        height: 80,
        borderRadius: "50%",
        objectFit: "cover",
        border: "3px solid #000",
        marginBottom: "1rem",
      }}
    />
    <h3>{selectedPoint?.name}</h3>
    <p><strong>Status:</strong> {selectedPoint?.status}</p>
    <p><strong>Vehicle:</strong> {selectedPoint?.vehicle}</p>
    <p><strong>Schools:</strong> {selectedPoint?.schools.join(", ")}</p>
    <p><strong>Languages:</strong> {selectedPoint?.languages.join(", ")}</p>
    <p><strong>Criminal Record:</strong> {selectedPoint?.criminal_record ? "Yes" : "No"}</p>
    <p><strong>Max Passengers:</strong> {selectedPoint?.max_passengers}</p>
    <p><strong>Available Seats:</strong> {selectedPoint?.available_seats}</p>
    <p><strong>Gender:</strong> {selectedPoint?.gender}</p>
    <p><strong>Race:</strong> {selectedPoint?.race}</p>

    <button onClick={handleReviewDriver} style={{
      marginTop: "0.5rem",
      padding: "8px 16px",
      borderRadius: 6,
      border: "none",
      backgroundColor: "#000000ff",
      color: "#fff",
      cursor: "pointer"
    }}>Review Driver</button>
    <br/>
    <button onClick={handleMessageDriver} style={{
      marginTop: "0.5rem",
      padding: "8px 16px",
      borderRadius: 6,
      border: "none",
      backgroundColor: "#000000ff",
      color: "#fff",
      cursor: "pointer"
    }}>Message Driver</button>
  </div>

  {/* RIGHT: Reviews */}
  <div style={{ flex: 1, minWidth: 300 }}>
    <h2>Reviews</h2>
    {reviews.length > 0
      ? <ReviewsList reviews={reviews} />
      : <p style={{ marginTop: "1rem" }}>No reviews yet.</p>}
  </div>
</div>
                </div>
            </div>
        </div>
    );

 function FilterBar({ filters, setFilters, onApply }) {
    const [locationQuery, setLocationQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const handleChange = (field, value) => setFilters(prev => ({ ...prev, [field]: value }));

    const inputStyle = {
        padding: "6px 10px",
        borderRadius: 6,
        border: "1px solid #ccc",
        fontSize: 14,
        width: 120,
        outline: "none"
    };

    const buttonStyle = {
        padding: "5px 14px",
        borderRadius: 6,
        border: "none",
        backgroundColor: "#000",
        color: "#fff",
        cursor: "pointer",
        fontSize: 14
    };

    const selectStyle = { ...inputStyle };

    const statusOptions = ["", "Available", "Unavailable"];
    const raceOptions = ["", "black", "white", "coloured", "indian"];
    const languageOptions = ["", "English", "Afrikaans", "Zulu", "Xhosa", "Sotho", "Arabic", "Urdu"];
    const genderOptions = ["male", "female"];
    const criminal_recordOptions = ["", "true", "false"];

    const handleReset = () => {
        setFilters({});
        setLocationQuery("");
        onApply();
    };

    // Fetch suggestions from OpenStreetMap Nominatim API
    const handleLocationSearch = async (query) => {
        setLocationQuery(query);
        if (!query) return setSuggestions([]);

        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`);
            const data = await res.json();
            setSuggestions(data.slice(0, 5)); // show top 5 suggestions
        } catch (error) {
            console.error("Error fetching location:", error);
            setSuggestions([]);
        }
    };

    const handleSelectLocation = (place) => {
        handleChange("lat", place.lat);
        handleChange("lng", place.lon);
        setLocationQuery(place.display_name);
        setSuggestions([]);
    };

    return (
        <div style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.5rem",
            justifyContent: "flex-start",
            marginBottom: "1rem",
            position: "relative"
        }}>
            <select
                value={filters.status || ""}
                onChange={e => handleChange("status", e.target.value)}
                style={selectStyle}
            >
                {statusOptions.map(opt => <option key={opt} value={opt}>{opt || "Status"}</option>)}
            </select>

            <select
                value={filters.race || ""}
                onChange={e => handleChange("race", e.target.value)}
                style={selectStyle}
            >
                {raceOptions.map(opt => <option key={opt} value={opt}>{opt || "Race"}</option>)}
            </select>

            <select
                value={filters.languages || ""}
                onChange={e => handleChange("languages", e.target.value)}
                style={selectStyle}
            >
                {languageOptions.map(opt => <option key={opt} value={opt}>{opt || "Languages"}</option>)}
            </select>

            
            <select
                value={filters.gender || ""}
                onChange={e => handleChange("gender", e.target.value)}
                style={selectStyle}
            >
                {genderOptions.map(opt => <option key={opt} value={opt}>{opt || "Genders"}</option>)}
            </select>

            <select
                value={filters.criminal_record || ""}
                onChange={e => handleChange("criminal_record", e.target.value)}
                style={selectStyle}
            >
                {criminal_recordOptions.map(opt => <option key={opt} value={opt}>{opt || "Criminal Reocrd"}</option>)}
            </select>

            {["vehicle", "schools", "max_passengers", "available_seats"].map(field => (
                <input
                    key={field}
                    type="text"
                    placeholder={field.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}
                    value={filters[field] || ""}
                    onChange={e => handleChange(field, e.target.value)}
                    style={inputStyle}
                />
            ))}

            {/* Location search input */}
            {/* <div style={{ position: "relative" }}>
                <input
                    type="text"
                    placeholder="Search Location"
                    value={locationQuery}
                    onChange={(e) => handleLocationSearch(e.target.value)}
                    style={{ ...inputStyle, width: 200 }}
                />
                {suggestions.length > 0 && (
                    <ul style={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        width: "100%",
                        backgroundColor: "#fff",
                        border: "1px solid #ccc",
                        borderRadius: 4,
                        maxHeight: 150,
                        overflowY: "auto",
                        zIndex: 1000,
                        listStyle: "none",
                        padding: 0,
                        margin: 0
                    }}>
                        {suggestions.map(place => (
                            <li
                                key={place.place_id}
                                onClick={() => handleSelectLocation(place)}
                                style={{
                                    padding: "6px 10px",
                                    cursor: "pointer",
                                    borderBottom: "1px solid #eee"
                                }}
                            >
                                {place.display_name}
                            </li>
                        ))}
                    </ul>
                )}
            </div> */}

            <button onClick={onApply} style={buttonStyle}>Filter</button>
            <button onClick={handleReset} style={{ ...buttonStyle, backgroundColor: "#888" }}>Reset</button>
        </div>
    );
}



function DriverCard({ name, profilePic, onClick, selected }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "8px 12px",
        borderRadius: 8,
        cursor: "pointer",
        backgroundColor: selected ? "#e0f7fa" : "#f5f5f5",
        border: selected ? "2px solid #007acc" : "2px solid transparent",
        transition: "all 0.2s ease",
      }}
    >
      <img
        src={profilePic}
        alt={name}
        style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          objectFit: "cover",
          border: "2px solid #007acc",
        }}
      />
      <span style={{ fontWeight: 600, color: "#333" }}>{name}</span>
    </div>
  );
}





}


