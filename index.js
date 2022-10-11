let nav = document.querySelector('nav')
let ranges = document.querySelectorAll('input[type=range]')
let audio = document.querySelector('audio')
let playBtn = document.querySelector('#play')

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

const options = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': '68ca7f80e9mshdaca8240d43ab1ap178984jsn99d2a212d1c9',
    'X-RapidAPI-Host': 'spotify23.p.rapidapi.com',
  },
}
let container = document.querySelector('.new-releases__container')
container.innerHTML = ''

async function getMusicPlaylist() {
  let res = await fetch(
    'https://spotify23.p.rapidapi.com/playlist_tracks/?id=37i9dQZF1DX4Wsb4d7NKfP&offset=0&limit=100',
    options
  )
  let { items } = await res.json()
  items.forEach(({ track }) => {
    let {
      album: {
        images: [{ url }],
        name: artist,
      },
      name,
      preview_url,
    } = track
    // console.log(track)
    container.innerHTML += `<div class="new-release" data-audio="${preview_url}">
                              <img src="${url}" alt="" style="border-radius: 25px"/>
                              <p>${name}</p>
                              <p class="sub-text">${artist}</p>
                            </div>`
  })
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
})

audio.addEventListener('play', function () {
  let duration = audio.duration
  const myInt = setInterval(() => {
    let progress = (audio.currentTime / duration) * 100
    ranges[1].parentElement.style.setProperty('--progress', `${progress}%`)
    ranges[1].value = progress
  }, 1000)
})
