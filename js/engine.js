const initElements = []

// Adminbar
{
	// Adminbar
	if (document.cookie.indexOf("is_admin=1") !== -1) {
		const style = document.createElement("link")
		style.rel = "stylesheet"
		style.href = "/tpl/css/adminbar.css"
		document.head.append(style)

		const bar = document.createElement("div")
		bar.id = "adminbar"

		const admin_link = document.createElement("a")
		admin_link.href = "/admin/"
		admin_link.innerText = "Панель редактора"
		bar.append(admin_link)

		admin_link.addEventListener("click", (e) => {
			e.preventDefault()
			e.stopPropagation()

			window.open("/admin/")
		})

		const btn_val = document.cookie.indexOf("debug_ad=1") !== -1 ? 0 : 1

		const ad_link = document.createElement("a")
		ad_link.href = "#"

		if (btn_val === 0) ad_link.innerText = "Вимкнути відлагодження реклами"
		else ad_link.innerText = "Увімкнути відлагодження реклами"

		bar.append(ad_link)

		ad_link.addEventListener("click", (e) => {
			e.preventDefault()
			document.cookie = "debug_ad=" + btn_val.toString() + "; path=/"
			location.reload()
		})

		document.body.append(bar)

		initElements.push(() => {
			bar.querySelector("#news_edit_link")?.remove()

			const match = window.location
				.toString()
				.match(/\/[a-z]+\/[a-zA-Z\-0-9_.]*_(\d+).html/)

			if (match) {
				const edit_link = document.createElement("a")
				edit_link.href = "/admin/?act=edit&id=" + match[1]
				edit_link.innerText = "Редагувати новину"
				edit_link.id = "news_edit_link"
				edit_link.target = "_blank"
				bar.insertBefore(edit_link, ad_link)

				edit_link.addEventListener("click", (e) => {
					e.preventDefault()
					e.stopPropagation()

					window.open("/admin/?act=edit&id=" + match[1])
				})
			}
		})
	}
}

// share count
initElements.push(() => {
	const share_page = document.querySelector("[data-share_count]")

	if (share_page) {
		const count = JSON.parse(share_page.dataset.share_count)

		share_page.querySelectorAll("[data-share]").forEach((btn) => {
			const cnt =
				typeof count[btn.dataset.share] !== "undefined"
					? parseInt(count[btn.dataset.share])
					: 0

			const cnt_span = btn.querySelector("span")
			cnt_span.innerText = cnt.toString()
			cnt_span.style.display = cnt > 0 ? "" : "none"

			btn.addEventListener("click", (e) => {
				e.stopPropagation()

				let cnt = parseInt(cnt_span.innerText)
				cnt += 1

				cnt_span.innerText = cnt.toString()
				cnt_span.style.display = cnt > 0 ? "" : "none"

				fetch(
					"/news_vote.php?act=add&news_id=" +
						share_page.dataset.news_id +
						"&vote=" +
						btn.dataset.share
				).then()
			})
		})
	}
})

// share buttons
initElements.push(() => {
	const share_buttons = document.querySelector(".share-buttons")

	const facebook = share_buttons.querySelectorAll(".facebook")
	const twitter = share_buttons.querySelectorAll(".twitter")
	const telegram = share_buttons.querySelectorAll(".telegram")
	const viber = share_buttons.querySelectorAll(".viber")

	facebook &&
		facebook.forEach((item) => {
			item.dataset.init = "1"
			item.addEventListener("click", (e) => {
				e.preventDefault()
				const url =
					"https://facebook.com/sharer.php?display=popup&u=" +
					window.location.href
				const options =
					"toolbar=0,status=0,resizable=1,width=626,height=436"
				window.open(url, "sharer", options)
			})
		})

	twitter &&
		twitter.forEach((item) => {
			item.dataset.init = "1"
			item.addEventListener("click", (e) => {
				e.preventDefault()
				const url =
					"https://twitter.com/intent/tweet?text=" +
					document.title +
					" " +
					window.location.href
				const options =
					"toolbar=0,status=0,resizable=1,width=626,height=436"
				window.open(url, "twitter", options)
			})
		})

	telegram &&
		telegram.forEach((item) => {
			item.dataset.init = "1"
			item.addEventListener("click", (e) => {
				e.preventDefault()
				const url =
					"https://telegram.me/share/url?url=" +
					window.location.href +
					"&text=" +
					document.title
				const options =
					"toolbar=0,status=0,resizable=1,width=626,height=436"
				window.open(url, "telegram", options)
			})
		})

	viber &&
		viber.forEach((item) => {
			item.dataset.init = "1"
			item.addEventListener("click", (e) => {
				e.preventDefault()
				const url =
					"viber://forward?text=" +
					document.title +
					" " +
					window.location.href
				const options =
					"toolbar=0,status=0,resizable=1,width=626,height=436"
				window.open(url, "viber", options)
			})
		})
})

