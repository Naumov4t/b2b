let menuBtn = document.querySelector('.header-section__menu-btn');
let menu = document.querySelector('.mobile-nav');

menuBtn.addEventListener('click', function() {
    menuBtn.classList.toggle('header-section__menu-btn--active');
    menu.classList.toggle('mobile-nav--active');
})