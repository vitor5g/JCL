-- This script was generated by a beta version of the ERD tool in pgAdmin 4.
-- Please log an issue at https://redmine.postgresql.org/projects/pgadmin4/issues/new if you find any bugs, including reproduction steps.
BEGIN;


CREATE TABLE public.aluno
(
    id bigint NOT NULL,
    nome character(255) NOT NULL,
    data_nascimento date NOT NULL,
    cpf character(11) NOT NULL,
    telefone character(15),
    celular character(15) NOT NULL,
    curso_id integer NOT NULL,
    data_cadastro timestamp with time zone,
    PRIMARY KEY (id)
);

CREATE TABLE public.curso
(
    id bigint NOT NULL,
    nome character(255),
    PRIMARY KEY (id)
);

ALTER TABLE public.aluno
    ADD FOREIGN KEY (curso_id)
    REFERENCES public.curso (id)
    NOT VALID;

END;