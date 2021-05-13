<?php

//inclui arquivo
include_once "../../Connection/Conexao.php";

//cria classe CursoDAO
class CursoDAO {

    //cria função create que recebe um objeto do tipo Curso como parametro
    static function create(Curso $dto) {
        try {
            $db = Conexao::getConexao();
            $stmt = $db->prepare("INSERT INTO curso (nome) VALUES (?)");
            $stmt->bindValue(1, $dto->getNome(), PDO::PARAM_STR);
            $stmt->execute();
            //pega o id da inserção
            $id = $db->lastInsertId();
            //fim do try inicio do catch
        } catch (Throwable $th) {
            //caso dê erro ao inserir exibi a mensagem com o codigo do erro pego no catch
            $e = new Exception('Erro ao cadastrar curso <br>' . $th->getMessage());
            //lança a exceção pega na variavel é para ser tratada posteriormente
            throw $e;
        }
    }

    //cria função update que recebe um objeto do tipo Curso como parametro
    static function update(Curso $dto) {
        //inicia try
        try {
            //cria variavel $db que recebe a conexão com o BD
            $db = Conexao::getConexao();
            $stmt = $db->prepare("UPDATE curso SET nome=? WHERE id=?");
            $stmt->bindValue(1, $dto->getNome(), PDO::PARAM_STR);
            $stmt->bindValue(2, $dto->getId(), PDO::PARAM_INT);

            //executa o sql preparado
            $stmt->execute();

            //fim do try inico do catch
        } catch (Throwable $th) {
            //caso dê erro ao inserir exibi a mensagem com o codigo do erro pego no catch
            $e = new Exception('Erro ao atualizar curso <br>' . $th->getMessage());
            //lança a exceção pega na variavel é para ser tratada posteriormente
            throw $e;
        }
    }

    //cria função delete que recebe um objeto do tipo Curso como parametro
    static function delete(Curso $dto) {
        //inicia try
        try {
            //cria variavel $db que recebe a conexão com o BD
            $db = Conexao::getConexao();
            //cria variavel $stmt que recebe o prepare de $db para preparar o sql para deletar
            $stmt = $db->prepare("DELETE FROM curso WHERE id=?");
            //seta o id no primeiro parametro das ?
            $stmt->bindValue(1, $dto->getId(), PDO::PARAM_INT);

            //executa o sql preparado
            $stmt->execute();
            //fim do try inico do catch
        } catch (Throwable $th) {
            //caso dê erro ao inserir exibi a mensagem com o codigo do erro pego no catch
            $e = new Exception('Erro ao remover curso <br>' . $th->getMessage());
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
            $str = "SELECT * FROM curso ";
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

            //Define o modo de carga de dados para esta instrução como a classe Curso 
            $stmt->setFetchMode(PDO::FETCH_CLASS, 'Curso');
            //Retorna um array contendo todas as linhas do conjunto de resultados
            $dtos = $stmt->fetchAll();
            //retorna a variavel $dtos contendo os dados do SELECT            
            return $dtos;
            //fim do try inico do catch
        } catch (Throwable $th) {
            //caso dê erro ao inserir exibi a mensagem com o codigo do erro pego no catch
            $e = new Exception('Erro ao ler dados do curso <br>' . $th->getMessage());
            //lança a exceção pega na variavel é para ser tratada posteriormente
            throw $e;
        }
    }

}
