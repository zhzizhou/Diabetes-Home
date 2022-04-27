function disableScroll() {
    $("body").attr("id", "disable");
}

function enableScroll() {
    $("body").removeAttr("id", "disable");
}