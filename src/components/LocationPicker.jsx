import React, { useEffect, useState, useCallback } from 'react';

export default function LocationPicker({ onLocationChange }) {
    const [LocationPickerComp, setLocationPickerComp] = useState(null);
    const [location, setLocation] = useState(() => {
        try {
            const raw = sessionStorage.getItem('selectedLocation');
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    });

    useEffect(() => {
        let mounted = true;

        // Try to dynamically import the package we just installed.
        import('react-location-picker')
            .then((mod) => {
                const comp = mod.default || mod.LocationPicker || mod;
                if (mounted) setLocationPickerComp(() => comp);
            })
            .catch(() => {
                // If import fails, we silently fall back to a simple geolocation input below.
            });

        return () => { mounted = false; };
    }, []);

    const handleChange = useCallback((val) => {
        // The third-party picker may return different shapes; normalize common ones.
        // If val has `position` or `lat`/`lng`, use those; otherwise store val as-is.
        let normalized = val;

        if (val && val.position && typeof val.position.lat === 'number') {
            normalized = { lat: val.position.lat, lng: val.position.lng, raw: val };
        } else if (val && typeof val.lat === 'number' && typeof val.lng === 'number') {
            normalized = { lat: val.lat, lng: val.lng, raw: val };
        }

        setLocation(normalized);
        try { sessionStorage.setItem('selectedLocation', JSON.stringify(normalized)); } catch {}
        if (typeof onLocationChange === 'function') onLocationChange(normalized);
    }, [onLocationChange]);

    const useBrowserLocation = () => {
        if (!navigator.geolocation) {
            alert('Geolocation not available in this browser');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
                handleChange(coords);
            },
            (err) => {
                console.error('Geolocation error', err);
                alert('Unable to get your location');
            }
        );
    };

    return (
        <div style={{ maxWidth: 600 }}>
            {LocationPickerComp ? (
                <LocationPickerComp onChange={handleChange} value={location || undefined} />
            ) : (
                <div>
                    <p>Location picker not available — use browser location or type roughly where you are.</p>
                    <button onClick={useBrowserLocation} style={{ marginBottom: 8 }}>Use current location</button>
                </div>
            )}

            <div style={{ marginTop: 12 }}>
                <strong>Selected location:</strong>
                <div>
                    {location ? (
                        <code>{JSON.stringify(location)}</code>
                    ) : (
                        <span>None</span>
                    )}
                </div>
            </div>
        </div>
    );
}
