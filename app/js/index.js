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
 const createMarker = (latlng, name, address, storeNumber) => {
  let html = ``;
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

 const getStores = () => {
    fetch('http://localhost:3000/api/stores/')
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      searchLocationsNear(data);
    });

 }

 function searchLocationsNear(stores) {
   let bounds = new google.maps.LatLngBounds();
    stores.forEach((store, index) => {
      let latlng = new google.maps.LatLng(
        store.location.coordinates[1],
        store.location.coordinates[0]);
      let name = store.storeName;
      let address = store.addressLines[0];
      bounds.extend(latlng);
      createMarker(latlng, name, address, index+1);
    });
    map.fitBounds(bounds);
 }

