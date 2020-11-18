function initMap() {
  google.maps.Map.prototype.setCenterWithOffset= function(latlng, offsetX, offsetY) {
    var map = this;
    var ov = new google.maps.OverlayView();
    ov.onAdd = function() {
      var proj = this.getProjection();
      var aPoint = proj.fromLatLngToContainerPixel(latlng);
      aPoint.x = aPoint.x+offsetX;
      aPoint.y = aPoint.y+offsetY;
      map.setCenter(proj.fromContainerPixelToLatLng(aPoint));
    }; 
    ov.draw = function() {}; 
    ov.setMap(this); 
  };

  $("*[data-map]").each(function(i){
    var data = JSON.parse($(this).attr("data-map"));
    $(this).attr("data-map-index", i+"");

    var point = { lat: data.point[0], lng: data.point[1] };

    var map = new google.maps.Map($(this)[0], {
      center: point,
      zoom: data.zoom,
      disableDefaultUI: true,
      styles: [{"featureType":"water","elementType":"geometry","stylers":[{"color":"#e9e9e9"},{"lightness":17}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":20}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ffffff"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#ffffff"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":16}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":21}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#dedede"},{"lightness":21}]},{"elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#ffffff"},{"lightness":16}]},{"elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#333333"},{"lightness":40}]},{"elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#f2f2f2"},{"lightness":19}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#fefefe"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#fefefe"},{"lightness":17},{"weight":1.2}]}]
    });

    map.setCenterWithOffset(new google.maps.LatLng(data.point[0], data.point[1]), 0, -120);

    if (data.route != undefined) {
      var line = [];
      for (var j=0; j < data.route.length; j++) {
        line.push({lat: data.route[j][0], lng: data.route[j][1]});
      }

      var arrow = {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 6,
        strokeColor: "#59C13F",
      };

      const path = new google.maps.Polyline({
        path: line,
        geodesic: true,
        strokeColor: "#59C13F",
        strokeOpacity: 1.0,
        strokeWeight: 8,
        icons: [
          {
            icon: arrow,
            offset: "100%",
          },
        ]
      });
      path.setMap(map);

      let speed = 1;
      if (data.speed != undefined) { speed = data.speed; }

      let count = 0;
      window.setInterval(function(){
        count = (count + 1) % (400/speed);
        const icons = path.get("icons");
        icons[0].offset = count / (4/speed) + "%";
        path.set("icons", icons);
      }, 20);

    }

    var marker = new google.maps.Marker({
      position: point,
      icon: "includes/img/icons/pin.svg",
      map: map
    });

    class Popup extends google.maps.OverlayView {
      constructor(position, c) {
        super();
        this.position = position;
        this.content = document.createElement("div");
        this.content.innerHTML = c;
        this.content.classList.add("popup-bubble");
        const bubbleAnchor = document.createElement("div");
        bubbleAnchor.classList.add("popup-bubble-anchor");
        bubbleAnchor.appendChild(this.content);
        this.containerDiv = document.createElement("div");
        this.containerDiv.classList.add("popup-container");
        this.containerDiv.appendChild(bubbleAnchor);
        Popup.preventMapHitsAndGesturesFrom(this.containerDiv);
        this.opened = false;
        this.toggle();
      }
      toggle() {
        if (this.opened) {
          this.content.classList.remove("active");
        } else {
          this.content.classList.add("active");
        }
        this.opened = !this.opened;
      }
      onAdd() {
        this.getPanes().floatPane.appendChild(this.containerDiv);
      }
      onRemove() {
        if (this.containerDiv.parentElement) {
          this.containerDiv.parentElement.removeChild(this.containerDiv);
        }
      }
      draw() {
        const divPosition = this.getProjection().fromLatLngToDivPixel(
          this.position
        );
        const display =
          Math.abs(divPosition.x) < 4000 && Math.abs(divPosition.y) < 4000
            ? "block"
            : "none";

        if (display === "block") {
          this.containerDiv.style.left = divPosition.x + "px";
          this.containerDiv.style.top = divPosition.y + "px";
        }

        if (this.containerDiv.style.display !== display) {
          this.containerDiv.style.display = display;
        }
      }
    }

    let popup = new Popup(
      new google.maps.LatLng(data.point[0], data.point[1]),
      data.content
    );

    marker.addListener("click", function(){
      popup.toggle();
    });

    popup.setMap(map);
  });
}