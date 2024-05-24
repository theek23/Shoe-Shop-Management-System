let baseUrl = "http://localhost:8080/shop/data/"

let itemCode;
var itmCodeInput = $('#itemCode');
var categoryInput = $('#category');
var items = [];
let suppliers = [];
setSuppliers()

var originalQuantity = 100;
const qtyInput = document.getElementById('qty');
const statusSelect = document.getElementById('status');


//select page
document.addEventListener("DOMContentLoaded", function() {
    var path = window.location.pathname;
    if (path.includes("page-add-inventory.html")) {
        initialLoadPage01()
    } else if (path.includes("page-list-inventory.html")) {
        initialLoadPage02()
        searchItemsByName()

        console.log("here")
    } else {
        console.log("Unknown page");
    }
});

//initial loads

function initialLoadPage01(){
    itmCodeInput.prop('readonly', true);
    setImage();
    getNewId();
    setStatus();
    setSuppliersToSelect();
}



function initialLoadPage02(){
    getAllItems();
}


//search
function searchItemsByName() {
    const searchInput = document.getElementById('search-name');

    searchInput.addEventListener('input', (event) => {
        searchItems(event.target.value)
        if (event.target.value== null){
            getAllItems();
        }
    });
}
//search ajax
function searchItems(value) {
    $.ajax({
        url: baseUrl + "inventory?name="+value,
        method: "GET",
        contentType: "application/json",
        success: function (res) {
            if (Array.isArray(res)) {
                items = res;
                loadAllItems(items);
            } else {
                console.log("No data received or data is not an array");
            }
        },
        error: function (err) {
            console.error("Error fetching Items:", err);
        }
    });
}

//getsuppliers
function setSuppliers() {
    $.ajax({
        url: baseUrl + "suppliers",
        method: "GET",
        contentType: "application/json",
        success: function (res) {
            if (Array.isArray(res)) {
                suppliers = res;
            } else {
                console.log("No data received or data is not an array");
            }
        },
        error: function (err) {
            console.error("Error fetching supplier:", err);
        }
    });
}


//get All Items
function getAllItems() {
    $.ajax({
        url: baseUrl + "inventory",
        method: "GET",
        contentType: "application/json",
        success: function (res) {
            if (Array.isArray(res)) {
                items = res;
                loadAllItems(items);
            } else {
                console.log("No data received or data is not an array");
            }
        },
        error: function (err) {
            console.error("Error fetching Item:", err);
        }
    });
}


