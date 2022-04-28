

function showModel() {
    var model = document.getElementById("successful-update-data");
    model.style.display = "block";
    //var body = document.getElementById("ts-body");
    //body.style.overflow = "hidden";
    stopBodyScroll(1);
}

function closeModel() {
    var model = document.getElementById("successful-update-data");
    model.style.display = "none";
}

function stopBodyScroll(isFixed) {
    let bodyEl = document.body;
    let top = 0;
    
    if (isFixed) {
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