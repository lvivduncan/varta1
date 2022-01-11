// 5-11-2021

// клік на кнопці -- відкриває форму пошуку
getID("search-button").addEventListener("click", () => {
    getID("search-form").className = "active"
    getID("search-button").className = "hide"
    getID("search-button-close").className = "active"
})

// закриваємо пошук по кліку на кнопку закриття (червоний хрестик)
getID("search-button-close").addEventListener("click", () => {
    getID("search-form").className = ""
    getID("search-button").className = ""
    getID("search-button-close").className = ""
})

// показати мобільне меню
getID("nav-button").addEventListener("click", () => {
    getID("mobile").className = "active"
})

// закриваємо мобільне меню по кліку на кнопку з хрестиком
getID("mobile-button").addEventListener("click", () => {
    getID("mobile").className = ""
})

// закриваємо мобільне меню, натиснувши ескейп
document.addEventListener("keydown", (event) => {
    if (event.code === "Escape" || event.key === "Escape") {
        getID("mobile").className = ""

        getID("search-form").className = ""
        getID("search-button").className = ""
        getID("search-button-close").className = ""
    }
})

function getID(selector) {
    return document.getElementById(selector)
}

function $(selector) {
    return document.querySelector(selector)
}

// 11-01-22
