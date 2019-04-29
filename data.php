<?php
$data = array(
    "type" => "FeatureCollection",
    "features" => array(
        array(
            "type" => "Feature",
            "id" => 1811,
            "geometry" => array(
                "type" => "Point",
                "coordinates" => array(55.75399400, 37.623)
            ),
            "properties" => array(
                "balloonContentHeader" => '<a class="map__link" href='/'>1811 - д. Хлябово, 420м от Дмитровского ш.</a>',
                "balloonContentBody" => "123",
                "hintContent"=> '<div class="map__hint">1811 - д. Хлябово, 420м от Дмитровского ш.</div>'
            )
        )
    ),
);
$json = json_encode($data);

$file = fopen('data.json', 'w');

// и записываем туда данные
$write = fwrite($file,$json);

// проверяем успешность выполнения операции
if($write) echo "Данные успешно записаны!<br>";
else echo "Не удалось записать данные!<br>";

//закрываем файл
fclose($file);
