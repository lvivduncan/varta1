// 5-11-2021
{
	const body = document.body

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
		body.className = "fixed"
		const cover = document.createElement("div")
		cover.id = "cover"
		body.append(cover)
		// <500 міняємо на хрестик
		getID("nav-button").className = "active"
	})

	// закриваємо мобільне меню по кліку на кнопку з хрестиком
	getID("mobile-button").addEventListener("click", () => {
		getID("mobile").className = ""
		body.className = ""
		cover.remove()
		// <500 міняємо на хрестик
		getID("nav-button").className = ""
	})

	document.addEventListener("click", (event) => {
		if (event.target.id === "cover") {
			getID("mobile").className = ""
			body.className = ""
			cover.remove()
			// <500 міняємо на хрестик
			getID("nav-button").className = ""
		}
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

	// шарбатон
	getID("button-share") &&
		getID("button-share").addEventListener("click", (event) => {
			event.preventDefault()
			const url =
				"https://facebook.com/sharer.php?display=popup&u=" +
				window.location.href
			const options =
				"toolbar=0,status=0,resizable=1,width=626,height=436"
			window.open(url, "sharer", options)
		})

	// Share button
	if (getID("button-share-mobile")) {
		getID("button-share-mobile")?.addEventListener("click", () => {
			if (navigator.share) {
				navigator
					.share({
						url: $('meta[property="og:url"]').content,
						title: $('meta[property="og:title"]').content,
					})
					.then()
					.catch(console.error)
			}
		})
	}

	// vidget
	$$(".embed-render-box").forEach((box) =>
		box.addEventListener("click", () => {
			if (box.dataset.code.length === 0) return

			box.setAttribute(
				"style",
				"--aspect-ratio: " +
					(box.clientWidth / box.clientHeight).toString() +
					"; max-width: " +
					box.clientWidth.toString() +
					"px"
			)

			box.innerHTML = ""

			const block = document
				.createRange()
				.createContextualFragment(box.dataset.code)
			box.append(block)
			box.style.backgroundColor = "white"

			box.dataset.code = ""
		})
	)

	// join buttons
	if ($(".join")) {
		const joinButtons = $$("[data-txt]")
		const joinButtonsSelected = []
		const joinButtonsSend = $(".join button")
		const joinOutput = $(".join p")

		for (let i = 0, length = joinButtons.length; i < length; i++) {
			joinButtons[i].addEventListener("click", function () {
				for (let k = 0; k < length; k++) {
					joinButtons[k].className = ""
				}
				this.className = "selected"
				joinButtonsSelected[0] = this.dataset.txt
				joinButtonsSelected[1] = this.dataset.link
				joinOutput.textContent = joinButtonsSelected[0]
			})
		}
		joinButtonsSend.addEventListener("click", () => {
			window.open(joinButtonsSelected[1], "_blank").focus()
		})
	}

	function getID(selector) {
		return document.getElementById(selector)
	}

	function $(selector) {
		return document.querySelector(selector)
	}

	function $$(selector) {
		return document.querySelectorAll(selector)
	}
}
// 22-02-22
