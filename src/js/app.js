function searchHandler() {
  const userSearch = document.querySelector('#search-panel').value
  console.log(userSearch);
  getStreets(userSearch)
  .then((streets) => generateStreetsHTML(streets))
}

document.querySelector('form').addEventListener('submit', searchHandler);

function getStreets (userSearch) {
  return fetch(`https://api.winnipegtransit.com/v3/streets.json?name=${userSearch}&usage=long&api-key=tkJgIR5_6mI5h3wthGp8`)
  .then((result) => result.json())
  .then((data) => data.streets)
}

function generateStreetsHTML(streets) {
  const streetsContainer = document.querySelector('.streets')
  streetsContainer.textContent = '';
  streets.forEach(street => {
    streetsContainer.insertAdjacentHTML(
      'beforeend',
      `
      <a href="#" data-street-key="${street.key}">${street.name}</a>
      `
    )
  })
}