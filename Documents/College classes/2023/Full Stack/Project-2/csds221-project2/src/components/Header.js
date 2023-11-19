// Header.js
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'react-bootstrap';
import AddTask from './AddTask';
import './Header.css';

const Header = ({ onAddTask }) => {
    const [showPanel, setShowPanel] = useState(false);

    const handleShow = () => setShowPanel(true);
    const handleClose = () => setShowPanel(false);

    const handleAddTaskLocal = (task) => {
        onAddTask(task);
        handleClose();
    };

    return (
        <div className="header">
        
        <div className="title">
            <FontAwesomeIcon icon={faBars} className="icon" />
            Frameworks
        </div>
        <Button className="btn btn-primary" onClick={handleShow}>
            Add
        </Button>

        <AddTask show={showPanel} handleClose={handleClose} onAddTask={handleAddTaskLocal} />
        </div>
    );
};

export default Header;
