// 5-11-2021

// клік на кнопці -- відкриває форму пошуку
document.getElementById('search-button').addEventListener('click', () => {
    
    document.getElementById('search-form').classList.add('active')
    document.getElementById('search-button').classList.add('hide')
})

document.getElementById('search-button-close').addEventListener('click', () => {

    document.getElementById('search-form').classList.remove('active')
    document.getElementById('search-button').classList.remove('hide')
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

//17-11-21