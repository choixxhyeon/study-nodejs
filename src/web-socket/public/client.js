// @ts-check
;(() => {
  const socket = new WebSocket(`ws://${window.location.host}/ws`)
  socket.addEventListener('open', () => {
    socket.send('Hello, Server!')
  })

  socket.addEventListener('message', (e) => {
    alert(e.data)
  })
})()
