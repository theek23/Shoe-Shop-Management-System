let baseUrl = "http://localhost:8080/shop/data/"

let customerCode;
var custCodeInput = $('#customerCode');
var pointsInput = $('#totalPoints');
var customers = [];
// Set the customer code input field to '0001' and make it non-editable

//Identify witch page using
document.addEventListener("DOMContentLoaded", function() {
    var path = window.location.pathname;
    if (path.includes("page-add-customers.html")) {
        initialLoadPage01()
    } else if (path.includes("page-list-customers.html")) {
        initialLoadPage02()
        searchCustomerByName()
    } else {
        console.log("Unknown page");
    }
});

function initialLoadPage02(){
    getAllCustomers();
}

function initialLoadPage01(){
    custCodeInput.prop('readonly', true);

    pointsInput.val("0000");
    var currentDate = new Date();
    var joinDateInput = $('#joinDate');

    var formattedDate = currentDate.toISOString().substring(0, 10);

    joinDateInput.val(formattedDate);
    getNewId();
}
function searchCustomerByName(){
    const searchInput = document.getElementById('search-name');

// Add an input event listener to log the value to the console

    searchInput.addEventListener('input', (event) => {
        searchCustomer(event.target.value)
        if (event.target.value== null){
            getAllCustomers();
        }
    });
}
function searchCustomer(searchValue){
    $.ajax({
        url: baseUrl + "customers?name="+searchValue,
        method: "GET",
        contentType: "application/json",
        success: function (res) {
            if (Array.isArray(res)) {
                customers = res;
                loadAllCustomers(customers);
            } else {
                console.log("No data received or data is not an array");
            }
        },
        error: function (err) {
            console.error("Error fetching customers:", err);
        }
    });
}
//Generate new ID
function getNewId() {
    $.ajax({
        url: baseUrl + "customers/NewLoyaltyMember",
        method: "get",
        async: false,
        dataType: "json",
        contentType: "application/json",
        success: function (res) {
            customerCode = res.data;
            custCodeInput.val(customerCode);

        }
    });
}

//getALlCustomers
function getAllCustomers() {
    $.ajax({
        url: baseUrl + "customers",
        method: "GET",
        contentType: "application/json",
        success: function (res) {
            if (Array.isArray(res)) {
                customers = res;
                loadAllCustomers(customers);
            } else {
                console.log("No data received or data is not an array");
            }
        },
        error: function (err) {
            console.error("Error fetching customers:", err);
        }
    });
}
function closeModel(index,method){
    if(method== "delete"){
        $(`#delete-customer-${index}`).modal('hide');
    }else if(method== "update"){
        $(`#edit-customer-${index}`).modal('hide');
    }
    $('.modal-backdrop').remove();
    $('body').removeClass('modal-open');
    $('body').css('padding-right', '');
}

//Delete Customer

function deleteCustomer(id,index) {
    $.ajax({
        url: baseUrl + "customers/" + id,
        method: "DELETE",
        success: function (res) {
                alert('Customer deleted successfully');
                closeModel(index,"delete");
                getAllCustomers();
        },
        error: function (error) {
            let message = JSON.parse(error.responseText).message;
            console.log(message);
            alert('Failed to delete customer: ' + message);
        }
    });
}


//update Customer
function updateCustomer(id,customer,index){
    $.ajax({
        url: baseUrl + "customers/"+ id,
        method: "PUT",
        contentType: "application/json",
        data: JSON.stringify(customer),
        success: function (res) {
            alert('Customer Updated successfully: ' + res.message);
            closeModel(index,"update");
            getAllCustomers();
        },
        error: function (error) {
            let message = JSON.parse(error.responseText).message;
            console.log(message)
        }
    });
}

