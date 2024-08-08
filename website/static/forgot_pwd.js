document.getElementById('forgot-password-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;

    if (email) {
        // Simulate sending a reset link
        alert('A password reset link has been sent to ' + email);
        // In a real application, you would send the email to your server here.
    }
});