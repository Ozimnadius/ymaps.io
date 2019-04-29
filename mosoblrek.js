if ($('#YMap').length > 0) {
    ymaps.ready(init);
}

function setCookie1(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";";
}

function getCookie1(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

(function () {
    // Convert array to object
    var convArrToObj = function (array) {
        var thisEleObj = new Object();
        if (typeof array == "object") {
            for (var i in array) {
                var thisEle = convArrToObj(array[i]);
                thisEleObj[i] = thisEle;
            }
        } else {
            thisEleObj = array;
        }
        return thisEleObj;
    };
    var oldJSONStringify = JSON.stringify;
    JSON.stringify = function (input) {
        if (oldJSONStringify(input) == '[]')
            return oldJSONStringify(convArrToObj(input));
        else
            return oldJSONStringify(input);
    };
})();

function saveParamsMain(key, val) {
    if ($("input.track").val() == undefined) {
        if (getCookie1('mp') == "")
            mp = new Array();
        else
            mp = JSON.parse(getCookie1('mp'));

        mp[key] = val;

        setCookie1('mp', JSON.stringify(mp), 30);
    }
}

function loadParamsMain() {
    if ($("input.track").val() == undefined) {
        mp = JSON.parse(getCookie1('mp'));

        _filter = $('.map_filters');

        if (mp.poi_select != null) {
            poi_select = _filter.find('.poi');
            poi_select.val(mp.poi_select);
            $.each(mp.poi_select, function (k, v) {
                $('.map_filters .poi').parent().find('ul li[data-val="' + v + '"]').addClass('selected');
            });
            poi_select.change();
        }
        if (mp.track_select != null) {
            track_select = _filter.find('.track');
            track_select.val(mp.track_select);
            $.each(mp.track_select, function (k, v) {
                $('.map_filters .track').parent().find('ul li[data-val="' + v + '"]').addClass('selected');
            });
            track_select.change();
        }
        if (mp.format_select != null) {
            format_select = _filter.find('.format');
            format_select.val(mp.format_select);
            $.each(mp.format_select, function (k, v) {
                $('.map_filters .format').parent().find('ul li[data-val="' + v + '"]').addClass('selected');
            });
            format_select.change();
        }
        if (mp.month_select != null) {
            month_select = _filter.find('.month');
            month_select.val(mp.month_select);
            $.each(mp.month_select, function (k, v) {
                $('.map_filters .month').parent().find('ul li[data-val="' + v + '"]').addClass('selected');
            });
            month_select.change();
        }
        if (mp.cluster_select != null) {
            cluster_select = _filter.find('.cluster');
            cluster_select.val(mp.cluster_select);
            $.each(mp.cluster_select, function (k, v) {
                $('.map_filters .cluster').parent().find('ul li[data-val="' + v + '"]').addClass('selected');
            });
            cluster_select.change();
        }

    }
    return false;
}

function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        if (hash[1] === undefined) continue;
        vars[hash[0]] = hash[1];
    }
    return vars;
}

var $get = getUrlVars();


