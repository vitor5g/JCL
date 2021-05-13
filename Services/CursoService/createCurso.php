<?php

include_once "../../Entity/Curso.php";
include_once "../../DAO/CursoDAO.php";

try {

    $data = json_decode($_POST['data']);

    $dto = new Curso();

    $dto->setNome(trim($data->nome));


    if (empty($dto->getNome())) {
        throw new Exception("Por favor preencha todos os campos obrigatórios");
    } else if (ctype_space($dto->getNome())) {
        throw new Exception("Por favor preencha o campo corretamente, campos preenchidos somente com espaços não são permitidos");
    }


    CursoDAO::create($dto);

    http_response_code(200);

    echo 'Curso cadastrado com sucesso';
} catch (Throwable $th) {
    http_response_code(500);
    echo $th->getMessage();
}


