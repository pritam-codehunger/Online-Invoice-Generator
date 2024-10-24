// display download history
function loadDownloadHistory() {
    const downloadHistory = JSON.parse(localStorage.getItem('downloadHistory')) || [];
    const tableBody = document.querySelector('#download-history-table tbody');
    tableBody.innerHTML = '';


    if (downloadHistory.length === 0) {
        const noDataMessage = document.createElement('tr');
        const messageCell = document.createElement('td');
        messageCell.setAttribute('colspan', 5);
        messageCell.textContent = 'No download history available.';
        messageCell.classList.add('text-center', 'text-muted');
        noDataMessage.appendChild(messageCell);
        tableBody.appendChild(noDataMessage);
        return;
    }

    downloadHistory.sort((a, b) => {
        const dateA = parseDateString(a.date);
        const dateB = parseDateString(b.date);
        return dateB - dateA;
    });

    var a = 0;
    downloadHistory.forEach(entry => {
        
        a++;

        const row = document.createElement('tr');

        const noCell = document.createElement('td');
        noCell.textContent = a;
        row.appendChild(noCell);

        const headingCell = document.createElement('td');
        headingCell.textContent = entry.heading;
        row.appendChild(headingCell);

        const totalCell = document.createElement('td');
        totalCell.textContent = entry.total;
        row.appendChild(totalCell);

        const dateCell = document.createElement('td');
        dateCell.textContent = entry.date;
        row.appendChild(dateCell);

        const downloadCell = document.createElement('td');
        const downloadBtn = document.createElement('button');
        downloadBtn.textContent = 'Download';
        downloadBtn.classList.add('btn', 'btn-outline-secondary', 'btn-sm', 'move-to-wishlist', 'download-histroy');
        downloadBtn.addEventListener('click', () => {
            downloadPDF(entry);
        });
        downloadCell.appendChild(downloadBtn);
        row.appendChild(downloadCell);

        tableBody.appendChild(row);
    });
}
// end display download history

// Function to download PDF from history
function downloadPDF(entry) {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'pt', 'a4');

    const imgProps = pdf.getImageProperties(entry.fileData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    const pageHeight = pdf.internal.pageSize.height;
    const totalHeight = imgProps.height * (pdfWidth / imgProps.width);
    const numberOfPages = Math.ceil(totalHeight / pageHeight);

    // Add the image to the PDF across multiple pages
    for (let i = 0; i < numberOfPages; i++) {
        const yOffset = i * pageHeight;
        if (i > 0) {
            pdf.addPage();
        }
        pdf.addImage(entry.fileData, 'PNG', 0, -yOffset, pdfWidth, totalHeight);
    }
    pdf.save('invoice.pdf');
}
//end Function to download PDF from history


// Load history when the page is ready
document.addEventListener('DOMContentLoaded', loadDownloadHistory);


// Helper function to parse date string in "DD-MM-YYYY HH:mm AM/PM" format
function parseDateString(dateString) {
    const [datePart, timePart] = dateString.split(' ');
    const [day, month, year] = datePart.split('-').map(Number);

    let [hours, minutes] = timePart.split(':');
    const period = minutes.split(' ')[1]; // AM or PM
    minutes = parseInt(minutes, 10);
    hours = parseInt(hours, 10);

    if (period === 'PM' && hours !== 12) {
        hours += 12;
    } else if (period === 'AM' && hours === 12) {
        hours = 0;
    }

    return new Date(year, month - 1, day, hours, minutes);
}