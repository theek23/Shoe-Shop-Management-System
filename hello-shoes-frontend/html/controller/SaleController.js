let baseUrl = "http://localhost:8080/shop/data/"

let orderCode;
var items = [];

let customer;
let selectedItem = null;

const customerName = $(`#customerName`)
const orderId = $(`#orderCode`)

document.addEventListener("DOMContentLoaded", function() {
    var path = window.location.pathname;
    if (path.includes("page-add-sale.html")) {
         initialLoadPage01()
         searchItemsByName()
         searchCustomerByContact()

    } else if (path.includes("page-list-sale.html")) {
        /*initialLoadPage02()
        searchItemsByName()*/

        console.log("here")
    } else {
        console.log("Unknown page");
    }
});
function initialLoadPage01(){
    getAllItems();
    getNewId()
}
//Generate new ID
function getNewId() {
    $.ajax({
        url: baseUrl + "sale/getId",
        method: "GET",
        async: false,
        dataType: "json",
        contentType: "application/json",
        success: function (res) {
            orderCode = res.data;
            orderId.val(orderCode);
        }
    });
}
//search customer
function searchCustomerByContact() {
    const searchInput = document.getElementById('searchCustomer');

    searchInput.addEventListener('change', (event) => {
        searchCustomer(event.target.value);
    });
}
function searchCustomer(value) {
    $.ajax({
        url: baseUrl + "customers?contact_no="+value,
        method: "GET",
        contentType: "application/json",
        success: function (res) {
            customer = res.data;
            customerName.text(customer.name)
        },
        error: function (err) {
            console.error("Error fetching Customer:", err);
            if (err.responseJSON && err.responseJSON.message) {
                errorMessage = err.responseJSON.message;
            }
            alert(errorMessage)
        },
    });
}
//search items
function searchItemsByName() {
    const searchInput = document.getElementById('searchItem');

    searchInput.addEventListener('input', (event) => {
        searchItems(event.target.value)
        if (event.target.value== null){
            getAllItems();
        }
    });
}
//search items ajax
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
    const tbody = document.querySelector('.data-tables tbody');

    // Clear any existing rows
    tbody.innerHTML = '';

    // Loop through the items array and create rows
    items.forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.itemCode}</td>
            <td>${item.description}</td>
            <td>${item.category}</td>
            <td>${item.size}</td>
            <td>Rs. ${item.salePrice}</td>
            <td>${item.qty}</td>
        `;
        // Append the row to the table body
        tbody.appendChild(row);
        scrollToBottom();
        // Add double-click event listener to the row
        row.addEventListener('dblclick', () => {
            selectedItem = item;
            $('#quantityModal').modal('show');
        });
    });
}
function scrollToBottom() {
    const tableBody = $('.data-tables tbody');
    tableBody.scrollTop(tableBody[0].scrollHeight);
}


//add qty button
document.getElementById('addItemButton').addEventListener('click', () => {
    const quantityInput = document.getElementById('itemQuantity').value;
    const quantity = quantityInput ? parseInt(quantityInput, 10) : 1;

    if (selectedItem.qty<quantity){
        alert("Too Many QTYs")
    }else {
        addItemToDetailsTable(selectedItem, quantity);
        $('#quantityModal').modal('hide');
        document.getElementById('itemQuantity').value = ''; // Clear the input field
    }


});

function addItemToDetailsTable(item, quantity) {
    const detailsTableBody = document.querySelector('.tbl-server-info tbody');

    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${item.description}</td>
        <td>${item.itemCode}</td>
        <td>${quantity}</td>
        <td>Rs. ${item.salePrice * quantity}</td>
        <td>
            <div class="d-flex align-items-center list-action">
                <a class="badge badge-info mr-2" data-toggle="tooltip" data-placement="top"  href="#"><i class="ri-eye-line mr-0"></i></a>
                <a class="badge bg-warning mr-2 delete-from-table" data-toggle="tooltip" data-placement="top" href="#"><i class="ri-delete-bin-line mr-0"></i></a>
            </div>
        </td>
    `;

    // Append the new row to the details table body
    detailsTableBody.appendChild(row);

    // Initialize tooltips
    $('[data-toggle="tooltip"]').tooltip();

    // Add event listener to the delete button
    row.querySelector('.delete-from-table').addEventListener('click', function(event) {
        event.preventDefault();
        row.remove();
    });
}