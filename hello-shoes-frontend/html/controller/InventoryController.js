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
