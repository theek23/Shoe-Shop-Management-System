let baseUrl = "http://localhost:8080/shop/data/"

let supplierCode;
var supCodeInput = $('#supplierCode');

document.addEventListener("DOMContentLoaded", function() {
    var path = window.location.pathname;
    if (path.includes("page-add-supplier.html")) {
        initialLoadPage01()

    } else if (path.includes("page-list-supplier.html")) {
        // initialLoadPage02()
        // searchCustomerByName()
    } else {
        console.log("Unknown page");
    }
});

// function initialLoadPage02(){
//     getAllCustomers();
// }

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
        success: function (res) {
            supplierCode = res.data;
            supCodeInput.val(supplierCode);
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
    // Remove individual address fields from main JSON object
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
    console.log(formDataJson)
    // Optionally, convert the JSON object to a JSON string
    var formDataJsonString = JSON.stringify(formDataJson);


    $.ajax({
        url: baseUrl + "suppliers",
        method: "POST",
        data: formDataJsonString,
        contentType: "application/json",
        success: function(res) {
            alert('Supplier added successfully: ' + res.message);
            clearFormFields();
        },
        error: function(xhr) {
            alert('Error adding customer: ' + xhr.responseJSON.message);
            console.log(xhr.responseJSON.message)
        }
    });
});

function clearFormFields() {
    $("#supplier-form").find("input[type=text], input[type=email], input[type=tel], textarea").val("");
    $("#supplier-form").find("input[type=radio], input[type=checkbox]").prop("checked", false);
    $("#supplier-form").find("select").prop("selectedIndex", 0);

    // Make the customer code input editable again if necessary
    // $("#supplierCode").prop('readonly', false);
    getNewId();
}