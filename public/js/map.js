let  map;
let marker;
let infoWindow;
const markers = [
    {lat:-12.0925502,lng: -77.020291,quantity:10,color:'yellow'},
    {lat:-12.0972407 ,lng: -77.0224126,quantity:40,color:'red'},
    {lat:-12.092513 ,lng: -77.024200,quantity:60,color:'green'},
];
function iniciarMap(){
        var coord = {lat:-12.093913 ,lng: -77.021239};
        map = new google.maps.Map(document.getElementById('map'),{
            zoom: 10,
            center: coord
        });
        marker = new google.maps.Marker({
            position: coord,
            map: map,
        });
        const searchMap = document.getElementById('search-map');
        const autocomplete = new google.maps.places.Autocomplete(searchMap);
        autocomplete.addListener("place_changed",()=>{
            const place = autocomplete.getPlace();
            const {geometry:{viewport,location}} = place;
            map.setCenter(location);
            map.setZoom(16);
            addInfoMap(location);
        })
}
var code_postal;
async function searchPostalCode(coord){
    geocoder = new google.maps.Geocoder();
    
    let data ={
        address:'Dirección no encontrada.',
    }
    const {results} =await geocoder.geocode({'latLng': coord}, ()=>{});
    if (results[0]) {
        data.address =results[0].formatted_address;
    }
    return data;
}
setCurrentPositionMap();
function setCurrentPositionMap(){
    let loader = document.getElementById("loader-custom");
        loader.classList.remove("d-none");
        if ("geolocation" in navigator){
        navigator.geolocation.getCurrentPosition(function(position){ 
            var currentLatitude = position.coords.latitude;
            var currentLongitude = position.coords.longitude;
            var currentLocation = { lat: currentLatitude, lng: currentLongitude };
            markers.forEach(marker => {
                let location_marker = {
                    lat:marker.lat,
                    lng:marker.lng
                };
                const marker_google =new google.maps.Marker({
                    position: location_marker,
                    icon:`../images/marker-${marker.color}.svg`,
                    map: map,
                })
                
                let fn = infoFn(location_marker,marker);
                google.maps.event.addListener(marker_google, 'click', fn);
            });

            map.setCenter(currentLocation);
            map.setZoom(16);
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