//levus-touch-gallery
initElements.push(() => {
	if (document.querySelector(".levus-touch-gallery")) {
		const script = document.createElement("script")
		script.src = "/tpl/js/levus-touch-gallery.js"
		document.body.append(script)
	}
})

class Ads {
	static init() {
		// News in body load
		{
			const page = document.querySelector(
				"#article-content main:not([data-inited])"
			)

			if (page) {
				const root_blocks = document.querySelectorAll(
					"#article-content main > p, #article-content main > blockquote"
				)

				if (root_blocks.length > 5) {
					for (let idx = 4; idx < root_blocks.length; idx += 6) {
						const block = root_blocks.item(idx)

						const ad = document.createElement("p")
						ad.classList.add("ad")
						ad.dataset.key = "news_intxt"
						block.parentNode.insertBefore(ad, block)
					}
				}

				page.dataset.inited = "1"
			}
		}

		let ads_show = []

		const flag = window.innerWidth > 776 ? "is_desktop" : "is_mobile"

		document
			.querySelectorAll(".ad[data-key]:not([data-inited])")
			.forEach((block) => {
				const rect = block.getBoundingClientRect()
				if (
					!(
						rect.top > 0 &&
						rect.top <
							document.documentElement.clientHeight *
								Ads.viewframe_koe
					)
				)
					return

				const block_data = Ads.data[block.dataset.key]

				if (document.cookie.indexOf("debug_ad=1") !== -1) {
					// debug mode
					if (typeof block_data !== "undefined")
						block.innerHTML = block_data["name"]
					else block.innerHTML = "undefined key: " + block.dataset.key

					block.classList.add("debug")
					block.dataset.inited = "1"
					return
				}

				if (typeof block_data === "undefined") return

				if (Object.entries(block_data["ads"]).length > 0) {
					Object.entries(block_data["ads"]).forEach(([, ads]) => {
						const items = []
						Object.entries(ads).forEach(([, ad]) => {
							if (ad[flag]) items.push(ad)
						})

						const item =
							items[Math.floor(Math.random() * items.length)]

						if (typeof item !== "undefined") {
							if (item["html"].length > 0) {
								const div = document.createElement("div")
								div.innerHTML = item["html"]
								div.dataset.ad_id = item["id"]
								block.appendChild(div)
							}

							if (item["html"].length > 0) {
								const script = document.createElement("script")
								script.innerText = item["js"]
								block.appendChild(script)
							}

							ads_show.push(item["id"])
						}
					})
				} else block.remove()

				block.dataset.inited = "1"
			})

		if (ads_show.length > 0)
			fetch(
				"/register_view.php?type=ads&ids=" + ads_show.join(",")
			).then()
	}
}
Ads.data = {}
Ads.viewframe_koe = 1

// Ads load
{
	fetch("/cachedata.json?" + Math.random())
		.then((res) => {
			return res.json()
		})
		.then((data) => {
			Ads.data = data
			Ads.init()
			document.addEventListener("scroll", () => {
				Ads.viewframe_koe = 2
				Ads.init()
			})
			initElements.push(() => Ads.init())
		})
}

