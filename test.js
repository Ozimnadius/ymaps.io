ymaps.ready(init);

function init() {
    var myMap = new ymaps.Map('map', {
            center: [55.76, 37.64],
            zoom: 10,
            controls: []
        }, {
            searchControlProvider: 'yandex#search'
        }),
        objectManager = new ymaps.ObjectManager({
            // Чтобы метки начали кластеризоваться, выставляем опцию.
            clusterize: true,
            // ObjectManager принимает те же опции, что и кластеризатор.
            gridSize: 64,
            // Макет метки кластера pieChart.
            clusterIconLayout: "default#pieChart"
        });
    myMap.geoObjects.add(objectManager);

    // Создадим 5 пунктов выпадающего списка.
    var listBoxItems = ['Школа', 'Аптека', 'Магазин', 'Больница', 'Бар']
            .map(function (title) {
                return new ymaps.control.ListBoxItem({
                    data: {
                        content: title
                    },
                    state: {
                        selected: true
                    }
                })
            }),
        reducer = function (filters, filter) {
            filters[filter.data.get('content')] = filter.isSelected();
            return filters;
        },
        // Теперь создадим список, содержащий 5 пунктов.
        listBoxControl = new ymaps.control.ListBox({
            data: {
                content: 'Фильтр',
                title: 'Фильтр'
            },
            items: listBoxItems,
            state: {
                // Признак, развернут ли список.
                expanded: true,
                filters: listBoxItems.reduce(reducer, {})
            }
        });
    myMap.controls.add(listBoxControl);



    // Также создадим макет для отдельного элемента списка.
    var ListBoxItemLayout = ymaps.templateLayoutFactory.createClass(
        "<li class='filter__li'><a>{{data.content}}</a></li>"
    );

    // Создадим 5 пунктов выпадающего списка.
    var listBoxItems2 = ['Школа2', 'Аптека2', 'Магазин2', 'Больница2', 'Бар2']
            .map(function (title) {
                return new ymaps.control.ListBoxItem({
                    data: {
                        content: title
                    },
                    state: {
                        selected: true
                    }
                })
            }),
        reducer = function (filters, filter) {
            filters[filter.data.get('content')] = filter.isSelected();
            return filters;
        },
        // Теперь создадим список, содержащий 5 пунктов.
        listBoxControl2 = new ymaps.control.ListBox({
            data: {
                content: 'Фильтр2',
                title: 'Фильтр2'
            },
            options: {
                itemLayout: ListBoxItemLayout
            },
            items: listBoxItems2,
            state: {
                // Признак, развернут ли список.
                expanded: true,
                filters: listBoxItems2.reduce(reducer, {})
            }
        });

    myMap.controls.add(listBoxControl2);

    // Добавим отслеживание изменения признака, выбран ли пункт списка.
    listBoxControl.events.add(['select', 'deselect'], function (e) {
        var listBoxItem = e.get('target');
        var filters = ymaps.util.extend({}, listBoxControl.state.get('filters'));
        filters[listBoxItem.data.get('content')] = listBoxItem.isSelected();
        listBoxControl.state.set('filters', filters);
    });

    // Добавим отслеживание изменения признака, выбран ли пункт списка.
    listBoxControl2.events.add(['select', 'deselect'], function (e) {
        var listBoxItem = e.get('target');
        var filters = ymaps.util.extend({}, listBoxControl2.state.get('filters'));
        filters[listBoxItem.data.get('content')] = listBoxItem.isSelected();
        listBoxControl2.state.set('filters', filters);
    });

    var filterMonitor = new ymaps.Monitor(listBoxControl.state);
    filterMonitor.add('filters', function (filters) {
        // Применим фильтр.
        objectManager.setFilter(getFilterFunction(filters));
    });

    var filterMonitor2 = new ymaps.Monitor(listBoxControl2.state);
    filterMonitor2.add('filters', function (filters) {
        // Применим фильтр.
        objectManager.setFilter(getFilterFunction2(filters));
    });

    function getFilterFunction(categories) {
        return function (obj) {
            var content = obj.properties.balloonContent;
            return categories[content]
        }
    }

    function getFilterFunction2(categories) {
        return function (obj) {
            var content = obj.properties.fiilter2;
            return categories[content]
        }
    }

    $.ajax({
        url: "data2.json"
    }).done(function (data) {
        objectManager.add(data);
    });

}