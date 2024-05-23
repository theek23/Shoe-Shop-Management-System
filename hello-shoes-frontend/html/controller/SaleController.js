let baseUrl = "http://localhost:8080/shop/data/"

let orderCode;
var items = [];

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