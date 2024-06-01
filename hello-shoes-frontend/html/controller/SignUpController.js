document.getElementById('signupForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    // Gather form data
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('roleSelect').value;

    // Create a data object to send
    const data = {
        email: email,
        password: password,
        role: role
    };

    // Use AJAX to send the data
    $.ajax({
        url: "http://localhost:8080/shop/api/v0/auth/signup", // Replace with your actual endpoint
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function (response) {
            console.log('Sign-up successful:', response);
            // Redirect to a different page or show a success message
            if (role=="ADMIN"){
                window.location.href = 'dashboard.html';
            }else {
                window.location.href = 'user/dashboard.html';
            }
             // Redirect to the sign-in page or another page
        },
        error: function (error) {
            console.error('Error during sign-up:', error);
            // Handle error response
        }
    });
});