// Address From
const fromStreetInput = document.getElementById('from-street-input');
const fromCityStateInput = document.getElementById('from-city-state-input');
const fromZipCodeInput = document.getElementById('from-zip-code-input');

function checkFromAddressFields() {
    if (fromStreetInput.value.trim() !== '') {
        fromCityStateInput.style.display = 'block';
        fromZipCodeInput.style.display = 'block';
    } else {
        fromCityStateInput.style.display = 'none';
        fromZipCodeInput.style.display = 'none';
    }
}
fromStreetInput.addEventListener('input', checkFromAddressFields);
// End Address From

// Address Bill To
const billToStreetInput = document.getElementById('bill-to-street-input');
const billToCityStateInput = document.getElementById('bill-to-city-state-input');
const billToZipCodeInput = document.getElementById('bill-to-zip-code-input');

function checkBillToAddressFields() {
    if (billToStreetInput.value.trim() !== '') {
        billToCityStateInput.style.display = 'block';
        billToZipCodeInput.style.display = 'block';
    } else {
        billToCityStateInput.style.display = 'none';
        billToZipCodeInput.style.display = 'none';
    }
}
billToStreetInput.addEventListener('input', checkBillToAddressFields);
// End Address 

// today date seleted
document.addEventListener('DOMContentLoaded', function () {
    const dateInput = document.querySelector('input[type="date"]');
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
});
//End today date seleted
// due date
function updateDueDate() {
    const terms = document.getElementById('terms').value;
    const dueDateField = document.getElementById('dueDate');
    const customDateGroup = document.getElementById('custom-date-group');
    const customDateInput = document.getElementById('customDate');

    let dueDate = '';

    if (terms === 'none') {
        dueDate = 'No due date';
        customDateGroup.style.display = 'none';
    } else if (terms === 'custom') {
        customDateGroup.style.display = 'block';
        dueDate = customDateInput.value || 'Select a date';
    } else {
        customDateGroup.style.display = 'none';
        const today = new Date();
        today.setDate(today.getDate() + parseInt(terms));
        dueDate = today.toISOString().split('T')[0];
    }

    dueDateField.value = dueDate;
}
// end due date

// subtotal in empty set 0
function handleEmpty(input) {
    if (input.value === '') {
        input.value = 0;
    }
}
//end subtotal in empty set 0
