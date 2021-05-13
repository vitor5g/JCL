<?php

include_once "../../Entity/Curso.php";
include_once "../../DAO/CursoDAO.php";

try {

    $dtos = CursoDAO::read('', '');
    if (isset($dtos)) {
        echo json_encode($dtos);
    } else {
        echo json_encode(Array());
    }
    http_response_code(200);
} catch (Throwable $th) {
    http_response_code(500);
    echo $th->getMessage();
}


