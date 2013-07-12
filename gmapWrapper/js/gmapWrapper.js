var gmap,
    maps;

gmap = google.maps;

maps = {
    map: {},
    init: function(id,zoom,lat,lng){

            var mapOptions = {
                zoom: zoom,
                center: new gmap.LatLng(lat, lng),
                mapTypeId: gmap.MapTypeId.ROADMAP
            },
            mapID = document.getElementById(id);

            if (mapID)
                maps.map = new gmap.Map(mapID, mapOptions);
    },
    markers:{
        collection:{},
        add: function(config) {

            var point,
                options,
                sizeIco,
                marker,
                sizeShadow,
                pointStart,
                pointAnchor,
                icon,
                shadow,
                id;

            // icon
            if(config.icon && config.shadow) {
                sizeIco = new gmap.Size(config.icon.size.width, config.icon.size.height);
                sizeShadow = new gmap.Size(config.shadow.size.width, config.shadow.size.height);
                pointStart = new gmap.Point(0,0);
                pointAnchor = new gmap.Point(config.icon.size.width/2, config.icon.size.height/2);

                icon = new gmap.MarkerImage(config.icon.url, sizeIco, pointStart, pointAnchor);
                shadow = new gmap.MarkerImage(config.shadow.url, sizeShadow, pointStart, pointAnchor);
            }
            
                
            // point 
            if(config.position) {
                id = 'mr' + config.id.toString();

                point = new gmap.LatLng(config.position.lat, config.position.lng);
                
                options = {
                    id: id,
                    position: point,
                    map: maps.map,
                    title: config.title, 
                    visible: config.visible,
                    clickable: config.clickable,
                    draggable: config.draggable,
                    icon: icon,
                    shadow: shadow
                };

                marker = maps.markers.collection[id] = new gmap.Marker(options);

                //tooltip 
                if(config.tooltip) {

                    config.events ? events = config.events : events = false;
                    maps.tooltip.add(marker, config.tooltip.content, config.tooltip.showOnLoad,events);
                }
            
            }

        },
        remove: function(id) {

            maps.markers.collection[id].setMap(null);
        
        },
        removeAll: function() {

            var key,
                markers = maps.markers.collection,
                i = Object.keys(markers).length;

            for (key in markers)
                maps.markers.remove(markers[key].id);

            maps.markers.collection = {};

        }
    },
    tooltip:{
        visibleCollection: [],
        add: function(marker,content,showOnLoad,events) {

            var tooltipEvents = maps.tooltip,
                event = gmap.event;

            marker.tooltip = new gmap.InfoWindow({
                visible: false,
                content: content
            });

            if(events.click) {
                event.addListener(marker, 'click', events.click );
            } else {
                event.addListener(marker, 'click', function() {
                    marker.tooltip.visible ? tooltipEvents.hide(marker.id) : tooltipEvents.show(marker.id);
                });
            }

            if(events.closeClick) {
                event.addListener(marker.tooltip,'closeclick', events.closeClick);
            } else {
                event.addListener(marker.tooltip,'closeclick',function(){
                    tooltipEvents.hide(marker.id);
                });
            }

            if (showOnLoad)
                tooltipEvents.show(marker.id);

        },
        show: function(id) {

            var marker = maps.markers.collection[id],
                tooltip = marker.tooltip;

            tooltip.open(maps.map, marker);
            tooltip.visible = !tooltip.visible;

            maps.tooltip.visibleCollection.push(marker.id);
        },
        hide: function(id) {

            var tooltip = maps.markers.collection[id].tooltip,
                col = maps.tooltip.visibleCollection;

            tooltip.close();
            tooltip.visible = !tooltip.visible;

            col.splice(col.indexOf(id), 1);
        },
        hideAll: function() {

            var visibleTooltips = maps.tooltip.visibleCollection,
                i = visibleTooltips.length;

            while(i--)
                maps.tooltip.hide(visibleTooltips[i]);
        }
    }

};

