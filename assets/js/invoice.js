
$(document).ready(function () {
    var currencySelect = document.getElementById('currency');
    currencySelect.style.display = 'block';
    var templateSelect = document.getElementById('template');
    templateSelect.style.display = 'block';
    document.querySelectorAll('.nice-select').forEach(function (element) {
        element.style.display = 'none';
    });
    $.get("http://ip-api.com/json/", function (data) {
        let countryCode = data.countryCode;
        let currency;

        switch (countryCode) {
            case 'US': currency = '$'; break;
            case 'EU': currency = '€'; break;
            case 'JP': currency = '¥'; break;
            case 'GB': currency = '£'; break;
            case 'AU': currency = 'A$'; break;
            case 'CA': currency = 'C$'; break;
            case 'CH': currency = 'CHF'; break;
            case 'CN': currency = 'CNY'; break;
            case 'KR': currency = '₩'; break;
            case 'IN': currency = '₹'; break;
            default: currency = '$';
        }

        $("#currency").val(currency);
        $("#currency").trigger('change');
    }, "json");
});
//end select currency

var currency = document.getElementById('currency').value;
var template = document.getElementById('template').value;
var currencySymbol = currency;
var oldCurrencySymbol = null;
function updateCurrency() {
    currency = document.getElementById('currency').value;
    currencySymbol = currency;

    if (oldCurrencySymbol == null) {
        sessionStorage.setItem('oldCurrencySymbolSession', currencySymbol);
        oldCurrencySymbol = sessionStorage.getItem('oldCurrencySymbolSession');
    } else {
        const elements = document.body.getElementsByTagName('*');
        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            if (element.childNodes.length > 0) {
                for (let j = 0; j < element.childNodes.length; j++) {
                    const node = element.childNodes[j];
                    if (node.nodeType === Node.TEXT_NODE) {
                        node.nodeValue = node.nodeValue.replace(oldCurrencySymbol, currencySymbol);
                    }
                }
            }
        }
        sessionStorage.setItem('oldCurrencySymbolSession', currencySymbol);
        oldCurrencySymbol = sessionStorage.getItem('oldCurrencySymbolSession');
    }
}

function updateTemplate() {
    template = document.getElementById('template').value;
    const tableFiled = document.getElementById('table-filed');
    var tableContent = ``;
    if (template == "quantity") {
        tableContent = `
        <thead>
            <tr>
                <th style="width: 50%">Item/Service</th>
                <th style="width: 10%">Quantity</th>
                <th style="width: 10%">Rate</th>
                <th style="width: 20%">Amount</th>
                <th class="hide-t" style="width: 10%">Actions</th>
            </tr>
        </thead>
        <tbody id="invoice-items">
            <tr>
                <td><input type="text" class="form-control"  placeholder="Description of item/service..."></td>
                <td><input class="form-control" type="number" value="0" oninput="calculateAmount(this)"></td>
                <td><input class="form-control" type="number" value="0" oninput="calculateAmount(this)"></td>
                <td class="amount"></td>
                <td class="hide-t"><button class="remove-btn" onclick="removeLineItem(this)">Remove</button></td>
            </tr>
        </tbody>`;
    }
    if (template == "hours") {
        tableContent = `
        <thead>
            <tr>
                <th style="width: 50%">Item/Service</th>
                <th style="width: 10%">Hours</th>
                <th style="width: 10%">Rate</th>
                <th style="width: 20%">Amount</th>
                <th class="hide-t" style="width: 10%">Actions</th>
            </tr>
        </thead>
        <tbody id="invoice-items">
            <tr>
                <td><input type="text" class="form-control"placeholder="Description of item/service..."></td>
                <td><input class="form-control" type="number" value="0" oninput="calculateAmount(this)"></td>
                <td><input class="form-control" type="number" value="0" oninput="calculateAmount(this)"></td>
                <td class="amount"></td>
                <td class="hide-t"><button class="remove-btn" onclick="removeLineItem(this)">Remove</button></td>
            </tr>
        </tbody>`;

    }
    if (template == "amounts-only") {
        tableContent = `
        <thead>
            <tr>
                <th style="width: 60%">Item/Service</th>
                <th style="width: 30%">Amount</th>
                <th class="hide-t" style="width: 10%">Actions</th>
            </tr>
        </thead>
        <tbody id="invoice-items">
            <tr>
                <td><input type="text" class="form-control"  placeholder="Description of item/service..."></td>
                <td><input type="number" class="amount" value="0" oninput="calculateTotalOnlyAmount()"></td>
                <td class="hide-t"><button class="remove-btn" onclick="removeLineItem(this)">Remove</button></td>
            </tr>
        </tbody>`;
    }
    tableFiled.innerHTML = tableContent;
    changecurrencySymbol();
}

