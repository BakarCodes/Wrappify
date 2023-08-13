import React from 'react'

function Footer() {
    return (
        <footer className="footer">
            <p>&copy; {new Date().getFullYear()} Wrappify. All rights reserved.</p>
            <p>We are not related to Spotify AB or any of its partners in any way</p>
        </footer>
    );
}

export default Footer