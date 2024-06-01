const baseUrl = 'http://localhost:8080/shop/data/';

function getTotalActiveSales() {
    $.ajax({
        url: baseUrl + "sale/activeSales",
        method: "GET",
        success: function (res) {
            $('#totalSalesTxt').text(res);
        },
        error: function (err) {
            console.error("Error fetching total active sales:", err);
            $('#totalActiveSales').text('Error');
        }
    });
}

function getTotalProfit() {
    $.ajax({
        url: baseUrl + "sale/totalProfit",
        method: "GET",
        success: function (res) {
            $('#totalProfitTxt').text("Rs. "+res);
        },
        error: function (err) {
            console.error("Error fetching total profit:", err);
            $('#totalProfit').text('Error');
        }
    });
}

function getTotalCost() {
    $.ajax({
        url: baseUrl + "sale/totalCost",
        method: "GET",
        success: function (res) {
            $('#TotalCostTxt').text("Rs. "+res);
        },
        error: function (err) {
            console.error("Error fetching total cost:", err);
            $('#totalCost').text('Error');
        }
    });
}

function getTopSoldItems() {
    $.ajax({
        url: baseUrl + "sale/topSoldItems",
        method: "GET",
        success: function (res) {
            loadItemsToCards(res);
            loadBestAllTimeItems(res)
        },
        error: function (err) {
            console.error("Error fetching top sold items:", err);
            $('#topProductList').text('Error loading items');
        }
    });
}
function loadBestAllTimeItems(res){
    if (res.length > 0) {
        const item1 = res[0];
        decodeBase64ToImage(item1.picture, 'best-img-1');
        document.getElementById('desc-1').innerText = item1.description;
        document.getElementById('qtys-1').innerText = `Total Sell: ${item1.qty}`;
        //document.getElementById('total-earned-1').innerText = `Total Earned: $${(item1.qty * item1.salePrice / 1e6).toFixed(2)} M`;
    }
    if (res.length > 1) {
        const item2 = res[1];
        decodeBase64ToImage(item2.picture, 'best-img-2');
        document.getElementById('desc-2').innerText = item2.description;
        document.getElementById('qtys-2').innerText = `Total Sell: ${item2.qty}`;
        //document.getElementById('total-earned-2').innerText = `Total Earned: $${(item2.qty * item2.salePrice / 1e6).toFixed(2)} M`;
    }
}
function loadItemsToCards(res){
  /*  const list = $('#topProductList');
    list.empty(); */

    res.forEach((item, index) => {
        // Ensure index is within bounds
        const idx = index + 1;
        if (idx <= 4) {
            // Update the image
            decodeBase64ToImage(item.picture, `img-${idx}`);
            // Update the description
            document.getElementById(`description-${idx}`).innerText = item.description;
            // Update the quantity
            document.getElementById(`qty-${idx}`).innerText = `${item.qty} Item`;
        }
        /*const bgClass = ['bg-warning-light', 'bg-danger-light', 'bg-info-light', 'bg-success-light'][index % 4]; // Rotate background colors
        const listItem = `
                            <li class="col-lg-3">
                                <div class="card card-block card-stretch card-height mb-0">
                                    <div class="card-body">
                                        <div class="${bgClass} rounded">
                                            <img id="img-${index}" class="style-img img-fluid m-auto p-3" alt="image">
                                        </div>
                                        <div class="style-text text-left mt-3">
                                            <h5 class="mb-1">${item.description}</h5>
                                            <p class="mb-0">${item.qty} Item</p>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        `;
        list.append(listItem);*/
/*
        decodeBase64ToImage(item.picture, `img-${index}`);
*/
    });
}
//decodeImages
function decodeBase64ToImage(base64String, imgElementId) {
    const imgElement = document.getElementById(imgElementId);
    imgElement.src = `data:image/jpeg;base64,${base64String}`;
}
// Call these functions to load the data when the page loads
$(document).ready(function() {
    getTotalActiveSales();
    getTotalProfit();
    getTotalCost();
    getTopSoldItems();
});