document.addEventListener('DOMContentLoaded', updateTemplate);
document.addEventListener('DOMContentLoaded', updateCurrency);


function changecurrencySymbol() {
    document.querySelector('.amount').textContent = currencySymbol + '00.00';
    document.querySelector('.amount').textContent = currencySymbol + '00.00';
    document.querySelector('#subtotal').textContent = currencySymbol + '00.00';
    document.querySelector('#total').textContent = currencySymbol + '00.00';
    document.querySelector('#balance-due').textContent = currencySymbol + '00.00';
    document.querySelector('.sy').textContent = currencySymbol;
    document.querySelector('.sya').textContent = currencySymbol;
}


//upload logo
document.getElementById('logoInput').addEventListener('change', function (event) {
    const input = event.target;
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const logoImage = document.getElementById('logoImage');
            logoImage.src = e.target.result;
            logoImage.style.display = 'block';
            document.querySelector('.invoice-logo  span').style.display = 'none';
            document.getElementById('logoInput').style.display = 'none';
            document.getElementById('removeLogo').style.display = 'block';

            const invoiceLogo = document.querySelector('.invoice-logo');
            invoiceLogo.style.padding = '0';
            invoiceLogo.style.borderRadius = '0';
        }
        reader.readAsDataURL(input.files[0]);
    }
});

document.getElementById('removeLogo').addEventListener('click', function () {

    const invoiceLogo = document.querySelector('.invoice-logo');
    invoiceLogo.style.padding = '30px 30px';
    invoiceLogo.style.borderRadius = '10px';

    document.getElementById('logoImage').style.display = 'none';
    document.querySelector('.invoice-logo  span').style.display = 'block';
    document.getElementById('logoInput').style.display = 'block';
    this.style.display = 'none';
    document.getElementById('logoInput').value = '';
});
//end upload logo


// item table update in row amount
function calculateAmount(element) {
    const row = element.parentElement.parentElement;
    const quantity = row.querySelectorAll('input[type="number"]')[0].value;
    const rate = row.querySelectorAll('input[type="number"]')[1].value;
    const amount = row.querySelector('.amount');
    const total = quantity * rate;
    amount.textContent = currencySymbol + total.toFixed(2);
    calculateTotalAmount();
}


//add item line
function addLineItem() {
    const table = document.getElementById('invoice-items');
    const newRow = document.createElement('tr');

    if (template == 'hours' || template == 'quantity') {
        newRow.innerHTML = `
    <td><input type="text" class="form-control"  placeholder="Description of item/service..."></td>
    <td><input class="form-control" type="number" value="0" oninput="calculateAmount(this)"></td>
    <td><input class="form-control" type="number" value="0" oninput="calculateAmount(this)"></td>
    <td class="amount">${currencySymbol}00.00</td>
    <td class="hide-t"><button class="remove-btn" onclick="removeLineItem(this)">Remove</button></td>
    `;
    }
    if (template == 'amounts-only') {
        newRow.innerHTML = `
    <td><input type="text" class="form-control" placeholder="Description of item/service..."></td>
    <td><input type="number" class="amount" value="0" oninput="calculateTotalOnlyAmount()"></td>
    <td class="hide-t"><button class="remove-btn" onclick="removeLineItem(this)">Remove</button></td>
    `;
    }

    table.appendChild(newRow);
}

