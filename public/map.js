class Map {

  constructor() {
    // default to SF
    this.location = {
      lng: -122.75,
      lat: 36.8,
    };

    this.map = new google.maps.Map(document.querySelector('.map'), {
      zoom: 10,
      center: this.location,
    });

    this.LatLngBounds = this.map.getBounds();
  }

  setBounds(bottomLeft, topRight) {
    let sw = new google.maps.LatLng(bottomLeft);
    let ne = new google.maps.LatLng(topRight);
    this.LatLngBounds = new google.maps.LatLngBounds(sw, ne);
    this.map.fitBounds(this.LatLngBounds);
  }

}