<?php


class Conexao{
    private static $host = "localhost";
    private static $user = "postgres";
    private static $password = "";
    private static $database = "jcl";
    private static $charset = "utf8";
    private static $conexao;


    public static function getConexao(){
        try {
            if(Conexao::$conexao==null){
               //abre e retorna a Conexao 

               Conexao::$conexao = new PDO('pgsql:host=localhost;dbname=jcl', 'postgres', '123456');
               

               return Conexao::$conexao;
            }else{
                return Conexao::$conexao;
            }
        } catch (\Throwable $th) {
            throw $th;
        }
    }


}





?>