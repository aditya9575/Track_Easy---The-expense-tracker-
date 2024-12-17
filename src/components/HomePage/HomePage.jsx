// ----------------------------------------
import React, { useEffect, useState } from "react";
import "./homepage.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const FirebaseCheckEmailVerificationStatusUrl = import.meta.env.VITE_CheckEmailVerification_URL;
const FirebaseHandleEmailVerificationStatusUrl = import.meta.env.VITE_HandleEmailVerification_URL;
const FirebaseFetchUserDataUrl = import.meta.env.VITE_FireBaseFetchUserData_URL;

const HomePage = () => {
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [emailVerificationSent, setEmailVerificationSent] = useState(false);
    const [profileStatus, setProfileStatus] = useState("incomplete");
    const navigate = useNavigate();
    const token = localStorage.getItem("authToken");

    // Function to check email verification status
    const checkEmailVerificationStatus = async () => {
        try {
            const response = await axios.post(
                FirebaseCheckEmailVerificationStatusUrl,
                { idToken: token },
                { headers: { "Content-Type": "application/json" } }
            );

            const user = response.data.users[0];
            if (user.emailVerified) {
                setIsEmailVerified(true);
                localStorage.setItem("isEmailVerified", "true");
            } else {
                setIsEmailVerified(false);
                localStorage.setItem("isEmailVerified", "false");
            }
        } catch (error) {
            console.error("Error checking email verification status:", error);
        }
    };

    // Function to check profile completion status
    const checkProfileCompletionStatus = async () => {
        try {
            const response = await axios.post(
                FirebaseFetchUserDataUrl,
                { idToken: token },
                { headers: { "Content-Type": "application/json" } }
            );

            const user = response.data.users[0];
            const isProfileComplete = user.displayName && user.photoUrl;

            if (isProfileComplete) {
                setProfileStatus("complete");
                localStorage.setItem("profileStatus", "complete");
            } else {
                setProfileStatus("incomplete");
                localStorage.setItem("profileStatus", "incomplete");
            }
        } catch (error) {
            console.error("Error fetching profile status:", error);
        }
    };

    // Function to handle sending the verification email
    const handleEmailVerification = async () => {
        try {
            await axios.post(
                FirebaseHandleEmailVerificationStatusUrl,
                { requestType: "VERIFY_EMAIL", idToken: token },
                { headers: { "Content-Type": "application/json" } }
            );
            setEmailVerificationSent(true);
            alert("Verification email sent successfully. Please check your inbox.");
        } catch (error) {
            const errorMessage =
                error.response?.data?.error?.message || "Failed to send verification email.";
            alert(`Error: ${errorMessage}`);
        }
    };

    useEffect(() => {
        // On component load, check email verification and profile status
        const verified = localStorage.getItem("isEmailVerified");

        if (verified === "true") {
            setIsEmailVerified(true);
        } else {
            checkEmailVerificationStatus();
        }

        checkProfileCompletionStatus();

        // Set interval to check email verification every 1 minute
        const interval = setInterval(() => {
            checkEmailVerificationStatus();
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        navigate("/LoginForm");
    };

    return (
        <div className="homepage">
            <div className="homepage__top">
                <div className="homepage__welcome">
                    <h4>Welcome To Expense Tracker</h4>
                </div>
                <div className="homepage__profile">
                    <h4>Your profile is {profileStatus === "complete" ? "complete" : "incomplete"}.</h4>
                    {profileStatus === "incomplete" && (
                        <Link to="/UserProfile" className="homepage__button-link">
                            Complete Now
                        </Link>
                    )}
                    <Link to="/UserProfile" className="homepage__button-link">
                        Update Profile
                    </Link>
                </div>
            </div>
            <hr className="homepage__divider" />
            <div className="homepage__actions">
                <button
                    className="homepage__button"
                    onClick={handleEmailVerification}
                    disabled={isEmailVerified || emailVerificationSent}
                >
                    {isEmailVerified
                        ? "Email Verified"
                        : emailVerificationSent
                            ? "Verification Email Sent"
                            : "Verify Your Email"}
                </button>

                <button
                    className="homepage__button"
                    disabled={!isEmailVerified}
                    onClick={isEmailVerified ? () => navigate("/ExpenseTracker") : undefined}
                >
                    {isEmailVerified
                        ? "Track Your Expenses"
                        : "Verify your email first to be able to start tracking your expenses"}
                </button>

                <button className="homepage__button" onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </div>
    );
};

export default HomePage;



