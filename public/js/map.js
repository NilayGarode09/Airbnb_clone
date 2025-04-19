
    mapboxgl.accessToken = mapToken;
      const map = new mapboxgl.Map({
          container: 'map', // container ID
          center: coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
          zoom: 10 // starting zoom
      });
      
    //   console.log(coordinates);

      const marker1 = new mapboxgl.Marker({color :"red"})
      .setLngLat(coordinates)
      .setPopup( new mapboxgl.Popup({offset:10}).setHTML("<p>Exact location will be provided after login</p>"))
      .addTo(map);

    //   let cordinates =<%-JSON.stringify(listing.geometry.coordinates)%>;
