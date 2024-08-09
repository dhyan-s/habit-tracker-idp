var createHabitBtn = document.getElementById('create-habit-btn');
var popupForm = document.getElementById('popup-form');


function showPopup() {
    Swal.fire({
        title: "Create New Habit",
        html: document.getElementById('popup-form').innerHTML,
        showCloseButton: true,
        showCancelButton: true,
        focusConfirm: false,
        showConfirmButton: true,
        confirmButtonText: "Submit",
        cancelButtonText: 'Cancel',
        icon: 'info',
        preConfirm: () => {
            // You can add form validation or handling here if needed
            return {
                habitName: document.getElementById('habit-name').value,
                timeLimit: document.getElementById('time-limit').value
            };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            popupForm.style.display = 'none'
        }  
        else if (result.dismiss) {
            popupForm.style.display = 'none';
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    createHabitBtn.addEventListener('click', function() {
        showPopup();
        // Toggle the display of the habit form
        popupForm.style.display = 'block';
    })
});