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

    downloadHistory.forEach(entry => {
        const row = document.createElement('tr');

        const noCell = document.createElement('td');
        noCell.textContent = entry.id;
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

    pdf.addImage(entry.fileData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(entry.fileName);
}
//end Function to download PDF from history


// Load history when the page is ready
document.addEventListener('DOMContentLoaded', loadDownloadHistory);