function showModel() {
    var model = document.getElementById("successful-update-data");
    model.style.display = "block";
    var bodyscroll = 0;
    bodyscroll = -$(window).scrollTop();
    $("body").addClass('fixed');
    $("body").css("top", bodyscroll);
}

function closeModel() {
    var model = document.getElementById("successful-update-data");
    model.style.display = "none";
}