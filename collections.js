const nav = document.querySelector('nav')
const navItems = document.querySelectorAll('nav li')
const container = document.querySelectorAll('.collections-container')
const navContainer = document.querySelector('.nav-container')
let albums = document.querySelectorAll('.album')

document.addEventListener('click', function (e) {
  let album = e.target.closest('.album')?.dataset.id
  console.log(album)
  if (!album) return
  sessionStorage.setItem('currentAlbum', JSON.stringify(album))
  window.location = 'album.html'
})
document.querySelectorAll('.harmburger-toggle').forEach(el => {
  el.addEventListener('click', function () {
    nav.classList.toggle('active')
  })
})
navItems.forEach((item, idx) => {
  item.addEventListener('click', function () {
    if (idx === 0) window.location = 'index.html'
    if (idx === 1) window.location = 'album.html'
    if (idx === 2) window.location = 'collections.html'
  })
})
Array.from(navContainer.children).forEach((item, idx) => {
  item.addEventListener('click', function () {
    ;[...navContainer.children].forEach(item => item.classList.remove('active'))
    ;[...container].forEach(item => item.classList.remove('active'))
    this.classList.add('active')
    container[idx].classList.add('active')
  })
})
let collections = JSON.parse(localStorage.getItem('#16102022AcE'))
let collections1 = JSON.parse(localStorage.getItem('#16102022AdE'))
if (collections != null) {
  Object.entries(collections).forEach(([id, obj]) => {
    container[0].innerHTML += `<div class="album" data-id="${id}">
    <div class="darken"></div>
    <div class="img-container">
      <img
        src="${obj.img}"
        alt="cover-image"
      />
    </div>
    <div class="text-container">
      <h2 title="${obj.name}">${obj.name.split(/[\s,]/g)[0]}...</h2>
      <p class="name">${obj.name1}</p>
      <p class="likes">${obj.likes}m likes</p>
      <img src="./icons/Play.svg" alt="play" />
    </div>
  </div>`
  })
}
if (collections1 !== null) {
  Object.entries(collections1).forEach(([id, obj]) => {
    container[1].innerHTML += `<div class="album" data-name="${id}">
    <div class="darken"></div>
    <div class="img-container">
      <img
        src="${obj.img}"
        alt="cover-image"
      />
    </div>
    <div class="text-container">
      <h2 title="${obj.name}">${obj.name.split(/[\s,]/g)[0]}...</h2>
      <p class="name">${obj.name1}</p>
      <p class="likes">${obj.likes}m likes</p>
      <img src="./icons/Play.svg" alt="play" />
    </div>
  </div>`
  })
}
