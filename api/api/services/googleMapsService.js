const axios = require('axios');



const googleMapsURL = 'https://maps.googleapis.com/maps/api/geocode/json';

class GoogleMaps {
    async getCoordinates(zipCode) {
        let coordinates = [];
        await axios.get(googleMapsURL, {
            params: {
                address: zipCode,
                key: `${process.env.MAPS_API_KEY}`,
            }
        }).then(response => {
            const data = response.data;
            coordinates = [
                data.results[0].geometry.location.lng,
                data.results[0].geometry.location.lat,
            ]
        }).catch(err => {
            throw new Error(err)
        });
        return coordinates;
    }
}

module.exports = GoogleMaps;