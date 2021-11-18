// 5-11-2021

// клік на кнопці -- відкриває форму пошуку
document.getElementById('search-button').addEventListener('click', () => {
    
    document.getElementById('search-form').className = 'active'
    document.getElementById('search-button').className = 'hide'
    document.getElementById('search-button-close').className = 'active'
})

// закриваємо пошук по кліку на кнопку закриття (червоний хрестик)
document.getElementById('search-button-close').addEventListener('click', () => {

    document.getElementById('search-form').className = ''
    document.getElementById('search-button').className = ''
    document.getElementById('search-button-close').className = ''
})

// показати мобільне меню
document.getElementById('nav-button').addEventListener('click', () => {

    document.getElementById('mobile').className = 'active'
})

// закриваємо мобільне меню по кліку на кнопку з хрестиком
document.getElementById('mobile-button').addEventListener('click', () => {

    document.getElementById('mobile').className = ''
})

// закриваємо мобільне меню, натиснувши ескейп
document.addEventListener('keydown', event =>{

    if(event.code === 'Escape' || event.key === 'Escape'){

        document.getElementById('mobile').className = ''
    }
})

// додаємо скрол до меню на мобільному
if(isTouchDevice()){

    document.querySelector('#nav ul').className = 'scroll'
} else {

    document.querySelector('#nav ul').className = ''
}

function isTouchDevice() {
    return (('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));
}

//18-11-21