//remove item line
function removeLineItem(button) {
    const row = button.parentElement.parentElement;
    row.remove();


    if (template == 'hours' || template == 'quantity') {
        calculateTotalAmount();
    }
    if (template == 'amounts-only') {
        calculateTotalOnlyAmount();
    }
}

if (template == 'hours' || template == 'quantity') {
    document.addEventListener('DOMContentLoaded', calculateTotalAmount);
}
if (template == 'amounts-only') {
    document.addEventListener('DOMContentLoaded', calculateTotalOnlyAmount);
}


//item subtotal count
function calculateTotalAmount() {
    const amounts = document.querySelectorAll('.amount');
    let totalAmount = 0;
    amounts.forEach(amount => {
        totalAmount += parseFloat(amount.textContent.replace(currencySymbol, ''));
    });
    document.getElementById('subtotal').textContent = currencySymbol + totalAmount.toFixed(2);
    calculateInvoice();
}
function calculateTotalOnlyAmount() {
    const amounts = document.querySelectorAll('.amount');
    var totalAmount = 0;
    amounts.forEach(amount => {
        totalAmount += parseFloat(amount.value)
    });

    document.getElementById('subtotal').textContent = currencySymbol + totalAmount;
    calculateInvoice();
}
// total calculate
function calculateInvoice() {

    let subtotalText = document.getElementById('subtotal').textContent;
    let amountValue = parseFloat(subtotalText.replace(currencySymbol, ""));
    const subtotal = amountValue;
    const discountInput = document.getElementById('discount');
    const taxInput = document.getElementById('tax');
    const shippingInput = document.getElementById('shipping');
    const amountPaidInput = document.getElementById('amount-paid');
    const totalSpan = document.getElementById('total');
    const balanceDueSpan = document.getElementById('balance-due');


    const discount = (subtotal * (discountInput.value / 100));
    const tax = (subtotal * (taxInput.value / 100));
    const shipping = parseFloat(shippingInput.value);
    const amountPaid = parseFloat(amountPaidInput.value);

    const total = subtotal - discount + tax + shipping;
    const balanceDue = total - amountPaid;

    totalSpan.textContent = currencySymbol + total.toFixed(2);
    balanceDueSpan.textContent = currencySymbol + balanceDue.toFixed(2);

}
//end calculate
//this function use enter filed in text this store in p tag
function updateContent(inputSelector, outputSelector) {
    document.querySelectorAll(inputSelector).forEach(function (element) {
        element.addEventListener('input', function () {
            document.querySelector(outputSelector).textContent = this.value;
        });
    });
}
updateContent('.note-write', '.note-show');
updateContent('.term-write', '.term-show');
updateContent('.invoice-heading', '.invoice-title');
//this use enter filed in text this store in p tag.this p tag hide on invoice
document.querySelectorAll('.invoice-title,.note-show,.term-show').forEach(function (element) {
    element.classList.add('hidden');
});

// this print time is hide(show on user download or pdf time)
function hideEmptyFields() {

    inputHideBankDetails();
    inputHideUPIQrCode();
    inputHideAuthorized();

    document.getElementById('invoice').classList.add('hide-borders');

    document.getElementById('invoice-size').classList.add('col-md-12');
    document.getElementById('invoice-size').classList.remove('col-md-9');

    //this function use enter filed in text this store in p tag is hide
    document.getElementById('invoice').classList.remove('card');


    document.querySelectorAll('.invoice-heading,.note-write,.term-write,#custom-date-group').forEach(function (element) {
        element.classList.add('hidden');
    });

    //this use enter filed in text this store in p tag.this p tag show in pdf on invoice
    document.querySelectorAll('.invoice-title,.note-show,.term-show').forEach(function (element) {
        element.classList.remove('hidden');
    });

    const inputs = document.querySelectorAll('#invoice input, #invoice textarea,#invoice select');
    const inputparent = document.querySelectorAll('.parent-hide');
    const hideTElements = document.querySelectorAll('.hide-t');

    inputs.forEach(input => {
        if (!input.value) {
            input.parentElement.style.display = 'none';
        }
    });
    inputparent.forEach(input => {
        if (!input.value) {
            input.parentElement.parentElement.style.display = 'none';
        }
    });
    hideTElements.forEach(element => {
        element.style.display = 'none';
    });

}

