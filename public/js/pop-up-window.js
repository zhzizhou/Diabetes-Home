// Open pop-up window
function showModel() {
    var model = document.getElementById("successful-update-data");
    var hidebg = document.getElementById("hidebg");
    hidebg.style.display = "block";
    model.style.display = "block";
    stopBodyScroll(1);
}

// Close pop-up window
function closeModel() {
    document.getElementById("hidebg").style.display = "none";
    var model = document.getElementById("successful-update-data");
    model.style.display = "none";
    stopBodyScroll(0);
}

// Stop scoll
function stopBodyScroll(isFixed) {
    let bodyEl = document.body;
    var tsbody = document.getElementById("ts-body");
    var box = document.getElementById("dashboard-right");
    var nav = document.getElementsByClassName("nav-placeholder");
    let top = 0;

    if (isFixed == 1) {
        top = window.scrollY;
        bodyEl.style.position = 'fixed';
        tsbody.style.position = 'fixed';
        box.style.position = 'fixed';
        nav.style.position = 'fixed';
        bodyEl.style.top = -top + 'px';
    } else {
        bodyEl.style.position = '';
        tsbody.style.position = '';
        box.style.position = '';
        nav.style.position = '';
        bodyEl.style.top = '';
        window.scrollTo(0, top);
    }
}

// POP-UP TABS
function openCity(evt, cityName) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";
}

// Get the element with id="defaultOpen" and click on it
document.getElementById("open").click();


// VALIDATING FORM
function ValidateEmail(inputText) {
    var emailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (inputText.value.match(emailformat)) {
        alert("Valid email address!");
        document.newPatientForm.email.focus();
        return true;
    } else {
        err = ("You have entered an invalid email address!");
        document.newPatientForm.email.focus();
        return false;
    }
}
//document.getElementById("open").click();