frappe.ui.form.on("Locate Address On Map", "onload", function(frm, dt, dn) {
  //  home address map div
  $( "#map" ).remove();
  $(cur_frm.get_field("address").wrapper).append('<div id="map" style="width:425px; height: 425px;"></div>');
            var map, vectors, controls;
            var Lon             = 78 ;
            var Lat             = 21;
            var Zoom            = 3;
            if (frm.doc.lat){
                Lat=frm.doc.lat;
                Lon=frm.doc.lon;
                Zoom=7;
              }               
            var EPSG4326        = new OpenLayers.Projection( "EPSG:4326" );
            var EPSG900913      = new OpenLayers.Projection("EPSG:900913");
            var LL              = new OpenLayers.LonLat( Lon, Lat );
            var XY              = LL.clone().transform( EPSG4326, EPSG900913 );
            map = new OpenLayers.Map('map',{ projection: EPSG900913});
            //Open Street Maps layer
            map.addLayer(new OpenLayers.Layer.OSM());
            map.setCenter(XY, Zoom);
            var deftColor     = "#00FF00";
            var deftIcon      = "files/images.png";
            var featureHeight = 34;
            var featureWidth  = 20;
            var featureStyle  = {
                fillColor:      deftColor,
                strokeColor:    deftColor,
                pointRadius:    1,
                externalGraphic:deftIcon,
                graphicWidth:   featureWidth,
                graphicHeight:  featureHeight,
                graphicXOffset: -featureWidth/2,
                graphicYOffset: -featureHeight        
            };
            var vectorL = new OpenLayers.Layer.Vector(  "Vector Layer", {
                                                        styleMap:   new OpenLayers.StyleMap(  featureStyle  )
            });
            map.addLayer( vectorL );
            
            var dragVectorC = new OpenLayers.Control.DragFeature(   vectorL, { 
                                                                    onComplete: function(feature, pixel){
                                                                      var point = feature.geometry.components[0];
                                                                      var llpoint = point.clone()                                                            
                                                                      llpoint.transform(  new OpenLayers.Projection(EPSG900913),new OpenLayers.Projection(EPSG4326));
            frm.doc.lat=llpoint.y;
            frm.doc.lon=llpoint.x;
            refresh_field('lat');
            refresh_field('lon');
            }});
            map.addControl( dragVectorC );
            dragVectorC.activate();
            var point       = new OpenLayers.Geometry.Point( XY.lon, XY.lat );
            var featureOb   = new OpenLayers.Feature.Vector( new OpenLayers.Geometry.Collection([point]) );
            vectorL.addFeatures( [featureOb] );  
});

frappe.ui.form.on("Locate Address On Map", "address", function(frm, dt, dn) {
  // trigger on address field for settings lat lon from postal address
      frappe.call({
        method:"map.map.doctype.locate_your_address_on_map.locate_your_address_on_map.get_latlon",
        args:{"args":""},
        callback: function(r) {
          if (r.message){
            alert("hi");
            /*frm.doc.region=r.message.region
            frm.doc.zone=r.message.zone
            refresh_field('region');              
            refresh_field('zone');  */          
          }
        }
      });
});

