function getStreets(userSearch) {
  return fetch(`https://api.winnipegtransit.com/v3/streets.json?name=${userSearch}&usage=long&api-key=tkJgIR5_6mI5h3wthGp8`)
    .then((result) => result.json())
    .then((data) => data.streets)
}

function generateStreetsHTML(streets) {
  const streetsContainer = document.querySelector('.streets')
  streetsContainer.textContent = '';
  if (typeof streets !== 'object') {
    streetsContainer.textContent = streets;
  } else {
    streets.forEach(street => {
      streetsContainer.insertAdjacentHTML(
        'beforeend',
        `
        <a href="#" data-street-key="${street.key}">${street.name}</a>
        `
      )
    })
  }
}

function generateStopsHTML(data, streetNameEl) {
  const { stopName, crossStreet, direction, busNum, time } = data;
  const streetName = document.querySelector('#street-name')
  const stopTable = document.querySelector('tbody');
  streetName.textContent = `Displaying Result for ${streetNameEl}`
  stopTable.insertAdjacentHTML(
    'beforebegin',
    `
    <tr>
      <td>${stopName}</td>
      <td>${crossStreet}</td>
      <td>${direction}</td>
      <td>${busNum}</td>
      <td>${time}</td>
    </tr>
    `
  )
}

function getStops(stopID) {
  return fetch(`https://api.winnipegtransit.com/v3/stops.json?street=${stopID}&usage=long&api-key=tkJgIR5_6mI5h3wthGp8`)
    .then((result) => result.json())
    .then((data) => data.stops)
}

//get stop info and route schedules for a given stop key
function getSchedule(stopKey) {
  const url = `https://api.winnipegtransit.com/v3/stops/${stopKey}/schedule.json?api-key=tkJgIR5_6mI5h3wthGp8&max-results-per-route=2`
  //`${BASE_URL}/stops/${stopkey}
  return fetch(url)
    .then(response => response.json())
    .then(data => {
      return {
        'stop-name': data['stop-schedule'].stop.name,
        'cross-street': data['stop-schedule'].stop['cross-street'].name,
        direction: data['stop-schedule'].stop.direction,
        'route-schedules': data['stop-schedule']['route-schedules']
      };
    });
};

function searchHandler(e) {
  const userSearch = document.querySelector('#search-panel').value
  console.log(userSearch);
  e.preventDefault();
  getStreets(userSearch)
    .then((streets) => generateStreetsHTML(streets))
}

function clickHandler(e) {
  const streetId = e.target.dataset.streetKey;
  const streetNameEl = e.target.textContent;
  getStops(streetId)
    .then((stops) => {
      //loop through each response
      // for each stop:
      // call get schedule with stopkey
      // return stop and schedule data
      // loop through schedule data
      // render the table row for each time
      // generateStopsHTML(stops, streetNameEl)
      stops.forEach((stop) => {
        getSchedule(stop.key)
          .then((schedule) => {
            schedule['route-schedules'].forEach((route) => {
              route['scheduled-stops'].forEach(time => {
                generateStopsHTML({
                  stopName: stop.name,
                  crossStreet: stop['cross-street'].name,
                  direction: stop.direction,
                  busNum: route.route.number,
                  time: formatDate(time.times.departure.scheduled),
                }, streetNameEl)
              })
            })
          })
      })
    })
}

function formatDate(date) {
  const rawDate = new Date(date);
  return rawDate.toLocaleTimeString('ca-EN');
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
//Note
// Check the maps api with geographic data on winnipeg transit