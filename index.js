import SPOTIFY_API_KEY from './apikey.js'

const nav = document.querySelector('nav')
const ranges = document.querySelectorAll('input[type=range]')
const navItems = document.querySelectorAll('nav li')
const audio = document.querySelector('audio')
const playBtn = document.querySelector('#play')
const container = document.querySelector('.new-releases__container')
const currMusicImg = document.querySelector('aside > img')
const currMusicTitle = document.querySelector('.text__title')
const currMusicArtist = document.querySelector('.text__artist')
const repeatBtn = document.querySelector('#repeat')
const shuffleBtn = document.querySelector('#shuffle')
const nextBtn = document.querySelector('#next')
const previousBtn = document.querySelector('#previous')
const topCharts = document.querySelectorAll('.top-chart')
const searchBar = document.querySelector('#search')
const searchContainer = document.querySelector('.your-search__container')

let seekInterval
container.innerHTML = ''
let currSong

document.querySelectorAll('.harmburger-toggle').forEach(el => {
  el.addEventListener('click', function () {
    nav.classList.toggle('active')
  })
})
navItems.forEach((item, idx) => {
  item.addEventListener('click', function () {
    if (idx === 0) window.location = 'index.html'
    if (idx === 1) window.location = 'album.html'
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
  clearInterval(seekInterval)
  audio.pause()
}
function play() {
  this.classList.remove('fa-circle-play')
  this.classList.add('fa-circle-pause')
  this.setAttribute('data-playboolean', 'false')
  audio.play()
}
playBtn.addEventListener('click', function () {
  if (Number.isNaN(audio.duration)) return
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

const lazyLoader = new IntersectionObserver(
  (entries, lazyLoader) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return
      entry.target.addEventListener('load', function () {
        this.style.width = '100%'
        this.style.filter = 'unset'
      })
      entry.target.src = entry.target.dataset.src
    })
  },
  {
    threshold: 0.6,
  }
)

const options = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': SPOTIFY_API_KEY,
    'X-RapidAPI-Host': 'spotify23.p.rapidapi.com',
  },
}

async function getMusicPlaylist(id, container) {
  let res = await fetch(
    `https://spotify23.p.rapidapi.com/playlist_tracks/?id=${id}&offset=0&limit=100`,
    options
  )
  let data = await res.json()
  let { items } = data
  container.innerHTML = ''
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
                              <p title='${name}'>${
      name.length > 15 ? name.slice(0, 16).padEnd(18, '...') : name
    }</p>
                              <p class="sub-text" title='${artist}'>${
      artist.length > 15 ? artist.slice(0, 16).padEnd(18, '...') : artist
    }</p>
                            </div>`
  })
  Array.from(container.children).forEach(child => {
    child.firstElementChild.style.width = '153px'
    lazyLoader.observe(child.firstElementChild)
  })
}
getMusicPlaylist('4XuvWxk9sq6YpvUAYwZKbw', container)
function chooseSong(releaseContainer, src, title, artist) {
  if (audio.src === releaseContainer.dataset.audio) return
  currSong = releaseContainer
  pause.call(playBtn)
  audio.src = releaseContainer.dataset.audio
  ranges[1].parentElement.style.setProperty('--progress', `0%`)
  ranges[1].value = 0
  ranges[0].parentElement.style.setProperty(
    '--progress',
    `${audio.volume * 100}%`
  )
  ranges[0].value = audio.volume * 100
  currMusicImg.src = src || releaseContainer.firstElementChild.src
  currMusicTitle.textContent = title || releaseContainer.children[1].textContent
  currMusicArtist.textContent =
    artist || releaseContainer.lastElementChild.textContent
}
document.body.addEventListener('click', function (e) {
  if (!e.target.closest('.new-release')) return
  chooseSong(e.target.closest('.new-release'))
})
audio.addEventListener('play', function () {
  let duration = audio.duration
  play.call(playBtn)
  seekInterval = setInterval(() => {
    let progress = (audio.currentTime / duration) * 100
    ranges[1].parentElement.style.setProperty('--progress', `${progress}%`)
    ranges[1].value = progress
  }, 500)
})
audio.addEventListener('pause', function () {
  pause.call(playBtn)
})
audio.addEventListener('ended', function () {
  repeatBtn.classList.contains('active') ? audio.play() : null
  if (shuffleBtn.classList.contains('active')) {
    let randomChild = [...container.children][
      Math.floor(Math.random() * container.children.length)
    ]
    chooseSong(randomChild)
    audio.addEventListener('durationchange', () => {
      play.call(playBtn)
    })
  }
})
repeatBtn.addEventListener('click', function () {
  this.classList.toggle('active')
  shuffleBtn.classList.remove('active')
})
shuffleBtn.addEventListener('click', function () {
  this.classList.toggle('active')
  repeatBtn.classList.remove('active')
})
nextBtn.addEventListener('click', function () {
  let nextSong = currSong.nextElementSibling
  if (!nextSong) return
  chooseSong(nextSong)
})
previousBtn.addEventListener('click', function () {
  let previousSong = currSong.previousElementSibling
  if (!previousSong) return
  chooseSong(previousSong)
})
topCharts.forEach(chart => {
  chart.addEventListener('click', function () {
    let chartChildren = [...chart.children]
    console.log(chartChildren[3].src)
    chooseSong(
      chart,
      chartChildren[3].src,
      chartChildren[0].textContent,
      chartChildren[1].textContent
    )
  })
})
searchBar.addEventListener('keydown', async function (e) {
  if (e.key !== 'Enter' || this.value.trim() === '') return
  const res = await fetch(
    `https://spotify23.p.rapidapi.com/search/?q=${this.value}&type=multi&offset=0&limit=10&numberOfTopResults=5`,
    options
  )
  const {
    playlists: {
      items: [
        {
          data: { uri },
        },
      ],
    },
  } = await res.json()
  let id = uri.match(/:[0-9a-zA-Z]+$/g)
  console.log()
  getMusicPlaylist(id[0].slice(1), searchContainer)
})
