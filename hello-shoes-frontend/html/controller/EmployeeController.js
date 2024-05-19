let baseUrl = "http://localhost:8080/shop/data/"

let employeeCode;
var empCodeInput = $('#employeeCode');
var employees = [];

document.addEventListener("DOMContentLoaded", function() {
    var path = window.location.pathname;
    if (path.includes("page-add-employees.html")) {
        initialLoadPage01()

    } else if (path.includes("page-list-employees.html")) {
        //initialLoadPage02()
        //searchSupplierByName()
    } else {
        console.log("Unknown page");
    }
});
function initialLoadPage01(){
    empCodeInput.prop('readonly', true);
    setImage();
    getNewId();
}

function setImage(){
    document.getElementById('file-1').addEventListener('change', function(event) {
        var reader = new FileReader();
        reader.onload = function(){
            var img = document.getElementById('preview-img');
            img.src = reader.result;
        }
        reader.readAsDataURL(event.target.files[0]);
    });
}

//Generate new ID
function getNewId() {
    $.ajax({
        url: baseUrl + "employees/getId",
        method: "GET",
        async: false,
        dataType: "json",
        contentType: "application/json",
        success: function (res) {
            employeeCode = res.data;
            empCodeInput.val(employeeCode);
        }
    });
}

$("#saveBtn").click(function(event) {
    event.preventDefault(); // Prevent default form submission

    let formData = new FormData($("#employee-form")[0]);
    let formArray = $("#employee-form").serializeArray();

    // Convert the array to a JSON object
    var formDataJson = {};
    $.each(formArray, function(_, field) {
        formDataJson[field.name] = field.value;
    });

    // Construct the address object
    formDataJson["address"] = {
        addressLine1: formDataJson["buildingNo"],
        addressLine2: formDataJson["lane"],
        addressLine3: formDataJson["mainCity"],
        addressLine4: formDataJson["mainState"],
        addressLine5: formDataJson["postalCode"]
    };

    delete formDataJson["buildingNo"];
    delete formDataJson["lane"];
    delete formDataJson["mainCity"];
    delete formDataJson["mainState"];
    delete formDataJson["postalCode"];

    // Encode profile picture to base64 and append to FormData
    let fileInput = document.getElementById('file-1');
    let file = fileInput.files[0];

    if (file) {
        encodeImageToBase64(file, function(base64String) {
            formDataJson["profilePic"] = base64String;

            // Perform the AJAX request
            $.ajax({
                url: baseUrl + "employees",
                method: "POST",
                data: JSON.stringify(formDataJson),
                processData: false,
                contentType: "application/json",
                success: function(res) {
                    alert('Employee added successfully: ' + res.message);
                    // Optionally clear the form fields here
                    // $("#employee-form")[0].reset();
                },
                error: function(xhr) {
                    alert('Error adding employee: ' + xhr.responseJSON.message);
                    console.log(xhr.responseJSON.message);
                }
            });
        });
    } else {
        // Perform the AJAX request without profile picture
        $.ajax({
            url: baseUrl + "employees",
            method: "POST",
            data: JSON.stringify(formDataJson),
            processData: false,
            contentType: "application/json",
            success: function(res) {
                alert('Employee added successfully: ' + res.message);
                // Optionally clear the form fields here
                // $("#employee-form")[0].reset();
            },
            error: function(xhr) {
                alert('Error adding employee: ' + xhr.responseJSON.message);
                console.log(xhr.responseJSON.message);
            }
        });
    }
});

function encodeImageToBase64(file, callback) {
    var reader = new FileReader();
    reader.onloadend = function () {
        var base64String = reader.result.split(',')[1];
        callback(base64String);
    };
    reader.readAsDataURL(file);
}
