 let map;
 let infoWindow;
 let losAngeles = { lat: 34.06338, lng: -118.35808 };

 function initMap() {
   map = new google.maps.Map(document.getElementById('map'), {
     center: losAngeles,
     zoom: 8,
   });
   infoWindow = new google.maps.InfoWindow();
   getStores();
 }
 

 const getStores = () => {
    fetch('http://localhost:3000/api/stores/')
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      searchLocationsNear(data);
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
      
      google.maps.event.addListener(marker, 'click', () => {
        infoWindow.setContent(html);
        infoWindow.open(map, marker);
      })
 }

