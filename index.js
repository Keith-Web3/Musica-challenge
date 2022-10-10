let nav = document.querySelector('nav')

document.querySelectorAll('.harmburger-toggle').forEach(el => {
  el.addEventListener('click', function () {
    nav.classList.toggle('active')
  })
})

document.querySelectorAll('input[type=range]').forEach(el => {
  el.addEventListener('input', function () {
    el.parentElement.style.setProperty('--progress', `${el.value}%`)
  })
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
