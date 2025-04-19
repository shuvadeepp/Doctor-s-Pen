import React, { useState, useEffect } from 'react';

const TrafficLight = () => {
  const [activeLight, setActiveLight] = useState('red');

  useEffect(() => {
    let timer;

    if (activeLight === 'red') {
      timer = setTimeout(() => {
        setActiveLight('yellow');
      }, 5000);
    } else if (activeLight === 'yellow') {
      timer = setTimeout(() => {
        setActiveLight('green');
      }, 3000);
    } else if (activeLight === 'green') {
      timer = setTimeout(() => {
        setActiveLight('red');
      }, 4000);
    }

    // Cleanup function to clear the timeout if the component unmounts or the activeLight changes prematurely
    return () => clearTimeout(timer);
  }, [activeLight]);

  return (
    <div style={styles.container}>
      <div
        style={{
          ...styles.light,
          ...styles.red,
          backgroundColor: activeLight === 'red' ? 'red' : '#330000',
        }}
      />
      <div
        style={{
          ...styles.light,
          ...styles.yellow,
          backgroundColor: activeLight === 'yellow' ? 'yellow' : '#CCCC00',
        }}
      />
      <div
        style={{
          ...styles.light,
          ...styles.green,
          backgroundColor: activeLight === 'green' ? 'green' : '#003300',
        }}
      />
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#333',
    padding: '20px',
    borderRadius: '10px',
  },
  light: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    margin: '10px 0',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
  },
  red: {},
  yellow: {},
  green: {},
};

export default TrafficLight;