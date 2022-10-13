const nav = document.querySelector('nav')
const ranges = document.querySelectorAll('input[type=range]')
const navItems = document.querySelectorAll('nav li')

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
