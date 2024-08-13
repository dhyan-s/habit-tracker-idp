import { HabitDisplayManager } from "./habit.js";
import {homepageHabitManager } from "./homepage.js";

var createHabitBtn = document.getElementById('create-habit-btn');
var popupForm = document.getElementById('popup-form');

const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: false,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    }
  });

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
            const notes = Swal.getPopup().querySelector('#notes').value;
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
            else if (!foreverYes.checked && !endDate) {
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
                notes: notes,
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
            fetch('/create_habit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(result.value)
            })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                Toast.fire({
                  icon: "success",
                  title: `Habit Created: ${data['name']}`
                });
                homepageHabitManager.displayNewHabit(data);
            })
            .catch((error) => {
                console.error('Error:', error);
                Toast.fire({
                    icon: "error",
                    title: "There was an issue creating the habit"
                  });
            });
        }  
        else if (result.dismiss) {
            popupForm.style.display = 'none'
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    createHabitBtn.addEventListener('click', function() {
        showPopup();
        // Toggle the display of the habit form
    })
});