 let map;
 let infoWindow;
 const markers = [];
 let losAngeles = { lat: 34.06338, lng: -118.35808 };

 function initMap() {
   map = new google.maps.Map(document.getElementById('map'), {
     center: losAngeles,
     zoom: 12,
   });
   infoWindow = new google.maps.InfoWindow();
   
 }
 
const searchBtn = document.querySelector('.fa-search');
  searchBtn.addEventListener('click', () => {
  getStores();
})

const zipcode = document.querySelector('#zip-code');
zipcode.addEventListener('keyup', (ev) => {
  if (ev.key === "Enter") {
    getStores();
  }
  
})


 const getStores = () => {

   if (!zipcode.value) {
     return;
   }
     
    fetch(`http://localhost:3000/api/stores?zip_code=${zipcode.value}`)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if (markers.length) {
        clearLocations();
      }
      if (data.length) {
        searchLocationsNear(data);
        setStoresList(data);
        setOnClickListener();
      } else {
        noStoresFound();
      }
     
    });

 }

 const searchLocationsNear = (stores) => {
   let bounds = new google.maps.LatLngBounds();
    stores.forEach((store, index) => {
      let latlng = new google.maps.LatLng(
        store.location.coordinates[1],
        store.location.coordinates[0]);
      let name = store.storeName;
      let address = store.addressLines[0];
      let openStatusText = store.openStatusText;
      let phone = store.phoneNumber;
      bounds.extend(latlng);
      createMarker(latlng, name, address, openStatusText, phone, index+1);
    });
    map.fitBounds(bounds);
 }

 const createMarker = (latlng, name, address, openStatusText, phone ,storeNumber) => {
  let html = `
    <div class="store-info-window">
      <div class="store-info-name">
          ${name}
      </div>
      <div class="store-info-open-status">
          ${openStatusText}
      </div>
      <div class="store-info-address">
        <div class="icon">
          <i class="fas fa-location-arrow"></i>
        </div>
        <span>
            ${address}
        </span>
        </div>
      <div class="store-info-phone">
          <div class="icon">
          <i class="fas fa-phone-alt"></i>
          </div>
          <span>
            <a href="tel:${phone}">${phone}</a>
          </span>
      </div>
    </div>
  `;
  const marker = new google.maps.Marker({
        position: latlng,
        label: `${storeNumber}`,
        map,
      });
      markers.push(marker);
      google.maps.event.addListener(marker, 'click', () => {
        infoWindow.setContent(html);
        infoWindow.open(map, marker);
      })
 }

 const setStoresList = (stores) => {
   const storesList = document.querySelector('.stores-list');
   let storesHtml = '';
   stores.forEach((store, index) => {
  const address = [store.addressLines[0], store.addressLines[1]];
  const phone = store.phoneNumber;
  storesHtml += ` <div class="store-container">
  <div class="store-background">
    <div class="store-info-container">
      <div class="store-address">
        <span>${address[0]}</span>
        <span>${address[1]}</span>
      </div>

      <div class="store-phone-number">${phone}</div>
    </div>
    <div class="store-number-container">
      <span class="store-number">${index + 1}</span>
    </div>
  </div>
</div>`
   });
   storesList.innerHTML = storesHtml;
 }

const clearLocations = () => {
  infoWindow.close();
  markers.forEach(marker => marker.setMap(null));
  markers.length = 0;
}


 const setOnClickListener = () => {
   let storeElements = document.querySelectorAll('.store-container');
   storeElements.forEach((el, index) => {
     el.addEventListener('click', () => {
      google.maps.event.trigger(markers[index], 'click');
     })
     
   })
 }

const noStoresFound = () => {
  const html =`
    <div class="no-stores-found">
      No stores found
    </div>
  `
  document.querySelector('.stores-list').innerHTML = html;
}
