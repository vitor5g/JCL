<?php

include_once "../../Entity/Curso.php";
include_once "../../DAO/CursoDAO.php";

try {

    $data = json_decode($_POST['data']);

    $dto = new Curso();

    $dto->setId($data->id);

    CursoDAO::delete($dto);

    http_response_code(200);

    echo 'Curso removido com sucesso';
} catch (Throwable $th) {
    http_response_code(500);
    echo $th->getMessage();
}


