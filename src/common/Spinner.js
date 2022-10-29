import React from 'react';
import ClipLoader from 'react-spinners/ClipLoader';

function Spinner() {
  return (
    <div style={{ width: '50px', margin: 'auto', display: 'block' }}>
      <ClipLoader color="#52bfd9" size={50}/>
    </div>
  );
};

export default Spinner;