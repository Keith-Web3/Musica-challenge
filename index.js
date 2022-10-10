document.querySelectorAll('.harmburger-toggle').forEach(el => {
  el.addEventListener('click', function () {
    document.querySelector('nav').classList.toggle('active')
  })
})

document.querySelectorAll('input[type=range]').forEach(el => {
  el.addEventListener('input', function () {
    el.parentElement.style.setProperty('--progress', `${el.value}%`)
  })
})