function loadAllItems(items) {
    console.log(items)
    const tbody = document.querySelector('.data-tables tbody');

    // Clear any existing rows
    tbody.innerHTML = '';

    // Loop through the items array and create rows
    items.forEach((item, index) => {
        let statusColor;
        if (item.status === 'Available') {
            statusColor = 'green';
        } else if (item.status === 'Low') {
            statusColor = 'orange';
        } else {
            statusColor = 'red';
        }

        const imgElementId = `item-image-${index}`;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <div class="checkbox d-inline-block">
                    <input type="checkbox" class="checkbox-input" id="checkbox${index + 2}">
                    <label for="checkbox${index + 2}" class="mb-0"></label>
                </div>
            </td>
            <td>
                <div class="d-flex align-items-center">
                    <img id="${imgElementId}" class="img-fluid rounded avatar-50 mr-3" alt="image">
                    <div>
                        ${item.description}
                        <p class="mb-0"><small><span style="color: ${statusColor};">${item.status}</span></small></p>
                    </div>
                </div>
            </td>
            <td>${item.itemCode}</td>
            <td>${item.category}</td>
            <td>${item.supplier.name}</td>
            <td>Rs. ${item.salePrice}</td>
            <td>Rs. ${item.buyingPrice}</td>
            <td>${item.qty}</td>
            <td>
                <div class="d-flex align-items-center list-action">
                    <a class="badge badge-info mr-2" data-toggle="modal" data-target="#view-item-${index}" data-toggle="tooltip" data-placement="top" title="View">
                        <i class="ri-eye-line mr-0"></i>
                    </a>
                    <a class="badge bg-success mr-2" data-toggle="modal" data-target="#edit-item-${index}" data-toggle="tooltip" data-placement="top" title="Edit">
                        <i class="ri-pencil-line mr-0"></i>
                    </a>
                    <a class="badge bg-warning mr-2" data-toggle="modal" data-target="#delete-item-${index}" data-toggle="tooltip" data-placement="top" title="Delete">
                        <i class="ri-delete-bin-line mr-0"></i>
                    </a>
                </div>
            </td>
        `;
        // Append the row to the table body
        tbody.appendChild(row);

        // Decode the base64 image and set it to the image element
        decodeBase64ToImage(item.picture, imgElementId);

        // Create modals for the item
        createItemModals(item, index);
    });
    // Initialize tooltips
    $('[data-toggle="tooltip"]').tooltip();
}

function createItemModals(item, index) {
    const modalsContainer = document.querySelector('body');

    // Convert item picture from base64 string for display
    const itemPictureBase64 = item.picture ? item.picture : '';

    // Determine the status color
    let statusColor;
    if (item.status === 'Available') {
        statusColor = 'green';
    } else if (item.status === 'Low') {
        statusColor = 'orange';
    } else {
        statusColor = 'red';
    }

    // View modal
    const viewModal = document.createElement('div');
    viewModal.classList.add('modal', 'fade');
    viewModal.id = `view-item-${index}`;
    viewModal.tabIndex = '-1';
    viewModal.role = 'dialog';
    viewModal.innerHTML = `
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">View Item</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <img id="item-preview-img-${index}" alt="Item Picture" style="max-width: 50%;">
                    <p><b>Item Code:</b> ${item.itemCode}</p>
                    <p><b>Description:</b> ${item.description}</p>
                    <p><b>Category:</b> ${item.category}</p>
                    <p><b>Supplier Name:</b> ${item.supplier.name}</p>
                    <p><b>Selling Price:</b> ${item.sellingPrice}</p>
                    <p><b>Cost:</b> ${item.buyingPrice}</p>
                    <p><b>Quantity:</b> ${item.qty}</p>
                    <p><b>Status:</b> <span style="color: ${statusColor};">${item.status}</span></p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    `;
    modalsContainer.appendChild(viewModal);
    if (item.picture) {
        decodeBase64ToImage(item.picture, `item-preview-img-${index}`);
    }

    // Edit modal
    const editModal = document.createElement('div');
    editModal.classList.add('modal', 'fade');
    editModal.id = `edit-item-${index}`;
    editModal.tabIndex = '-1';
    editModal.role = 'dialog';
    editModal.innerHTML = `
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Edit Item</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form id="edit-item-form-${index}">
                        <div class="form-group">
                            <label for="edit-item-description-${index}">Description</label>
                            <input type="text" class="form-control" id="edit-item-description-${index}" value="${item.description}">
                        </div>
                        <div class="form-group">
                            <label for="edit-item-category-${index}">Category</label>
                            <input type="text" class="form-control" id="edit-item-category-${index}" value="${item.category}">
                        </div>
                        <div class="form-group">
                            <label for="edit-item-supplierName-${index}">Supplier Name</label>
                            <select class="form-control" id="edit-item-supplierName-${index}">
                                ${suppliers.map(supplier => `<option value="${supplier.supplierCode}" ${item.supplier.name === supplier.name ? 'selected' : ''}>${supplier.name}</option>`).join('')}
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="edit-item-sellingPrice-${index}">Selling Price</label>
                            <input type="number" class="form-control" id="edit-item-sellingPrice-${index}" value="${item.salePrice}">
                        </div>
                        <div class="form-group">
                            <label for="edit-item-cost-${index}">Cost</label>
                            <input type="number" class="form-control" id="edit-item-cost-${index}" value="${item.buyingPrice}">
                        </div>
                        <div class="form-group">
                            <label for="edit-item-quantity-${index}">Quantity</label>
                            <input type="number" class="form-control" id="edit-item-quantity-${index}" value="${item.qty}">
                        </div>
                        <div class="form-group">
                            <label for="edit-item-status-${index}">Status</label>
                            <select id="edit-item-status-${index}" name="status" class="form-control" data-style="py-0">
                                <option value="Available" ${item.status === 'Available' ? 'selected' : ''}>Available</option>
                                <option value="Low" ${item.status === 'Low' ? 'selected' : ''}>Low</option>
                                <option value="Unavailable" ${item.status === 'Out Of Stock' ? 'selected' : ''}>Unavailable</option>
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
    deleteModal.id = `delete-item-${index}`;
    deleteModal.tabIndex = '-1';
    deleteModal.role = 'dialog';
    deleteModal.innerHTML = `
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Delete Item</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <p>Are you sure you want to delete <strong>${item.itemCode}, ${item.description}</strong>?</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">No</button>
                    <button type="button" class="btn btn-danger" id="confirm-delete-${index}">Yes</button>
                </div>
            </div>
        </div>
    `;
    modalsContainer.appendChild(deleteModal);

    // Update form submit handler
    $(`#edit-item-form-${index}`).off('submit').on('submit', function (event) {
        event.preventDefault();
        const supplierCode = document.getElementById(`edit-item-supplierName-${index}`).value;

        getSupplierDetails(supplierCode, function (supplierDetails) {
            if (supplierDetails) {
                const updatedItem = {
                    itemCode: item.itemCode,
                    description: document.getElementById(`edit-item-description-${index}`).value,
                    category: document.getElementById(`edit-item-category-${index}`).value,
                    supplier: {
                        supplierCode: supplierDetails.supplierCode,
                        name: supplierDetails.name,
                    },
                    salePrice: document.getElementById(`edit-item-sellingPrice-${index}`).value,
                    buyingPrice: document.getElementById(`edit-item-cost-${index}`).value,
                    qty: document.getElementById(`edit-item-quantity-${index}`).value,
                    status: document.getElementById(`edit-item-status-${index}`).value,
                    picture: item.picture  // Assuming picture is not edited here
                };

                // Now you can use updatedItem to update the item
                updateItem(item.itemCode, updatedItem, index);
            } else {
                console.log("Supplier details not found, cannot update item.");
            }
        });
    });

    $(`#confirm-delete-${index}`).off('click').on('click', function () {
        deleteItem(item.itemCode, index);
    });
}

//set suppliers
function setSuppliersToSelect() {
    const selectElement = document.getElementById('supplierNames');
    suppliers.forEach(supplier => {
        const option = document.createElement('option');
        option.value = supplier.supplierCode; // Option value
        option.text = supplier.name; // Option text
        selectElement.appendChild(option);
    })
}

function getSupplierDetails(supplierCode, callback) {
    $.ajax({
        url: baseUrl + "suppliers",
        method: "GET",
        contentType: "application/json",
        data: { id: supplierCode },
        success: function (res) {
            if (res) {
                callback(res.data);
            } else {
                console.log("No data received or data is not valid");
                callback(null);
            }
        },
        error: function (err) {
            console.error("Error fetching supplier:", err);
            callback(null);
        }
    });
}

//save
$("#saveBtn").click(function(event) {
    event.preventDefault(); // Prevent default form submission

    let formData = new FormData($("#inventory-form")[0]);
    let formArray = $("#inventory-form").serializeArray();

    // Convert the array to a JSON object
    var formDataJson = {};
    $.each(formArray, function(_, field) {
        formDataJson[field.name] = field.value;
    });

    // Get the selected supplier code
    let supplierCode = formDataJson["supplierNames"];

    // Fetch supplier details
    getSupplierDetails(supplierCode, function(supplierData) {
        if (supplierData) {
            formDataJson["supplier"] = supplierData; // Add supplier object to form data

            // Encode item picture to base64 and append to FormData
            let fileInput = document.getElementById('file-2');
            let file = fileInput.files[0];

            if (file) {
                encodeImageToBase64(file, function(base64String) {
                    formDataJson["picture"] = base64String;
                    console.log(formDataJson)
                    // Perform the AJAX request
                    $.ajax({
                        url: baseUrl + "inventory",
                        method: "POST",
                        data: JSON.stringify(formDataJson),
                        processData: false,
                        contentType: "application/json",
                        success: function(res) {
                            alert('Item added successfully: ' + res.message);
                            clearFormFields();
                        },
                        error: function(xhr) {
                            alert('Error adding item: ' + xhr.responseJSON.message);
                            console.log(xhr.responseJSON.message);
                        }
                    });
                });
            } else {
                // Perform the AJAX request without item picture
                $.ajax({
                    url: baseUrl + "inventory",
                    method: "POST",
                    data: JSON.stringify(formDataJson),
                    processData: false,
                    contentType: "application/json",
                    success: function(res) {
                        alert('Item added successfully: ' + res.message);
                        clearFormFields();
                    },
                    error: function(xhr) {
                        alert('Error adding item: ' + xhr.responseJSON.message);
                        console.log(xhr.responseJSON.message);
                    }
                });
            }
        } else {
            alert('Error fetching supplier details.');
        }
    });
});

//clear fields
function clearFormFields() {
    $("#inventory-form")[0].reset();
    $("#preview-img-inventory").attr("src", "https://bit.ly/3ubuq5o");
}

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

//Generate new ID
function getNewId() {
    categoryInput.on('click', function (event)  {
        if (categoryInput.val() != null) {
            $.ajax({
                url: baseUrl + "inventory/getId",
                method: "GET",
                async: false,
                dataType: "json",
                contentType: "application/json",
                success: function (res) {
                    console.log(res)
                    itemCode = res.data;
                    if (itemCode != 1){
                        itemCode = "0000"+itemCode;
                    }
                    itmCodeInput.val(categoryInput.val()+itemCode);
                }
            });
        }
    });
}
//set image to page
function setImage(){
    document.getElementById('file-2').addEventListener('change', function(event) {
        var reader = new FileReader();
        reader.onload = function(){
            var img = document.getElementById('preview-img-inventory');
            img.src = reader.result;
        }
        reader.readAsDataURL(event.target.files[0]);
    });
}
//set status
function setStatus(){
    qtyInput.addEventListener('input', (event) => {
        // Get the current value of the input field
        const currentValue = event.target.value;

        if (currentValue == 0 || currentValue == null){
            statusSelect.value = "OutOfStock";
        } else if (currentValue <= originalQuantity / 2){
            statusSelect.value = "Low";
        } else {
            statusSelect.value = "Available";
        }

        // Re-disable the select element
    });
}
//create category
function createCategory() {
    let genderCode = '';
    let occasionCode = '';
    let varietyCode = '';
    let accessoriesCode = '';

    $('#tree-table-3 tbody tr td[data-value]').on('click', function() {
        const selectedValue = $(this).attr('data-value');
        const parentId = $(this).closest('tr').attr('data-parent');
        const parentLevel = $(this).closest('tr').attr('data-level');

        // Clear previous selections
        if (parentLevel == 2) {
            genderCode = '';
            occasionCode = '';
            varietyCode = '';
            accessoriesCode = '';
        } else if (parentLevel == 3 && parentId == 2) {
            genderCode = '';
        } else if (parentLevel == 3 && parentId == 5) {
            occasionCode = '';
        } else if (parentLevel == 3 && parentId == 10) {
            varietyCode = '';
        } else if (parentLevel == 3 && parentId == 22) {
            accessoriesCode = '';
        }

        // Determine the category based on the selected value
        switch (selectedValue) {
            case 'Men':
                genderCode = 'M';
                break;
            case 'Women':
                genderCode = 'W';
                break;
            case 'Formal':
                occasionCode = 'F';
                break;
            case 'Casual':
                occasionCode = 'C';
                break;
            case 'Industrial':
                occasionCode = 'I';
                break;
            case 'Sport':
                occasionCode = 'S';
                break;
            case 'Heel':
                varietyCode = 'H';
                break;
            case 'Flats':
                varietyCode = 'F';
                break;
            case 'Wedges':
                varietyCode = 'W';
                break;
            case 'Flip Flops':
                varietyCode = 'FF';
                break;
            case 'Sandals':
                varietyCode = 'SD';
                break;
            case 'Shoe':
                varietyCode = 'S';
                break;
            case 'Slippers':
                varietyCode = 'SL';
                break;
            case 'Shoe Shampoo':
                accessoriesCode = 'SHMP';
                break;
            case 'Black Polish':
                accessoriesCode = 'POLB';
                break;
            case 'Brown Polish':
                accessoriesCode = 'POLBR';
                break;
            case 'Dark Brown Polish':
                accessoriesCode = 'POLDBR';
                break;
            case 'Full socks':
                accessoriesCode = 'SOF';
                break;
            case 'Half socks':
                accessoriesCode = 'SOH';
                break;
        }

        // Generate the category code
        let category = (occasionCode + genderCode + varietyCode + accessoriesCode).toUpperCase();
        $('#category').val(category);
    });
}
// Function to update item
function updateItem(id, item, index) {
    $.ajax({
        url: baseUrl + "inventory/" + id,
        method: "PUT",
        contentType: "application/json",
        data: JSON.stringify(item),
        success: function (res) {
            alert('Item updated successfully: ' + res.message);
            closeModel(index, "update");
            getAllItems();
        },
        error: function (error) {
            let message = JSON.parse(error.responseText).message;
            console.log(message);
            alert('Failed to update item: ' + message);
        }
    });
}

// Function to delete item
function deleteItem(id, index) {
    $.ajax({
        url: baseUrl + "inventory/" + id,
        method: "DELETE",
        success: function (res) {
            alert('Item deleted successfully');
            closeModel(index, "delete");
            getAllItems();
        },
        error: function (error) {
            let message = JSON.parse(error.responseText).message;
            console.log(message);
            alert('Failed to delete Item: ' + message);
        }
    });
}
//close model
function closeModel(index,method){
    if(method== "delete"){
        $(`#delete-item-${index}`).modal('hide');
    }else if(method== "update"){
        $(`#edit-item-${index}`).modal('hide');
    }
    $('.modal-backdrop').remove();
    $('body').removeClass('modal-open');
    $('body').css('padding-right', '');
}

// Initialize the createCategory function
$(document).ready(function() {
    createCategory();
});