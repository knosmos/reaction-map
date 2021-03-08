/* Send Requests to Server */
let server_url = 'https://reactionmap-server.herokuapp.com/?q='

function enterSearch(){
    if (event.keyCode == 13){search();}
}

function search(){
    // retrieve query from webpage
    query = document.getElementById("query").value;
    // display "loading" message
    document.getElementById("messages").innerHTML = "Processing request (this may take up to 30 seconds)";
    // send request to server
    var req = new XMLHttpRequest();
    req.addEventListener("load", handleResponse);
    req.open("GET", server_url+query+"&t="+document.getElementById("check").checked);
    req.send();
}

function handleResponse(){
    let resp = this.responseText;
    let json = JSON.parse(resp);
    // see if there was error message
    if (json["res"] == "true"){
        document.getElementById("messages").innerHTML = "";
        displayMap(json["data"]);
    }
    else{
        document.getElementById("messages").innerHTML = "ERROR: "+JSON.stringify(json["data"]);
    }
}

document.getElementById("search-btn").onclick = search;


/* Handle Leaflet/Plotting Map */
var map = L.map('map').setView([0,0], 2);
L.tileLayer('https://api.tiles.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    zoomDelta: 0.1,
    zoomSnap:0.1,
    attribution: '',
    id: 'mapbox/light-v10'
    }).addTo(map);
let markers = [];
let polyline;

var red = L.icon({
    iconUrl: 'marker-red.png',
    iconSize:     [25, 41], // size of the icon
    iconAnchor:   [15, 41], // point of the icon which will correspond to marker's location
    tooltipAnchor:  [20, -30] // point from which the popup should open relative to the iconAnchor
});
var dot = L.icon({
    iconUrl: 'marker-dot.png',
    iconSize:     [15, 15], // size of the icon
    iconAnchor:   [7,7], // point of the icon which will correspond to marker's location
    tooltipAnchor:  [10, 0] // point from which the popup should open relative to the iconAnchor
});

function displayMap(points){
    if (polyline){
        map.removeLayer(polyline);
    }
    for(var i = 0; i < markers.length; i++){
        map.removeLayer(markers[i]);
    }
    let coords = []
    for (let i=0; i<points.length; i++){
        p = points[i];
        let icon = dot;
        if (i==points.length-1){icon = red;}
        markers.push(L.marker([p["lat"],p["lng"]],{icon:icon}).addTo(map)
            .bindTooltip(`<p>${p["name"]}, <span>${p["countryCode"]}</span></p>`,{permanent:true,direction:"right"})
            .openTooltip());
        coords.push([p["lat"],p["lng"]]);
    }
    polyline = L.polyline(coords, {color: 'rgba(100,150,200,0.5)'}).addTo(map);
}
