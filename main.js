ymaps.ready(init);

var myPlacemarks = [
        {
            latitude: 55.75399400,
            longitude: 37.623,
            hintContent: '<div class="map__hint">Метка1</div>',
            balloonContent: 'Метка1',
            preset: 'islands#blueIcon',
            img: [
                'img/4356_image_a.jpg',
                'img/4356_image_b.jpg'
            ],
            link: '',
            chars: {
                id: 1811,
                title: 'д. Хлябово, 420м от Дмитровского ш.  (0 м)',
                city: 'г.Москва',
                district: '',
                rout: '',
                count: '1+1',
                location: 'справа',
                region: 'Москва',
                addr: 'д. Хлябово, 420м от Дмитровского ш.',
                illumination: 'Нет',
                sideA: 'в область',
                sideB: 'из области'
            }
        },
        {
            latitude: 55.75399400,
            longitude: 37.63,
            hintContent: '<div class="map__hint">Метка2</div>',
            balloonContent: 'Метка2',
            preset: 'islands#blueBookIcon',
            img: [
                'img/4078_image_a.jpg',
                'img/4078_image_b.jpg'
            ],
            link: '',
            chars: {
                id: 1812,
                title: 'д. Хлябово, 420м от Дмитровского ш.  (0 м)',
                city: 'г.Москва',
                district: '',
                rout: '',
                count: '1+1',
                location: 'справа',
                region: 'Москва',
                addr: 'д. Хлябово, 420м от Дмитровского ш.',
                illumination: 'Нет',
                sideA: 'в область',
                sideB: 'из области'
            }
        },
        {
            latitude: 55.75399400,
            longitude: 37.64,
            hintContent: '<div class="map__hint">Метка3</div>',
            balloonContent: 'Метка33',
            preset: 'islands#blueEntertainmentCenterIcon',
            img: [
                'img/4106_image_a.jpg',
                'img/4106_image_b.jpg'
            ],
            link: '',
            chars: {
                id: 1813,
                title: 'д. Хлябово, 420м от Дмитровского ш.  (0 м)',
                city: 'г.Москва',
                district: '',
                rout: '',
                count: '1+1',
                location: 'справа',
                region: 'Москва',
                addr: 'д. Хлябово, 420м от Дмитровского ш.',
                illumination: 'Нет',
                sideA: 'в область',
                sideB: 'из области'
            }
        },
        {
            latitude: 55.75399400,
            longitude: 37.65,
            hintContent: '<div class="map__hint">Метка0</div>',
            balloonContent: 'Метка0',
            preset: 'islands#blueShoppingIcon',
            img: [
                'img/4356_image_a.jpg',
                'img/4356_image_b.jpg'
            ],
            link: '',
            chars: {
                id: 1814,
                title: 'д. Хлябово, 420м от Дмитровского ш.  (0 м)',
                city: 'г.Москва',
                district: '',
                rout: '',
                count: '1+1',
                location: 'справа',
                region: 'Москва',
                addr: 'д. Хлябово, 420м от Дмитровского ш.',
                illumination: 'Нет',
                sideA: 'в область',
                sideB: 'из области'
            }
        },
        {
            latitude: 55.75399400,
            longitude: 37.72,
            hintContent: '<div class="map__hint">Метка4</div>',
            balloonContent: '<div class="map__hint">Метка4</div>',
            preset: 'islands#redRunIcon',
            img: [
                'img/4078_image_a.jpg',
                'img/4078_image_b.jpg'
            ],
            link: '',
            chars: {
                id: 1815,
                title: 'д. Хлябово, 420м от Дмитровского ш.  (0 м)',
                city: 'г.Москва',
                district: '',
                rout: '',
                count: '1+1',
                location: 'справа',
                region: 'Москва',
                addr: 'д. Хлябово, 420м от Дмитровского ш.',
                illumination: 'Нет',
                sideA: 'в область',
                sideB: 'из области'
            }
        },
        {
            latitude: 55.75399400,
            longitude: 37.627,
            hintContent: '<div class="map__hint">Метка5</div>',
            balloonContent: 'Метка5',
            preset: 'islands#redScienceIcon',
            img: [
                'img/4106_image_a.jpg',
                'img/4106_image_b.jpg'
            ],
            link: '',
            chars: {
                id: 1816,
                title: 'д. Хлябово, 420м от Дмитровского ш.  (0 м)',
                city: 'г.Москва',
                district: '',
                rout: '',
                count: '1+1',
                location: 'справа',
                region: 'Москва',
                addr: 'д. Хлябово, 420м от Дмитровского ш.',
                illumination: 'Нет',
                sideA: 'в область',
                sideB: 'из области'
            }
        },
        {
            latitude: 55.75399400,
            longitude: 37.628,
            hintContent: '<div class="map__hint">Метка6</div>',
            balloonContent: 'Метка6',
            preset: 'islands#blueNightClubIcon',
            img: [
                'img/4106_image_a.jpg',
                'img/4106_image_b.jpg'
            ],
            link: '',
            chars: {
                id: 1817,
                title: 'д. Хлябово, 420м от Дмитровского ш.  (0 м)',
                city: 'г.Москва',
                district: '',
                rout: '',
                count: '1+1',
                location: 'справа',
                region: 'Москва',
                addr: 'д. Хлябово, 420м от Дмитровского ш.',
                illumination: 'Нет',
                sideA: 'в область',
                sideB: 'из области'
            }
        },
        {
            latitude: 55.75399400,
            longitude: 37.629,
            hintContent: '<div class="map__hint">Метка7</div>',
            balloonContent: 'Метка7',
            preset: 'islands#blueStarIcon',
            img: [
                'img/4106_image_a.jpg',
                'img/4106_image_b.jpg'
            ],
            link: '',
            chars: {
                id: 1811,
                title: 'д. Хлябово, 420м от Дмитровского ш.  (0 м)',
                city: 'г.Москва',
                district: '',
                rout: '',
                count: '1+1',
                location: 'справа',
                region: 'Москва',
                addr: 'д. Хлябово, 420м от Дмитровского ш.',
                illumination: 'Нет',
                sideA: 'в область',
                sideB: 'из области'
            }
        },
        {
            latitude: 55.75399400,
            longitude: 37.70,
            hintContent: '<div class="map__hint">Метка8</div>',
            balloonContent: 'Метка8',
            preset: 'islands#blueToiletIcon',
            img: [
                'img/4106_image_a.jpg',
                'img/4106_image_b.jpg'
            ],
            link: '',
            chars: {
                id: 1818,
                title: 'д. Хлябово, 420м от Дмитровского ш.  (0 м)',
                city: 'г.Москва',
                district: '',
                rout: '',
                count: '1+1',
                location: 'справа',
                region: 'Москва',
                addr: 'д. Хлябово, 420м от Дмитровского ш.',
                illumination: 'Нет',
                sideA: 'в область',
                sideB: 'из области'
            }
        },
        {
            latitude: 55.75399400,
            longitude: 37.68,
            hintContent: '<div class="map__hint">Метка9</div>',
            balloonContent: 'Метка9',
            preset: 'islands#blueWaterParkIcon',
            img: [
                'img/4106_image_a.jpg',
                'img/4106_image_b.jpg'
            ],
            link: '',
            chars: {
                id: 1819,
                title: 'д. Хлябово, 420м от Дмитровского ш.  (0 м)',
                city: 'г.Москва',
                district: '',
                rout: '',
                count: '1+1',
                location: 'справа',
                region: 'Москва',
                addr: 'д. Хлябово, 420м от Дмитровского ш.',
                illumination: 'Нет',
                sideA: 'в область',
                sideB: 'из области'
            }
        }
    ],
    geoObjects = [];


