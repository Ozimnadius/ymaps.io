<?php

header('Content-Type: application/json');

$action = $_POST['action'];

switch ($action) {
    case 'filter':
        echo json_encode(array(
            'status' => true,
            'data' => array(
                array(
                    "type" => "Feature",
                    "id" => 1811,
                    "geometry" => array(
                        "type" => "Point",
                        "coordinates" => array(55.75399400, 37.623),
                    ),
                    "properties" => array(
                        "balloonContentBody" => getBalloonContent(),
                        "hintContent" => '<div class="map__hint">1811 - д. Хлябово, 420м от Дмитровского ш.</div>',
                        "preset" => 'islands#blueIcon'
                    )
                ),
                array(
                    "type" => "Feature",
                    "id" => 1812,
                    "geometry" => array(
                        "type" => "Point",
                        "coordinates" => array(55.76399400, 37.643)
                    ),
                    "properties" => array(
                        "balloonContentBody" => getBalloonContent(),
                        "hintContent" => '<div class="map__hint">1811 - д. Хлябово, 420м от Дмитровского ш.</div>',
                        "preset" => 'islands#blueIcon'
                    )
                )
            )
        ));
        exit();
        break;
    default:
        echo json_encode(array(
            'status' => false,
        ));
        exit();
        break;
}

function getBalloonContent()
{
    ob_start();
    ?>
    <a class="map__link" href=' / '>1811 - д. Хлябово, 420м от Дмитровского ш.</a>
    <div class="map__imgs">
        <a href="img/4078_image_a.jpg" data-fancybox="gallery" class="map__img"> Сторона А
            <img src="img/4078_image_a.jpg" alt="" class="map__img-img">
        </a>
        <a href="img/4078_image_b.jpg" data-fancybox="gallery" class="map__img"> Сторона Б
            <img src="img/4078_image_b.jpg" alt="" class="map__img-img">
        </a>
    </div>
    <table class="map__table">
        <tr>
            <td>Город</td>
            <td>г.Москва</td>
        </tr>
        <tr>
            <td>Округ</td>
            <td></td>
        </tr>
        <tr>
            <td>Район</td>
            <td></td>
        </tr>
        </tr>
        <tr>
            <td>Трасса</td>
            <td></td>
        </tr>
        <tr>
            <td>Количество сторон</td>
            <td>1+1</td>
        </tr>
        <tr>
            <td>Расположение</td>
            <td>справа</td>
        </tr>
        <tr>
            <td>Регион</td>
            <td>Москва</td>
        </tr>
        <tr>
            <td>Адрес</td>
            <td>д. Хлябово, 420м от Дмитровского ш.</td>
        </tr>
        <tr>
            <td>Подсветка</td>
            <td>Нет</td>
        </tr>
        <tr>
            <td>Сторона А</td>
            <td>в область</td>
        </tr>
        <tr>
            <td>Сторона Б</td>
            <td>из области</td>
        </tr>
    </table>
    <a href="" class="map__link2">Подробнее</a>
    <?
    $html = ob_get_contents();
    ob_end_clean();
    return $html;
}