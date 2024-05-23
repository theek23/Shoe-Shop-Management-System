let baseUrl = "http://localhost:8080/shop/data/"

let orderCode;
var items = [];

let selectedItem = null;


document.addEventListener("DOMContentLoaded", function() {
    var path = window.location.pathname;
    if (path.includes("page-add-sale.html")) {
         initialLoadPage01()
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
    console.log(items);
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

        // Add double-click event listener to the row
        row.addEventListener('dblclick', () => {
            selectedItem = item;
            $('#quantityModal').modal('show');
        });
    });
}

document.getElementById('addItemButton').addEventListener('click', () => {
    const quantityInput = document.getElementById('itemQuantity').value;
    const quantity = quantityInput ? parseInt(quantityInput, 10) : 1;
    addItemToDetailsTable(selectedItem, quantity);
    $('#quantityModal').modal('hide');
    document.getElementById('itemQuantity').value = ''; // Clear the input field
});

function addItemToDetailsTable(item, quantity) {
    const detailsTableBody = document.querySelector('.tbl-server-info tbody');

    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${item.description}</td>
        <td>${item.itemCode}</td>
        <td>${quantity}</td>
        <td>Rs. ${item.salePrice}</td>
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