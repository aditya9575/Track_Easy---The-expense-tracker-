import React, { useState } from 'react';
import './header.css'; // Header CSS
import { Blend } from 'lucide-react'; // Toggle icon

const Header = () => {
    const [isToggled, setIsToggled] = useState(false);

    const handleToggle = () => {
        // Update the state and immediately apply the background toggle
        const newToggledState = !isToggled;
        setIsToggled(newToggledState);

        // Toggle gradient background based on the new state
        if (newToggledState) {
            document.body.classList.add('gradient-bg');
        } else {
            document.body.classList.remove('gradient-bg');
        }
    };

    return (
        <header className="header">
            <div className="header-container">
                <h1 className="header-title">📝Track-Easy Your Handy Expense Tracker</h1>
                <button
                    className={`toggle-btn ${isToggled ? 'active' : ''}`}
                    onClick={handleToggle}
                    aria-label="Toggle Background"
                >
                    <Blend size={24} />
                </button>
            </div>
        </header>
    );
};

export default Header;