// this print after show (input filed)
function showHiddenFields() {

    inputShowBankDetails();
    inputShowUPIQrCode();
    inputShowAuthorized();

    document.getElementById('invoice-size').classList.add('col-md-9');
    document.getElementById('invoice-size').classList.remove('col-md-12');

    document.getElementById('invoice').classList.remove('hide-borders');
    document.getElementById('invoice').classList.add('card');


    document.querySelectorAll('.invoice-heading,.note-write,.term-write,#custom-date-group').forEach(function (element) {
        element.classList.remove('hidden');
    });
    document.querySelectorAll('.invoice-title,.note-show,.term-show').forEach(function (element) {
        element.classList.add('hidden');
    });

    const inputs = document.querySelectorAll('#invoice input, #invoice textarea,#invoice select');
    const inputparent = document.querySelectorAll('.parent-hide');
    const hideTElements = document.querySelectorAll('.hide-t');

    inputs.forEach(input => {
        input.parentElement.style.display = '';
    });
    inputparent.forEach(input => {
        if (!input.value) {
            input.parentElement.parentElement.style.display = '';
        }
    });
    hideTElements.forEach(element => {
        element.style.display = '';
    });
}

//require this filed
function validateFields() {
    const items = document.querySelectorAll('#invoice-items tr');
    const from = document.getElementById('from_name');
    const billTo = document.getElementById('bill_to_name');
    const invoiceHeading = document.getElementById('invoice-heading');
    let isValid = true, errorMessage = '';

    const showError = (field, message) => {
        field.classList.add('error');
        errorMessage += `<div class="alert alert-danger alert-dismissible fade show" role="alert">${message}<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`;
        isValid = false;
    };

    const clearError = (field) => {
        field.classList.remove('error');
    };

    items.forEach(item => {
        const [descriptionField, quantityField, rateField] = item.querySelectorAll('td input');
        const description = descriptionField?.value.trim();
        const quantity = quantityField?.value.trim();
        const rate = rateField?.value.trim();

        if (!description) showError(descriptionField, 'Description of item/service is required.');
        else clearError(descriptionField);

        if (['hours', 'quantity'].includes(template)) {
            if (!quantity) showError(quantityField, `${template === 'hours' ? 'Hours' : 'Quantity'} is required.`);
            else clearError(quantityField);

            if (!rate) showError(rateField, 'Rate is required.');
            else clearError(rateField);
        }

        if (template === 'amounts-only') {
            if (!quantity) showError(quantityField, 'Amount is required.');
            else clearError(quantityField);
        }
    });

    if (!invoiceHeading.value.trim()) showError(invoiceHeading, 'Invoice Heading field is required.');
    else clearError(invoiceHeading);

    if (!from.value.trim()) showError(from, 'Business Name field is required.');
    else clearError(from);

    if (!billTo.value.trim()) showError(billTo, 'Client Name field is required.');
    else clearError(billTo);

    document.getElementById('ErrorMessage').innerHTML = errorMessage;

    return isValid;
}


// IndexedDB utility setup
function openDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('DownloadHistoryDB', 1);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('downloadHistory')) {
                db.createObjectStore('downloadHistory', { keyPath: 'id', autoIncrement: true });
            }
        };

        request.onsuccess = (event) => {
            resolve(event.target.result);
        };

        request.onerror = (event) => {
            reject('Error opening database:', event.target.errorCode);
        };
    });
}

function addToDatabase(entry) {
    return new Promise(async (resolve, reject) => {
        const db = await openDatabase();
        const transaction = db.transaction('downloadHistory', 'readwrite');
        const store = transaction.objectStore('downloadHistory');

        const request = store.add(entry);

        request.onsuccess = () => resolve();
        request.onerror = () => reject('Error adding data to database');
    });
}

