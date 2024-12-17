import React, { useEffect, useState } from "react";
import "./userprofile.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Firebase_FetchUserDataUrl = import.meta.env.VITE_FireBaseFetchUserData_URL;
const Firebase_UpdateUserDataUrl = import.meta.env.VITE_FireBaseUpdateUserData_URL;

const UserProfile = () => {
    const [fullName, setFullName] = useState("");
    const [photoURL, setPhotoURL] = useState("");
    const [idToken, setIdToken] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (token) {
            setIdToken(token);
            fetchUserData(token);
        } else {
            setError("User is not authenticated. Please log in again.");
        }
    }, []);

    useEffect(() => {
        // Update profile status in localStorage
        if (fullName && photoURL) {
            localStorage.setItem("profileStatus", "complete");
        } else {
            localStorage.setItem("profileStatus", "incomplete");
        }
    }, [fullName, photoURL]);

    const fetchUserData = async (token) => {
        setLoading(true);
        setError("");

        try {
            const response = await axios.post(
                Firebase_FetchUserDataUrl,
                { idToken: token },
                {
                    headers: {
                        "Content-Type": "application/json",
                    }
                }
            );

            const user = response.data.users[0];
            setFullName(user.displayName || "");
            setPhotoURL(user.photoUrl || "");
        } catch (error) {
            setError("Failed to load user data. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleUserDetailsUpdate = (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const updateData = {
            idToken,
            displayName: fullName,
            photoUrl: photoURL,
        };

        axios
            .post(
                Firebase_UpdateUserDataUrl,
                updateData,
                {
                    headers: {
                        "Content-Type": "application/json",
                    }
                }
            )
            .then(() => {
                alert("Profile updated successfully");
            })
            .catch(() => {
                setError("Failed to update profile. Please try again.");
            })
            .finally(() => setLoading(false));
    };

    const handleBack = (e) => {
        e.preventDefault();
        navigate("/Homepage");
    };

    return (
        <div className="user-profile-container">
            <h1>User Profile</h1>

            {error && <p className="error-message">{error}</p>}

            <div className="profile-section">
                <div className="profile-image-container">
                    {photoURL ? (
                        <img src={photoURL} alt="User" className="profile-image" />
                    ) : (
                        <div className="profile-placeholder">+</div>
                    )}
                </div>
                <h2 className="full-name">{fullName || "Full Name"}</h2>
            </div>

            <form className="user-form" onSubmit={handleUserDetailsUpdate}>
                <label htmlFor="fullName">Full Name:</label>
                <input
                    id="fullName"
                    type="text"
                    placeholder="Enter full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    disabled={loading}
                />

                <label htmlFor="photoURL">Profile Photo URL:</label>
                <input
                    id="photoURL"
                    type="text"
                    placeholder="Enter photo URL"
                    value={photoURL}
                    onChange={(e) => setPhotoURL(e.target.value)}
                    disabled={loading}
                />

                <button type="submit" disabled={loading} className="userprofilebtn">
                    {loading ? "Updating..." : "Update"}
                </button>
                <button onClick={handleBack} className="userprofilebtn">
                    Back
                </button>
            </form>
        </div>
    );
};

export default UserProfile;
