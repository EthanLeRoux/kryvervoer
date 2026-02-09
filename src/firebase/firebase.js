import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, doc, query, where, getDocs, updateDoc, deleteDoc, Timestamp, serverTimestamp, orderBy } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail, updateEmail as fbUpdateEmail, updatePassword as fbUpdatePassword } from "firebase/auth";

// Debug environment variables
console.log("Environment check:", {
    hasApiKey: !!import.meta.env.VITE_API_KEY,
    hasProjectId: !!import.meta.env.VITE_PROJECT_ID,
    env: import.meta.env.MODE
});

const firebaseConfig = {
    apiKey: import.meta.env.VITE_API_KEY,
    authDomain: import.meta.env.VITE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_APP_ID,
    measurementId: import.meta.env.VITE_MEASUREMENT_ID
};

// Validate config
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    console.error("Missing Firebase configuration. Please check your environment variables.");
    throw new Error("Firebase configuration is incomplete.");
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
console.log("Firebase app initialized:", app.name);

export const db = getFirestore(app);
export const auth = getAuth(app); // Export auth so other components can use it

// Enhanced signUpUser with better error handling
export async function signUpUser(email, password) {
    try {
        console.log("Attempting to sign up user:", email);
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log("User signed up successfully:", userCredential.user.uid);
        return userCredential.user;
    } catch (error) {
        console.error("Sign up failed:", error.code, error.message);

        // User-friendly error messages
        let errorMessage = "Sign up failed: ";
        switch (error.code) {
            case 'auth/email-already-in-use':
                errorMessage += "This email is already registered.";
                break;
            case 'auth/invalid-email':
                errorMessage += "Please enter a valid email address.";
                break;
            case 'auth/weak-password':
                errorMessage += "Password should be at least 6 characters.";
                break;
            case 'auth/network-request-failed':
                errorMessage += "Network error. Please check your connection.";
                break;
            case 'auth/api-key-not-valid':
                errorMessage += "Configuration error. Please contact support.";
                break;
            default:
                errorMessage += error.message;
        }

        alert(errorMessage);
        throw error;
    }
}

// Enhanced loginUser function
export async function loginUser(email, password) {
    try {
        console.log("Attempting to login user:", email);
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("User logged in successfully:", userCredential.user.uid);
        return userCredential.user;
    } catch (error) {
        console.error("Login failed:", error.code, error.message);

        let errorMessage = "Login failed: ";
        switch (error.code) {
            case 'auth/user-not-found':
                errorMessage += "No account found with this email.";
                break;
            case 'auth/wrong-password':
                errorMessage += "Incorrect password.";
                break;
            case 'auth/invalid-email':
                errorMessage += "Please enter a valid email address.";
                break;
            case 'auth/network-request-failed':
                errorMessage += "Network error. Please check your connection.";
                break;
            case 'auth/api-key-not-valid':
                errorMessage += "Configuration error. Please contact support.";
                break;
            default:
                errorMessage += error.message;
        }

        alert(errorMessage);
        throw error;
    }
}

// Rest of your functions remain the same...
export const logoutUser = async () => {
    try {
        await signOut(auth);
        console.log("User signed out successfully.");
    } catch (error) {
        console.error("Error signing out:", error);
    }
};

export async function resetPassword(email) {
    try {
        await sendPasswordResetEmail(auth, email);
    } catch (error) {
        console.error("Error sending reset email:", error.message);
        throw error;
    }
}

export async function updateEmail(newEmail) {
    if (!auth.currentUser) throw new Error("No user logged in");
    return await fbUpdateEmail(auth.currentUser, newEmail);
}

export async function updatePassword(newPassword) {
    if (!auth.currentUser) throw new Error("No user logged in");
    return await fbUpdatePassword(auth.currentUser, newPassword);
}

export async function saveDoc(docData, collectionName) {
    try {
        await addDoc(collection(db, collectionName), docData);
    } catch (error) {
        console.error("Error adding document: ", error);
        throw error;
    }
}

export async function getDocumentsByField(collectionName, fieldName, value) {
    try {
        const q = query(collection(db, collectionName), where(fieldName, "==", value));
        const querySnapshot = await getDocs(q);
        const results = [];
        querySnapshot.forEach((doc) => results.push({ id: doc.id, ...doc.data() }));
        return results;
    } catch (error) {
        console.error("Error getting documents:", error);
        throw error;
    }
}

export async function updateDocument(collectionName, docId, updatedData) {
    try {
        const docRef = doc(db, collectionName, docId);
        await updateDoc(docRef, updatedData);
    } catch (error) {
        console.error("Error updating document:", error);
        throw error;
    }
}

export async function deleteDocument(collectionName, docId) {
    try {
        const docRef = doc(db, collectionName, docId);
        await deleteDoc(docRef);
        console.log("Document deleted successfully.");
    } catch (error) {
        console.error("Error deleting document:", error);
        throw error;
    }
}

export async function saveDriverReview(reviewData) {
    try {
        const reviewWithUser = {
            ...reviewData,
            timestamp: serverTimestamp(),
            createdAt: new Date().toISOString() // Client-side fallback
        };

        const docRef = await addDoc(collection(db, "driver-reviews"), reviewWithUser);
        console.log("Review saved with ID:", docRef.id);
        return docRef.id;
    } catch (error) {
        console.error("Error saving driver review:", error);
        throw error;
    }
}

export async function getDriverReviews(driverId) {
    try {
        const q = query(
            collection(db, "driver-reviews"),
            where("driverId", "==", driverId),
            orderBy("timestamp", "desc")
        );
        const querySnapshot = await getDocs(q);
        const reviews = [];
        querySnapshot.forEach((doc) => reviews.push({ id: doc.id, ...doc.data() }));
        return reviews;
    } catch (error) {
        console.error("Error getting driver reviews:", error);
        throw error;
    }
}