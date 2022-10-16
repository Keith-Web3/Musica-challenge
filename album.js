const nav = document.querySelector('nav')
const ranges = document.querySelectorAll('input[type=range]')
const navItems = document.querySelectorAll('nav li')
const coverImage = document.querySelector('#cover-image')
const albumName = document.querySelector('#album-title')
const albums = document.querySelector('.albums')
const searchBar = document.querySelector('#search')
const playBtn = document.querySelector('#play')
const audio = document.querySelector('#audio')
let aside = document.querySelector('aside')

let seekInterval

document.querySelectorAll('.harmburger-toggle').forEach(el => {
  el.addEventListener('click', function () {
    nav.classList.toggle('active')
  })
})
const lazyLoader = new IntersectionObserver(
  (entries, lazyLoader) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return
      console.log('working')
      entry.target.addEventListener('load', function () {
        this.style.width = '100%'
        this.style.filter = 'unset'
      })
      entry.target.src = entry.target.dataset.src
      document.body.style.background = `linear-gradient(180deg, rgba(29, 33, 35, 0.8) 0%, #1d2123 61.48%),
    url(${entry.target.dataset.src})`
      lazyLoader.unobserve(entry.target)
    })
  },
  {
    threshold: 0.6,
  }
)

navItems.forEach((item, idx) => {
  item.addEventListener('click', function () {
    if (idx === 0) window.location = 'index.html'
    if (idx === 1) window.location = 'album.html'
  })
})

const options = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': '2d63567ec9msh25bcd1a15aa4690p17b84djsnb2a05dff6a06',
    'X-RapidAPI-Host': 'spotify23.p.rapidapi.com',
  },
}
searchBar.addEventListener('keydown', async function (e) {
  if (e.key !== 'Enter' || this.value === '') return
  let res = await fetch(
    `https://spotify23.p.rapidapi.com/search/?q=${this.value.replace(
      ' ',
      '%20'
    )}&type=multi&offset=0&limit=10&numberOfTopResults=5`,
    options
  )
  let {
    albums: {
      items: [
        {
          data: { uri },
        },
      ],
    },
  } = await res.json()
  let id = uri.match(/:[0-9a-zA-Z]+$/g)[0].slice(1)

  let albumRes = await fetch(
    `https://spotify23.p.rapidapi.com/albums/?ids=${id}`,
    options
  )
  let {
    albums: [
      {
        images: [{ url }, , { url: url1 }],
        name,
        tracks: { items },
      },
    ],
  } = await albumRes.json()
  coverImage.src = url1
  coverImage.dataset.src = url
  coverImage.style.filter = 'blur(5px)'
  coverImage.style.borderRadius = '35.1703px'
  lazyLoader.observe(coverImage)
  albumName.textContent = name

  albums.innerHTML = ''
  items.forEach(
    ({ artists: [{ name: name1 }], duration_ms, name, preview_url }, idx) => {
      const time = duration_ms / 60000
      const minutes = time.toFixed(0)
      let seconds = Math.round((time % 1) * 60)
      seconds < 10 ? (seconds = `0${seconds}`) : null
      albums.innerHTML += `<div class="music" data-audio='${preview_url}'>
                            <img src="https://source.unsplash.com/random/640x640/?music%20cover%20${idx}" alt="image" style="border-radius: 8.53125px"/>
                            <img src="./icons/love-stroke-icon.svg" alt="like" />
                            <p class="name">${name}</p>
                            <p class="title">${name1}</p>
                            <p class="duration">${minutes}:${seconds}</p>
                            <img src="./icons/more-vertical.svg" alt="more" />
                          </div>`
    }
  )
})
function chooseSong(song) {
  if (audio.src === song.dataset.audio) return
  pause.call(playBtn)
  ranges[1].parentElement.style.setProperty('--progress', `0%`)
  ranges[1].value = 0
  ranges[0].parentElement.style.setProperty(
    '--progress',
    `${audio.volume * 100}%`
  )
  ranges[0].value = audio.volume * 100
  let asideChildren = aside.children
  let songChildren = song.children
  asideChildren[0].src = songChildren[0].src
  asideChildren[1].firstElementChild.textContent =
    songChildren[2].textContent.length > 15
      ? songChildren[2].textContent.slice(0, 16).padEnd(18, '...')
      : songChildren[2].textContent
  asideChildren[1].firstElementChild.nextElementSibling.textContent =
    songChildren[3].textContent
  audio.src = song.dataset.audio
}
document.body.addEventListener('click', function (e) {
  if (!e.target.closest('.music')) return
  chooseSong(e.target.closest('.music'))
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
ranges.forEach((el, idx) => {
  el.addEventListener('input', function () {
    el.parentElement.style.setProperty('--progress', `${el.value}%`)
    if (idx === 0) {
      audio.volume = el.value / 100
      return
    }
    if (audio.duration) audio.currentTime = (el.value / 100) * audio.duration
  })
})