//Customer Save
$("#saveBtn").click(function() {
    let formData = $("#customer-form").serialize(); // Now should serialize with correct input names

    var formArray = $("#customer-form").serializeArray();

    // Convert the array to a JSON object
    var formDataJson = {};
    $.each(formArray, function(_, field) {
        formDataJson[field.name] = field.value;
    });

    formDataJson["address"] = {
        addressLine1: formDataJson["addressLine1"],
        addressLine2: formDataJson["addressLine2"],
        addressLine3: formDataJson["addressLine3"],
        addressLine4: formDataJson["addressLine4"],
        addressLine5: formDataJson["addressLine5"]
    };

    // Remove individual address fields from main JSON object
    delete formDataJson["addressLine1"];
    delete formDataJson["addressLine2"];
    delete formDataJson["addressLine3"];
    delete formDataJson["addressLine4"];
    delete formDataJson["addressLine5"];

    // Optionally, convert the JSON object to a JSON string
    var formDataJsonString = JSON.stringify(formDataJson);

    console.log(formDataJsonString);

    $.ajax({
        url: baseUrl + "customers",
        method: "POST",
        data: formDataJsonString,
        contentType: "application/json",
        success: function(res) {
            alert('Customer added successfully: ' + res.message);
            clearFormFields();
        },
        error: function(xhr) {
            alert('Error adding customer: ' + xhr.responseJSON.message);
            console.log(xhr.responseJSON.message)
        }
    });
});

//clear fields
function clearFormFields() {
    $("#customer-form").find("input[type=text], input[type=email], input[type=tel], textarea").val("");
    $("#customer-form").find("input[type=radio], input[type=checkbox]").prop("checked", false);
    $("#customer-form").find("select").prop("selectedIndex", 0);

    // Make the customer code input editable again if necessary
    $("#customerCodeInput").prop('readonly', false);
    getNewId();
}

