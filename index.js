let nav = document.querySelector('nav')
let ranges = document.querySelectorAll('input[type=range]')
let audio = document.querySelector('audio')
let playBtn = document.querySelector('#play')
let container = document.querySelector('.new-releases__container')
let currMusicImg = document.querySelector('aside > img')
let currMusicTitle = document.querySelector('.text__title')
let currMusicArtist = document.querySelector('.text__artist')
container.innerHTML = ''

document.querySelectorAll('.harmburger-toggle').forEach(el => {
  el.addEventListener('click', function () {
    nav.classList.toggle('active')
  })
})

ranges.forEach((el, idx) => {
  el.addEventListener('input', function () {
    el.parentElement.style.setProperty('--progress', `${el.value}%`)
    if (idx === 0) {
      audio.volume = el.value / 100
      return
    }
    audio.currentTime = (el.value / 100) * audio.duration
  })
})
function pause() {
  this.classList.remove('fa-circle-pause')
  this.classList.add('fa-circle-play')
  this.setAttribute('data-playboolean', 'true')
  audio.pause()
}
function play() {
  this.classList.remove('fa-circle-play')
  this.classList.add('fa-circle-pause')
  this.setAttribute('data-playboolean', 'false')
  audio.play()
}
playBtn.addEventListener('click', function () {
  if (audio.duration === 0) return
  ;(this.dataset.playboolean !== 'true' ? pause : play).call(this)
})

let inter = new IntersectionObserver(
  entries => {
    if (!entries[0].isIntersecting) {
      document.body.style.overflowY = 'unset'
      document.querySelector('html').style.overflowY = 'unset'
      return
    }
    if (window.innerWidth >= 735) return
    document.body.style.overflowY = 'hidden'
    document.querySelector('html').style.overflowY = 'hidden'
    document.body.scrollIntoView()
  },
  {
    threshold: 0.1,
  }
)
inter.observe(nav)

const lazyLoader = new IntersectionObserver((entries, lazyLoader) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return
    entry.target.addEventListener('load', function () {
      this.style.width = '100%'
      this.style.filter = 'unset'
    })
    entry.target.src = entry.target.dataset.src
  })
})

const options = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': '68ca7f80e9mshdaca8240d43ab1ap178984jsn99d2a212d1c9',
    'X-RapidAPI-Host': 'spotify23.p.rapidapi.com',
  },
}

async function getMusicPlaylist() {
  let res = await fetch(
    'https://spotify23.p.rapidapi.com/playlist_tracks/?id=37i9dQZF1DX4Wsb4d7NKfP&offset=0&limit=100',
    options
  )
  let data = await res.json()
  let { items } = data
  items.forEach(({ track }) => {
    let {
      album: {
        images: [{ url }, , { url: url1 }],
        name: artist,
      },
      name,
      preview_url,
    } = track
    container.innerHTML += `<div class="new-release" data-audio="${preview_url}">
                              <img src="${url1}" alt="" style="border-radius: 25px; filter: blur(2px);" data-src="${url}" class="ger"/>
                              <p>${name}</p>
                              <p class="sub-text">${artist}</p>
                            </div>`
  })
  Array.from(container.children).forEach(child => {
    child.firstElementChild.style.width = '153px'
    lazyLoader.observe(child.firstElementChild)
  })
  console.log(data)
}
getMusicPlaylist()
document.body.addEventListener('click', function (e) {
  if (!e.target.closest('.new-release')) return
  let releaseContainer = e.target.closest('.new-release')
  if (audio.src === releaseContainer.dataset.audio) return
  pause.call(playBtn)
  audio.src = releaseContainer.dataset.audio
  ranges[1].parentElement.style.setProperty('--progress', `0%`)
  ranges[1].value = 0
  ranges[0].parentElement.style.setProperty(
    '--progress',
    `${audio.volume * 100}%`
  )
  ranges[0].value = audio.volume * 100
  currMusicImg.src = releaseContainer.firstElementChild.src
  currMusicTitle.textContent = releaseContainer.children[1].textContent
  currMusicArtist.textContent = releaseContainer.lastElementChild.textContent
})
audio.addEventListener('play', function () {
  let duration = audio.duration
  const myInt = setInterval(() => {
    let progress = (audio.currentTime / duration) * 100
    ranges[1].parentElement.style.setProperty('--progress', `${progress}%`)
    ranges[1].value = progress
  }, 1000)
})
