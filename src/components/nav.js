"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from '../app/nav.module.css';

const notifyUser = (command) => {
  alert(`Command ${command} sent to the board successfully.`);
};

const updateLEDStatus = async (command, setStatus) => {
  try {
    const response = await fetch('/api/getControlCommand', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ command }),
    });

    const data = await response.json();

    if (data.success) {
      setStatus(command !== 'OFF');
      notifyUser(command);
    }
  } catch (error) {
    console.error('Error updating Command:', error);
    alert('Failed to send command to the board.');
  }
};

const fetchLEDStatus = async (setStatus) => {
  try {
    const response = await fetch('/api/getCurrentStatus', {
      method: 'GET',
    });

    const data = await response.json();

    if (data.success) {
      setStatus(data.isOn);
    }
  } catch (error) {
    console.error('Error fetching current status:', error);
  }
};

const Navbar = () => {
  const [ledStatus, setLEDStatus] = useState(false);

  useEffect(() => {
    fetchLEDStatus(setLEDStatus);
  }, []);

  return (
    <nav className={`navbar navbar-expand-lg ${styles.navbarCustom}`}>
      <div className="container-fluid">
        <Link className={`navbar-brand d-flex align-items-center ${styles.navbarBrandText}`} href="./">
          <img src="/a.png" alt="Logo" className={styles.navbarLogo} />
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className={`nav-link ${styles.navLink}`} href="./">Dashboard</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${styles.navLink}`} href="/History">History</Link>
            </li>
          </ul>
          <form className="d-flex align-items-center">
            <button type="button" className={`btn ${styles.btnCustom} me-2`} onClick={() => updateLEDStatus('RGB_ON', setLEDStatus)}>Turn on the lights</button>
            <button type="button" className={`btn ${styles.btnCustom} me-2`} onClick={() => updateLEDStatus('BUZZER_ON', setLEDStatus)}>Buzzer</button>
            <button type="button" className={`btn ${styles.btnDanger}`} onClick={() => updateLEDStatus('OFF', setLEDStatus)}>Off</button>
            <span className={`ms-3 ${ledStatus ? styles.statusOn : styles.statusOff}`}>
              {ledStatus ? 'LED is ON' : 'LED is OFF'}
            </span>
          </form>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
