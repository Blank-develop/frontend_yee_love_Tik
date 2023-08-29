import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './css/Welcome.css';
import Swal from 'sweetalert2';
import axios from 'axios';

function Welcome() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const name = queryParams.get('name');
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    const hasReloaded = localStorage.getItem('hasReloaded');
    if (!hasReloaded) {
      localStorage.setItem('hasReloaded', 'true');
      window.location.reload();
    }
  }, []);


  useEffect(() => {
    const lastShown = localStorage.getItem('popUpLastShown');
    const currentDate = new Date().toDateString();
    const userEmail = localStorage.getItem('userEmail'); // Replace 'userEmail' with the actual variable name

    // Check if the pop-up was shown today
    if (lastShown !== currentDate) {
      if (userEmail) {
        // Make the API request to check if the email has a phone number
        axios.get(`http://127.0.0.1:8080/api/get/tel?email=${userEmail}`)
          .then(response => {
            const hasPhoneNumber = response.data === 1;

            if (!hasPhoneNumber) {
              // Display the SweetAlert dialog when the component mounts
              Swal.fire({
                title: 'Enter Your Phone Number (ThaiLand)',
                input: 'text',
                inputPlaceholder: 'Enter your phone number',
                showCancelButton: true,
                confirmButtonText: 'Add',
                cancelButtonText: 'Cancel',
                html:
                  '<label for="dontShowAgain">ใส่ เบอร์โทรของคุณ</label>',
                preConfirm: (number) => {
                  if (!number) {
                    Swal.showValidationMessage('Please enter a phone number');
                  } else if (!isValidThaiPhoneNumber(number)) {
                    Swal.showValidationMessage('Please enter a valid Thai phone number');
                  }
                  return number;
                },
              }).then((result) => {
                if (result.isConfirmed) {
                  const updatedPhoneNumber = result.value;

                  // Make the API request to update the phone number
                  axios.put('http://127.0.0.1:8080/api/put/tel', {
                    email: userEmail,
                    phoneNumber: updatedPhoneNumber
                  })
                    .then(response => {
                      // Handle successful response if needed
                      console.log('Phone number updated successfully');
                    })
                    .catch(error => {
                      console.error('Error updating phone number:', error);
                    });
                }

                // Store today's date as the last shown date
                localStorage.setItem('popUpLastShown', currentDate);

                // Check if the "Don't show again" checkbox was checked
                const dontShowAgainCheckbox = document.getElementById('dontShowAgain') as HTMLInputElement;
                if (dontShowAgainCheckbox && dontShowAgainCheckbox.checked) {
                  localStorage.setItem('popUpDontShow', currentDate);
                }
              });
            } else {
              // Email has a phone number, do not show the pop-up
              localStorage.setItem('popUpLastShown', currentDate);
            }
          })
          .catch(error => {
            console.error('Error fetching API data:', error);
          });
      } else {
        console.error('Error Dont have Email in localstorage');
      }
    }
  }, []);



  // Helper function to validate Thai phone numbers
  const isValidThaiPhoneNumber = (number: string) => {
    // Use a regular expression to validate Thai phone numbers
    const thaiPhoneNumberPattern = /^0\d{8,9}$/;
    return thaiPhoneNumberPattern.test(number);
  };

  const handlePhoneNumberPopupClick = () => {
    const userEmail = localStorage.getItem('userEmail');
    // Display the SweetAlert dialog
    Swal.fire({
      title: 'Enter Your Phone Number (ThaiLand)',
      input: 'text',
      inputPlaceholder: 'Enter your phone number',
      showCancelButton: true,
      confirmButtonText: 'Add',
      cancelButtonText: 'Cancel',
      html: '<label for="dontShowAgain">Enter your phone number</label>',
      preConfirm: (number) => {
        if (!number) {
          Swal.showValidationMessage('Please enter a phone number');
        } else if (!isValidThaiPhoneNumber(number)) {
          Swal.showValidationMessage('Please enter a valid Thai phone number');
        }
        return number;
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedPhoneNumber = result.value;

        // Make the API request to update the phone number
        axios.put('http://127.0.0.1:8080/api/put/tel', {
          email: userEmail,  // You might need to provide the email here
          phoneNumber: updatedPhoneNumber
        })
          .then(response => {
            console.log('Phone number updated successfully');
          })
          .catch(error => {
            console.error('Error updating phone number:', error);
          });
      }
    });

    // Helper function to validate Thai phone numbers
    const isValidThaiPhoneNumber = (number: string) => {
      // Use a regular expression to validate Thai phone numbers
      const thaiPhoneNumberPattern = /^0\d{8,9}$/;
      return thaiPhoneNumberPattern.test(number);
    };
  };

  //change language
  const [selectedLanguage, setSelectedLanguage] = useState(localStorage.getItem('selectedLanguage') || 'en');

  useEffect(() => {
    localStorage.setItem('selectedLanguage', selectedLanguage);
  }, [selectedLanguage]);

  // useEffect(() => {
  //   // Calculate font size based on name length
  //   if (name && name.length > 14) {
  //     const adjustedFontSize = 2 - (name.length - 14); // Decrease font size for longer names
  //     setFontSize(adjustedFontSize > 10 ? adjustedFontSize : 10); // Minimum font size of 10
  //   }
  // }, [name]);

  return (
    <div className='body-welcome'>
      {selectedLanguage === 'en' ? (
        <div className='container-welcome position-th'>
          <div className='text-welcome'>
            <strong>
              Welcome, <br />
              {name}
            </strong>
          </div><br />

          <p className='tag-p-home'>
            <strong>Discover Your Inner Animal:<br />
              Falcon, Bear, Rat, or Cow <br />
              Unleash Your True Personality!</strong>
          </p><br />

          <button className='button-start'>
            <Link style={{ textDecoration: 'none' }} to='/home'>
              <p className='text-btn-start'>Let's get started</p>
            </Link>
          </button>
          <button onClick={handlePhoneNumberPopupClick} className='font-size-addphone btn-position'>
            Add or update Phone number
          </button>
        </div>

      ) : (

        <div className='container-welcome position-th'>
          <div className='text-welcome'>
            <strong>ยินดีต้อนรับ <br />{name}</strong>
          </div><br />

          <p className='tag-p-home'>
            <strong>ค้นพบสัตว์ภายในของคุณ ว่าจะเป็น: <br />
              เหยี่ยว หมี หนู หรือ วัว <br />
              ปลดปล่อยบุคลิกที่แท้จริงของคุณ!</strong>
          </p><br />
          <button className='button-start'>
            <Link style={{ textDecoration: 'none' }} to='/home'>
              <p className='text-btn-start'>เริ่มกันเลย</p>
            </Link>
          </button>
          <button onClick={handlePhoneNumberPopupClick} className='font-size-addphone btn-position'>
            เพิ่ม หรือ แก้ไขหมายเลขโทรศัพท์
          </button>
        </div>
      )}
      <img className='img-welcome' src='bg/home.png' alt="Welcome" />
    </div>
  );
}

export default Welcome;
