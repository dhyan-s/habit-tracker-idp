var createHabitBtn = document.getElementById('create-habit-btn');
var popupForm = document.getElementById('popup-form');

var datesDiv = document.getElementById("dates");
var foreverRadioYes = document.getElementById('forever-yes');
var foreverRadioNo = document.getElementById('forever-no');

console.log('datesDiv:', datesDiv);
console.log('foreverRadioYes:', foreverRadioYes);
console.log('foreverRadioNo:', foreverRadioNo);

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


function toggleDatePrompt(val) {
    console.log('here');
    if (val == "yes") {
        datesDiv.style.display = "block";
    }
    else if (val == "no") {
        datesDiv.style.display = "none";
    }
}

// foreverRadioYes.addEventListener('change', function () { toggleDatePrompt("yes"); });
// foreverRadioNo.addEventListener('change', function () { toggleDatePrompt("no"); });

document.addEventListener('DOMContentLoaded', function() {
    createHabitBtn.addEventListener('click', function() {
        showPopup();
        // Toggle the display of the habit form
        popupForm.style.display = 'block';
    })
});