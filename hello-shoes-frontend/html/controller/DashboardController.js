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

// Call these functions to load the data when the page loads
$(document).ready(function() {
    getTotalActiveSales();
    getTotalProfit();
    getTotalCost();
});