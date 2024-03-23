document.getElementById('promptForm').addEventListener('submit', async function (e) {
  e.preventDefault()

  const loadingIndicator = document.getElementById('loading')
  const submitButton = this.querySelector('button[type="submit"]')
  loadingIndicator.style.display = 'block'
  submitButton.disabled = true

  const emailInput = document.getElementById('promptInput').value

  try {
    const response = await fetch('api/fixEmail', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emailInput })
    })
    const data = await response.json()

    const responseDiv = document.getElementById('response')
    const diffDiv = document.getElementById('diff')
    responseDiv.innerHTML = data.parsed
    diffDiv.innerHTML = data.diff
  } catch (error) {
    console.error('Error:', error)
  } finally {
    loadingIndicator.style.display = 'none'
    submitButton.disabled = false
  }
})
