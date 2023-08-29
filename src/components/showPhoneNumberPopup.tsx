import axios from 'axios';
import Swal from 'sweetalert2';

const showPhoneNumberPopup = () => {
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

// Usage: Call the function when you want to show the popup
export default showPhoneNumberPopup();