function getAllFromDatabase() {
    return new Promise(async (resolve, reject) => {
        const db = await openDatabase();
        const transaction = db.transaction('downloadHistory', 'readonly');
        const store = transaction.objectStore('downloadHistory');
        const request = store.getAll();

        request.onsuccess = (event) => resolve(event.target.result);
        request.onerror = () => reject('Error retrieving data from database');
    });
}

function removeOldestEntry() {
    return new Promise(async (resolve, reject) => {
        const db = await openDatabase();
        const transaction = db.transaction('downloadHistory', 'readwrite');
        const store = transaction.objectStore('downloadHistory');
        const request = store.openCursor();

        request.onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor) {
                cursor.delete();
                resolve();
            }
        };

        request.onerror = () => reject('Error deleting data from database');
    });
}

async function downloadPDF() {
    if (!validateFields()) {
        return;
    }

    document.getElementById('LoadSpinner').style.display = 'block';
    document.body.style.background = '#eee';
    document.body.style.cursor = 'not-allowed';

    hideEmptyFields();

    const invoiceTitle = document.querySelector('.invoice-title');
    const invoiceHeading = invoiceTitle.textContent;

    const invoicetotalId = document.querySelector('#total');
    const invoiceTotal = invoicetotalId.textContent;

    const invoice = document.getElementById('invoice');

    const canvas = await html2canvas(invoice, {
        scale: 2, // Double the scale to improve quality
        useCORS: true // Enable CORS if there are external resources
    });
    const imgData = canvas.toDataURL('image/png');

    // Compress the image data to reduce size
    const compressedImgData = await compressImage(imgData, 0.5); // 0.5 for 50% quality

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'pt', 'a4');
    const imgProps = pdf.getImageProperties(compressedImgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    const pdfFileName = 'invoice.pdf';

    const pageHeight = pdf.internal.pageSize.height;

    const totalHeight = imgProps.height * (pdfWidth / imgProps.width);
    const numberOfPages = Math.ceil(totalHeight / pageHeight);

    for (let i = 0; i < numberOfPages; i++) {
        const yOffset = i * pageHeight;
        if (i > 0) {
            pdf.addPage();
        }

        pdf.addImage(compressedImgData, 'PNG', 0, -yOffset, pdfWidth, totalHeight);
    }

    pdf.save('invoice.pdf');

    try {
        const downloadEntry = {
            heading: invoiceHeading,
            fileName: pdfFileName,
            total: invoiceTotal,
            date: getcurrentDateTime(),
            fileData: compressedImgData
        };

        const downloadHistory = await getAllFromDatabase();

        // if (downloadHistory.length >= 5) {
        //     await removeOldestEntry();
        // }

        await addToDatabase(downloadEntry);
    } catch (error) {
        console.error('Error while storing data in IndexedDB:', error);
    }



    document.getElementById('LoadSpinner').style.display = 'none';
    document.body.style.background = '';
    document.body.style.cursor = '';

    showHiddenFields();
}

function compressImage(base64Image, quality = 0.5) {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = base64Image;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            canvas.width = img.width;
            canvas.height = img.height;

            ctx.drawImage(img, 0, 0);

            const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
            resolve(compressedBase64);
        };
    });
}



document.getElementById('downloadInvoice').addEventListener('click', downloadPDF);

document.getElementById('sendEmailButton').addEventListener('click', function () {
    document.getElementById('emailModal').style.display = 'block';
});

// document.getElementById('closeemailModal').addEventListener('click', function () {
//     document.getElementById('emailModal').style.display = 'none';
// });
// document.getElementById('btncloseemailModal').addEventListener('click', function () {
//     document.getElementById('emailModal').style.display = 'none';
// });




// document.getElementById('emailForm').addEventListener('submit', function (event) {
//     document.getElementById('emailModal').style.display = 'none';

//     event.preventDefault();

