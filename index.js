document.querySelectorAll('.harmburger-toggle').forEach(el => {
  el.addEventListener('click', function () {
    document.querySelector('nav').classList.toggle('active')
  })
})