//customer details to table
function loadAllCustomers(customers) {
    const tbody = document.querySelector('.data-table tbody');

    // Clear any existing rows
    tbody.innerHTML = '';

    // Loop through the customers array and create rows
    customers.forEach((customer, index) => {
        const row = document.createElement('tr');
        let badgeClass = 'badge-orange';
        if (customer.level == "New"){
            badgeClass = 'badge-warning';
        }else if (customer.level == "Silver"){
            badgeClass = 'badge-dark'
        }else if (customer.level == "Gold"){
            badgeClass = 'badge-orange'
        }else if (customer.level == "Bronze"){
            badgeClass = 'badge-skyblue'
        }
        row.innerHTML = `
            <td>
                <div class="checkbox d-inline-block">
                    <input type="checkbox" class="checkbox-input" id="checkbox${index + 2}">
                    <label for="checkbox${index + 2}" class="mb-0"></label>
                </div>
            </td>
            <td>${customer.name}</td>
            <td>${customer.email}</td>
            <td>${customer.contactNo}</td>
            <td>${customer.gender}</td>
            <td><div class="badge ${badgeClass}">${customer.level}</div></td>
            <td>${customer.totalPoints}</td>
            <td>${new Date(customer.joinDate).toLocaleDateString()}</td>
            <td>
                <div class="d-flex align-items-center list-action">
                    <a class="badge badge-info mr-2" data-toggle="modal" data-target="#view-customer-${index}" data-toggle="tooltip" data-placement="top" title="View">
                        <i class="ri-eye-line mr-0"></i>
                    </a>
                    <a class="badge bg-success mr-2" data-toggle="modal" data-target="#edit-customer-${index}" data-toggle="tooltip" data-placement="top" title="Edit">
                        <i class="ri-pencil-line mr-0"></i>
                    </a>
                    <a class="badge bg-warning mr-2" data-toggle="modal" data-target="#delete-customer-${index}" data-toggle="tooltip" data-placement="top" title="Delete">
                        <i class="ri-delete-bin-line mr-0"></i>
                    </a>
                </div>
            </td>
        `;
        // Append the row to the table body
        tbody.appendChild(row);
        createCustomerModals(customer, index);
    });
    // Initialize tooltips
    $('[data-toggle="tooltip"]').tooltip();
}
function createCustomerModals(customer, index) {
    // Create and append modals to the body (example for view modal, repeat for edit and delete)
    const modalsContainer = document.querySelector('body');

    const viewModal = document.createElement('div');
    viewModal.classList.add('modal', 'fade');
    viewModal.id = `view-customer-${index}`;
    viewModal.tabIndex = '-1';
    viewModal.role = 'dialog';
    viewModal.innerHTML = `
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">View Customer</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <p><b>Customer Code:</b> ${customer.customerCode}</p>
                    <p><b>Name:</b> ${customer.name}</p>
                    <p><b>Email:</b> ${customer.email}</p>
                    <p><b>Phone:</b> ${customer.contactNo}</p>
                    <p><b>Gender:</b> ${customer.gender}</p>
                    <p><b>Level:</b> ${customer.level}</p>
                    <p><b>Points:</b> ${customer.totalPoints}</p>
                    <p><b>Join Date:</b> ${new Date(customer.joinDate).toLocaleDateString()}</p>
                    <!-- Add more customer details as needed -->
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    `;

    modalsContainer.appendChild(viewModal);

    // Repeat the above for edit and delete modals


    // Edit modal
    const editModal = document.createElement('div');
    editModal.classList.add('modal', 'fade');
    editModal.id = `edit-customer-${index}`;
    editModal.tabIndex = '-1';
    editModal.role = 'dialog';
    editModal.innerHTML = `
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Edit Customer</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form id="edit-customer-form-${index}">
                        <div class="form-group">
                            <label for="edit-customer-name-${index}">Name</label>
                            <input type="text" class="form-control" id="edit-customer-name-${index}" value="${customer.name}">
                        </div>
                        <div class="form-group">
                            <label for="edit-customer-email-${index}">Email</label>
                            <input type="email" class="form-control" id="edit-customer-email-${index}" value="${customer.email}">
                        </div>
                        <div class="form-group">
                            <label for="edit-customer-contact-${index}">Phone</label>
                            <input type="text" class="form-control" id="edit-customer-contact-${index}" value="${customer.contactNo}">
                        </div>
                        <div class="form-group">
                            <label for="edit-customer-gender-${index}">Gender</label>
                            <select class="form-control" id="edit-customer-gender-${index}">
                                <option ${customer.gender === 'Male' ? 'selected' : ''}>Male</option>
                                <option ${customer.gender === 'Female' ? 'selected' : ''}>Female</option>
                                <option ${customer.gender === 'Other' ? 'selected' : ''}>Other</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="edit-customer-level-${index}">Level</label>
                            <select class="form-control" id="edit-customer-level-${index}">
                                <option ${customer.level === 'New' ? 'selected' : ''}>New</option>
                                <option ${customer.level === 'Gold' ? 'selected' : ''}>Gold</option>
                                <option ${customer.level === 'Silver' ? 'selected' : ''}>Silver</option>
                                <option ${customer.level === 'Bronze' ? 'selected' : ''}>Bronze</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="edit-customer-points-${index}">Points</label>
                            <input type="number" class="form-control" id="edit-customer-points-${index}" value="${customer.totalPoints}">
                        </div>
                        <button id="editBtn" type="submit" class="btn btn-primary">Save changes</button>
                    </form>
                </div>
            </div>
        </div>
    `;
    modalsContainer.appendChild(editModal);

    const deleteModal = document.createElement('div');
    deleteModal.classList.add('modal', 'fade');
    deleteModal.id = `delete-customer-${index}`;
    deleteModal.tabIndex = '-1';
    deleteModal.role = 'dialog';
    deleteModal.innerHTML = `
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Delete Customer</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <p>Are you sure you want to delete <strong>${customer.customerCode}, ${customer.name}</strong>?</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">No</button>
                    <button type="button" class="btn btn-danger" id="confirm-delete-${index}">Yes</button>
                </div>
            </div>
        </div>
    `;
    modalsContainer.appendChild(deleteModal);


    document.getElementById(`edit-customer-form-${index}`).addEventListener('submit', function (event) {
        event.preventDefault();
        const updatedCustomer = {
            customerCode: customer.customerCode,
            name: document.getElementById(`edit-customer-name-${index}`).value,
            email: document.getElementById(`edit-customer-email-${index}`).value,
            contactNo: document.getElementById(`edit-customer-contact-${index}`).value,
            gender: document.getElementById(`edit-customer-gender-${index}`).value,
            level: document.getElementById(`edit-customer-level-${index}`).value,
            totalPoints: document.getElementById(`edit-customer-points-${index}`).value
        };

        updateCustomer(customer.customerCode, updatedCustomer, index);
    });

    document.getElementById(`confirm-delete-${index}`).addEventListener('click', function () {
        deleteCustomer(customer.customerCode, index);
    });
}