//     const senderEmailField = document.getElementById('senderEmail');
//     const senderEmail = senderEmailField.value;
//     const existingAlertsenderEmail = senderEmailField.nextElementSibling;
//     if (existingAlertsenderEmail) {
//         existingAlertsenderEmail.remove();
//         senderEmailField.style.border = '1px solid #eeeeee';
//     }

//     const recipientEmailField = document.getElementById('recipientEmail');
//     const recipientEmail = recipientEmailField.value;
//     const existingAlertrecipientEmail = recipientEmailField.nextElementSibling;
//     if (existingAlertrecipientEmail) {
//         existingAlertrecipientEmail.remove();
//         recipientEmailField.style.border = '1px solid #eeeeee';
//     }

//     const subjectEmailField = document.getElementById('subjectEmail');
//     const subjectEmail = subjectEmailField.value;
//     const existingAlertsubjectEmail = subjectEmailField.nextElementSibling;
//     if (existingAlertsubjectEmail) {
//         existingAlertsubjectEmail.remove();
//         subjectEmailField.style.border = '1px solid #eeeeee';
//     }

//     const emailMessageField = document.getElementById('emailMessage');
//     const emailMessage = emailMessageField.value;

//     if (!senderEmail || !recipientEmail || !subjectEmail) {
//         document.getElementById('emailModal').style.display = 'block';


//         if (!senderEmail) {
//             const existingAlert = senderEmailField.nextElementSibling;
//             if (existingAlert) {
//                 existingAlert.remove();
//             }
//             if (existingAlert && existingAlert.classList.contains('alert')) {
//                 existingAlert.remove();
//             }
//             const alertDiv = document.createElement('div');
//             alertDiv.className = 'text-danger m-1';
//             alertDiv.innerHTML = 'Sender Email To field is required.';
//             senderEmailField.parentNode.insertBefore(alertDiv, senderEmailField.nextSibling);
//             senderEmailField.style.border = '2px solid red';
//         }

//         if (!recipientEmail) {
//             const existingAlert = recipientEmailField.nextElementSibling;
//             if (existingAlert) {
//                 existingAlert.remove();
//             }
//             if (existingAlert && existingAlert.classList.contains('alert')) {
//                 existingAlert.remove();
//             }
//             const alertDiv = document.createElement('div');
//             alertDiv.className = 'text-danger m-1';
//             alertDiv.innerHTML = 'Recipient Email To field is required.';
//             recipientEmailField.parentNode.insertBefore(alertDiv, recipientEmailField.nextSibling);
//             recipientEmailField.style.border = '2px solid red';
//         }
//         if (!subjectEmail) {
//             const existingAlert = subjectEmailField.nextElementSibling;
//             if (existingAlert) {
//                 existingAlert.remove();
//             }
//             if (existingAlert && existingAlert.classList.contains('alert')) {
//                 existingAlert.remove();
//             }
//             const alertDiv = document.createElement('div');
//             alertDiv.className = 'text-danger m-1';
//             alertDiv.innerHTML = 'Subject Message To field is required.';
//             subjectEmailField.parentNode.insertBefore(alertDiv, subjectEmailField.nextSibling);
//             subjectEmailField.style.border = '2px solid red';
//         }
//         return;
//     }



//     // Validate fields and create the PDF
//     if (!validateFields()) {
//         document.getElementById('loadingSpinner').style.display = 'none';
//         document.getElementById('submitButton').disabled = false;
//         document.body.style.background = '';
//         document.body.style.cursor = '';
//         return;
//     }
//     // Show the spinner
//     document.getElementById('loadingSpinner').style.display = 'block';
//     document.getElementById('submitButton').disabled = true;
//     document.body.style.background = '#eee';
//     document.body.style.cursor = 'not-allowed';
//     hideEmptyFields();
//     const invoice = document.getElementById('invoice');
//     html2canvas(invoice).then(canvas => {
//         const imgData = canvas.toDataURL('image/png');