function init() {
    var no_bound_filter = false;
    var timerID, timerIDFilter;
    var trackLoad = new Array();
    var d = new Date();
    var n = d.getMonth();
    var cookie_expire = new Date(); // day  hours min  sec  msec
    cookie_expire.setTime(d.getTime() + (1 * 24 * 60 * 60 * 1000));
    var monthes = [
        'СЏРЅРІ', 'С„РµРІ', 'РјР°СЂ', 'Р°РїСЂ', 'РјР°Р№', 'РёСЋРЅ',
        'РёСЋР»', 'Р°РІРі', 'СЃРµРЅ', 'РѕРєС‚', 'РЅРѕСЏ', 'РґРµРє'
    ];
    var myMap = new ymaps.Map('YMap', {
        //  center: [55.76, 37.64],
        center: [55.753559, 37.609218],
        zoom: 10,
        controls: [],
        behaviors: ['default', 'scrollZoom']
    }, {
        suppressMapOpenBlock: true,
    });
    myMap.options.set('balloonAutoPanMargin', 60);
    myMap.options.set('minZoom', 7);
    myMap.options.set('maxZoom', 18);
    myMap.controls.add('trafficControl');
    myMap.controls.add('zoomControl', {size: "large"});
    myMap.controls.add('rulerControl');
    myMap.controls.add('fullscreenControl');
    //myMap.behaviors.disable("scrollZoom");
//    myMap.controls.add('searchControl', {
//        floatIndex: -1, strictBounds: true, size: 'small', float: 'right',
//        boundedBy: [[56.466672, 36.313731], [55.010305, 38.983409]]
//    });
    var ape = false; //$.cookie('ape') == 1;
    var pic_path = '/published/publicdata/MOSOBLBASE/attachments/SC/products_pictures/';

    var BalloonContentLayout = ymaps.templateLayoutFactory.createClass(
        '<div class="balloon{% if properties.in_plan %} in-plan{% endif %}" data-id="{{ properties.id }}">' +
        '<div class="btitle">{% if properties.id > 0 %}<a href="/product/{{ properties.id }}/" target="_blank">{{ properties.title }}</a>{% else %}{{ properties.title }}{% endif %}</div>' +
        '<div class="close-button">&times;</div>' +
        '<p class="yandexform-info">РЎС‚РѕСЂРѕРЅР° {{ properties.side }}</p>' +
        //'<p class="yandexform-info">{{ properties.ctype }}</p>' +
        '{% if (properties.type != "") && (properties.type != 7) %}<p class="yandexform-info">{{ properties.ctype }}</p>{% endif %}' +
        '{% if (properties.type != "") && (properties.type == 7) %}<p class="yandexform-info">РЎРєСЂРѕР»Р»РµСЂ {{ properties.ctype }}</p>{% endif %}' +
        '{% if properties.d %}<p class="yandexform-info">{{ properties.d }}</p>{% endif %}' +
        '<div class="yandexform-period">' +
        '<div>' +
        '<p title="{{ properties.st[0] }}" class="avail_{{properties.a[0]}}">' + monthes[n] + '</p>' +
        '<p title="{{ properties.st[1] }}" class="avail_{{properties.a[1]}}">' + monthes[(n + 1) % 12] + '</p>' +
        '<p title="{{ properties.st[2] }}" class="avail_{{properties.a[2]}}">' + monthes[(n + 2) % 12] + '</p>' +
        '{% if properties.pav > 0 %}<p class="action">РЎРєРёРґРєР° {{ properties.pav }}%</p>{% endif %}' +
        '</div>' +
        //'<div class="avail_titles">' +
        //'<span class="avail_title">{{ properties.st[0] }}</span>' +
        //'<span class="avail_title">{{ properties.st[1] }}</span>' +
        //'<span class="avail_title">{{ properties.st[2] }}</span>' +
        //'</div>' +
        '<div class="price">' +
        (ape ? '<div style="display:none" class="price_edit"><input type="text" name="price" /><input type="button" value="OK" class="save_price" /></div>' : '') +
        '<div class="text">{% if properties.price %}{{ properties.price }} СЂСѓР±' + (ape ? '{% else %}РќР°Р¶РјРёС‚Рµ РґР»СЏ СЂРµРґР°РєС‚РёСЂРѕРІР°РЅРёСЏ' : '') + '{% endif %}</div>' +
        '</div>' +
        '</div>' +
        '<div class="info">' +
        '<div class="img">' +
        '{% if properties.id > 0 %}<a href="/product/{{ properties.id }}/" target="_blank">{% endif %}' +
        '<img src="' + pic_path + '{% if properties.id > 1000000000 && properties.id < 2000000000 %}other/{% endif %}{{ properties.i }}" />' +
        '{% if properties.id > 0 %}</a>{% endif %}' +
        '</div>' +
        '<div class="desk">' +
        //'<div class="desk-title">{% if properties.id > 0 %}<a href="/product/{{ properties.id }}/" target="_blank">РџРѕРґСЂРѕР±РЅРѕРµ РѕРїРёСЃР°РЅРёРµ:</a>{% else %}РџРѕРґСЂРѕР±РЅРѕРµ РѕРїРёСЃР°РЅРёРµ:{% endif %}</div>' +
        //'{% if properties.p > 0 %}<p>Р¦РµРЅР°: {{ properties.p }} СЂ.</p>{% endif %}' +
        '{% if properties.inv_id != "" %}<p>РРЅРІРµРЅС‚Р°СЂРЅС‹Р№ в„–: {{ properties.inv_id }}</p>{% endif %}' +
        '{% if (properties.ctype != "") && (properties.type != 7) %}<p>{{ properties.ctype }}</p>{% endif %}' +
        '{% if (properties.ctype != "") && (properties.type == 7) %}<p>РЎРєСЂРѕР»Р»РµСЂ {{ properties.ctype }}</p>{% endif %}' +
        '{% if properties.side != "" %}<p>РЎС‚РѕСЂРѕРЅР°: {{ properties.side }}</p>{% endif %}' +
        '{% if properties.light != "" %}<p>РџРѕРґСЃРІРµС‚РєР°: {{ properties.light }}</p>{% endif %}' +
        //'<p>GPSN: {{ properties.GPSN }}</p>' +
        //'<p>GPSE: {{ properties.GPSE }}</p>' +
        //'{% if (properties.mos_dist != "") && (properties.mos_dist != "-") %}<p>РћС‚ С†РµРЅС‚СЂР° РњРЎРљ(Рј): {{ properties.mos_dist }}</p>{% endif %}' +
        '{% if properties.mrr_dist != "" %}<p>РћС‚ РњРљРђР”(Рј): {{ properties.mrr_dist }}</p>{% endif %}' +
        '</div>' +
        '</div>' +
        '<div class="yandexform-buttons"><a href="/product/{{ properties.id }}/" class="podrobnee-na-karte zakaz_btn" target="_blank" title="РћС‚РєСЂРѕРµС‚СЃСЏ РІ РЅРѕРІРѕР№ РІРєР»Р°РґРєРµ">РџРѕРґСЂРѕР±РЅРµРµ</a>' +
        '<input class="{% if (properties.a[0] == 1) && (properties.a[1] == 1) && (properties.a[2] == 1) %}multi {% endif %}addCollection addCollectionmap withoutbutt" value="Р”РѕР±Р°РІРёС‚СЊ РІ РєРѕСЂР·РёРЅСѓ" type="button" />' +
        '<div class="yandexform-number">' +
        '<a href="/map_inter.php" class="in-plan-text show-mediaplan">&#10004; Р’ РєРѕСЂР·РёРЅРµ</a>' +
        // '{% if window.location.href.indexOf(\'map_inter\') == -1 %}<a href="/map_inter.php" class="in-plan-text show-mediaplan">&#10004; Р’ РєРѕСЂР·РёРЅРµ</a>{% else %}' +
        //   '<a href="javascrip:void(0)" class="in-plan-text show-mediaplan">&#10004; Р’ РєРѕСЂР·РёРЅРµ</a>{% endif %}' +
        '</div>' +
        '</div>' +
        //'<div class="yandexform-buttons"><input class="zakazmap_btn addzakaz" data-url="/product/{{ properties.id }}/" value="Р—Р°РїСЂРѕСЃ С†РµРЅС‹" type="button" /><input class="addCollection addCollectionmap withoutbutt" value="Р’ РјРµРґРёР°РїР»Р°РЅ" type="button" /></div>' +
        '</div>'
    );
    var ItemLayout = ymaps.templateLayoutFactory.createClass(
        '<div class="cluster-left-column">' +
        '{% for geoObject in properties.geoObjects %}' +
        '<div onlick="this.getData().state.set(\'activeObject\', geoObjects[index]);"><a href=# data-placemarkid="{{ geoObject.properties.placemarkId }}" class="list_item">{{ geoObject.properties.clusterCaption|raw }}</a></div>' +
        '{% endfor %}' +
        '</div>'
    );
    var clusterIconsSimple = [{
            href: '/img/clusters/3x6.png',
            size: [55, 55],
            offset: [-27, -53]
        }, {
            href: '/img/clusters/cluster20.png',
            size: [48, 57],
            offset: [-24, -24],
            'iconShape': {
                type: 'Circle',
                coordinates: [0, 0],
                radius: 24
            }
        }, {
            href: '/img/clusters/cluster100.png',
            size: [68, 78],
            offset: [-34, -34],
            'iconShape': {
                type: 'Circle',
                coordinates: [0, 0],
                radius: 34
            }
        }],
        clusterSkidka = [{
            href: '/img/clusters/digital-skidka.png',
            size: [55, 55],
            offset: [-27, -53]
        }, {
            href: '/img/clusters/cluster20.png',
            size: [48, 57],
            offset: [-24, -24],
            'iconShape': {
                type: 'Circle',
                coordinates: [0, 0],
                radius: 24
            }
        }, {
            href: '/img/clusters/cluster100.png',
            size: [68, 78],
            offset: [-34, -34],
            'iconShape': {
                type: 'Circle',
                coordinates: [0, 0],
                radius: 34
            }
        }],
        clusterIconsAction = [{
            href: '/img/clusters/cluster2-sk.png',
            size: [55, 55],
            offset: [-27, -53]
        }, {
            href: '/img/clusters/cluster20-sk.png',
            size: [48, 57],
            offset: [-24, -24],
            'iconShape': {
                type: 'Circle',
                coordinates: [0, 0],
                radius: 24
            }
        }, {
            href: '/img/clusters/cluster100-sk.png',
            size: [56, 66],
            offset: [-31, -31],
            'iconShape': {
                type: 'Circle',
                coordinates: [0, 0],
                radius: 31
            }
        }],
        clusterIconsSuper = [{
            href: '/img/clusters/supersite.png',
            size: [55, 55],
            offset: [-25, -25]
        }, {
            href: '/img/clusters/cluster20.png',
            size: [48, 57],
            offset: [-24, -24],
            'iconShape': {
                type: 'Circle',
                coordinates: [0, 0],
                radius: 24
            }
        }, {
            href: '/img/clusters/cluster100.png',
            size: [68, 78],
            offset: [-31, -31],
            'iconShape': {
                type: 'Circle',
                coordinates: [0, 0],
                radius: 34
            }
        }],
        clusterIconsScroller = [{
            href: '/img/clusters/scroller.png',
            size: [55, 55],
            offset: [-25, -25]
        }, {
            href: '/img/clusters/cluster20.png',
            size: [48, 57],
            offset: [-24, -24],
            'iconShape': {
                type: 'Circle',
                coordinates: [0, 0],
                radius: 24
            }
        }, {
            href: '/img/clusters/cluster100.png',
            size: [68, 78],
            offset: [-31, -31],
            'iconShape': {
                type: 'Circle',
                coordinates: [0, 0],
                radius: 34
            }
        }],
        clusterIconsOsta = [{
            href: '/img/clusters/bus-stop.png',
            size: [55, 55],
            offset: [-25, -25]
        }, {
            href: '/img/clusters/cluster20.png',
            size: [48, 57],
            offset: [-24, -24],
            'iconShape': {
                type: 'Circle',
                coordinates: [0, 0],
                radius: 24
            }
        }, {
            href: '/img/clusters/cluster100.png',
            size: [68, 78],
            offset: [-31, -31],
            'iconShape': {
                type: 'Circle',
                coordinates: [0, 0],
                radius: 34
            }
        }],
        clusterIconsVideo = [{
            href: '/img/clusters/video.png',
            size: [55, 55],
            offset: [-27, -53]
        }, {
            href: '/img/clusters/cluster20-video.png',
            size: [68, 78],
            offset: [-34, -34],
            'iconShape': {
                type: 'Circle',
                coordinates: [0, 0],
                radius: 34
            }
        }, {
            href: '/img/clusters/cluster100-video.png',
            size: [68, 78],
            offset: [-34, -34],
            'iconShape': {
                type: 'Circle',
                coordinates: [0, 0],
                radius: 34
            }
        }];

    var objectManager = new ymaps.ObjectManager({
        clusterize: ($get['not_b'] ? false : true),//true,
        showInAlphabeticalOrder: true,
        gridSize: 64,
        synchAdd: true,
        openBalloonOnClick: false,
        clusterDisableClickZoom: true,
        clusterBalloonContentLayoutWidth: 460,
        clusterBalloonLeftColumnWidth: 60,
        clusterBalloonContentLayoutHeight: 350,
        clusterBalloonItemContentLayout: BalloonContentLayout,
        clusterBalloonCloseButton: false,
        clusterIcons: clusterIconsSimple,
        clusterNumbers: [3, 20],
        minClusterSize: 2,
        //geoObjectBalloonMinHeight: auto,
        geoObjectBalloonContentLayout: BalloonContentLayout,
        geoObjectBalloonCloseButton: false,
        geoObjectIconLayout: 'default#image',
        geoObjectIconImageHref: '/img/clusters/3x6.png',
        geoObjectIconImageSize: [55, 55],
        geoObjectIconImageOffset: [-27, -53]
    });
    objectManager.objects.events.add('add', function (e) {
        var obj = e.get('child');

        if (obj.properties.spec == 1) {
            obj.options = obj.options || {};
            obj.options.iconImageHref = '/img/clusters/digital-skidka.png';
        } else if (obj.properties.type == 2) {
            obj.options = obj.options || {};
            obj.options.iconImageHref = '/img/clusters/video.png';
        } else if (typeof (obj.properties.pav) !== "undefined" && obj.properties.pav > 0) {
            obj.options = obj.options || {};
            obj.options.iconImageHref = '/img/clusters/shield3.png';
        } else if (obj.properties.type == 7) {
            obj.options.iconImageHref = '/img/clusters/scroller.png';
        } else if (obj.properties.type == 6 || obj.properties.type == 8) {
            obj.options.iconImageHref = '/img/clusters/supersite.png';
        } else if (obj.properties.type == 5) {
            obj.options.iconImageHref = '/img/clusters/bus-stop.png';
        }
    });


    objectManager.clusters.events.add('add', function (e) {
        var cluster = e.get('child'),
            objects = cluster.properties.geoObjects,
            is_video = true;
        is_osta = false;
        is_super = false;
        is_scrol = false;
        is_skidka = false;

        for (var i = 0; i < objects.length; i++) {
            var obj = objects[i];
            // if (typeof(obj.properties.pav) !== "undefined" && obj.properties.pav > 0) {
            //
            //     objectManager.clusters.setClusterOptions(cluster.id, {
            //         clusterIcons: clusterIconsAction,
            //         clusterNumbers: [3, 20, 50]
            //     });
            //     cluster.properties.iconContent = "";
            //     is_video = false;
            //     break;
            // }
            if (is_video && obj.properties.type !== 2) {
                is_video = false;
            }
            if (obj.properties.type == 7) {
                is_scrol = true;
            }
            if (obj.properties.type == 5) {
                is_osta = true;
            }
            if (obj.properties.type == 8 || obj.properties.type == 6) {
                is_super = true;
            }
            if (obj.properties.spec == 1) {
                is_skidka = true;
            }
        }

        if (is_scrol) {
            objectManager.clusters.setClusterOptions(cluster.id, {
                clusterIcons: clusterIconsScroller,
                clusterNumbers: [10, 20]
            });
            if (objects.length <= 10) {
                cluster.properties.iconContent = "";
            }
        }

        if (is_super) {
            objectManager.clusters.setClusterOptions(cluster.id, {
                clusterIcons: clusterIconsSuper,
                clusterNumbers: [10, 20]
            });
            if (objects.length <= 10) {
                cluster.properties.iconContent = "";
            }
        }
        if (is_osta) {
            objectManager.clusters.setClusterOptions(cluster.id, {
                clusterIcons: clusterIconsOsta,
                clusterNumbers: [10, 20]
            });
            if (objects.length <= 10) {
                cluster.properties.iconContent = "";
            }
        }
        if (is_video) {
            objectManager.clusters.setClusterOptions(cluster.id, {
                clusterIcons: clusterIconsVideo,
                clusterNumbers: [4, 20, 50]
            });
            if (objects.length <= 4) {
                cluster.properties.iconContent = "";
            }
        }
        if (is_skidka) {
            objectManager.clusters.setClusterOptions(cluster.id, {
                clusterIcons: clusterSkidka,
                clusterNumbers: [4, 20, 50]
            });
            if (objects.length <= 3) {
                cluster.properties.iconContent = "";
            }
        }
        if (!is_scrol && !is_skidka && !is_video && !is_osta && !is_super && !is_scrol) {
            if (objects.length <= 3) {
                cluster.properties.iconContent = "";
            }
        }
    });

    objectManager.clusters.events.add('click', function (e) {

        //console.log('click - clusters');
        var id = e.get('objectId');
        var cluster = objectManager.clusters.getById(id),
            objects = cluster.properties.geoObjects;
        if (objects.length > 1 && objects.length < 5) {
            objectManager.clusters.balloon.open(cluster.id);
            downloadContent(objects, id, true);
            return true;
        }
        var curr_zoom = myMap.getZoom();
        var new_zoom = curr_zoom + 2;
        if (new_zoom < 19) {
            myMap.panTo(cluster.geometry.coordinates, {delay: 100, duration: 100}).then(function () {
                myMap.setZoom(new_zoom, {duration: 200, checkZoomRange: true});
            });
        } else {
            objectManager.clusters.balloon.open(cluster.id);
            downloadContent(objects, id, true);
        }
        return true;
    });


    function hasBalloonData(objectId) {
        return (objectManager.objects.getById(objectId).properties.title != 'РРґРµС‚ Р·Р°РіСЂСѓР·РєР° ...');
    }

    objectManager.objects.events.add('click', function (e) {
        //console.log('click - objects');

        //objectManager.objects.balloon.open(e.get('objectId'));

        var objectId = e.get('objectId'),
            obj = objectManager.objects.getById(objectId);

        if (hasBalloonData(objectId)) {
            //console.log('open - objects');
            objectManager.objects.balloon.open(objectId);
        } else {
            obj.properties.title = "РРґРµС‚ Р·Р°РіСЂСѓР·РєР° ...";
            objectManager.objects.balloon.open(objectId);
            //console.log('load - objects');

            downloadContent([obj], objectId);
            // .then(function () {
            //         objectManager.objects.balloon.setData(obj);
            //     });
        }

        return true;
    });

    myMap.events.add('click', function () {
        //console.log('click - events myMap');
        objectManager.objects.balloon.close();
        objectManager.clusters.balloon.close();
    });

    myMap.geoObjects.add(objectManager);
    //РљРѕСЃС‚СЂРѕРјР°
    if ($("input.track").val() != "1100000024") {
        myPlacemark = new ymaps.Placemark([57.76667, 40.93333], {
            hintContent: 'Р‘РёР»Р±РѕСЂРґС‹ РІ РљРѕСЃС‚СЂРѕРјРµ',
            balloonContent: '<span style="padding: 15px;display: block;font-size: 14px;"><a style="color:#ff6600;" href="/category/kostroma/">РџРѕРєР°Р·Р°С‚СЊ СЃРІРѕР±РѕРґРЅС‹Рµ Р±РёР»Р±РѕСЂРґС‹ РІ РљРѕСЃС‚СЂРѕРјРµ</a></span>'
        }, {
            iconLayout: 'default#image',
            iconImageHref: '/img/icons/novos-30-i.png',
            iconImageSize: [30, 30],
            iconImageOffset: [-15, -15]
        });
        myMap.geoObjects.add(myPlacemark);
    }

    //РћСЂС‘Р»_
    if ($("input.track").val() != "1100000028") {
        myPlacemark = new ymaps.Placemark([52.96667, 36.08333], {
            hintContent: 'Р‘РёР»Р±РѕСЂРґС‹ РІ Рі. РћСЂС‘Р»',
            balloonContent: '<span style="padding: 15px;display: block;font-size: 14px;"><a style="color:#ff6600;" href="/category/oryol/">РџРѕРєР°Р·Р°С‚СЊ СЃРІРѕР±РѕРґРЅС‹Рµ Р±РёР»Р±РѕСЂРґС‹ РІ РћСЂР»Рµ</a></span>'
        }, {
            iconLayout: 'default#image',
            iconImageHref: '/img/icons/novos-30-i.png',
            iconImageSize: [30, 30],
            iconImageOffset: [-15, -15]
        });
        myMap.geoObjects.add(myPlacemark);
    }

    // Р’РѕР»РіРѕРіСЂР°Рґ
    if ($("input.track").val() != "1000000106") {
        myPlacemark = new ymaps.Placemark([48.69917, 44.47333], {
            hintContent: 'Р‘РёР»Р±РѕСЂРґС‹ РІ Р’РѕР»РіРѕРіСЂР°РґРµ',
            balloonContent: '<span style="padding: 15px;display: block;font-size: 14px;"><a style="color:#ff6600;" href="/category/volgograd/">РџРѕРєР°Р·Р°С‚СЊ СЃРІРѕР±РѕРґРЅС‹Рµ Р±РёР»Р±РѕСЂРґС‹ РІ Р’РѕР»РіРѕРіСЂР°РґРµ</a></span>'
        }, {
            iconLayout: 'default#image',
            iconImageHref: '/img/icons/novos-30-i.png',
            iconImageSize: [30, 30],
            iconImageOffset: [-15, -15]
        });
        myMap.geoObjects.add(myPlacemark);
    }

    //Р’РѕСЂРѕРЅРµР¶
    if ($("input.track").val() != "1000000105") {
        myPlacemark = new ymaps.Placemark([51.67167, 39.21056], {
            hintContent: 'Р‘РёР»Р±РѕСЂРґС‹ РІ Р’РѕСЂРѕРЅРµР¶Рµ',
            balloonContent: '<span style="padding: 15px;display: block;font-size: 14px;"><a style="color:#ff6600;" href="/category/voronezh/">РџРѕРєР°Р·Р°С‚СЊ СЃРІРѕР±РѕРґРЅС‹Рµ Р±РёР»Р±РѕСЂРґС‹ РІ Р’РѕСЂРѕРЅРµР¶Рµ</a></span>'
        }, {
            iconLayout: 'default#image',
            iconImageHref: '/img/icons/novos-30-i.png',
            iconImageSize: [30, 30],
            iconImageOffset: [-15, -15]
        });
        myMap.geoObjects.add(myPlacemark);
    }

    //РРІР°РЅРѕРІРѕ
    if ($("input.track").val() != "1100000014") {
        myPlacemark = new ymaps.Placemark([56.99500, 40.98028], {
            hintContent: 'Р‘РёР»Р±РѕСЂРґС‹ РІ РРІР°РЅРѕРІРѕ',
            balloonContent: '<span style="padding: 15px;display: block;font-size: 14px;"><a style="color:#ff6600;" href="/category/ivanovo/">РџРѕРєР°Р·Р°С‚СЊ СЃРІРѕР±РѕРґРЅС‹Рµ Р±РёР»Р±РѕСЂРґС‹ РІ РРІР°РЅРѕРІРѕ</a></span>'
        }, {
            iconLayout: 'default#image',
            iconImageHref: '/img/icons/novos-30-i.png',
            iconImageSize: [30, 30],
            iconImageOffset: [-15, -15]
        });
        myMap.geoObjects.add(myPlacemark);
    }

    //РљР°Р·Р°РЅСЊ
    if ($("input.track").val() != "1000000102") {
        myPlacemark = new ymaps.Placemark([55.79083, 49.11444], {
            hintContent: 'Р‘РёР»Р±РѕСЂРґС‹ РІ РљР°Р·Р°РЅРё',
            balloonContent: '<span style="padding: 15px;display: block;font-size: 14px;"><a style="color:#ff6600;" href="/category/kazan/">РџРѕРєР°Р·Р°С‚СЊ СЃРІРѕР±РѕРґРЅС‹Рµ Р±РёР»Р±РѕСЂРґС‹ РІ РљР°Р·Р°РЅРё</a></span>'
        }, {
            iconLayout: 'default#image',
            iconImageHref: '/img/icons/novos-30-i.png',
            iconImageSize: [30, 30],
            iconImageOffset: [-15, -15]
        });
        myMap.geoObjects.add(myPlacemark);
    }

    //РџРёС‚РµСЂ
    if ($("input.track").val() != "1000000101") {
        myPlacemark = new ymaps.Placemark([59.946900, 30.316670], {
            hintContent: 'Р‘РёР»Р±РѕСЂРґС‹ РІ РЎР°РЅРєС‚-РџРµС‚РµСЂР±СѓСЂРіРµ',
            balloonContent: '<span style="padding: 15px;display: block;font-size: 14px;"><a style="color:#ff6600;" href="/category/sankt-peterburg/">РџРѕРєР°Р·Р°С‚СЊ СЃРІРѕР±РѕРґРЅС‹Рµ Р±РёР»Р±РѕСЂРґС‹ РІ РЎР°РЅРєС‚-РџРµС‚РµСЂР±СѓСЂРіРµ</a></span>'
        }, {
            iconLayout: 'default#image',
            iconImageHref: '/img/icons/novos-30-i.png',
            iconImageSize: [30, 30],
            iconImageOffset: [-15, -15]
        });

        myMap.geoObjects.add(myPlacemark);
    }

    var filter = $('.map_filters');
    var track_select = filter.find('.track');
    var format_select = filter.find('.format');
    var month_select = filter.find('.month');
    var cluster_select = filter.find('.cluster');
    var poi_select = filter.find('.poi');
    var show_mb = filter.data('show_mb') == 1;
    var mp_redir = filter.data('mp_redir') == 1;
    // var load_buyer = filter.data('hide_bp') !== 1;
    var is_moscow = typeof $get['reg'] !== 'undefined' && $get['reg'] === 'mos';
    var bound_all = typeof $get['all_city'] !== 'undefined' && $get['all_city'] === '1';

    if ($("input.track").val() == 38) {
        is_moscow = true;
    }

    if ($('.road_type .rt1').length !== 0) {
        $('.road_type .rt').on('click', function () {
            is_moscow = $(this).hasClass('rt1');
            if ($("input.track").val() == 38) {
                is_moscow = true;
            }
            track_select.trigger('change');
        });
    }

    var load_statuses = [1, 1];
    ////console.log('properties.li = 38');
    //objectManager.setFilter('properties.li' + (is_moscow?'==':'!=') + '38');

    var url = "/constructions/load1.php";
    var d = {};
    if ($get['round'] != undefined)
        d['round'] = 1;
//    if ($get['mediaplan']);
//    $.cookie('constructions', constr.join(','), {'path':'/'});
    if ($get['b'] == 1) d['b'] = 1;
    //if ($get['not_b'] == 1){ load_buyer = false; d['not_b'] = 1; }
    d['track'] = 0;
    if ($("input.track").val() == 'all') {
        d['track'] = 'all';
    }
    if (!track_select.hasClass('multi')) {
        d['track'] = track_select.val();
        // if (load_buyer) {
        d['b'] = 1;
        //load_buyer = false;
        //}
    }
    var PselectVal = {
        "acentr": null,
        "azs": null,
        "rest": null,
        "rynok": null,
        "svet": null,
        "torg": null,
        "fit": null,
        "novos": null
    };
    for (var om_name in PselectVal) {
        var new_om = new ymaps.ObjectManager({
            clusterize: ($get['not_b'] ? false : true),
            showInAlphabeticalOrder: true,
            gridSize: 80,
            openBalloonOnClick: false,
            geoObjectIconLayout: 'default#image',
            geoObjectIconImageHref: '/img/icons/' + om_name + '-20-i.png',
            geoObjectIconImageSize: [20, 20],
            geoObjectIconImageOffset: [-10, -10],
            clusterIcons: [{
                href: '/img/icons/' + om_name + '-20-i.png',
                size: [20, 20],
                offset: [-10, -10]
            }, {
                href: '/img/icons/' + om_name + '-25-i.png',
                size: [25, 25],
                offset: [-12, -12],
                'iconShape': {
                    type: 'Circle',
                    coordinates: [0, 0],
                    radius: 24
                }
            }, {
                href: '/img/icons/' + om_name + '-30-i.png',
                size: [30, 30],
                offset: [-15, -15],
                'iconShape': {
                    type: 'Circle',
                    coordinates: [0, 0],
                    radius: 31
                }
            }],
            clusterNumbers: [5, 10, 20],
            clusterIconContentLayout: null
        });
        myMap.geoObjects.add(new_om);
        PselectVal[om_name] = new_om;
    }


    if ($('#YMap .loading').length == 0)
        $('#YMap').append($('<div />', {'class': 'loading'}));

    $.ajax({
        cache: false, dataType: "json", url: url, data: d,
        success: function (data) {

            objectManager.add(getDatashield(data.shield));

            var track_count = data.tracks.length;
            var tracks = [];
            if ($get['track'] !== undefined) {
                tracks = $get['track'].split(',');
            }
            if (track_select.data('selected') !== undefined) {
                var tmp = track_select.data('selected').toString().split(',');
                tracks = tracks.concat(tmp.filter(function (item) {
                    return tracks.indexOf(item) === -1;
                }));
            }
            if (track_select.hasClass('multi')) {
                for (var i = 0; i < track_count; i++) {
                    if (data.tracks[i].tn == "") continue;
                    var opt = $('<option />', {
                        'value': data.tracks[i].id,
                        'text': data.tracks[i].tn,
                        'data-state': data.tracks[i].m,
                        'data-mo': data.tracks[i].mo
                    });
                    if (tracks.indexOf(data.tracks[i].id) !== -1) {
                        opt.attr('selected', 'selected');
                    }
                    track_select.append(opt);
                }

            }

            if ($get['format'] != undefined) {
                var formats = $get['format'].split(',');
                format_select.find('option').prop('selected', false);
                $.each(formats, function (k, v) {
                    format_select.find('option[value="' + v + '"]').prop('selected', true);
                });
            }
            if ($get['month'] != undefined) {
                var monthes = $get['month'].split(',');
                month_select.find('option').prop('selected', false);
                $.each(monthes, function (k, v) {
                    month_select.find('option[value="' + v + '"]').prop('selected', true);
                });
            }
            //console.log('ajax load shield');
            // if(timerID != undefined){ clearTimeout(timerID); }
            // timerID = setTimeout( function(){ apply_filter()}, 500 );

            poi_select.change(function () {
                var poiselect = $(this).val();
                saveParamsMain('poi_select', poiselect);
                if (poiselect === undefined || poiselect === null) poiselect = [];
                for (var key in PselectVal) {
                    var oc = PselectVal[key].objects.getLength();
                    if (oc > 0) {
                        PselectVal[key].setFilter('false');
                    }
                    if (poiselect.indexOf(key) == -1) continue;
                    if (oc === 0) {
                        var url = "/constructions/load_poi.php?tip=" + key + "&mesto=mo";
                        $('#YMap').append($('<div />', {'class': 'loading'}));
                        $.getJSON(url, function (d2) {
                            $('#YMap .loading').remove();
                            PselectVal[d2.tip].add(d2.shield);
                        });
                    }
                    PselectVal[key].setFilter('');
                }
            }).change();

            $('.multi.poi').SumoSelect({
                placeholder: 'POI',
                triggerChangeCombined: true,
                csvDispCount: 3,
                filterSelect: true,
                forceCustomRendering: true
            });

            $('.multi.track').SumoSelect({
                placeholder: ['Р’С‹Р±РѕСЂ РЅР°РїСЂР°РІР»РµРЅРёСЏ', 'Р’С‹Р±РѕСЂ РѕРєСЂСѓРіР°'],
                triggerChangeCombined: true,
                csvDispCount: 1,
                filterSelect: true,
                forceCustomRendering: true
            });
            $('.multi.format').SumoSelect({
                placeholder: 'Р¤РѕСЂРјР°С‚ РєРѕРЅСЃС‚СЂСѓРєС†РёРё',
                triggerChangeCombined: true,
                csvDispCount: 2,
                forceCustomRendering: true
            });
            $('.multi.month').SumoSelect({
                placeholder: 'РЎРІРѕР±РѕРґРЅС‹Р№ РјРµСЃСЏС†',
                triggerChangeCombined: true,
                csvDispCount: 3,
                forceCustomRendering: true
            });
            $('.multi.cluster').SumoSelect({
                placeholder: 'РЈРґР°Р»С‘РЅРЅРѕСЃС‚СЊ РѕС‚ РњРљРђР”',
                triggerChangeCombined: true,
                csvDispCount: 1,
                forceCustomRendering: true
            });
            loadParamsMain();
            mediaplan_change(false);
            // if ($get['b'] != 1 && load_buyer) {
            //     load_more(is_moscow);
            // }
            //console.log('Finish ajax load shield');
        }
    });

    track_select.change(function () {
        if ($('#YMap .loading').length == 0)
            $('#YMap').append($('<div />', {'class': 'loading'}));

        if (timerID != undefined) {
            clearTimeout(timerID);
        }
        timerID = setTimeout(function () { //console.log('track_select');
            apply_filter(true)
        }, 30);
        saveParamsMain('track_select', track_select.val());
        return true;
    });

    format_select.change(function () {
        if ($('#YMap .loading').length == 0)
            $('#YMap').append($('<div />', {'class': 'loading'}));

        if (timerID != undefined) {
            clearTimeout(timerID);
        }
        timerID = setTimeout(function () {//console.log('format_select');
            apply_filter(true)
        }, 30);
        saveParamsMain('format_select', format_select.val());
        return true;
    });
    month_select.change(function () {

        if ($('#YMap .loading').length == 0)
            $('#YMap').append($('<div />', {'class': 'loading'}));

        if (timerID != undefined) {
            clearTimeout(timerID);
        }
        timerID = setTimeout(function () { //console.log('month_select');
            apply_filter(true)
        }, 30);
        saveParamsMain('month_select', month_select.val());
        return true;
    });

    var _clusterLoad = false;
    var omClusters = new ymaps.ObjectManager({clusterize: false});
    var dataomClusters = [{
        "name": "0 РєРј - 5 РєРј РѕС‚ РњРљРђР”",
        "color": "#6699ff",
        "p": [[[55.793471, 37.916052], [55.751607, 37.918421], [55.658843, 37.89316], [55.555863, 37.775072], [55.532028, 37.610532], [55.532699, 37.581255], [55.572056, 37.454058], [55.618299, 37.389723], [55.684996, 37.327644], [55.803815, 37.298078], [55.819376, 37.32791], [55.864768, 37.343891], [55.917704, 37.397719], [55.951829, 37.538212], [55.912494, 37.784146], [55.829406, 37.913349]], [[55.77687, 37.842828], [55.743897, 37.841946], [55.686831, 37.83089], [55.591641, 37.729346], [55.575926, 37.596445], [55.576067, 37.59705], [55.611119, 37.491699], [55.638854, 37.459253], [55.713546, 37.385752], [55.789793, 37.372643], [55.832904, 37.395373], [55.832712, 37.395293], [55.881563, 37.444701], [55.907926, 37.543731], [55.882085, 37.725908], [55.813917, 37.838862]]]
    }, {
        "name": "5 РєРј - 10 РєРј РѕС‚ РњРљРђР”",
        "color": "#ff6699",
        "p": [[[55.799998, 37.995188], [55.751643, 37.99745], [55.627631, 37.949422], [55.512393, 37.756876], [55.486998, 37.612763], [55.488648, 37.567495], [55.540117, 37.400457], [55.599303, 37.317281], [55.653126, 37.276875], [55.778378, 37.23276], [55.835577, 37.264022], [55.894199, 37.285612], [55.952779, 37.346835], [55.99409, 37.533867], [55.951992, 37.817015], [55.854375, 37.975206]], [[55.793471, 37.916052], [55.751607, 37.918421], [55.658843, 37.89316], [55.555863, 37.775072], [55.532028, 37.610532], [55.532699, 37.581255], [55.572056, 37.454058], [55.618299, 37.389723], [55.684996, 37.327644], [55.803815, 37.298078], [55.819376, 37.32791], [55.864768, 37.343891], [55.917704, 37.397719], [55.951829, 37.538212], [55.912494, 37.784146], [55.829406, 37.913349]]]
    }, {
        "name": "10 РєРј - 15 РєРј РѕС‚ РњРљРђР”",
        "color": "#66ff99",
        "p": [[[55.808845, 38.072608], [55.75174, 38.076898], [55.593033, 37.997049], [55.472094, 37.74619], [55.44272, 37.616454], [55.444432, 37.551687], [55.508566, 37.348873], [55.581257, 37.244955], [55.631081, 37.209602], [55.781474, 37.156886], [55.848091, 37.188358], [55.914233, 37.216647], [55.98272, 37.288299], [56.037364, 37.542622], [55.984216, 37.870266], [55.89215, 38.015598]], [[55.799998, 37.995188], [55.751643, 37.99745], [55.627631, 37.949422], [55.512393, 37.756876], [55.486998, 37.612763], [55.488648, 37.567495], [55.540117, 37.400457], [55.599303, 37.317281], [55.653126, 37.276875], [55.778378, 37.23276], [55.835577, 37.264022], [55.894199, 37.285612], [55.952779, 37.346835], [55.99409, 37.533867], [55.951992, 37.817015], [55.854375, 37.975206]]]
    }, {
        "name": "15 РєРј - 20 РєРј РѕС‚ РњРљРђР”",
        "color": "#6699ff",
        "p": [[[55.817834, 38.1514], [55.745334, 38.152407], [55.561377, 38.052277], [55.429724, 37.769651], [55.398344, 37.605039], [55.417491, 37.501562], [55.471432, 37.308704], [55.56302, 37.172085], [55.621235, 37.132097], [55.785053, 37.079639], [55.873964, 37.123127], [55.939026, 37.158669], [56.008215, 37.223239], [56.07836, 37.520915], [56.027563, 37.885785], [55.905074, 38.090013]], [[55.808845, 38.072608], [55.75174, 38.076898], [55.593033, 37.997049], [55.472094, 37.74619], [55.44272, 37.616454], [55.444432, 37.551687], [55.508566, 37.348873], [55.581257, 37.244955], [55.631081, 37.209602], [55.781474, 37.156886], [55.848091, 37.188358], [55.914233, 37.216647], [55.98272, 37.288299], [56.037364, 37.542622], [55.984216, 37.870266], [55.89215, 38.015598]]]
    }, {
        "name": "20 РєРј - 25 РєРј РѕС‚ РњРљРђР”",
        "color": "#9966ff",
        "p": [[[55.826532, 38.230708], [55.725552, 38.220943], [55.529454, 38.108753], [55.386921, 37.786645], [55.353819, 37.594396], [55.394977, 37.435129], [55.4307, 37.277547], [55.543705, 37.101275], [55.609577, 37.055965], [55.814207, 37.024707], [55.883762, 37.04829], [55.966066, 37.102793], [56.036067, 37.164069], [56.12175, 37.522116], [56.071693, 37.905117], [55.928268, 38.155706]], [[55.817834, 38.1514], [55.745334, 38.152407], [55.561377, 38.052277], [55.429724, 37.769651], [55.398344, 37.605039], [55.417491, 37.501562], [55.471432, 37.308704], [55.56302, 37.172085], [55.621235, 37.132097], [55.785053, 37.079639], [55.873964, 37.123127], [55.939026, 37.158669], [56.008215, 37.223239], [56.07836, 37.520915], [56.027563, 37.885785], [55.905074, 38.090013]]]
    }, {
        "name": "25 РєРј - 30 РєРј РѕС‚ РњРљРђР”",
        "color": "#6f96f9",
        "p": [[[55.830686, 38.308985], [55.727732, 38.299865], [55.492875, 38.153814], [55.343412, 37.799949], [55.315658, 37.555686], [55.365739, 37.374302], [55.394075, 37.232382], [55.526279, 37.027632], [55.600247, 36.978031], [55.818943, 36.947631], [55.895693, 36.973456], [55.99174, 37.041681], [56.076415, 37.127223], [56.159225, 37.489501], [56.105013, 37.957155], [55.942907, 38.22275]], [[55.826532, 38.230708], [55.725552, 38.220943], [55.529454, 38.108753], [55.386921, 37.786645], [55.353819, 37.594396], [55.394977, 37.435129], [55.4307, 37.277547], [55.543705, 37.101275], [55.609577, 37.055965], [55.814207, 37.024707], [55.883762, 37.04829], [55.966066, 37.102793], [56.036067, 37.164069], [56.12175, 37.522116], [56.071693, 37.905117], [55.928268, 38.155706]]]
    }, {
        "name": "30 РєРј - 35 РєРј РѕС‚ РњРљРђР”",
        "color": "#ff9669",
        "p": [[[55.834222, 38.38798], [55.721798, 38.377353], [55.456165, 38.196815], [55.299021, 37.816943], [55.272804, 37.537576], [55.340786, 37.308934], [55.356881, 37.189896], [55.498712, 36.969096], [55.591548, 36.900268], [55.829476, 36.87004], [55.903734, 36.89937], [56.024175, 36.99323], [56.114954, 37.085595], [56.198313, 37.524005], [56.140473, 38.007173], [55.967779, 38.288479]], [[55.830686, 38.308985], [55.727732, 38.299865], [55.492875, 38.153814], [55.343412, 37.799949], [55.315658, 37.555686], [55.365739, 37.374302], [55.394075, 37.232382], [55.526279, 37.027632], [55.600247, 36.978031], [55.818943, 36.947631], [55.895693, 36.973456], [55.99174, 37.041681], [56.076415, 37.127223], [56.159225, 37.489501], [56.105013, 37.957155], [55.942907, 38.22275]]]
    }, {
        "name": "35 РєРј - 40 РєРј РѕС‚ РњРљРђР”",
        "color": "#6ff969",
        "p": [[[55.834464, 38.459391], [55.702561, 38.433658], [55.415368, 38.229088], [55.256002, 37.833766], [55.227598, 37.529679], [55.315853, 37.244089], [55.318576, 37.153418], [55.463756, 36.91838], [55.583908, 36.822014], [55.849857, 36.799144], [55.915725, 36.84119], [56.035565, 36.92345], [56.149847, 37.037334], [56.241425, 37.525335], [56.183099, 38.030569], [55.98873, 38.349777]], [[55.834222, 38.38798], [55.721798, 38.377353], [55.456165, 38.196815], [55.299021, 37.816943], [55.272804, 37.537576], [55.340786, 37.308934], [55.356881, 37.189896], [55.498712, 36.969096], [55.591548, 36.900268], [55.829476, 36.87004], [55.903734, 36.89937], [56.024175, 36.99323], [56.114954, 37.085595], [56.198313, 37.524005], [56.140473, 38.007173], [55.967779, 38.288479]]]
    }];
    for (var i = 0; i < dataomClusters.length; i++) {
        var opt = $('<option />', {
            'value': i,
            'text': dataomClusters[i].name
        });
        cluster_select.append(opt);
    }
    cluster_select.change(function () {
        var val = $(this).val();
        if (val === null) {
            omClusters.setFilter('false');
            return;
        }
        saveParamsMain('cluster_select', $(this).val());
        for (var i = 0; i < val.length; i++) {
            val[i] = 'id==' + val[i];
        }
        if (_clusterLoad == false) {
            _clusterLoad = true;
            //console.log('omClusters load');

            var cl_count = dataomClusters.length;
            for (var i = 0; i < cl_count; i++) {
                omClusters.add({
                    type: 'Feature',
                    id: i,
                    geometry: {
                        type: 'Polygon',
                        coordinates: dataomClusters[i].p,
                        fillRule: 'evenOdd'
                    },
                    properties: {
                        hintContent: dataomClusters[i].name,
                        id: i
                    },
                    options: {
                        fillColor: dataomClusters[i].color,
                        interactivityModel: 'default#transparent',
                        strokeWidth: 0,
                        opacity: 0.5
                    }
                });
            }
            myMap.geoObjects.add(omClusters);
        }

        omClusters.setFilter(val.join(' || '));
    });

    $('#price-detail .modal-close').click(function () {
        toggle_mediaplan(false);
        return false;
    });

    $('#price-detail .checkout_mediaplan').click(function () {
        $(this).parents('.overlay_form').addClass('checkout');
    });

    $('#price-detail .show_mediaplan').click(function () {
        // $(this).toggleClass('selected');

        if (timerID != undefined) {
            clearTimeout(timerID);
        }
        timerID = setTimeout(function () { //console.log('show_mediaplan');
            apply_filter(true)
        }, 50);

    });
    $('#price-detail form').submit(function () {
        var form = $(this);
        form.append($('<input />', {'type': 'hidden', 'name': 'action', 'value': 'send_collection'}));
        $.ajax({
            'url': '/data2/contact.php',
            'data': $(this).serialize(),
            'type': 'POST',
            'beforeSend': function () {
                form.parent().addClass('ajax');
            },
            'success': function (data) {
                var cl = 'success';
                if (data.indexOf('РћС€РёР±РєР°') != -1) {
                    cl = 'error';
                    $('#detail-subject').addClass('error');
                } else {
                    $.removeCookie('constructions');
                    if (typeof (yaCounter6415042) != "undefined") {
                        yaCounter6415042.reachGoal('mediaplan');
                    }
                    if (typeof (_gaq) != "undefined") {
                        _gaq.push(['_trackEvent', 'Р—Р°РєР°Р·', 'mediaplan']);
                    }
                    mediaplan_change();
                }
                success_message(data, cl);
            },
            'complete': function () {
                form.parent().removeClass('ajax');
            }
        });

        return false;
    });


    $('.map_block .reg, .map_block .mos').click(function () {
//РѕС‚РєР» РІС‹Р±РѕСЂ
        return false;

        if ($(this).hasClass('disabled'))
            is_moscow = $(this).hasClass('mos');
        track_select.get(0).sumo.setState(+is_moscow);
        poi_select.get(0).sumo.disabled = is_moscow;
        if (is_moscow) {
            track_select.get(0).sumo.unSelectAll();
            poi_select.get(0).sumo.unSelectAll();
            for (var key in PselectVal) {
                //console.log('filter false');
                PselectVal[key].setFilter('false');
            }
            $('.yandexmap + h4, .map_block .leftmenu').hide();
        } else {
            $('.yandexmap + h4, .map_block .leftmenu').show();
        }
        $('.map_block .reg, .map_block .mos').removeClass('active');
        $(this).addClass('active');
        $(this).addClass('disabled');

        if ($('#YMap .loading').length == 0)
            $('#YMap').append($('<div />', {'class': 'loading'}));

        if (timerID != undefined) {
            clearTimeout(timerID);
        }
        timerID = setTimeout(function () {
            apply_filter()
        }, 500);

        $(this).removeClass('disabled');
        return false;
    });

    $(document).on("click", ".show-mediaplan", function () {
        $('.mediaplan_btn_v2').click();
    });
    $(document).on("click", ".mediaplan_btn.add", function () {
        var id = $(this).data('id').toString();
        add_to_media(id);
        if ($(this).hasClass('addCollectionmap')) {
            $(this).remove();
        } else {
            $(this).before('<a href="/map_inter.php" class="in-mediaplan">&#10004; Р’ РєРѕСЂР·РёРЅРµ</a>').remove();
        }


        return false;
    });

    $(document).on("click", '.balloon .addCollection', function () {
        var balloon = $(this).parents('.balloon');
        if (balloon.hasClass('in-plan')) return false;
        var id = balloon.data('id').toString();
        var price = parseInt(balloon.find('.price .text').text(), 10);
        if (isNaN(price)) price = 0;
        add_to_media(id, price);
        balloon.addClass('in-plan');
        return false;
    });
    $(document).on("click", ".balloon .close-button", function () {
        objectManager.objects.balloon.close();
        objectManager.clusters.balloon.close();
    });

    $(document).on("click", '.delCollection', function () {
        var constr = get_construction_array();
        var constr_id = $(this).parent().find('input[name^="constr_id"]').val();
        var construction = objectManager.objects.getById(constr_id);
        if (construction != null) construction.properties['in_plan'] = false;

        //  var key = $(this).parents('.construction').data('index');
        var cnt = constr.length;
        key = -1;
        for (var i = 0; i < cnt; i++) {
            var id = constr[i];

            if (id.indexOf(':') !== -1) {
                id = id.substr(0, id.indexOf(':'));
            }
            if (id == constr_id) {
                key = i;
                break;
            }
        }

        if (key != -1) constr.splice(key, 1);
        $.cookie('constructions', constr, {'path': '/', expires: cookie_expire});
        //setBasketAjax(constr);
        mediaplan_change();


    });

    $(document).on("click", '.balloon .price', function () {
        if (!ape) return false;
        var text = $(this).find('.text');
        text.hide();
        var price = parseInt(text.text(), 10);
        if (isNaN(price)) price = 0;
        $(this).find('.price_edit').show().find('input[type="text"]').val(price);

    });
    $(document).on("click", '.balloon .save_price', function () {
        if (!ape) return false;
        var price = $(this).parents('.price');
        var constr_id = $(this).parents('.balloon').data('id');
        var p_field = price.find('input[type="text"]');
        price.find('.price_edit').hide();
        var construction = objectManager.objects.getById(constr_id);
        var p_val = parseInt(p_field.val(), 10);
        if (isNaN(p_val)) p_val = 0;
        if (construction != null) construction.properties['price'] = p_val;
        var constr = get_construction_array();
        var idx = in_media(constr_id, constr);
        if (idx !== false) {
            constr[idx] = constr_id + (p_val > 0 ? (":" + p_val) : "");
            $.cookie('constructions', constr.join(','), {'path': '/', expires: cookie_expire});
            // setBasketAjax(constr);
            $('.mediaplan_link').attr('href', WAROOT_URL + '?mediaplan=' + constr.join(','));
        }
        var p_text = price.find('.text');
        if (p_text.length == 0) {
            p_text = $('<div />', {'class': 'text'});
            price.append(p_text);
        } else {
            p_text.show();
        }
        p_text.text(p_val > 0 ? (p_val + ' СЂСѓР±') : '');
        p_field.val('');
        return false;
    });

    var btn_mediaplan = new ymaps.control.Button({
        data: {
            image: '',
            content: 'РџРµСЂРµР№С‚Рё РІ РєРѕСЂР·РёРЅСѓ',
            title: 'РќР°Р¶РјРёС‚Рµ С‡С‚РѕР±С‹ РїРѕСЃРјРѕС‚СЂРµС‚СЊ СЃРІРѕР№ РјРµРґРёР°РїР»Р°РЅ'
        },
        options: {
            layout: ymaps.templateLayoutFactory.createClass(
                "<div     style='opacity: 0;' class='mediaplan_btn_v2 {% if state.selected %}mediaplan-selected{% endif %}'>" +
                "{{data.content}}" +
                "</div>"
            ),
            selectOnClick: false,
            maxWidth: 200,
            position: {bottom: 30, right: 0}
        }
    });
    var btn_main_page = new ymaps.control.Button({
        data: {
            image: '',
            content: 'РџРѕР»РЅР°СЏ РєР°СЂС‚Р°',
            title: 'РќР°Р¶РјРёС‚Рµ С‡С‚РѕР±С‹ РїРµСЂРµР№С‚Рё РЅР° РєР°СЂС‚Сѓ РІСЃРµС… РєРѕРЅСЃС‚СЂСѓРєС†РёР№'
        },
        options: {
            layout: ymaps.templateLayoutFactory.createClass(
                "<div class='main_page_btn'>" +
                "{{data.content}}" +
                "</div>"
            ),
            selectOnClick: false,
            maxWidth: 200,
            position: {bottom: 115, right: 0}
        }
    });
    myMap.controls.add(btn_mediaplan);
    if (show_mb) {
        myMap.controls.add(btn_main_page);
    }

    btn_mediaplan.events.add('click', function (e) {
        if (mp_redir) {
            window.location.href = "/map_inter.php";
        } else {
            if (btn_mediaplan.isSelected()) {
                toggle_mediaplan(false);
            } else {
                toggle_mediaplan(true);
                // var sm = $('#price-detail .show_mediaplan');
                // if (!sm.hasClass('selected')) sm.click();
            }
        }
    });
    btn_main_page.events.add('click', function (e) {
        window.location.href = "/";
    });

    function getDatashield(data) {
        var myObjects = [];
        for (var key in data) {
            for (var i = 0, l = data[key].length; i < l; i++) {
                myObjects.push({
                    type: 'Feature',
                    id: data[key][i][2],
                    geometry: {
                        type: 'Point',
                        coordinates: [data[key][i][0], data[key][i][1]]
                    },
                    properties: {
                        li: key,
                        id: data[key][i][2],
                        GPSE: data[key][i][0],
                        GPSN: data[key][i][1],
                        type: data[key][i][4],
                        clusterCaption: data[key][i][3],
                        spec: data[key][i][8],
                        a: [data[key][i][5], data[key][i][6], data[key][i][7]],
                        inv_id: '00000',
                        title: 'РРґРµС‚ Р·Р°РіСЂСѓР·РєР° ...',
                        side: data[key][i][3],
                        pav: 0,
                        d: null,
                        i: '../../../../../../../img//no-photo.png',
                        m: 0,
                        mo: '',
                        p: 0,
                        st: ["РЈС‚РѕС‡РЅСЏРµС‚СЃСЏ", "РЈС‚РѕС‡РЅСЏРµС‚СЃСЏ", "РЈС‚РѕС‡РЅСЏРµС‚СЃСЏ"],
                        ctype: 'Р©РёС‚',
                        light: 'РЈС‚РѕС‡РЅСЏРµС‚СЃСЏ',
                        mos_dist: '',
                        mrr_dist: ''

                    }
                });
            }
        }
        return myObjects;
    }

    function add_to_media(id, price) {
        if (typeof (price) == 'undefined') price = 0;
        if (typeof (yaCounter6415042) != "undefined") {
            yaCounter6415042.reachGoal('addmedia');
        }
        if (typeof (_gaq) != "undefined") {
            _gaq.push(['_trackEvent', 'Р—Р°РєР°Р·', 'addmedia']);
        }
        var constr = get_construction_array();
        var in_array = in_media(id, constr);
        if (in_array === false) {
            constr.push(id + (price > 0 ? (":" + price) : ""));
        } else {
            constr[in_array] = id + (price > 0 ? (":" + price) : "");
        }
        $.cookie('constructions', constr.join(','), {'path': '/', expires: cookie_expire});
        //setBasketAjax(constr);
        mediaplan_change();
    }

    function in_media(id, constr) {
        if (typeof (constr) === 'undefined') constr = get_construction_array();
        var count = constr.length;
        for (var i = 0; i < count; i++) {
            if (constr[i].indexOf(id) == 0) return i;
        }
        return false;
    }

    var FirsLoad = true;
    var showOneMediaplan = false;

    function mediaplan_change(auto_close) {
        console.log('mediaplan_change auto_close = ' + auto_close);
        if (typeof (auto_close) == 'undefined') {
            no_bound_filter = true;
            auto_close = true;
        }
        if (FirsLoad && $get['mediaplan'] != undefined) {
            FirsLoad = false;
            setBasketAjax($get['mediaplan']);
            showOneMediaplan = false;
            if ($get['mediaplan'] != undefined) {
                showOneMediaplan = true;
            }
            $get['mediaplan'] = undefined;
        }
        //console.log('FirsLoad ='+ FirsLoad);

        var form = $('#price-detail');
        var constr_list = form.find('.mediaplan').empty();
        var constr = get_construction_array();
        var cnt = constr.length;
        if (cnt == 0) {
            if (auto_close) toggle_mediaplan(false);
            btn_mediaplan.options.set({'visible': false});
            $('.show_mediaplan, .print_mediaplan').hide();

            //console.log('mediaplan_change == 0');
            apply_filter(true);

            return;
        } else {
            console.log('mediaplan_change cnt!=0');
            console.log('$get[mediaplan] =' + $get['mediaplan']);
            console.log('$(#price-detail .show_mediaplan).hasClass(selected) = ' + $('#price-detail .show_mediaplan').hasClass('selected'));
            btn_mediaplan.options.set({'visible': true});
            $('.show_mediaplan, .print_mediaplan').show();
            // $('.mediaplan_btn_v2').click();

            if (showOneMediaplan) {
                if ($('#price-detail .show_mediaplan').hasClass('selected') == false) {
                    $('#price-detail .show_mediaplan').addClass('selected');
                    showOneMediaplan = false;
                }
            }

            apply_filter(true);


        }
        var _var_load = [];
        var _var_load2 = [];
        for (var i = 0; i < cnt; i++) {
            var id = constr[i];
            var price = 0;
            if (id.indexOf(':') !== -1) {
                price = parseInt(id.substr(id.indexOf(':') + 1), 10);
                id = id.substr(0, id.indexOf(':'));
                if (id < 1000000000) {
                    price = 0;
                }
            }


            var construction = objectManager.objects.getById(id);
            if (construction == null) continue;


            if (construction.properties.title == 'РРґРµС‚ Р·Р°РіСЂСѓР·РєР° ...') {
                _var_load.push(id);
            } else {
                _var_load2.push(id);
            }

        }


        if (_var_load.length > 0) { //construction.properties.title == 'РРґРµС‚ Р·Р°РіСЂСѓР·РєР° ... '
            // console.log('_var_load -'+_var_load);
            ymaps.vow.resolve(
                $.ajax({
                    type: 'GET',
                    cache: true,
                    url: '/constructions/load-poduct.php?p=[' + _var_load.join(",") + ']',
                    dataType: 'json',
                    processData: false
                })
            ).then(
                function (data) {
                    for (var id2 in data) {

                        i = $('#price-detail').find('.mediaplan .construction').length;
                        geoObject = objectManager.objects.getById(id2);

                        geoObject.properties = data[id2].properties;

                        var constr_list = $('#price-detail').find('.mediaplan');

                        geoObject.properties['in_plan'] = true;
                        // geoObject.properties['price'] = price;
                        _dirPrefix = "";

                        if (geoObject.properties.id > 1000000000 && geoObject.properties.id < 2000000000)
                            _dirPrefix = 'other/';

                        constr_list.append(
                            $('<div />', {
                                'class': 'construction',
                                'data-index': i
                            }).append(
                                $('<a />', {
                                    'html': geoObject.properties.title,
                                    'href': 'https://www.mosoblreclama.ru/product/' + geoObject.properties.id + '/',
                                    'alt': 'РћС‚РєСЂС‹С‚СЊ РєР°СЂС‚РѕС‡РєСѓ С‚РѕРІР°СЂР°',
                                    'target': '_blank'
                                }),
                                $('<span>', {'class': 'delCollection', 'html': '&times;'}),
                                $('<img>', {
                                    'class': 'imagetipCollection',
                                    src: '/published/publicdata/MOSOBLBASE/attachments/SC/products_pictures/' + _dirPrefix + geoObject.properties.i
                                }),
                                $('<input />', {'type': 'hidden', 'name': 'constr_id[' + i + ']', 'value': id}),
                                $('<input />', {
                                    'type': 'hidden',
                                    'name': 'constr_side[' + i + ']',
                                    'value': geoObject.properties.side
                                }),
                                $('<input />', {
                                    'type': 'hidden',
                                    'name': 'constr_avail[' + i + ']',
                                    'value': geoObject.properties.a.join(',')
                                }),
                                $('<input />', {
                                    'type': 'hidden',
                                    'name': 'constr_name[' + i + ']',
                                    'value': geoObject.properties.title
                                })
                            )
                        );
                    }
                }).then(function () {
                //error
            });
        }

        if (_var_load2.length > 0) {
            //i=0;
            // console.log('_var_load2 -'+_var_load2);
            for (var id in _var_load2) {

                i = $('#price-detail').find('.mediaplan .construction').length;

                geoObject = objectManager.objects.getById(_var_load2[id]);

                if (geoObject == null) continue;


                id = geoObject.properties.id;
                //geoObject.properties = construction.properties;

                var constr_list = $('#price-detail').find('.mediaplan');

                geoObject.properties['in_plan'] = true;
                //  geoObject.properties['price'] = price;
                _dirPrefix = "";

                if (geoObject.properties.id > 1000000000 && geoObject.properties.id < 2000000000)
                    _dirPrefix = 'other/';

                constr_list.append(
                    $('<div />', {
                        'class': 'construction',
                        'data-index': i
                    }).append(
                        $('<a />', {
                            'html': geoObject.properties.title,
                            'href': 'https://www.mosoblreclama.ru/product/' + geoObject.properties.id + '/',
                            'alt': 'РћС‚РєСЂС‹С‚СЊ РєР°СЂС‚РѕС‡РєСѓ С‚РѕРІР°СЂР°',
                            'target': '_blank'
                        }),
                        $('<span>', {'class': 'delCollection', 'html': '&times;'}),
                        $('<img>', {
                            'class': 'imagetipCollection',
                            src: '/published/publicdata/MOSOBLBASE/attachments/SC/products_pictures/' + _dirPrefix + geoObject.properties.i
                        }),
                        $('<input />', {'type': 'hidden', 'name': 'constr_id[' + i + ']', 'value': id}),
                        $('<input />', {
                            'type': 'hidden',
                            'name': 'constr_side[' + i + ']',
                            'value': geoObject.properties.side
                        }),
                        $('<input />', {
                            'type': 'hidden',
                            'name': 'constr_avail[' + i + ']',
                            'value': geoObject.properties.a.join(',')
                        }),
                        $('<input />', {
                            'type': 'hidden',
                            'name': 'constr_name[' + i + ']',
                            'value': geoObject.properties.title
                        })
                    )
                );

            }
            //i++;
        }


        $('.mediaplan_link').attr('href', WAROOT_URL + '?mediaplan=' + constr.join(','));

    }

    function load_more_filter(id, objectManager) {
        var url = "/constructions/load1.php?track=" + id;
        if ($get['round'] != undefined)
            url = "/constructions/load1.php?round=true&track=" + id;

        if ($('#YMap .loading').length == 0)
            $('#YMap').append($('<div />', {'class': 'loading'}));
        if (trackLoad[id] == undefined) {
            trackLoad[id] = true;
        } else {
            return true;
        }
        ymaps.vow.resolve($.getJSON(url, function (data) {
            objectManager.add(getDatashield(data.shield))

        })).then(function () {
            updateBounds();
        });
    }

    function load_more(is_mos)//track
    {
        //console.log('load_more ');
        if (load_statuses[+is_mos] !== 1) return;
        var d = is_mos ? {'mos': 1} : {'b': 1};
        $.ajax({
            dataType: "json", url: url, data: d,
            beforeSend: function () {
                load_statuses[+is_mos] = 2;
                if ($('#YMap .loading').length == 0)
                    $('#YMap').append($('<div />', {'class': 'loading'}));
            },
            complete: function () {
                load_statuses[+is_mos] = 3;
                $('#YMap .loading').remove();
            },
            success: function (data) {
                objectManager.add(getDatashield(data.shield));

                if ($get['track'] != undefined) {
                    track_select.change();
                }
                if (load_statuses[+!is_mos] === 1) {
                    load_more(!is_mos);
                }
                mediaplan_change(false);
            }
        });
    }

    function toggle_mediaplan(is_show) {
        var form = $('#price-detail');
        var YMap = $('#YMap');

        var visible = form.is(':visible');
        if (typeof (is_show) == 'undefined') is_show = !visible;
        if (is_show) {

            form.show();

            //console.log('form.show');

            YMap.addClass('show_media');
            $('#price-detail .show_mediaplan').addClass('selected');
            apply_filter();
//            YMap.width($(document).width() - 376);

            btn_mediaplan.select();
        } else {
            form.hide().removeClass('checkout');
            YMap.removeClass('show_media');
            $('#price-detail .show_mediaplan').removeClass('selected');
//            YMap.css('width', '100%');
            apply_filter();
            btn_mediaplan.deselect();
        }
        myMap.container.fitToViewport();
        return form;
    }

    //var BasketCache = Array();

    function getBasketAjax() {
        return $.cookie('constructions');
        // t = new Date();
        // Time = t.getMinutes()+"-"+t.getSeconds();
        // if(BasketCache[Time] == undefined){
        //     //console.log('get ajax Basket = '+Time);
        //     BasketCache = Array();
        //     BasketCache[Time] = $.ajax({
        //         type: "GET",
        //         url: '/basket.php?m=get',
        //         cache: false,
        //         async: false
        //     }).responseText;
        // }
        // //console.log('get Basket');
        //     return BasketCache[Time];
    }

    function setBasketAjax(id) {
        // t = new Date();
        // Time =t.getMinutes()+"-"+t.getSeconds();
        //
        // //console.log('set ajax Basket = '+Time);
        // BasketCache = Array();
        // BasketCache[Time] = $.ajax({
        //     type: "GET",
        //     url: '/basket.php?m=addremove&id='+id,
        //     cache: false,
        //     async: true
        // }).responseText;
        //
        // //console.log('set Basket');
        // return BasketCache[Time];
        $.cookie('constructions', id, {'path': '/', expires: cookie_expire});

    }

    function get_construction_array() {
        var constr_str = getBasketAjax();// $.cookie('constructions');
        if (typeof (constr_str) == 'undefined' || constr_str == '' || constr_str == null) {
            return [];
        } else if (constr_str.indexOf(',') == -1) {
            return [constr_str];
        }
        return constr_str.split(',');
    }

    function apply_filter(_forceClear = false) {
        //console.log('apply_filter');
        if (_forceClear == undefined)
            _forceClear = false;

        var filter = '',
            mp_show_btn = $('#price-detail .show_mediaplan'),
            constr = get_construction_array();


        if (mp_show_btn.length > 0 && mp_show_btn.hasClass('selected') && constr.length > 0 && $('#pokazat').is(':checked') == false) {
            //console.log("filter finish end media");

            for (var i = 0; i < constr.length; i++) {
                if (i != 0) filter += ' || ';
                filter += 'properties.id=="' + parseInt(constr[i], 10) + '"';
            }
            // $('html, body').animate({
            //     scrollTop: $("#YMap").offset().top + 'px'
            // }, 'fast');

            console.log('1:' + filter);
            objectManager.setFilter(filter);


            //console.log("end filter finish end media 2");
            $('#YMap .loading').remove();
            updateBounds();
            return;
        }
        //console.log("filter 2...");

        var selected_track = track_select.val(),
            selected_format = format_select.val(),
            selected_month = month_select.val(),
            filters = [], tfilter = '', ffilter = '', mfilter = '';

        if (selected_track == null) selected_track = [];
        if (selected_track.length === 1 && track_select.get(0).tagName == 'SELECT') {
            load_preview(selected_track[0]);
        }
        if (typeof (selected_track) == 'string') selected_track = [selected_track];
        for (var i = 0; i < selected_track.length; i++) {
            if (i != 0) tfilter += ' || ';
            tfilter += 'properties.li==' + selected_track[i];
            //РљРѕСЃС‚СЂРѕРјР°
            if (selected_track[i] == "1100000024" ||
                //РћСЂС‘Р»_
                selected_track[i] == "1100000028" ||
                // Р’РѕР»РіРѕРіСЂР°Рґ
                selected_track[i] == "1000000106" ||
                //Р’РѕСЂРѕРЅРµР¶
                selected_track[i] == "1000000105" ||
                //РРІР°РЅРѕРІРѕ
                selected_track[i] == "1100000014" ||
                //РљР°Р·Р°РЅСЊ
                selected_track[i] == "1000000102" ||
                //РџРёС‚РµСЂ
                selected_track[i] == "1000000101")
                wait = load_more_filter(selected_track[i], objectManager);
        }
        if (tfilter == 'properties.li==38'
            || tfilter == ('properties.li==' + $("input.track").val())
        ) tfilter = "";

        if (tfilter != "") filters.push(tfilter);

        if (typeof (selected_format) == 'undefined' || selected_format == "" || selected_format == null) {
            selected_format = [];
        }
        for (var i = 0; i < selected_format.length; i++) {
            if (i != 0) ffilter += ' || ';


            if (selected_format[i] == 'video2x3') {
                ffilter += ' properties.type == 7 ';
            } else if (selected_format[i] == 'video3x7') {
                ffilter += ' properties.type == 2 ';

            } else {
                if (selected_format[i] == 'osta') {
                    //Р·Р°РіСЂСѓР·РёС‚СЊ РѕСЃС‚Р°РЅРѕРІРєРё
                    load_more_filter(1100000035, objectManager);
                    ffilter = 'properties.type == 5';
                }
                if (selected_format[i] == 'super')
                    ffilter += ' properties.type == 6  || properties.type == 8 ';
                //     ffilter += 'properties.ctype=="РЎСѓРїРµСЂР±РѕСЂРґ 2,7x3,7" || properties.type=="' + selected_format[i] + '"';
                else if (selected_format[i] == '3x6')
                    ffilter += 'properties.type == 1 ';

            }
        }


        if (ffilter != "") {
            console.log(ffilter);
            filters.push(ffilter);
        } else {
            // if(d['track'] != '1100000035')
            //     filters.push('properties.type != 5');
        }

        if (typeof (selected_month) == 'undefined' || selected_month == "" || selected_month == null) {
            selected_month = [];
        }
        if (selected_month.length != 3) {
            for (var i = 0; i < selected_month.length; i++) {
                if (i != 0) mfilter += ' && ';
                mfilter +=
                    '(properties.a[' + selected_month[i] + ']==0 ||' +
                    ' properties.a[' + selected_month[i] + ']==2)';
            }
            if (mfilter != "")
                filters.push(mfilter);
            else
                filters.push('false');
        }
        //  filters.push('(properties.m==' + (+is_moscow) + ' || properties.m==2)');
        filter = "(" + filters.join(") && (") + ")";
        // }


        // $('#YMap').append($('<div />', {'class': 'loading'}));


        // if(timerIDFilter != undefined){ clearTimeout(timerIDFilter); }
        // timerIDFilter = setTimeout( function(){  //console.log(filter);}, 4500 );
        if (filter == '()')
            filter = 'true';

        if (_forceClear == true) {
            //console.log(filter);
            objectManager.setFilter(filter);
            updateBounds();
        } else if ($("input.track").val() != '') {
            //console.log("filter updateBounds");
            updateBounds();
        }

        //console.log("filter finish");
        $('#YMap .loading').remove();

    }


    function load_preview(track_id) {
        return false;
        if (typeof (load_preview.xhr) != "undefined" && load_preview.xhr.readystate != 4) {
            load_preview.xhr.abort();
        }
        load_preview.xhr = $.ajax({
            dataType: "json", url: "/constructions/load_preview.php",
            data: {track: track_id},
            success: function (data) {
                if (typeof (load_preview.previre_block) == "undefined") {
                    load_preview.previre_block = $("<div />", {'class': 'shield_preview'});
                    load_preview.previre_block.insertAfter(".yandexmap");
                }
                var pb = load_preview.previre_block;
                pb.empty();
                for (var i = 0; i < 6; i++) {
                    var dt = data.shield[i];
                    if (dt.id == undefined) {
                        i--;
                        continue;
                    }
                    var div = $('<div />', {'class': 'shield', 'data-id': dt.id});
                    var path = '/published/publicdata/MOSOBLBASE/attachments/SC/products_pictures/';
                    if (dt.id > 1000000000 && dt.id < 2000000000) {
                        path += 'other/';
                    }
                    var pav = null;
                    if (dt.pav > 0) {
                        pav = $('<div />', {'class': 'action', 'text': 'РЎРєРёРґРєР° ' + dt.pav + '%'});
                    }
                    var _type = '';
                    _type = dt.ctype;
                    if (dt.type == 7)
                        _type = 'РЎРєСЂРѕР»Р»РµСЂ';

                    div.append(
                        $('<div />', {'class': 'title'}).append(
                            $('<a />', {'href': '/product/' + dt.id, 'text': dt.title})
                        ),
                        $('<div />', {'class': 'thumbnail'}).append(
                            $('<a />', {'href': '/product/' + dt.id}).append(
                                $('<img />', {'title': dt.title, 'alt': dt.title, 'src': path + dt.i})
                            ),
                            pav
                        ),
                        $('<div />', {'class': 'options'}).append(
                            $('<div />', {'class': 'opt'}).append(
                                $('<span />', {'class': 'opt-name', 'text': 'РЎС‚РѕСЂРѕРЅР°:'}),
                                $('<span />', {'class': 'opt-val', 'text': dt.side})
                            ),
                            $('<div />', {'class': 'opt'}).append(
                                $('<span />', {'class': 'opt-name', 'text': 'Р¤РѕСЂРјР°С‚:'}),
                                $('<span />', {'class': 'opt-val', 'text': _type})
                            ),
                            $('<div />', {'class': 'opt'}).append(
                                $('<span />', {'class': 'opt-name', 'text': 'РќР°Р»РёС‡РёРµ РїРѕРґСЃРІРµС‚РєРё:'}),
                                $('<span />', {'class': 'opt-val', 'text': dt.light})
                            ),
                            $('<div />', {'class': 'opt'}).append(
                                $('<span />', {'class': 'opt-name', 'text': 'РРЅРІРµРЅС‚Р°СЂРЅС‹Р№ РЅРѕРјРµСЂ:'}),
                                $('<span />', {'class': 'opt-val', 'text': dt.inv})
                            )
                        ),
                        '<input class="mediaplan_btn add product" data-id="' + dt.id + '" value="Р”РѕР±Р°РІРёС‚СЊ РІ РјРµРґРёР°РїР»Р°РЅ" type="button" />'
                    );
                    pb.append(div);
                }
                pb.append('<div><a class="btn-otzyvy" href="/category/' + track_id + '/">РЎРјРѕС‚СЂРµС‚СЊ РІСЃРµ РєРѕРЅСЃС‚СЂСѓРєС†РёРё</a></div>');
            }
        });
    }

    function downloadContent(geoObjects, id, isCluster) {
        // РЎРѕР·РґР°РґРёРј РјР°СЃСЃРёРІ РјРµС‚РѕРє, РґР»СЏ РєРѕС‚РѕСЂС‹С… РґР°РЅРЅС‹Рµ РµС‰С‘ РЅРµ Р·Р°РіСЂСѓР¶РµРЅС‹.
        var array = geoObjects.filter(function (geoObject) {
                return geoObject.properties.title === 'РРґРµС‚ Р·Р°РіСЂСѓР·РєР° ...' || geoObject.properties.title === '';
            }),
            // Р¤РѕСЂРјРёСЂСѓРµРј РјР°СЃСЃРёРІ РёРґРµРЅС‚РёС„РёРєР°С‚РѕСЂРѕРІ, РєРѕС‚РѕСЂС‹Р№ Р±СѓРґРµС‚ РїРµСЂРµРґР°РЅ СЃРµСЂРІРµСЂСѓ.
            ids = array.map(function (geoObject) {
                return geoObject.id;
            });
        if (ids.length) {
            // Р—Р°РїСЂРѕСЃ Рє СЃРµСЂРІРµСЂСѓ.
            // РЎРµСЂРІРµСЂ РѕР±СЂР°Р±РѕС‚Р°РµС‚ РјР°СЃСЃРёРІ РёРґРµРЅС‚РёС„РёРєР°С‚РѕСЂРѕРІ Рё РЅР° РµРіРѕ РѕСЃРЅРѕРІРµ
            // РІРµСЂРЅРµС‚ JSON-РѕР±СЉРµРєС‚, СЃРѕРґРµСЂР¶Р°С‰РёР№ С‚РµРєСЃС‚ Р±Р°Р»СѓРЅР° РґР»СЏ
            // Р·Р°РґР°РЅРЅС‹С… РјРµС‚РѕРє.
            ymaps.vow.resolve($.ajax({
                // РћР±СЂР°С‚РёС‚Рµ РІРЅРёРјР°РЅРёРµ, С‡С‚Рѕ СЃРµСЂРІРµСЂРЅСѓСЋ С‡Р°СЃС‚СЊ РЅРµРѕР±С…РѕРґРёРјРѕ СЂРµР°Р»РёР·РѕРІР°С‚СЊ СЃР°РјРѕСЃС‚РѕСЏС‚РµР»СЊРЅРѕ.
                //contentType: 'application/json',
                type: 'GET',

                url: '/constructions/load-poduct.php?p=' + JSON.stringify(ids),
                dataType: 'json',
                processData: false
            })).then(
                function (data) {

                    geoObjects.forEach(function (geoObject) {
                        // РЎРѕРґРµСЂР¶РёРјРѕРµ Р±Р°Р»СѓРЅР° Р±РµСЂРµРј РёР· РґР°РЅРЅС‹С…, РїРѕР»СѓС‡РµРЅРЅС‹С… РѕС‚ СЃРµСЂРІРµСЂР°.
                        // РЎРµСЂРІРµСЂ РІРѕР·РІСЂР°С‰Р°РµС‚ РјР°СЃСЃРёРІ РѕР±СЉРµРєС‚РѕРІ РІРёРґР°:
                        // [ {"balloonContent": "РЎРѕРґРµСЂР¶РёРјРѕРµ Р±Р°Р»СѓРЅР°"}, ...]
                        geoObject.properties = data[geoObject.id].properties;
                        // //console.log("save geoObject.properties"+geoObject.properties.title)
                    });
                    // РћРїРѕРІРµС‰Р°РµРј Р±Р°Р»СѓРЅ, С‡С‚Рѕ РЅСѓР¶РЅРѕ РїСЂРёРјРµРЅРёС‚СЊ РЅРѕРІС‹Рµ РґР°РЅРЅС‹Рµ.
                    setNewData();
                }, function () {
                    geoObjects.forEach(function (geoObject) {
                        geoObject.properties = 'Not found';
                        //console.log("save geoObject.properties Not found" );
                    });
                    // РћРїРѕРІРµС‰Р°РµРј Р±Р°Р»СѓРЅ, С‡С‚Рѕ РЅСѓР¶РЅРѕ РїСЂРёРјРµРЅРёС‚СЊ РЅРѕРІС‹Рµ РґР°РЅРЅС‹Рµ.
                    setNewData();

                }
            );
        }

        function setNewData() {
            if (isCluster && objectManager.clusters.balloon.isOpen(id)) {
                objectManager.clusters.balloon.setData(objectManager.clusters.balloon.getData());
            } else if (objectManager.objects.balloon.isOpen(id)) {
                objectManager.objects.balloon.setData(objectManager.objects.balloon.getData());
            }
        }


    }

    function updateBounds() {
        //console.log('myMap.setBounds');
        //console.log('no_bound_filter =' +no_bound_filter);
        if (no_bound_filter == true) {
            //console.log('no_bound_filter..');

            no_bound_filter = false;
            return;
        }
        var maxLat = 0,
            maxLon = 0,
            minLat = 100,
            minLon = 100;
        var constr = get_construction_array();
        var cnt = constr.length;

        //console.log('bound_filter');

        var bound_filter = (track_select.val() !== null);
        if (!bound_filter && cnt == 0) {
            //console.log('msk setBounds');
            myMap.setBounds([[55.754941, 37.617188], [55.754941, 37.617188]], {checkZoomRange: true}).then(function () {
                myMap.setZoom(10, {duration: 10});
            });
            return;
        }
        if ($("#price-detail").is(':hidden') == true && bound_filter == false) {
            //console.log('msk setBounds2');
            myMap.setBounds([[55.754941, 37.617188], [55.754941, 37.617188]], {checkZoomRange: true}).then(function () {
                myMap.setZoom(10, {duration: 10});
            });
            return;
        }
        //console.log('objectManager.objects.each');
        objectManager.objects.each(function (object) {

            var objectState = objectManager.getObjectState(object.id);
            if (!objectState.isFilteredOut && bound_filter) {

                var lat = object.geometry.coordinates[0],
                    lon = object.geometry.coordinates[1];
                maxLat = (lat <= maxLat) ? maxLat : lat;
                maxLon = (lon <= maxLon) ? maxLon : lon;
                minLat = (lat >= minLat) ? minLat : lat;
                minLon = (lon >= minLon) ? minLon : lon;
            }
        }, myMap);
        console.log("zoom1:" + myMap.getZoom());
        if (maxLat != 0) {
            //console.log('cord setBounds');

            myMap.setBounds([[minLat, minLon], [maxLat, maxLon]], {
                checkZoomRange: true,
                duration: 0
            }).then(function () {
                //console.log("zoom3:"+myMap.getZoom());
                if (myMap.getZoom() > 20) myMap.setZoom(10, {duration: 0});
            });
        }
    }
};

function success_message(text, cl) {
    cl = cl || 'success';
    $('<div />', {'class': cl, 'html': text}).click(function () {
        $(this).fadeOut('slow', function () {
            $(this).remove();
        });
    }).insertBefore('#YMap').animate({'opacity': 1}, 3000, function () {
        $(this).fadeOut('slow', function () {
            $(this).remove();
        });
    });
}

function print_r(arr, level) {
    var print_red_text = "";
    if (!level) level = 0;
    var level_padding = "";
    for (var j = 0; j < level + 1; j++) level_padding += "    ";
    if (typeof (arr) == 'object') {
        for (var item in arr) {
            var value = arr[item];
            if (typeof (value) == 'object') {
                print_red_text += level_padding + "'" + item + "' :\n";
                print_red_text += print_r(value, level + 1);
            } else
                print_red_text += level_padding + "'" + item + "' => \"" + value + "\"\n";
        }
    } else
        print_red_text = "===>" + arr + "<===(" + typeof (arr) + ")";
    return print_red_text;
}