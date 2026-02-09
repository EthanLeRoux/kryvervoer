import React, { useState, useCallback, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import L from 'leaflet';
import "leaflet/dist/leaflet.css";
import "../assets/styles/MapWithPoints.css";
import { updateDocument } from '../firebase/firebase.js';
import MessageModal from "../modals/MessageModal.jsx";

// Component to handle map clicks
function MapClickHandler({ onMapClick }) {
    useMapEvents({
        click(e) {
            onMapClick(e.latlng.lat, e.latlng.lng);
        }
    });
    return null;
}

export default function LocationPicker({ onLocationChange }) {
    const navigate = useNavigate();
    const [location, setLocation] = useState(() => {
        try {
            const raw = sessionStorage.getItem('selectedLocation');
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    });
    const [isSaving, setIsSaving] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [showModal, setShowModal] = useState(false);
    const mapRef = useRef(null);
    const navTimeoutRef = useRef(null);

    const handleLocationSelected = useCallback((lat, lng) => {
        const coords = { lat, lng };
        setLocation(coords);
        if (typeof onLocationChange === 'function') onLocationChange(coords);
    }, [onLocationChange]);

    const useBrowserLocation = () => {
        if (!navigator.geolocation) {
            setModalMessage('Geolocation not available in this browser');
            setShowModal(true);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                handleLocationSelected(pos.coords.latitude, pos.coords.longitude);
            },
            (err) => {
                console.error('Geolocation error', err);
                setModalMessage('Unable to get your location. Please try clicking on the map instead.');
                setShowModal(true);
            }
        );
    };

    const handleConfirmLocation = async () => {
        if (!location) {
            setModalMessage('Please select a location first');
            setShowModal(true);
            return;
        }

        setIsSaving(true);
        try {
            // Get user ID from session storage
            const userDataRaw = sessionStorage.getItem('userData');
            const userData = userDataRaw ? JSON.parse(userDataRaw)[0] : null;

            if (!userData || !userData.id) {
                setModalMessage('Error: User not found');
                setShowModal(true);
                setIsSaving(false);
                return;
            }

            // Update database with location
            await updateDocument('users', userData.id, {
                latitude: location.lat,
                longitude: location.lng,
                locationSet: true
            });

            setModalMessage('Location saved successfully!');
            setShowModal(true);
            
            // Update session storage
            const updatedUserData = { ...userData, latitude: location.lat, longitude: location.lng,locationSet:true };
            sessionStorage.setItem('userData', JSON.stringify([updatedUserData]));
            sessionStorage.setItem('selectedLocation', JSON.stringify(location));

            // Show success message then navigate after a short delay so modal is visible
            navTimeoutRef.current = setTimeout(() => {
                navigate('/profile');
            }, 1200);
            
            if (typeof onLocationChange === 'function') onLocationChange(location);
        } catch (error) {
            console.error('Error saving location:', error);
            setModalMessage('Failed to save location. Please try again.');
            setShowModal(true);
        } finally {
            setIsSaving(false);
        }
    };

    // cleanup any pending timeout when component unmounts
    React.useEffect(() => {
        return () => {
            if (navTimeoutRef.current) clearTimeout(navTimeoutRef.current);
        };
    }, []);

    const defaultCenter = location ? [location.lat, location.lng] : [51.505, -0.09];

    return (
        <>
            <MessageModal 
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                message={modalMessage}
            />
            <div style={{ maxWidth: '1800px', margin: '0 auto', padding: '18px', display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '50vh' }}>


            <MapContainer ref={mapRef} center={defaultCenter} zoom={13} style={{ height: '400px', width: '250%', marginBottom: 14, borderRadius: '6px' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <MapClickHandler onMapClick={handleLocationSelected} />
                {location && (
                    <Marker position={[location.lat, location.lng]}>
                        <Popup>
                            Selected Location<br />
                            Lat: {location.lat.toFixed(4)}, Lng: {location.lng.toFixed(4)}
                        </Popup>
                    </Marker>
                )}
            </MapContainer>

            <div style={{ marginBottom: 12, textAlign: 'center', width: '100%' }}>
                <strong>Selected location:</strong>
                <div>
                    {location ? (
                        <p style={{ margin: '4px 0' }}>Lat: {location.lat.toFixed(4)}, Lng: {location.lng.toFixed(4)}</p>
                    ) : (
                        <p style={{ margin: '4px 0' }}>Click on the map or use geolocation to select a location</p>
                    )}
                </div>
            </div>

            <button onClick={useBrowserLocation} style={{ marginBottom: 12, padding: '8px 16px', backgroundColor: '#ff6423', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', width: '100%' }}>
                    Use My Current Location
            </button>

            <button 
                onClick={handleConfirmLocation} 
                disabled={!location || isSaving}
                style={{ 
                    padding: '10px 20px', 
                    backgroundColor: location && !isSaving ? '#4CAF50' : '#ccc', 
                    color: '#fff', 
                    border: 'none', 
                    borderRadius: '5px', 
                    cursor: location && !isSaving ? 'pointer' : 'not-allowed',
                    width: '100%'
                }}
            >
                {isSaving ? 'Saving...' : 'Confirm Location'}
            </button>
            </div>
        </>
    );
}