//         const { jsPDF } = window.jspdf;
//         const pdf = new jsPDF('p', 'pt', 'a4');
//         const imgProps = pdf.getImageProperties(imgData);
//         const pdfWidth = pdf.internal.pageSize.getWidth();
//         const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

//         pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
//         const pdfBlob = pdf.output('blob');
//         // console.log('PDF Blob:', pdfBlob);


//         const formData = new FormData();
//         formData.append('senderEmail', senderEmail);
//         formData.append('recipientEmail', recipientEmail);
//         formData.append('subject', subjectEmail);
//         formData.append('emailMessage', emailMessage);
//         formData.append('invoicePdf', pdfBlob, 'invoice.pdf');


//         // formData.forEach((value, key) => {
//         //     console.log(key + ": " + value);
//         // });
//         // for (const [key, value] of formData.entries()) {
//         //     console.log(key, value);
//         // }

//         $.ajaxSetup({
//             headers: {
//                 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
//             }
//         });
//         var url = "{{ route('send.invoice.email') }}";
//         $.ajax({
//             type: "POST",
//             url: url,
//             data: formData,
//             processData: false,
//             contentType: false,
//             success: function (response) {
//                 $('#successModal').modal('show');
//                 document.getElementById('emailModal').style.display = 'none';

//                 document.getElementById("successMessageEmail").innerText = response.message;
//                 document.getElementById("senderEmailMess").innerText = "Sender :- " + response.senderEmail;
//                 document.getElementById("recipientEmailMess").innerText = "Receiver :- " + response.recipientEmail;
//                 document.getElementById("subjectMess").innerText = "Subject :- " + response.subject;
//                 if (response.emailMessage != null) {
//                     document.getElementById("emailMessageMess").innerText = "email Message :-" + response.emailMessage;
//                 }

//                 // Hide spinner
//                 document.getElementById('loadingSpinner').style.display = 'none';
//                 document.getElementById('submitButton').disabled = false;
//                 document.body.style.background = '';
//                 document.body.style.cursor = '';
//             },
//             error: function (jqXHR, textStatus, errorThrown) {
//                 console.log('Error:', jqXHR.responseText);
//                 console.log('Status:', textStatus);
//                 console.log('Error Thrown:', errorThrown);

//                 // Hide spinner
//                 document.getElementById('loadingSpinner').style.display = 'none';
//                 document.getElementById('submitButton').disabled = false;
//                 document.body.style.background = '';
//                 document.body.style.cursor = '';


//                 // Optionally, show an error message or handle the error
//                 alert('There was an error sending the email. Please try again.');
//             }
//         });
//     });
//     showHiddenFields();
// });



// Form submission event
// document.getElementById('email-form').addEventListener('submit', function(event) {
//     event.preventDefault();

//     const fromEmail = document.getElementById('from-email').value;
//     const toEmail = document.getElementById('to-email').value;
//     const pdfFile = document.getElementById('pdf-file').files[0];

//     const reader = new FileReader();
//     reader.onload = function(e) {
//         const base64PDF = e.target.result.split(',')[1];  // Get base64 data without the prefix

//         const templateParams = {
//             from_email: fromEmail,
//             to_email: toEmail,
//             attachment: base64PDF,  // PDF in base64 format
//             file_name: pdfFile.name,
//         };

//         // Send the email via EmailJS
//         emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", templateParams)
//             .then(function(response) {
//                 alert("Email sent successfully!");
//             }, function(error) {
//                 console.error("Failed to send email:", error);
//             });
//     };
//     reader.readAsDataURL(pdfFile);  // Read the PDF file as Base64
// });



