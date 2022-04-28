/*OPEN MENU*/
function openMenu() {
  stopBodyScroll(1);
  document.getElementById("responsive-nav").style.display = "flex";

}

/*CLOSE MENU*/
function closeMenu() {
  document.getElementById("responsive-nav").style.display = "none";
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