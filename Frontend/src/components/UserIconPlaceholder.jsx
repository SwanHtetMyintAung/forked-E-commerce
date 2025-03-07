import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons'; // Or faRegularUser

function UserIconPlaceholder({ width = '150px', height = '150px', color = '#ccc', ...props }) {
    const containerStyle = {
        width: width,
        height: height,
        backgroundColor: '#f0f0f0', // Light background
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: color,
        borderRadius: '50%', // Optional: Make it circular
    };

    return (
        <div style={containerStyle} {...props}>
            <FontAwesomeIcon icon={faUser} size="3x" /> {/* Adjust size as needed */}
        </div>
    );
}

export default UserIconPlaceholder;