// bank details input hide
function inputHideBankDetails() {
    const bankInput = document.getElementById('bank-input');
    bankInput.classList.add('hidden');

    const accountNameInput = document.getElementById('accountName');
    const accountNumberInput = document.getElementById('accountNumber');
    const ifscInput = document.getElementById('ifsc');
    const accountTypeInput = document.getElementById('accountType');
    const bankInputData = document.getElementById('bank');

    var bankDetailsDiv = document.querySelector('.bank-details');

    bankDetailsDiv.innerHTML = "";

    if (accountNameInput.value || accountNumberInput.value || ifscInput.value || accountTypeInput.value || bankInputData.value) {
        const bankShow = document.getElementById('bank-show');
        bankShow.classList.remove('hidden');
        bankDetailsDiv.innerHTML += `<h6 class="bank-details-title">Bank Details</h6>`;
    }
    if (accountNameInput.value) {
        bankDetailsDiv.innerHTML += `<p><strong>Account Name: </strong>${accountNameInput.value}</p>`;
    }
    if (accountNumberInput.value) {
        bankDetailsDiv.innerHTML += `<p><strong>Account Number: </strong>${accountNumberInput.value}</p>`;
    }
    if (ifscInput.value) {
        bankDetailsDiv.innerHTML += `<p><strong>IFSC: </strong>${ifscInput.value}</p>`;
    }
    if (accountTypeInput.value) {
        bankDetailsDiv.innerHTML += `<p><strong>Account Type: </strong>${accountTypeInput.value}</p>`;
    }
    if (bankInputData.value) {
        bankDetailsDiv.innerHTML += `<p><strong>Bank: </strong>${bankInputData.value}</p>`;
    }
}
//bank details input show
function inputShowBankDetails() {
    const bankInput = document.getElementById('bank-input');
    const bankShow = document.getElementById('bank-show');

    bankShow.classList.add('hidden');
    bankInput.classList.remove('hidden');
}
//bank details end

// upi qr code
function inputShowUPIQrCode() {
    const upiInput = document.getElementById('upi-input');
    const upiShow = document.getElementById('upi-show');
    upiShow.classList.add('hidden');
    upiInput.classList.remove('hidden');
}
function inputHideUPIQrCode() {
    const upiShow = document.getElementById('upi-show');
    const upiInput = document.getElementById('upi-input');
    upiInput.classList.add('hidden');
    var upiId = document.getElementById("upi-id").value;
    if (upiId) {
        upiShow.classList.remove('hidden');
        var upiString = `upi://pay?pa=${upiId}`;
        document.getElementById("upi-qrcode").innerHTML = "";
        var qrcode = new QRCode(document.getElementById("upi-qrcode"), {
            text: upiString,
            width: 100,
            height: 100
        });
        document.getElementById("upi-id-show").innerHTML = `<p><strong>${upiId}</strong></p>`;
    }
}
// upi qr code end

// Upload Authorized Signator
document.getElementById('signatoryInput').addEventListener('change', function (event) {
    const input = event.target;
    if (input.files && input.files[0]) {

        const reader = new FileReader();

        reader.onload = function (e) {
            const signatoryImage = document.getElementById('signatoryImage');
            signatoryImage.src = e.target.result;
            signatoryImage.style.display = 'block';
            document.querySelector('.authorized-signatory span').style.display = 'none';
            document.getElementById('signatoryInput').style.display = 'none';
            document.getElementById('removeSignatory').style.display = 'block';

            const authorizedSignatory = document.querySelector('.authorized-signatory');
            authorizedSignatory.style.padding = '0';
            authorizedSignatory.style.borderRadius = '0';
        }
        reader.readAsDataURL(input.files[0]);
    }
});


document.getElementById('removeSignatory').addEventListener('click', function () {

    const authorizedSignatory = document.querySelector('.authorized-signatory');
    authorizedSignatory.style.padding = '10px';
    authorizedSignatory.style.borderRadius = '10px';

    document.getElementById('signatoryImage').style.display = 'none';
    document.querySelector('.authorized-signatory span').style.display = 'block';
    document.getElementById('signatoryInput').style.display = 'block';
    this.style.display = 'none';
    document.getElementById('signatoryInput').value = '';
});

function inputShowAuthorized() {
    document.getElementById('Authorized-Text').style.display = "block";
}
function inputHideAuthorized() {
    if (!document.getElementById('signatoryInput').value) {
        document.getElementById('Authorized-Text').style.display = "none";
    }
}

// End upload Authorized Signatory
