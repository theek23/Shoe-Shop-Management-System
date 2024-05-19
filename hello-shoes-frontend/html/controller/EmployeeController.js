let baseUrl = "http://localhost:8080/shop/data/"

let employeeCode;
var empCodeInput = $('#employeeCode');
var employees = [];

document.addEventListener("DOMContentLoaded", function() {
    var path = window.location.pathname;
    if (path.includes("page-add-employees.html")) {
        initialLoadPage01()

    } else if (path.includes("page-list-employees.html")) {
        //initialLoadPage02()
        //searchSupplierByName()
    } else {
        console.log("Unknown page");
    }
});
function initialLoadPage01(){
    empCodeInput.prop('readonly', true);
    setImage();
    //getNewId();
}

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
