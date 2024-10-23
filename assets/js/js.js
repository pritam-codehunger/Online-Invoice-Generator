// header footer add
function loadHTML(containerId, file) {
    fetch(file)
        .then(response => response.text())
        .then(data => {
            const container = document.getElementById(containerId);
            if (container) {
                container.innerHTML = data;
            } else {
                console.error(`Element with id '${containerId}' not found.`);
            }
        })
        .catch(error => console.error('Error loading file:', error));
}
loadHTML('header', 'header.html');
loadHTML('footer', 'footer.html');
// header footer add

// color changes
$(document).ready(function () {
    $('#primaryColorPicker').on('input', function () {
        const newColor = $(this).val();
        document.documentElement.style.setProperty('--primary-change-color', newColor);
        const lightColor = `${newColor}21`;
        document.documentElement.style.setProperty('--primary-change-light-color', lightColor);
        $('.card-border').css('border-color', newColor);
    });
});

$(document).ready(function () {
    // Handle swatch click to apply color immediately
    $('.color-swatch').on('click', function () {
        $('.color-swatch').removeClass('active');
        $(this).addClass('active');
        const selectedColor = $(this).data('color');
        document.documentElement.style.setProperty('--primary-change-color', selectedColor);
        const lightColor = `${selectedColor}21`;
        document.documentElement.style.setProperty('--primary-change-light-color', lightColor);
        $('.card-border').css('border-color', selectedColor);
    });
});
// end color changes

// google Translate in menu bar

// add google Translate 
function googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'en,es,fr,de,it,hi', 
        autoDisplay: false,
    }, 'google_translate_element');
}
//end google Translate 

// css add for google Translate 
const style = document.createElement('style');
style.innerHTML = `

/* Google Translate powered by remove */
.goog-logo-link {
    display:none !important;
  }
.goog-te-gadget {
    color: transparent !important;
}
/* end Google Translate powered by remove */

/* Google Translate fully hight set related your menu */
#google_translate_element { 
    height: 43px !important;
    overflow: hidden !important; 
    } 
/*end Google Translate fully hight set related your menu */


/* Google Translate select option in give desing */
.goog-te-gadget .goog-te-combo {
  display: block;
    width: 100%;
    padding: 0.375rem 0.75rem;
    font-size: 1rem;
    line-height: 1.5;
    color: #495057;
    background-color: #fff;
    background-clip: padding-box;
    border: 1px solid #ced4da;
    border-radius: 0.25rem;
    transition: border-color .15s ease-in-out, box-shadow .15s ease-in-out; 
   } 
/*end Google Translate select option in give desing */


/* Hide the floating Google Translate widget */
.goog-logo-link {
    display: none !important;
}
/*end Hide the floating Google Translate widget */

/* Hide Google Translate top in goole menu */
.VIpgJd-ZVi9od-ORHb-OEVmcd{
  display: none !important;
}
/* end Hide Google Translate top in goole menu */

/* Hide Google Translate top in goole menu in space problem solve */
.goog-te-banner-frame.skiptranslate {
    display: none !important;
} 
body {
    top: 0px !important; 
}
/* Hide Google Translate top in goole menu in space problem solve */

/* Hide Google Translate contant right click or hover show pop up this remove */
#goog-gt-tt{display: none !important; top: 0px !important; }
/*end  Hide Google Translate contant right click or hover show pop up this remove */
`;

document.head.appendChild(style);
//end css add for google Translate

//end google Translate in menu bar
