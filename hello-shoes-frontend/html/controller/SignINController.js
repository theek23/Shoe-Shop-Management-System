const baseurl = "http://localhost:8080/shop/api/v0/auth/";


document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    // Gather form data
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('customCheck1').checked;

    // Create a data object to send
    const data = {
        email: email,
        password: password,
        rememberMe: rememberMe
    };

    // Log the data to the console (for testing purposes)
    console.log(data);

    // Here you can send the data to your server using fetch or another method
    $.ajax({
        url: "http://localhost:8080/shop/api/v0/auth/signin", // Replace with your actual endpoint
        type: 'POST',
        contentType: 'application/json',
        /*headers: {
            'Authorization': 'Bearer ' + bearerToken
        },*/
        data: JSON.stringify(data),
        success: function (response) {
            console.log(response)
        },
        error: function (error) {
            console.error('Error during login:', error);
            // Handle error response
        }
    });
});