{
	document.querySelectorAll(".embed-render-box").forEach((box) =>
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
}

initElements.push(() => {
	if (
		document.querySelectorAll(".video-open-popup, .video-open-inline")
			.length > 0
	) {
		const radio_player = document.querySelector("audio#radio_player")
		let radio_fade_interval = null

		const clearRadioFadeInterval = () => {
			if (radio_fade_interval === null) return

			clearInterval(radio_fade_interval)
			radio_fade_interval = null
		}

		const volumeFade = (up) => {
			clearRadioFadeInterval()
			radio_fade_interval = setInterval(() => {
				let volume = radio_player.volume

				if (up) volume += 0.1
				else volume -= 0.1

				if (volume < 0.0) {
					volume = 0
					clearRadioFadeInterval()
				}

				if (volume > 1.0) {
					volume = 1
					clearRadioFadeInterval()
				}

				radio_player.volume = volume
			}, 100)
		}

		const initPlayerAPI = (callback) => {
			if (typeof window["YT"] === "undefined") {
				window.onYouTubePlayerAPIReady = () => callback()

				const script = document.createElement("script")
				script.src = "https://www.youtube.com/player_api"
				document.body.append(script)
			} else callback()
		}

		document.querySelectorAll(".video-open-inline").forEach((block) =>
			block.addEventListener("click", () => {
				const div = document.createElement("div")
				div.style.height = block.clientHeight + "px"
				div.style.width = block.clientWidth + "px"
				block.append(div)

				initPlayerAPI(() => {
					let up_timeout = null

					new window["YT"]["Player"](div, {
						height: block.clientHeight,
						width: block.clientWidth,
						playerVars: { autoplay: 1 },
						videoId: block.dataset.id,
						events: {
							onReady: () => {
								block.classList.add(
									"video-open-inline-rendered"
								)
							},
							onStateChange: (e) => {
								if (e.data === 1) {
									if (up_timeout !== null)
										clearTimeout(up_timeout)

									volumeFade(false)
								} else if (e.data === 0 || e.data === 2)
									up_timeout = setTimeout(
										() => volumeFade(true),
										1000
									)
							},
						},
					})
				})
			})
		)

		const closePopup = () => {
			const popup = document.getElementById("video-player")
			if (!popup) return

			popup.style.display = "none"
			popup.remove()
		}

		// closing popup on Esc button
		window.addEventListener("keydown", (e) => {
			if (e.key === "Escape") closePopup()
		})

		const initPopup = () => {
			let popup = document.getElementById("video-player")

			if (popup) return popup

			popup = document.createElement("div")
			popup.id = "video-player"
			document.body.append(popup)

			const closeBtn = document.createElement("a")
			closeBtn.href = "#"
			closeBtn.id = "close-video-player"
			popup.append(closeBtn)

			// closing popup
			closeBtn.addEventListener("click", (e) => {
				e.preventDefault()
				e.stopPropagation()
				closePopup()
			})
			popup.addEventListener("click", (e) => {
				e.preventDefault()
				e.stopPropagation()
				closePopup()
			})

			const frameDiv = document.createElement("div")
			frameDiv.setAttribute("style", "--aspect-ratio: 16/9")
			popup.append(frameDiv)

			return popup
		}

		document.querySelectorAll(".video-open-popup").forEach((block) =>
			block.addEventListener("click", (e) => {
				e.stopPropagation()
				e.preventDefault()

				const popup = initPopup(),
					frameDiv = popup.querySelector("div")

				const div = document.createElement("div")
				div.style.height = frameDiv.clientHeight + "px"
				div.style.width = frameDiv.clientWidth + "px"
				frameDiv.append(div)

				initPlayerAPI(() => {
					let up_timeout = null

					const player = new window["YT"]["Player"](div, {
						height: frameDiv.clientHeight,
						width: frameDiv.clientWidth,
						playerVars: { autoplay: 1 },
						videoId:
							typeof block.dataset.video_playlist === "undefined"
								? block.dataset.id
								: "",
						events: {
							onReady: () => {
								if (
									typeof block.dataset.video_playlist !==
									"undefined"
								) {
									const videoIds = []
									let item = block.closest(
										"[data-video_playlist_item]"
									)

									do {
										videoIds.push(
											item.querySelector("[data-id]")
												.dataset.id
										)
										item = item.nextElementSibling
									} while (item)

									player.loadPlaylist(videoIds)
								}
							},
							onStateChange: (e) => {
								if (e.data === 1) {
									if (up_timeout !== null)
										clearTimeout(up_timeout)

									volumeFade(false)
								} else if (e.data === 0 || e.data === 2)
									up_timeout = setTimeout(
										() => volumeFade(true),
										1000
									)
							},
						},
					})
				})
			})
		)
	}
})

initElements.forEach((func) => func())
