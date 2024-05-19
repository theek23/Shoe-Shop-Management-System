let baseUrl = "http://localhost:8080/shop/data/"

let employeeCode;
var empCodeInput = $('#employeeCode');
var employees = [];

document.addEventListener("DOMContentLoaded", function() {
    var path = window.location.pathname;
    if (path.includes("page-add-employees.html")) {
        initialLoadPage01()

    } else if (path.includes("page-list-employees.html")) {
        initialLoadPage02()
        //searchEmployeeByName()
    } else {
        console.log("Unknown page");
    }
});


function initialLoadPage01(){
    empCodeInput.prop('readonly', true);
    setImage();
    getNewId();
}

function initialLoadPage02(){
    getAllEmployees();
}
//getALlEmployee
function getAllEmployees() {
    $.ajax({
        url: baseUrl + "employeess",
        method: "GET",
        contentType: "application/json",
        success: function (res) {
            if (Array.isArray(res)) {
                employees = res;
                loadAllEmployees(employees);
            } else {
                console.log("No data received or data is not an array");
            }
        },
        error: function (err) {
            console.error("Error fetching employee:", err);
        }
    });
}

function loadAllEmployees(employees) {
    const tbody = document.querySelector('.data-table tbody');

    // Clear any existing rows
    tbody.innerHTML = '';

    // Loop through the employees array and create rows
    employees.forEach((employee, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <div class="checkbox d-inline-block">
                    <input type="checkbox" class="checkbox-input" id="checkbox${index + 2}">
                    <label for="checkbox${index + 2}" class="mb-0"></label>
                </div>
            </td>
            <td>${employee.employeeCode}</td>
            <td>${employee.name}</td>
            <td>${employee.gender}</td>
            <td>${employee.role}</td>
            <td>${employee.branch}</td>
            <td>${employee.joinDate}</td>
            <td>${employee.contactNo}</td>
            <td>
                <div class="d-flex align-items-center list-action">
                    <a class="badge badge-info mr-2" data-toggle="modal" data-target="#view-employee-${index}" data-toggle="tooltip" data-placement="top" title="View">
                        <i class="ri-eye-line mr-0"></i>
                    </a>
                    <a class="badge bg-success mr-2" data-toggle="modal" data-target="#edit-employee-${index}" data-toggle="tooltip" data-placement="top" title="Edit">
                        <i class="ri-pencil-line mr-0"></i>
                    </a>
                    <a class="badge bg-warning mr-2" data-toggle="modal" data-target="#delete-employee-${index}" data-toggle="tooltip" data-placement="top" title="Delete">
                        <i class="ri-delete-bin-line mr-0"></i>
                    </a>
                </div>
            </td>
        `;
        // Append the row to the table body
        tbody.appendChild(row);
        createEmployeeModals(employee, index);
    });
    // Initialize tooltips
    $('[data-toggle="tooltip"]').tooltip();
}

//set image to page
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
        console.log(formDataJson)
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
                    clearFormFields()
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
                clearFormFields()
            },
            error: function(xhr) {
                alert('Error adding employee: ' + xhr.responseJSON.message);
                console.log(xhr.responseJSON.message);
            }
        });
    }
});
//encode image to base 64
function encodeImageToBase64(file, callback) {
    var reader = new FileReader();
    reader.onloadend = function () {
        var base64String = reader.result.split(',')[1];
        callback(base64String);
    };
    reader.readAsDataURL(file);
}

function clearFormFields() {
    $("#employee-form").find("input[type=text], input[type=email], input[type=tel], textarea").val("");
    $("#employee-form").find("input[type=radio], input[type=checkbox]").prop("checked", false);
    $("#employee-form").find("select").prop("selectedIndex", 0);

    // Make the employee code input editable again if necessary
    // $("#employeeCode").prop('readonly', false);
    getNewId();
}