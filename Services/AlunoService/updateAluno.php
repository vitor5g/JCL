<?php

include_once "../../Entity/Aluno.php";
include_once "../../DAO/AlunoDAO.php";

try {

    $data = json_decode($_POST['data']);

    $dto = new Aluno();

    $data_nascimento = str_replace("/", "-", $data->data_nascimento);
    $cpf = str_replace(".", "", $data->cpf);
    $cpf = str_replace("-", "", $cpf);

    $dto->setNome(trim($data->nome));
    $dto->setData_nascimento(date('Y-m-d', strtotime($data_nascimento)));
    $dto->setCpf(trim($cpf));
    $dto->setTelefone(trim($data->telefone));
    $dto->setCelular(trim($data->celular));
    $dto->setCurso_id(trim($data->curso_id));

    if (empty($dto->getNome()) || empty($dto->getData_nascimento()) || empty($dto->getCpf()) || empty($dto->getCelular()) || empty($dto->getCurso_id())) {
        throw new Exception("Por favor preencha todos os campos obrigatórios");
    } else if (ctype_space($dto->getNome()) ||
            ctype_space($dto->getData_nascimento()) ||
            ctype_space($dto->getCpf()) ||
            ctype_space($dto->getTelefone()) ||
            ctype_space($dto->getCelular()) ||
            ctype_space($dto->getCurso_id())) {
        throw new Exception("Por favor preencha o campo corretamente, campos preenchidos somente com espaços não são permitidos");
    }

    AlunoDAO::update($dto);

    http_response_code(200);

    echo 'Aluno atualizado com sucesso';
} catch (Throwable $th) {
    http_response_code(500);
    echo $th->getMessage();
}


