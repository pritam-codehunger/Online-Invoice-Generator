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
loadHTML('modals', 'modals.html');
// header footer add
// color changes
$(document).ready(function () {
    $('#primaryColorPicker').on('input', function () {
        const newColor = $(this).val();
        document.documentElement.style.setProperty('--primary-color', newColor);
        const lightColor = `${newColor}21`;
        document.documentElement.style.setProperty('--primary-light-color', lightColor);
        $('.card-border').css('border-color', newColor);
    });
});

$(document).ready(function () {
    // Handle swatch click to apply color immediately
    $('.color-swatch').on('click', function () {
        $('.color-swatch').removeClass('active');
        $(this).addClass('active');
        const selectedColor = $(this).data('color');
        document.documentElement.style.setProperty('--primary-color', selectedColor);
        const lightColor = `${selectedColor}21`;
        document.documentElement.style.setProperty('--primary-light-color', lightColor);
        $('.card-border').css('border-color', selectedColor);
    });
});
// end color changes
// google Translate 
function googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'en,es,fr,de,it', // Add the languages you want to support
        autoDisplay: false
    }, 'google_translate_element');
}
//end google Translate 
setInterval(function () {
    if ($('html').hasClass('translated-ltr') ||
        (document.getElementsByClassName("skiptranslate")[1].style.visibility == 'visible' &&
            document.getElementsByClassName("skiptranslate")[0].style.display != 'none')) {
        $('.navbar').css('margin-top', '30px');
    } else {
        $('.navbar').css('margin-top', '0px');
    }
}, 500);

// Create a <style> element
const style = document.createElement('style');

// Define your CSS rules
style.innerHTML = `
.skiptranslate {
};
.goog-logo-link {
    display:none !important;
  }
.goog-te-gadget {
      color: transparent !important;
    }
.goog-te-gadget .goog-te-combo {
    margin: 9px 0;
       height: 35px;
       width: 90px;
   } 



#google_translate_element { height: 26px !important; overflow: hidden !important; } 

`



// Append the <style> element to the document's head
document.head.appendChild(style);

// $(window).load(function(){
//     $(".goog-logo-link").empty();
//     $('.goog-te-gadget').html($('.goog-te-gadget').children());
// })