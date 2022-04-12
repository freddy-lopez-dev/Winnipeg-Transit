function getStreets(userSearch) {
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

function generateStopsHTML(stops, streetNameEl) {
  const streetName = document.querySelector('#street-name')
  const stopTable = document.querySelector('tbody')
  streetName.textContent = `Displaying Result for ${streetNameEl}`

  stops.forEach(stop => {
    stopTable.insertAdjacentHTML(
      'beforebegin',
      `
      <tr>
        <td>${stop.name}</td>
        <td>${stop[`cross-street`].name}</td>
        <td>${stop.direction}</td>
        <td>650</td>
        <td>09:30 AM</td>
      </tr>
      `
    )
  })
}

function getStops(stopID) {
  return fetch(`https://api.winnipegtransit.com/v3/stops.json?street=${stopID}&usage=long&api-key=tkJgIR5_6mI5h3wthGp8`)
    .then((result) => result.json())
    .then((data) => data.stops)
}

function searchHandler() {
  const userSearch = document.querySelector('#search-panel').value
  console.log(userSearch);
  getStreets(userSearch)
    .then((streets) => generateStreetsHTML(streets))
}

function clickHandler(e) {
  const streetId = e.target.dataset.streetKey;
  const streetNameEl = e.target.textContent
  getStops(streetId)
  .then((stops) => generateStopsHTML(stops, streetNameEl))
}

document
  .querySelector('form')
  .addEventListener('submit', searchHandler);

document
  .querySelector('.streets')
  .addEventListener('click', clickHandler);

//The scheduled arrival time of the next 2 buses for each route at this stop.
// The route number(bus #) for each of these buses.
// The name of the street (this is displayed ABOVE the table)