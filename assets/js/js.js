// header footer add
function loadHTML(containerId, file) {
    fetch(file)
        .then(response => response.text())
        .then(data => {
            document.getElementById(containerId).innerHTML = data;
        })
        .catch(error => console.error('Error loading file:', error));
}
loadHTML('header', 'header.html');
loadHTML('footer', 'footer.html');
// header footer add
