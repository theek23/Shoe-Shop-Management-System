let baseUrl = "http://localhost:8080/shop/data/"

let itemCode;
var itmCodeInput = $('#itemCode');
var categoryInput = $('#category');
var items = [];
var suppliers=[];

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
        searchEmployeeByName()
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
    setSuppliers();
}
function initialLoadPage02(){
    getAllEmployees();
}


//set suppliers
function setSuppliers() {
    $.ajax({
        url: baseUrl + "suppliers",
        method: "GET",
        contentType: "application/json",
        success: function (res) {
            if (Array.isArray(res)) {
                const selectElement = document.getElementById('supplierNames');
                suppliers = res;
                suppliers.forEach(supplier => {

                    const option = document.createElement('option');
                    option.value = supplier.supplierCode; // Option value
                    option.text = supplier.name; // Option text
                    selectElement.appendChild(option);
                });
            } else {
                console.log("No data received or data is not an array");
            }
        },
        error: function (err) {
            console.error("Error fetching supplier:", err);
        }
    });
}


function getSupplierDetails(supplierCode, callback){
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


// Initialize the createCategory function
$(document).ready(function() {
    createCategory();
});
