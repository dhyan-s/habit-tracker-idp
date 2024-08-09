let windowWidth = window.innerWidth



function showPopup() {
    Swal.fire({
        title: "Create New Habit",
        html: document.getElementById('popup-form').innerHTML,
        showCloseButton: true,
        showCancelButton: true,
        focusConfirm: false,
        showConfirmButton: false,
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
            // Process the form data as needed
            console.log(result.value); // Replace with your form submission logic
        }
    });
}




document.addEventListener('DOMContentLoaded', function() {
    var createHabitBtn = document.getElementById('create-habit-btn');
    var habitForm = document.getElementById('habit-form');

    createHabitBtn.addEventListener('click', function() {
        // Toggle the display of the habit form
        if (habitForm.style.display === 'none' || habitForm.style.display === '') {
            habitForm.style.display = 'block';
        } else {
            habitForm.style.display = 'none';
        }
    });

    habitForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the form from submitting
        
        // Retrieve input values
        var habitName = document.getElementById('habit-name').value;
        var timeLimit = document.getElementById('time-limit').value;

        // Log the values (you can do further processing here)
        console.log('Habit Name:', habitName);
        console.log('Time Limit:', timeLimit);

        // Optional: Clear the form fields after submission
        habitForm.reset();

        // Hide the form after submission (optional)
        habitForm.style.display = 'none';
    });
});

// function ResponsiveNavbar() {
//     let navbar = document.getElementById("nav");

//     if windowWidth 
// }