import React from 'react';
import './footer.css'; // Import the updated CSS file
import { Github, Linkedin, Twitter } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-content">
                    <h3>Contact Us</h3>
                    <div className="footer-icons">
                        <a href="https://github.com/aditya9575" target="_blank" rel="noopener noreferrer">
                            <Github />
                        </a>
                        <a href="https://www.linkedin.com/in/aditya-m-0bb92b110/" target="_blank" rel="noopener noreferrer">
                            <Linkedin />
                        </a>
                        <a href="https://x.com/AdityaMehto3" target="_blank" rel="noopener noreferrer">
                            <Twitter />
                        </a>
                    </div>
                </div>
                <div className="footer-copyright">
                    <p>&copy; {new Date().getFullYear()} All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
