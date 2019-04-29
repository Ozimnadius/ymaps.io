ymaps.ready(init);

var geoObjects = [],
    clusterer;


function init() {
    var map = new ymaps.Map('map', {
        center: [55.75399400, 37.62209300],
        zoom: 7,
        controls: ['zoomControl'],
        behaviors: ['drag', 'dblClickZoom']
    });


    $.getJSON('data.json', function (data) {
        data.features.forEach(function (item, i, arr) {
            var geometry = item.geometry,
                properties = item.properties;

            geoObjects[i] = new ymaps.Placemark(
                geometry.coordinates,
                {
                    hintContent: properties.hintContent,
                    balloonContentHeader: false,
                    balloonContentBody: properties.balloonContentBody
                },
                {
                    preset: properties.preset
                }
            );
        });

        clusterer = new ymaps.Clusterer();

        map.geoObjects.add(clusterer);
        clusterer.add(geoObjects);
    });

}

$('.map__filter-submit').on('click', function (e) {
    e.preventDefault();

    var data = {
        action: 'filter'
    };


    $.ajax({
        dataType: "json",
        type: "POST",
        url: 'php/ajax.php',
        data: data,
        success: function (result) {
            if (result.status) {

                clusterer.removeAll();
                geoObjects = [];

                result.data.forEach(function (item, i, arr) {
                    var geometry = item.geometry,
                        properties = item.properties;

                    geoObjects[i] = new ymaps.Placemark(
                        geometry.coordinates,
                        {
                            hintContent: properties.hintContent,
                            balloonContentHeader: false,
                            balloonContentBody: properties.balloonContentBody
                        },
                        {
                            preset: properties.preset
                        }
                    );
                });

                clusterer.add(geoObjects);

            } else {
                alert('Что-то пошло не так, попробуйте еще раз!!!');
            }
        },
        error: function (result) {
            alert('Что-то пошло не так, попробуйте еще раз!!!');
        }
    });
});