function init() {
    var map = new ymaps.Map('map', {
        center: [55.75399400, 37.62209300],
        zoom: 10,
        controls: ['zoomControl'],
        behaviors: ['drag','dblClickZoom']
    });


    myPlacemarks.forEach(function (item, i, arr) {

        geoObjects[i] = new ymaps.Placemark(
            [item.latitude, item.longitude],
            {
                hintContent: item.chars.id + ' - ' + item.chars.addr,
                balloonContentHeader: '<a class="map__link" href="'+item.link+'">' + item.chars.id + ' - ' + item.chars.title + '</a>',
                balloonContentBody:
                    '<div class="map__imgs">' +
                    '<a href="' + item.img[0] + '" data-fancybox="gallery" class="map__img"> Сторона А' +
                    '<img src="' + item.img[0] + '" alt="" class="map__img-img">' +
                    '</a>' +
                    '<a href="'+item.img[1]+'" data-fancybox="gallery" class="map__img"> Сторона Б' +
                    '<img src="'+item.img[1]+'" alt="" class="map__img-img">' +
                    '</a>'+
                    '</div>' +
                    '<table class="map__table">' +
                    '<tr>' +
                    '<td>Город</td><td>'+item.chars.city+'</td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td>Округ</td><td>'+item.chars.district+'</td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td>Район</td><td>'+item.chars.district+'</td>' +
                    '</tr>' +
                    '</tr>' +
                    '<tr>' +
                    '<td>Трасса</td><td>'+item.chars.rout+'</td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td>Количество сторон</td><td>'+item.chars.count+'</td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td>Расположение</td><td>'+item.chars.location+'</td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td>Регион</td><td>'+item.chars.region+'</td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td>Адрес</td><td>'+item.chars.addr+'</td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td>Подсветка</td><td>'+item.chars.illumination+'</td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td>Сторона А</td><td>'+item.chars.sideA+'</td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td>Сторона Б</td><td>'+item.chars.sideB+'</td>' +
                    '</tr>' +
                    '</table>'+
                    '<a href="'+item.link+'" class="map__link2">Подробнее</a>'
            },
            {
                preset: item.preset
            }
        );


    });

    var clusterer = new ymaps.Clusterer();
    map.geoObjects.add(clusterer);
    clusterer.add(geoObjects);

}