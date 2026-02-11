import { useState,useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import MessageModal from "../modals/MessageModal.jsx";
import schools from '../enums/Schools.json';
import Select from 'react-select'

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

export default function DriverProfileForm(){
    const [availableSeats, setAvailableSeats] = useState("");
    const [vehicleCapacity, setVehicleCapacity] = useState("");
    const [pricePerMonth, setPricePerMonth] = useState("");
    const [vehicleType, setVehicleType] = useState("");
    const [supportedSchools, setSupportedSchools] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const vehicleTypes = ["Minibus", "SUV", "Sedan"];
    // const schools = schools;
    const options = schools.map(school => ({ value: school, label: school }));

    const navigate = useNavigate();
    const [message,setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);

        useEffect(() => {
            const storedUserData = sessionStorage.getItem("userData");
            
            if (storedUserData) {
                try {
                    const parsedData = JSON.parse(storedUserData);
                    
                    const userData = parsedData[0];
                    
                    if (!userData) {
                        console.error("No user data found at index 0");
                        navigate("/login");
                        return;
                    }
    
                    setUserData(userData);
                    
                    
                } catch (error) {
                    console.error("Error parsing user data:", error);
                    navigate("/login");
                }
            }
            setLoading(false);
        }, [navigate]);

    const handleSchoolsChange = (selectedOptions) => {
        const values = selectedOptions
            ? selectedOptions.map(option => option.value)
            : [];

        setSupportedSchools(values);
    };

            const handleFormSubmit = async (event) => {
                event.preventDefault();
        
                if (!role) return alert("Please select Parent or Driver.");
                if (password.length < 6) return alert("Password must be at least 6 characters.");
                if (password !== confirmPassword) return alert("Passwords do not match.");
        
                try {
                    await signUpUser(emailAddress, password,role,firstName,lastName);
        
                    setEmailAddress("");
                    setFirstName("");
                    setLastName("");
                    setPassword("");
                    setConfirmPassword("");
                    setRole("Parent");
        
                    setMessage("Signup successful!");
                    setModalOpen(true);
                } catch (error) {
                    console.error("Signup failed:", error);
                    setMessage("Error signing up. Please try again.");
                    setModalOpen(true);
                }
            };

    return(
        <>
        <form onSubmit={handleFormSubmit} style={styles.formArea}>
    <h1 style={styles.heading}>Driver Information</h1>

    <MessageModal
        isOpen={modalOpen}
        onClose={() => {
            setModalOpen(false);
            navigate('/login');
        }}
        message={message}
    />

    <div style={styles.fieldGroup}>
        <label style={styles.label}>Available Seats</label>
        <input
            type="number"
            value={availableSeats}
            onChange={(e) => setAvailableSeats(e.target.value)}
            placeholder="e.g. 3"
            min="0"
            required
            style={styles.inputText}
        />
    </div>

    <div style={styles.fieldGroup}>
        <label style={styles.label}>Vehicle Capacity</label>
        <input
            type="number"
            value={vehicleCapacity}
            onChange={(e) => setVehicleCapacity(e.target.value)}
            placeholder="e.g. 14"
            min="1"
            required
            style={styles.inputText}
        />
    </div>

    <div style={styles.fieldGroup}>
        <label style={styles.label}>Vehicle Type</label>

        <Select
            options={vehicleTypes.map(type => ({
                value: type,
                label: type
            }))}
            value={
                vehicleType
                    ? { value: vehicleType, label: vehicleType }
                    : null
            }
            onChange={(selectedOption) =>{
                setVehicleType(selectedOption?.value || "")
                }
            }
        />


    </div>

    <div style={styles.fieldGroup}>
        <label style={styles.label}>Supported School</label>
        <div style={styles.fieldGroup}>
      <Select options={options}
      isMulti
      onChange={handleSchoolsChange}
       />

    <small style={{ marginLeft: '0.75rem', color: '#666' }}>
        Hold Ctrl (Windows) or Cmd (Mac) to select multiple schools
    </small>
</div>

    </div>

    <div style={styles.fieldGroup}>
        <label style={styles.label}>Price Per Month (ZAR)</label>
        <input
            type="number"
            value={pricePerMonth}
            onChange={(e) => setPricePerMonth(e.target.value)}
            placeholder="e.g. 1200"
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