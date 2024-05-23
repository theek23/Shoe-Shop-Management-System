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
        searchEmployeeByName()
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
//search by name
function searchEmployeeByName(){
    const searchInput = document.getElementById('search-name');

    searchInput.addEventListener('input', (event) => {
        searchEmployee(event.target.value)
        if (event.target.value== null){
            getAllEmployees();
        }
    });
}

function searchEmployee(searchValue){
    $.ajax({
        url: baseUrl + "employees?name="+searchValue,
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
            console.error("Error fetching employees:", err);
        }
    });
}
//getALlEmployee
function getAllEmployees() {
    $.ajax({
        url: baseUrl + "employees",
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
            <td>${employee.dateOfJoin}</td>
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
//decode image to base 64
function decodeBase64ToImage(base64String, imgElementId) {
    const imgElement = document.getElementById(imgElementId);
    imgElement.src = `data:image/jpeg;base64,${base64String}`;
}

function clearFormFields() {
    $("#employee-form").find("input[type=text], input[type=email], input[type=tel], textarea").val("");
    $("#employee-form").find("input[type=radio], input[type=checkbox]").prop("checked", false);
    $("#employee-form").find("select").prop("selectedIndex", 0);

    // Make the employee code input editable again if necessary
    // $("#employeeCode").prop('readonly', false);
    getNewId();
}

function createEmployeeModals(employee, index) {
    const modalsContainer = document.querySelector('body');

    // Convert profile picture from byte array to base64 string for display
    const profilePicBase64 = employee.profilePic ? btoa(String.fromCharCode(...new Uint8Array(employee.profilePic))) : '';

    // View modal
    const viewModal = document.createElement('div');
    viewModal.classList.add('modal', 'fade');
    viewModal.id = `view-employee-${index}`;
    viewModal.tabIndex = '-1';
    viewModal.role = 'dialog';
    viewModal.innerHTML = `
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">View Employee</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <img id="preview-img-${index}" alt="Profile Picture" style="max-width: 50%;">
                    <p><b>Employee Code:</b> ${employee.employeeCode}</p>
                    <p><b>Name:</b> ${employee.name}</p>
                    <p><b>Email:</b> ${employee.email}</p>
                    <p><b>Phone No:</b> ${employee.contactNo}</p>
                    <p><b>Gender:</b> ${employee.gender}</p>
                    <p><b>Status:</b> ${employee.status}</p>
                    <p><b>Designation:</b> ${employee.designation}</p>
                    <p><b>Role:</b> ${employee.role}</p>
                    <p><b>Date of Birth:</b> ${employee.dateOfBirth}</p>
                    <p><b>Date of Join:</b> ${employee.dateOfJoin}</p>
                    <p><b>Branch:</b> ${employee.branch}</p>
                    <p><b>Address:</b> ${employee.address}</p>
                    <p><b>Guardian Name:</b> ${employee.guardianName}</p>
                    <p><b>Emergency Contact No:</b> ${employee.emergencyContactNo}</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    `;
    modalsContainer.appendChild(viewModal);
    if (employee.profilePic) {
        decodeBase64ToImage(employee.profilePic, `preview-img-${index}`);
    }

    // Edit modal
    const editModal = document.createElement('div');
    editModal.classList.add('modal', 'fade');
    editModal.id = `edit-employee-${index}`;
    editModal.tabIndex = '-1';
    editModal.role = 'dialog';
    editModal.innerHTML = `
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Edit Employee</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form id="edit-employee-form-${index}">
                        <div class="form-group">
                            <label for="edit-employee-name-${index}">Name</label>
                            <input type="text" class="form-control" id="edit-employee-name-${index}" value="${employee.name}">
                        </div>
                        <div class="form-group">
                            <label for="edit-employee-email-${index}">Email</label>
                            <input type="email" class="form-control" id="edit-employee-email-${index}" value="${employee.email}">
                        </div>
                        <div class="form-group">
                            <label for="edit-employee-phoneNo-${index}">Phone No</label>
                            <input type="text" class="form-control" id="edit-employee-phoneNo-${index}" value="${employee.contactNo}">
                        </div>
                        <div class="form-group">
                            <label for="edit-employee-gender-${index}">Gender</label>
                            <select id="edit-employee-gender-${index}" name="gender" class="form-control" data-style="py-0">
                                <option value="Male" ${employee.gender === 'Male' ? 'selected' : ''}>Male</option>
                                <option value="Female" ${employee.gender === 'Female' ? 'selected' : ''}>Female</option>
                                <option value="Others" ${employee.gender === 'Others' ? 'selected' : ''}>Others</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="edit-employee-status-${index}">Status</label>
                            <select id="edit-employee-status-${index}" name="status" class="form-control" data-style="py-0">
                                <option value="Married" ${employee.status === 'Married' ? 'selected' : ''}>Married</option>
                                <option value="Unmarried" ${employee.status === 'Unmarried' ? 'selected' : ''}>Unmarried</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="edit-employee-designation-${index}">Designation</label>
                            <input type="text" class="form-control" id="edit-employee-designation-${index}" value="${employee.designation}">
                        </div>
                        <div class="form-group">
                            <label for="edit-employee-role-${index}">Role</label>
                            <select id="edit-employee-role-${index}" name="role" class="form-control" data-style="py-0">
                                <option value="ADMIN" ${employee.role === 'ADMIN' ? 'selected' : ''}>Admin</option>
                                <option value="USER" ${employee.role === 'USER' ? 'selected' : ''}>User</option>
                            </select>   
                        </div>
                        <div class="form-group">
                            <label for="edit-employee-dateOfBirth-${index}">Date of Birth</label>
                            <input type="date" class="form-control" id="edit-employee-dateOfBirth-${index}" value="${employee.dateOfBirth}">
                        </div>
                        <div class="form-group">
                            <label for="edit-employee-dateOfJoin-${index}">Date of Join</label>
                            <input type="date" class="form-control" id="edit-employee-dateOfJoin-${index}" value="${employee.dateOfJoin}">
                        </div>
                        <div class="form-group">
                            <label for="edit-employee-branch-${index}">Branch</label>
                            <input type="text" class="form-control" id="edit-employee-branch-${index}" value="${employee.branch}">
                        </div>
                        <div class="form-group">
                            <label for="edit-employee-guardianName-${index}">Guardian Name</label>
                            <input type="text" class="form-control" id="edit-employee-guardianName-${index}" value="${employee.guardianName}">
                        </div>
                        <div class="form-group">
                            <label for="edit-employee-emergencyContactNo-${index}">Emergency Contact No</label>
                            <input type="text" class="form-control" id="edit-employee-emergencyContactNo-${index}" value="${employee.emergencyContactNo}">
                        </div>
                        <button type="submit" class="btn btn-primary">Save changes</button>
                    </form>
                </div>
            </div>
        </div>
    `;
    modalsContainer.appendChild(editModal);

    // Delete modal
    const deleteModal = document.createElement('div');
    deleteModal.classList.add('modal', 'fade');
    deleteModal.id = `delete-employee-${index}`;
    deleteModal.tabIndex = '-1';
    deleteModal.role = 'dialog';
    deleteModal.innerHTML = `
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Delete Employee</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <p>Are you sure you want to delete <strong>${employee.employeeCode}, ${employee.name}</strong>?</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">No</button>
                    <button type="button" class="btn btn-danger" id="confirm-delete-${index}">Yes</button>
                </div>
            </div>
        </div>
    `;
    modalsContainer.appendChild(deleteModal);
    //update
    $(`#edit-employee-form-${index}`).off('submit').on('submit', function (event) {
        event.preventDefault();
        const updatedEmployee = {
            employeeCode: employee.employeeCode,
            name: document.getElementById(`edit-employee-name-${index}`).value,
            email: document.getElementById(`edit-employee-email-${index}`).value,
            contactNo: document.getElementById(`edit-employee-phoneNo-${index}`).value,
            gender: document.getElementById(`edit-employee-gender-${index}`).value,
            status: document.getElementById(`edit-employee-status-${index}`).value,
            designation: document.getElementById(`edit-employee-designation-${index}`).value,
            role: document.getElementById(`edit-employee-role-${index}`).value,
            dateOfBirth: document.getElementById(`edit-employee-dateOfBirth-${index}`).value,
            dateOfJoin: document.getElementById(`edit-employee-dateOfJoin-${index}`).value,
            branch: document.getElementById(`edit-employee-branch-${index}`).value,
            address: employee.address,
            guardianName: document.getElementById(`edit-employee-guardianName-${index}`).value,
            emergencyContactNo: document.getElementById(`edit-employee-emergencyContactNo-${index}`).value,
            profilePic: employee.profilePic  // Assuming profilePic is not edited here
        };

        updateEmployee(employee.employeeCode, updatedEmployee, index);
    });

    $(`#confirm-delete-${index}`).off('click').on('click', function () {
        deleteEmployee(employee.employeeCode, index);
    });
}
// Function to update employee
function updateEmployee(id, employee, index) {
    $.ajax({
        url: baseUrl + "employees/" + id,
        method: "PUT",
        contentType: "application/json",
        data: JSON.stringify(employee),
        success: function (res) {
            alert('Employee updated successfully: ' + res.message);
            closeModel(index, "update");
            getAllEmployees();
        },
        error: function (error) {
            let message = JSON.parse(error.responseText).message;
            console.log(message);
            alert('Failed to update employee: ' + message);
        }
    });
}

// Function to delete employee
function deleteEmployee(id, index) {
    $.ajax({
        url: baseUrl + "employees/" + id,
        method: "DELETE",
        success: function (res) {
            alert('Employee deleted successfully');
            closeModel(index, "delete");
            getAllEmployees();
        },
        error: function (error) {
            let message = JSON.parse(error.responseText).message;
            console.log(message);
            alert('Failed to delete employee: ' + message);
        }
    });
}
//close window
function closeModel(index,method){
    if(method== "delete"){
        $(`#delete-employee-${index}`).modal('hide');
    }else if(method== "update"){
        $(`#edit-employee-${index}`).modal('hide');
    }
    $('.modal-backdrop').remove();
    $('body').removeClass('modal-open');
    $('body').css('padding-right', '');
}