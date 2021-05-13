<?php

//inclui arquivo
include_once "../../Connection/Conexao.php";

//cria classe AlunoDAO
class AlunoDAO {

    //cria função create que recebe um objeto do tipo Aluno como parametro
    static function create(Aluno $dto) {
        try {
            $db = Conexao::getConexao();
            $stmt = $db->prepare("INSERT INTO aluno (nome, data_nascimento, cpf, telefone, celular, curso_id) VALUES (?,?,?,?,?,?)");
            $stmt->bindValue(1, $dto->getNome(), PDO::PARAM_STR);
            $stmt->bindValue(2, $dto->getData_nascimento(), PDO::PARAM_STR);
            $stmt->bindValue(3, $dto->getCpf(), PDO::PARAM_STR);
            $stmt->bindValue(4, $dto->getTelefone(), PDO::PARAM_STR);
            $stmt->bindValue(5, $dto->getCelular(), PDO::PARAM_STR);
            $stmt->bindValue(6, $dto->getCurso_id(), PDO::PARAM_INT);
            $stmt->execute();
            //pega o id da inserção
            $id = $db->lastInsertId();
            //fim do try inicio do catch
        } catch (Throwable $th) {
            //caso dê erro ao inserir exibi a mensagem com o codigo do erro pego no catch
            $e = new Exception('Erro ao cadastrar aluno <br>' . $th->getMessage());
            //lança a exceção pega na variavel é para ser tratada posteriormente
            throw $e;
        }
    }

    //cria função update que recebe um objeto do tipo Aluno como parametro
    static function update(Aluno $dto) {
        //inicia try
        try {
            //cria variavel $db que recebe a conexão com o BD
            $db = Conexao::getConexao();
            $stmt = $db->prepare("UPDATE aluno SET nome=?, data_nascimento=?, cpf=?, telefone=?, celular=?, curso_id=? WHERE id=?");
            $stmt->bindValue(1, $dto->getNome(), PDO::PARAM_STR);
            $stmt->bindValue(2, $dto->getData_nascimento(), PDO::PARAM_STR);
            $stmt->bindValue(3, $dto->getCpf(), PDO::PARAM_STR);
            $stmt->bindValue(4, $dto->getTelefone(), PDO::PARAM_STR);
            $stmt->bindValue(5, $dto->getCelular(), PDO::PARAM_STR);
            $stmt->bindValue(6, $dto->getCurso_id(), PDO::PARAM_INT);

            $stmt->bindValue(7, $dto->getId(), PDO::PARAM_INT);

            //executa o sql preparado
            $stmt->execute();

            //fim do try inico do catch
        } catch (Throwable $th) {
            //caso dê erro ao inserir exibi a mensagem com o codigo do erro pego no catch
            $e = new Exception('Erro ao atualizar aluno <br>' . $th->getMessage());
            //lança a exceção pega na variavel é para ser tratada posteriormente
            throw $e;
        }
    }

    //cria função delete que recebe um objeto do tipo Aluno como parametro
    static function delete(Aluno $dto) {
        //inicia try
        try {
            //cria variavel $db que recebe a conexão com o BD
            $db = Conexao::getConexao();
            //cria variavel $stmt que recebe o prepare de $db para preparar o sql para deletar
            $stmt = $db->prepare("DELETE FROM aluno WHERE id=?");
            //seta o id no primeiro parametro das ?
            $stmt->bindValue(1, $dto->getId(), PDO::PARAM_STR);

            //executa o sql preparado
            $stmt->execute();
            //fim do try inico do catch
        } catch (Throwable $th) {
            //caso dê erro ao inserir exibi a mensagem com o codigo do erro pego no catch
            $e = new Exception('Erro ao remover aluno <br>' . $th->getMessage());
            //lança a exceção pega na variavel é para ser tratada posteriormente
            throw $e;
        }
    }

    //cria função read que recebe 2 variaveis um $filto ou uma $order para clausula WHERE e ORDER BY do SQL respectivamente
    static function read($filtro, $order) {
        //inicia try
        try {
            //cria variavel $db que recebe a conexão com o BD
            $db = Conexao::getConexao();
            //cria uma variavel $str que recebe o SQL para realizar o SELECT no BD
            $str = "SELECT *, curso.id AS curso_id, curso.nome AS curso_nome, aluno.id AS id FROM aluno INNER JOIN curso ON curso.id = aluno.curso_id;  ";
            //if que verifica se a variavel $filro é diferente de vazio
            if ($filtro != "") {
                //caso $filtro não seja diferente de vazio adiciona string a variavel $str
                $str = $str . " WHERE " . $filtro;
            }
            //if que verifica se a variavel $order é diferente de vazio
            if ($order != "") {
                //caso $order não seja diferente de vazio adiciona string a variavel $str
                $str = $str . " ORDER BY " . $order;
            }


            //executa o sql preparado
            $stmt = $db->query($str);

            //Define o modo de carga de dados para esta instrução como a classe Aluno 
            $stmt->setFetchMode(PDO::FETCH_CLASS, 'Aluno');
            //Retorna um array contendo todas as linhas do conjunto de resultados
            $dtos = $stmt->fetchAll();
            //retorna a variavel $dtos contendo os dados do SELECT            
            return $dtos;
            //fim do try inico do catch
        } catch (Throwable $th) {
            //caso dê erro ao inserir exibi a mensagem com o codigo do erro pego no catch
            $e = new Exception('Erro ao ler dados do aluno <br>' . $th->getMessage());
            //lança a exceção pega na variavel é para ser tratada posteriormente
            throw $e;
        }
    }

}
