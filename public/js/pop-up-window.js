

function showModel() {
    var model = document.getElementById("successful-update-data");
    var hidebg = document.getElementById("hidebg"); 
	hidebg.style.display="block"; 
    model.style.display = "block";
    stopBodyScroll(1);
}

function closeModel() {
    document.getElementById("hidebg").style.display="none";
    var model = document.getElementById("successful-update-data");
    model.style.display = "none";
    stopBodyScroll(0);
}

function stopBodyScroll(isFixed) {
    let bodyEl = document.body;
    let top = 0;

    if (isFixed == 1) {
        top = window.scrollY;
        bodyEl.style.position = 'fixed';
        bodyEl.style.top = -top + 'px';
    }
    else {
        bodyEl.style.position = '';
        bodyEl.style.top = '';
        window.scrollTo(0, top);
    }
}