let baseUrl = "http://localhost:8080/shop/data/"

let supplierCode;
var supCodeInput = $('#supplierCode');
var suppliers = [];

document.addEventListener("DOMContentLoaded", function() {
    var path = window.location.pathname;
    if (path.includes("page-add-supplier.html")) {
        initialLoadPage01()

    } else if (path.includes("page-list-suppliers.html")) {
        initialLoadPage02()
        searchSupplierByName()
    } else {
        console.log("Unknown page");
    }
});
function initialLoadPage02(){
    getAllSuppliers();
}

function initialLoadPage01(){
    supCodeInput.prop('readonly', true);

    getNewId();
}
//Generate new ID
function getNewId() {
    $.ajax({
        url: baseUrl + "suppliers/getId",
        method: "GET",
        async: false,
        dataType: "json",
        contentType: "application/json",
        headers: {
            'Authorization': 'Bearer ' + bearerToken
        },
        success: function (res) {
            supplierCode = res.data;
            supCodeInput.val(supplierCode);
        }
    });
}

function searchSupplierByName(){
    const searchInput = document.getElementById('search-name');

// Add an input event listener to log the value to the console

    searchInput.addEventListener('input', (event) => {
        searchSupplier(event.target.value)
        if (event.target.value== null){
            getAllSuppliers();
        }
    });
}
function searchSupplier(searchValue){
    $.ajax({
        url: baseUrl + "suppliers?name="+searchValue,
        method: "GET",
        contentType: "application/json",
        headers: {
            'Authorization': 'Bearer ' + bearerToken
        },
        success: function (res) {
            if (Array.isArray(res)) {
                console.log(res)
                suppliers = res;
                loadAllSuppliers(suppliers);
            } else {
                console.log("No data received or data is not an array");
            }
        },
        error: function (err) {
            console.error("Error fetching supplier:", err);
        }
    });
}
//Supplier Save
$("#saveBtn").click(function() {
    let formData = $("#supplier-form").serialize(); // Now should serialize with correct input names

    var formArray = $("#supplier-form").serializeArray();

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

    delete formDataJson["addressLine1"];
    delete formDataJson["addressLine2"];
    delete formDataJson["addressLine3"];
    delete formDataJson["addressLine4"];
    delete formDataJson["addressLine5"];

    formDataJson["contactNo"] = {
        contact1: formDataJson["contactNo1"],
        contact2: formDataJson["contactNo2"]
    };
    delete formDataJson["contactNo1"];
    delete formDataJson["contactNo2"];
    // Optionally, convert the JSON object to a JSON string
    var formDataJsonString = JSON.stringify(formDataJson);


    $.ajax({
        url: baseUrl + "suppliers",
        method: "POST",
        data: formDataJsonString,
        contentType: "application/json",
        headers: {
            'Authorization': 'Bearer ' + bearerToken
        },
        success: function(res) {
            alert('Supplier added successfully: ' + res.message);
            clearFormFields();
        },
        error: function(xhr) {
            alert('Error adding supplier: ' + xhr.responseJSON.message);
            console.log(xhr.responseJSON.message)
        }
    });
});

