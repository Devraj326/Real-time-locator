const socket = io();

// console.log("hey");

if(navigator.geolocation){
    navigator.geolocation.watchPosition((position) => {
        const {latitude, longitude} = position.coords;
        socket.emit('send-location', {latitude, longitude});
}, (error) => {
    console.log(error);

},
{
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
}
);
}

const map = L.map("map").setView([0,0],16);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

const markers = {};

socket.on("receive-location", (data) => {
    const {id, latitude, longitude} = data;
    map.setView([latitude, longitude]);  // add here the .16 for precise location
    if(markers[id]){
        markers[id].setLatLng([latitude, longitude]);
    }
    else{
        markers[id] = L.marker([latitude, longitude]).addTo(map);
    }
    })


socket.on("user-disconnected",(id) =>{
    if(markers[id]){
        map.removeLayer(markers[id]);
        delete markers[id];
    }
})