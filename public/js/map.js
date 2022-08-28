let map;
let marker;
let infoWindow;
const markers = [
    { lat: -12.092513, lng: -77.024200, quantity: 60, color: 'green' },
    { lat: -12.0925502, lng: -77.020291, quantity: 10, color: 'yellow' },
    { lat: -12.0972407, lng: -77.0224126, quantity: 40, color: 'red' },
];

function iniciarMap() {
    var coord = { lat: -12.093913, lng: -77.021239 };
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        center: coord
    });
    // marker = new google.maps.Marker({
    //     position: coord,
    //     icon:'./images/person-location-2.svg',
    //     map: map,
    // });
    const searchMap = document.getElementById('search-map');
    const autocomplete = new google.maps.places.Autocomplete(searchMap);
    autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        const { geometry: { viewport, location } } = place;
        if(location){
            map.setCenter(location);
            map.setZoom(16);
            // addInfoMap(location);
            new google.maps.Marker({
                position: location,
                icon: './images/person-location-2.svg',
                map: map,
            });
        }
    })
}
var code_postal;
async function searchPostalCode(coord) {
    geocoder = new google.maps.Geocoder();

    let data = {
        address: 'Dirección no encontrada.',
    }
    const { results } = await geocoder.geocode({ 'latLng': coord }, () => { });
    if (results[0]) {
        data.address = results[0].formatted_address;
    }
    return data;
}
setCurrentPositionMap();
function setCurrentPositionMap() {
    let loader = document.getElementById("loader-custom");
    loader.classList.remove("d-none");
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var currentLatitude = position.coords.latitude;
            var currentLongitude = position.coords.longitude;
            var currentLocation = { lat: currentLatitude, lng: currentLongitude };
            marker_current = new google.maps.Marker({
                position: currentLocation,
                icon: './images/person-location-2.svg',
                map: map,
            });
            markers.forEach((marker, index) => {
                let location_marker = {
                    lat: marker.lat,
                    lng: marker.lng
                };
                const marker_google = new google.maps.Marker({
                    position: location_marker,
                    icon: `../images/marker-${marker.color}.svg`,
                    map: map,
                })
                if (index == 0) {
                    setRoute(marker, marker_google, marker_current,location_marker,currentLocation);
                }
                let fn = infoFn(location_marker, marker, marker_google, marker_current,currentLocation);
                google.maps.event.addListener(marker_google, 'click', fn);
            });

            map.setCenter(currentLocation);
            map.setZoom(16);
        });
        loader.classList.add("d-none");
    }
}
let infoFn = function (location_marker, marker, marker_google, marker_current,currentLocation) {
    return async function (e) {
        if (infoWindow) {
            infoWindow.close();
        }
        const { address } = await searchPostalCode(location_marker);
        const  {distance,duration} = await calculateTimeDistance(currentLocation,location_marker);

        var content = `<div>Dirección: ${address}</div><br><div>Afluencia: ${marker.quantity} personas</div><br><div>Distancia: ${distance} (${duration} - en carro)</div>`;
        infoWindow = new google.maps.InfoWindow({ map: map, content: content });
        infoWindow.setPosition(location_marker);
        setRoute(marker, marker_google, marker_current);
        // Calculate distance
        
    }
};
function setRoute(marker, marker_google, marker_current,location_marker,currentLocation) {
    // Calculate route 
    // directionsDisplay = null;
    // directionsService = null;
    let directionsService = new google.maps.DirectionsService();
    let directionsDisplay = new google.maps.DirectionsRenderer();

    directionsDisplay.setDirections({routes: []});
    directionsDisplay.setMap(null);
    const request = {
        travelMode: google.maps.TravelMode.DRIVING
    };
    const position_current = marker_current.getPosition();
    request.origin = position_current;
    if (!request.waypoints) request.waypoints = [];
    request.waypoints.push({
        location: { lat: marker.lat, lng: marker.lng },
        stopover: true,
    });
    const position_destination = marker_google.getPosition();
    request.destination = position_destination;
    directionsDisplay.setMap(map);
    directionsService.route(request, function (result, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(result);
        }
    });
}
async function calculateTimeDistance(currentLocation,location_marker){
    let origin1 = new google.maps.LatLng(
        currentLocation.lat,
        currentLocation.lng
    );
    let destinationB = new google.maps.LatLng(
        location_marker.lat,
        location_marker.lng
    )
    let service = new google.maps.DistanceMatrixService();
    let response = await service.getDistanceMatrix(
    {
        origins: [origin1],
        destinations: [destinationB],
        travelMode: 'DRIVING',
    }, ()=>{});
    let origins = response.originAddresses;
    let distance = '';
    let duration = '';
    for (let i = 0; i < origins.length; i++) {
        let results = response.rows[i].elements;
        for (let j = 0; j < results.length; j++) {
            let element = results[j];
            distance = element.distance.text;
            duration = element.duration.text;
        }
    }
    return {distance:distance,duration:duration};
};