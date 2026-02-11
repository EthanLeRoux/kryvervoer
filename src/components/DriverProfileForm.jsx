import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MessageModal from "../modals/MessageModal.jsx";
import schools from "../enums/Schools.json";
import languages from "../enums/Languages.json";
import races from "../enums/Races.json";
import Select from "react-select";
import { getDocumentsByField, updateDocument, saveDriver } from "../firebase/firebase.js";

export default function DriverProfileForm() {
    const navigate = useNavigate();

    const [availableSeats, setAvailableSeats] = useState(0);
    const [vehicleCapacity, setVehicleCapacity] = useState(0);
    const [pricePerMonth, setPricePerMonth] = useState(0);
    const [vehicleType, setVehicleType] = useState("");
    const [supportedSchools, setSupportedSchools] = useState([]);
    const [selectedRace, setSelectedRace] = useState("");
    const [selectedLanguages, setSelectedLanguages] = useState([]);

    const [modalOpen, setModalOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);

    const vehicleTypes = ["Minibus", "SUV", "Sedan"];

    // Convert enums to react-select format
    const schoolOptions = schools.map(s => ({ value: s, label: s }));
    const raceOptions = races.map(r => ({ value: r, label: r }));
    const languageOptions = languages.map(l => ({ value: l, label: l }));

    useEffect(() => {
        const storedUserData = sessionStorage.getItem("userData");

        if (storedUserData) {
            try {
                const parsedData = JSON.parse(storedUserData);
                const user = parsedData[0];

                if (!user) {
                    navigate("/login");
                    return;
                }

                setUserData(user);
            } catch (error) {
                console.error("Error parsing user data:", error);
                navigate("/login");
            }
        }

        setLoading(false);
    }, [navigate]);

    const handleFormSubmit = async (event) => {
        event.preventDefault();

        if (!userData?.uid) {
            setMessage("Session expired. Please login again.");
            setModalOpen(true);
            return;
        }

        if (!vehicleType || !selectedRace || supportedSchools.length === 0) {
            setMessage("Please complete all required fields.");
            setModalOpen(true);
            return;
        }

        try {
            await saveDriver({
                uid: userData.uid,
                availableSeats: Number(availableSeats),
                vehicleCapacity: Number(vehicleCapacity),
                vehicleType,
                supportedSchools,
                pricePerMonth: Number(pricePerMonth),
                race: selectedRace,
                languages: selectedLanguages,
            });

            const res = await getDocumentsByField("users", "uid", userData.uid);

            if (res.length > 0) {
                const userDocId = res[0].id;
                await updateDocument("users", userDocId, { driverProfileSet: true });

                sessionStorage.setItem(
                    "userData",
                    JSON.stringify([{ ...userData, driverProfileSet: true }])
                );
            }

            setMessage("Driver Registration successful!");
            setModalOpen(true);

        } catch (error) {
            console.error("Registration failed:", error);
            setMessage("Error registering driver. Please try again.");
            setModalOpen(true);
        }
    };

    if (loading) return null;

    return (
        <>
            <form onSubmit={handleFormSubmit} style={styles.formArea}>
                <h1 style={styles.heading}>Driver Registration</h1>

                <MessageModal
                    isOpen={modalOpen}
                    onClose={() => {
                        setModalOpen(false);
                        navigate("/profile");
                    }}
                    message={message}
                />

                {/* Available Seats */}
                <div style={styles.fieldGroup}>
                    <label style={styles.label}>Available Seats</label>
                    <input
                        type="number"
                        value={availableSeats}
                        onChange={(e) => setAvailableSeats(Number(e.target.value))}
                        min="0"
                        required
                        style={styles.inputText}
                    />
                </div>

                {/* Vehicle Capacity */}
                <div style={styles.fieldGroup}>
                    <label style={styles.label}>Vehicle Capacity</label>
                    <input
                        type="number"
                        value={vehicleCapacity}
                        onChange={(e) => setVehicleCapacity(Number(e.target.value))}
                        min="1"
                        required
                        style={styles.inputText}
                    />
                </div>

                {/* Vehicle Type */}
                <div style={styles.fieldGroup}>
                    <label style={styles.label}>Vehicle Type</label>
                    <Select
                        options={vehicleTypes.map(type => ({ value: type, label: type }))}
                        onChange={(option) => setVehicleType(option?.value || "")}
                    />
                </div>

                {/* Supported Schools (Multi) */}
                <div style={styles.fieldGroup}>
                    <label style={styles.label}>Supported Schools</label>
                    <Select
                        options={schoolOptions}
                        isMulti
                        onChange={(options) =>
                            setSupportedSchools(
                                options ? options.map(o => o.value) : []
                            )
                        }
                    />
                </div>

                {/* Race (Single) */}
                <div style={styles.fieldGroup}>
                    <label style={styles.label}>Race</label>
                    <Select
                        options={raceOptions}
                        onChange={(option) => setSelectedRace(option?.value || "")}
                    />
                </div>

                {/* Languages (Multi) */}
                <div style={styles.fieldGroup}>
                    <label style={styles.label}>Languages Spoken</label>
                    <Select
                        options={languageOptions}
                        isMulti
                        onChange={(options) =>
                            setSelectedLanguages(
                                options ? options.map(o => o.value) : []
                            )
                        }
                    />
                </div>

                {/* Price */}
                <div style={styles.fieldGroup}>
                    <label style={styles.label}>Price Per Month (ZAR)</label>
                    <input
                        type="number"
                        value={pricePerMonth}
                        onChange={(e) => setPricePerMonth(Number(e.target.value))}
                        min="0"
                        required
                        style={styles.inputText}
                    />
                </div>

                <input
                    type="submit"
                    value="Save Driver Profile"
                    style={styles.taskAddButton}
                />
            </form>
        </>
    );
}


const styles = {
        formArea: {
            width: '100%',
            maxWidth: 400,
            margin: '5vh auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
        },
        heading: {
            textAlign: 'center',
            fontSize: '2rem',
            fontWeight: 600,
            marginBottom: '0.5rem',
            color: '#000'
        },
        label: {
    fontSize: '0.9rem',
    fontWeight: 500,
    marginLeft: '0.75rem',
    color: '#000'
},
fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem'
},
        inputText: {
            width: '100%',
            padding: '0.75rem 1rem',
            fontSize: '1rem',
            border: '1px solid #ccc',
            borderRadius: '50px',
            outline: 'none',
            transition: 'border-color 0.3s, box-shadow 0.3s',
        },
        inputFocus: {
            borderColor: '#000000ff',
            boxShadow: '0 0 5px rgba(0, 122, 204, 0.3)',
        },
        taskAddButton: {
            width: '100%',
            padding: '0.75rem',
            fontSize: '1rem',
            backgroundColor: '#FFA500',
            color: '#fff',
            border: 'none',
            borderRadius: '50px',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
        },
        radioGroup: {
            display: 'flex',
            justifyContent: 'center',
            gap: '20px',
            margin: '0.5rem 0'
        },
        linkButton: {
            display: 'block',
            marginTop: '0.5rem',
            textAlign: 'center',
            color: '#000000ff',
            fontSize: '0.9rem',
            textDecoration: 'none',
            transition: 'color 0.3s'
        }
    };