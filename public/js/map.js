let  map;
let marker;
let infoWindow;
const markers = [
    {lat:-12.0925634,lng: -77.0203588,quantity:10,color:'yellow'},
    {lat:-12.0972407 ,lng: -77.0224126,quantity:40,color:'red'},
    {lat:-12.092057 ,lng: -77.018868,quantity:60,color:'green'},
];
function iniciarMap(){
        var coord = {lat:-12.0529046 ,lng: -77.0253457};
        map = new google.maps.Map(document.getElementById('map'),{
            zoom: 10,
            center: coord
        });
        marker = new google.maps.Marker({
            position: coord,
            map: map,
        });
        // icon: './img/bbva.png',
        const searchMap = document.getElementById('search-map');
        const autocomplete = new google.maps.places.Autocomplete(searchMap);
        // autocomplete.bindTo('bounds',map);
        autocomplete.addListener("place_changed",()=>{
            const place = autocomplete.getPlace();
            const {geometry:{viewport,location}} = place;
            map.setCenter(location);
            map.setZoom(16);
            addInfoMap(location);
        })
        //Buscar código postal
}
var code_postal;
async function searchPostalCode(coord){
    geocoder = new google.maps.Geocoder();
    
    let data ={
        // country:'País no encontrada',
        // city:'Ciudad no encontrada',
        address:'Dirección no encontrada.',
        // postal_code:'Código Postal no encontrada'
    }
    const {results} =await geocoder.geocode({'latLng': coord}, ()=>{});
    if (results[0]) {
        data.address =results[0].formatted_address;
        // for (j = 0; j < results[0].address_components.length; j++) {
        //     if (results[0].address_components[j].types[0] == 'postal_code'){
        //         data.postal_code = results[0].address_components[j].short_name;
        //     }
        //     if (results[0].address_components[j].types[0] == "country") {
        //         data.country = results[0].address_components[j].long_name;
        //     }
        //     if (results[0].address_components[j].types[0] == "locality") {
        //         data.city = results[0].address_components[j].long_name;
        //     }
        // }
    }
    return data;
}
setCurrentPositionMap();
function setCurrentPositionMap(){
    // e.preventDefault();
    // searchCurrentLocation.disabled = true;
    let loader = document.getElementById("loader-custom");
        loader.classList.remove("d-none");
        if ("geolocation" in navigator){
        navigator.geolocation.getCurrentPosition(function(position){ 
            var currentLatitude = position.coords.latitude;
            var currentLongitude = position.coords.longitude;
            var currentLocation = { lat: currentLatitude, lng: currentLongitude };
            // marker.setPosition(currentLocation);
            // marker = new google.maps.Marker({
            //     position: currentLocation,
            //     map: map,
            // });
            markers.forEach(marker => {
                let location_marker = {
                    lat:marker.lat,
                    lng:marker.lng
                };
                const marker_google =new google.maps.Marker({
                    position: location_marker,
                    icon:`./img/marker-${marker.color}.svg`,
                    map: map,
                })
                
                let fn = infoFn(location_marker,marker);
                google.maps.event.addListener(marker_google, 'click', fn);
            });
            // scaledSize: new google.maps.Size(50, 50),
            // icon:'./img/location.png',
            // icon: './img/bbva.png',

            map.setCenter(currentLocation);
            map.setZoom(16);
            // addInfoMap(currentLocation);
        });
        loader.classList.add("d-none");
    }
}
let infoFn = function (currentLocation,marker) {
    return async function (e) {
        if(infoWindow){
            infoWindow.close();
        }
        const {address} =await searchPostalCode(currentLocation);
        var content = `<div>Dirección: ${address}</div><br><div>Afluencia: ${marker.quantity} personas</div>`;
        infoWindow = new google.maps.InfoWindow({map: map, content: content});
        infoWindow.setPosition(currentLocation);
    }
};
// async function addInfoMap(currentLocation){
//     //Setear información en el mapa
//     const {address} =await searchPostalCode(currentLocation);
//     var infoWindowHTML = `Dirección: ${address}`;
//     var infoWindow = new google.maps.InfoWindow({map: map, content: infoWindowHTML});
//     infoWindow.setPosition(currentLocation);
//     //Setear información en los inputs
// }