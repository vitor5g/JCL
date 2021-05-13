<?php

include_once "../../Entity/Aluno.php";
include_once "../../DAO/AlunoDAO.php";

try {

    $data = json_decode($_POST['data']);

    $dto = new Aluno();

    $dto->setId($data->id);

    AlunoDAO::delete($dto);
    

    http_response_code(200);

    echo 'Aluno removido com sucesso';
} catch (Throwable $th) {
    http_response_code(500);
    echo $th->getMessage();
}


