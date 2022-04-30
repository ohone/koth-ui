import React from 'react';
import './ConnectedPill.css';
import { Placeholder } from 'react-bootstrap';

function NotConnectedPill(){

    return (
        <div className="pill">
            <Placeholder animation="glow">
                <Placeholder xs={6} />
            </Placeholder>
        </div>)
}

export default NotConnectedPill;