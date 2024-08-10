var createHabitBtn = document.getElementById('create-habit-btn');
var popupForm = document.getElementById('popup-form');

var datesDiv = document.getElementById("dates");
var foreverRadioYes = document.getElementById('forever-yes');
var foreverRadioNo = document.getElementById('forever-no');

console.log('datesDiv:', datesDiv);
console.log('foreverRadioYes:', foreverRadioYes);
console.log('foreverRadioNo:', foreverRadioNo);

function getDateAsStr() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

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
        didOpen: () => {
            // Fill in start date to today's date
            let date = getDateAsStr();
            const startDate = Swal.getPopup().querySelector("input[name='start-date']");
            startDate.value = getDateAsStr();
        },
        preConfirm: () => {
            const habitName = Swal.getPopup().querySelector('#habit-name').value;
            const foreverYes = Swal.getPopup().querySelector('#forever-yes');
            const foreverNo = Swal.getPopup().querySelector('#forever-no');
            const startDate = Swal.getPopup().querySelector("input[name='start-date']").value;
            const endDate = Swal.getPopup().querySelector("input[name='end-date']").value;
            const reminderYes = Swal.getPopup().querySelector('#reminder-yes');
            const reminderNo = Swal.getPopup().querySelector('#reminder-no');
            const daysCheckboxes = Swal.getPopup().querySelectorAll('.days-label input');
            
            // Validations
            if (!habitName.trim()) {
                Swal.showValidationMessage('Please enter the habit name');
                return false;
            }

            if (!foreverYes.checked && !foreverNo.checked) {
                Swal.showValidationMessage('Please select if the habit is forever or not');
                return false;
            }
            else if (foreverYes.checked && !endDate) {
                Swal.showValidationMessage('Please choose an end date');
            }

            let daysSelected = false;
            daysCheckboxes.forEach(checkbox => {
                if (checkbox.checked) {
                    daysSelected = true;
                }
            });
            if (!daysSelected) {
                Swal.showValidationMessage('Please select at least one day');
                return false;
            }

            if (!reminderYes.checked && !reminderNo.checked) {
                Swal.showValidationMessage('Please select if you want a reminder or not');
                return false;
            }

            return {
                habitName: habitName,
                forever: foreverYes.checked ? 'yes' : 'no',
                startDate: startDate,
                endDate: endDate,
                days: Array.from(daysCheckboxes).filter(cb => cb.checked).map(cb => cb.value),
                reminder: reminderYes.checked ? 'yes' : 'no'
            };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            popupForm.style.display = 'none'
            console.log(result.value); // Handle the form data here
        }  
        else if (result.dismiss) {
            popupForm.style.display = 'none'
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