function clearFormFields() {
    $("#supplier-form").find("input[type=text], input[type=email], input[type=tel], textarea").val("");
    $("#supplier-form").find("input[type=radio], input[type=checkbox]").prop("checked", false);
    $("#supplier-form").find("select").prop("selectedIndex", 0);

    // Make the supplier code input editable again if necessary
    // $("#supplierCode").prop('readonly', false);
    getNewId();
}
//getALlSuppliers
function getAllSuppliers() {
    $.ajax({
        url: baseUrl + "suppliers",
        method: "GET",
        contentType: "application/json",
        headers: {
            'Authorization': 'Bearer ' + bearerToken
        },
        success: function (res) {
            if (Array.isArray(res)) {
                suppliers = res;
                loadAllSuppliers(suppliers);
            } else {
                console.log("No data received or data is not an array");
            }
        },
        error: function (err) {
            console.error("Error fetching supplier:", err);
        }
    });
}
//load suppliers to the table
function loadAllSuppliers(suppliers) {
    const tbody = document.querySelector('.data-table tbody');

    // Clear any existing rows
    tbody.innerHTML = '';

    // Loop through the suppliers array and create rows
    suppliers.forEach((supplier, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <div class="checkbox d-inline-block">
                    <input type="checkbox" class="checkbox-input" id="checkbox${index + 2}">
                    <label for="checkbox${index + 2}" class="mb-0"></label>
                </div>
            </td>
            <td>${supplier.supplierCode}</td>
            <td>${supplier.name}</td>
            <td>${supplier.email}</td>
            <td>${supplier.contactNo.contact1}</td>
            <td>${supplier.contactNo.contact1}</td>
            <td>${supplier.address.addressLine3}</td>
            <td>${supplier.category}</td>
            <td>
                <div class="d-flex align-items-center list-action">
                    <a class="badge badge-info mr-2" data-toggle="modal" data-target="#view-supplier-${index}" data-toggle="tooltip" data-placement="top" title="View">
                        <i class="ri-eye-line mr-0"></i>
                    </a>
                    <a class="badge bg-success mr-2" data-toggle="modal" data-target="#edit-supplier-${index}" data-toggle="tooltip" data-placement="top" title="Edit">
                        <i class="ri-pencil-line mr-0"></i>
                    </a>
                    <a class="badge bg-warning mr-2" data-toggle="modal" data-target="#delete-supplier-${index}" data-toggle="tooltip" data-placement="top" title="Delete">
                        <i class="ri-delete-bin-line mr-0"></i>
                    </a>
                </div>
            </td>
        `;
        // Append the row to the table body
        tbody.appendChild(row);
        createSupplierModals(supplier, index);
    });
    // Initialize tooltips
    $('[data-toggle="tooltip"]').tooltip();
}
//supplier view, edit and delete models
function createSupplierModals(supplier, index) {
    const modalsContainer = document.querySelector('body');

    const viewModal = document.createElement('div');
    viewModal.classList.add('modal', 'fade');
    viewModal.id = `view-supplier-${index}`;
    viewModal.tabIndex = '-1';
    viewModal.role = 'dialog';
    viewModal.innerHTML = `
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">View Supplier</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <p><b>Supplier Code:</b> ${supplier.supplierCode}</p>
                    <p><b>Name:</b> ${supplier.name}</p>
                    <p><b>Email:</b> ${supplier.email}</p>
                    <p><b>Phone No 1:</b> ${supplier.contactNo.contact1}</p>
                    <p><b>Phone No 2:</b> ${supplier.contactNo.contact2}</p>
                    <p><b>City:</b> ${supplier.address.addressLine3}</p>
                    <p><b>Category:</b> ${supplier.category}</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    `;
    modalsContainer.appendChild(viewModal);

    // Edit modal
    const editModal = document.createElement('div');
    editModal.classList.add('modal', 'fade');
    editModal.id = `edit-supplier-${index}`;
    editModal.tabIndex = '-1';
    editModal.role = 'dialog';
    editModal.innerHTML = `
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Edit Supplier</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form id="edit-supplier-form-${index}">
                        <div class="form-group">
                            <label for="edit-supplier-name-${index}">Name</label>
                            <input type="text" class="form-control" id="edit-supplier-name-${index}" value="${supplier.name}">
                        </div>
                        <div class="form-group">
                            <label for="edit-supplier-email-${index}">Email</label>
                            <input type="email" class="form-control" id="edit-supplier-email-${index}" value="${supplier.email}">
                        </div>
                        <div class="form-group">
                            <label for="edit-supplier-phoneNo1-${index}">Phone No 1</label>
                            <input type="text" class="form-control" id="edit-supplier-phoneNo1-${index}" value="${supplier.contactNo.contact1}">
                        </div>
                        <div class="form-group">
                            <label for="edit-supplier-phoneNo2-${index}">Phone No 2</label>
                            <input type="text" class="form-control" id="edit-supplier-phoneNo2-${index}" value="${supplier.contactNo.contact2}">
                        </div>
                         <div class="form-group">
                            <label for="edit-supplier-category-${index}">Category</label>
                            <select class="form-control" id="edit-supplier-category-${index}">
                                <option ${supplier.category === 'International' ? 'selected' : ''}>International</option>
                                <option ${supplier.category === 'Local' ? 'selected' : ''}>Local</option>
                            </select>
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
    deleteModal.id = `delete-supplier-${index}`;
    deleteModal.tabIndex = '-1';
    deleteModal.role = 'dialog';
    deleteModal.innerHTML = `
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Delete Supplier</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <p>Are you sure you want to delete <strong>${supplier.supplierCode}, ${supplier.name}</strong>?</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">No</button>
                    <button type="button" class="btn btn-danger" id="confirm-delete-${index}">Yes</button>
                </div>
            </div>
        </div>
    `;
    modalsContainer.appendChild(deleteModal);

    $(`#edit-supplier-form-${index}`).off('submit').on('submit', function (event) {
        event.preventDefault();
        const updatedSupplier = {
            supplierCode: supplier.supplierCode,
            name: document.getElementById(`edit-supplier-name-${index}`).value,
            email: document.getElementById(`edit-supplier-email-${index}`).value,
            contactNo: {
                contact1: document.getElementById(`edit-supplier-phoneNo1-${index}`).value,
                contact2: document.getElementById(`edit-supplier-phoneNo2-${index}`).value
            },
            address: supplier.address,
            category: document.getElementById(`edit-supplier-category-${index}`).value
        };

        updateSupplier(supplier.supplierCode, updatedSupplier, index);
    });

    $(`#confirm-delete-${index}`).off('click').on('click', function () {
        deleteSupplier(supplier.supplierCode, index);
    });
}
//deleteSupplier
function deleteSupplier(id,index) {
    $.ajax({
        url: baseUrl + "suppliers/" + id,
        method: "DELETE",
        headers: {
            'Authorization': 'Bearer ' + bearerToken
        },
        success: function (res) {
            alert('Supplier deleted successfully');
            closeModel(index,"delete");
            getAllSuppliers();
        },
        error: function (error) {
            let message = JSON.parse(error.responseText).message;
            console.log(message);
            alert('Failed to delete supplier: ' + message);
        }
    });
}


//update Supplier
function updateSupplier(id,supplier,index){
    $.ajax({
        url: baseUrl + "suppliers/"+ id,
        method: "PUT",
        contentType: "application/json",
        headers: {
            'Authorization': 'Bearer ' + bearerToken
        },
        data: JSON.stringify(supplier),
        success: function (res) {
            alert('Supplier Updated successfully: ' + res.message);
            closeModel(index,"update");
            getAllSuppliers();
        },
        error: function (error) {
            let message = JSON.parse(error.responseText).message;
            console.log(message)
        }
    });
}

function closeModel(index,method){
    if(method== "delete"){
        $(`#delete-supplier-${index}`).modal('hide');
    }else if(method== "update"){
        $(`#edit-supplier-${index}`).modal('hide');
    }
    $('.modal-backdrop').remove();
    $('body').removeClass('modal-open');
    $('body').css('padding-right', '');
}