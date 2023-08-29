import React, { useEffect, useState } from 'react';
import './css/Dashbord.css';
import { Checkbox } from '@mui/material';
import { Link } from 'react-router-dom';

function Dashbord() {
  //change language
  const [selectedLanguage, setSelectedLanguage] = useState(localStorage.getItem('selectedLanguage') || 'en');

  useEffect(() => {
    localStorage.setItem('selectedLanguage', selectedLanguage);
  }, [selectedLanguage]);

  return (

    <div className='contianer-style'>
      {selectedLanguage === 'en' ? (
        <>
          <h2 className='h2-dash'>Assessment Form</h2>
          <div className='box-button'>
            <div className='div-btn'>
              <Checkbox inputProps={{ 'aria-label': 'controlled' }} />
              <Link to="/home">
                <button className="btn-dash-link">Leadership</button>
              </Link>
              {/* <p className='date-edit'>last done: 99/99/9999</p> */}
            </div>
            <hr className="hr-dash" />
  
            <div className='div-btn'>
              <Checkbox inputProps={{ 'aria-label': 'controlled' }} />
              <Link to="/test"> 
                <button className='btn-dash-link'>Heart Food</button>
              </Link>
              {/* <p className='date-edit'>last done: 99/99/9999</p> */}
            </div>
            <hr className='hr-dash' />
            
            <div className='div-btn'>
              <Checkbox inputProps={{ 'aria-label': 'controlled' }} />
              <button className='btn-dash-link'>Level of Empowerment</button>
              {/* <p className='date-edit'>last done: 99/99/9999</p> */}
            </div>
            <hr className='hr-dash' />
  
            <div className='div-btn'>
              <Checkbox inputProps={{ 'aria-label': 'controlled' }} />
              <button className='btn-dash-link'>Collaboration</button>
              {/* <p className='date-edit'>last done: 99/99/9999</p> */}
            </div>
            <img className='img-bg' src="/bg/home.png" alt="" />
          </div>
        </>
      ) : (
        <>
        <h2 className='h2-dash'>แบบประเมิณ</h2>
        <div className='box-button'>
          <div className='div-btn'>
            <Checkbox inputProps={{ 'aria-label': 'controlled' }} />
            <Link to="/home">
              <button className="btn-dash-link">ผู้นำ 4 ทิศ</button>
            </Link>
            {/* <p className='date-edit'>ล่าสุด : 99/99/9999</p> */}
          </div>
          <hr className="hr-dash" />

          <div className='div-btn'>
            <Checkbox inputProps={{ 'aria-label': 'controlled' }} />
            <Link to="/test"> 
              <button className='btn-dash-link'>อาหารใจ</button>
            </Link>
            {/* <p className='date-edit'>ล่าสุด : 99/99/9999</p> */}
          </div>
          <hr className='hr-dash' />
          
          <div className='div-btn'>
            <Checkbox inputProps={{ 'aria-label': 'controlled' }} />
            <button className='btn-dash-link'>Level of Empowerment</button>
            {/* <p className='date-edit'>ล่าสุด : 99/99/9999</p> */}
          </div>
          <hr className='hr-dash' />

          <div className='div-btn'>
            <Checkbox inputProps={{ 'aria-label': 'controlled' }} />
            <button className='btn-dash-link'>การทำงานร่วมกัน</button>
            {/* <p className='date-edit'>ล่าสุด : 99/99/9999</p> */}
          </div>
          <img className='img-bg' src="/bg/home.png" alt="" />
        </div>
      </>
      )}
    </div>
  );
  
}

export default Dashbord;
