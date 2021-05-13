var table;
var edit = false;
var editing_id;

$().ready(async function () {
    table = $('#my_table').DataTable({
        "columnDefs": [
            {"targets": [0, 1], "visible": false},
            {"targets": [0, 1], "ordenable": false},
            {"targets": [0, 1], "searchable": false},
            {"targets": 5, "responsivePriority": 1},
            {"targets": 2, "responsivePriority": 2},
            {"targets": 4, "responsivePriority": 3},
            {"targets": 3, "responsivePriority": 4},
            {"targets": [2, 3, 4, 5], "className": "text-center"},
            {"targets": [5], "className": "text-center text-nowrap"},
        ],
        "oLanguage": {
            "sZeroRecords": "Não foram encontrados resultados",
            "sProcessing": "Processando...",
            "sLengthMenu": "Mostrar _MENU_ registros",
            "sInfoEmpty": "Mostrando de 0 até 0 de 0 registros",
            "sInfo": "Mostrando de _START_ até _END_ de _TOTAL_ registros",
            "sInfoFiltered": "",
            "sUrl": "",
            "sSearch": "Buscar:",
            "sInfoPostFix": "",
            "oPaginate": {
                "sPrevious": "Anterior",
                "sFirst": "Primeiro",
                "sNext": "Seguinte",
                "sLast": "Último"
            }
        },
        responsive: true,
        searching: true,
        paging: true,
        "order": [[1, "asc"]]

    });

    $('.cpf').mask('000.000.000-00', {reverse: true});
    $('.telefone').mask('(00) 0000-0000');
    $('.celular').mask('(00) 00000-0000');

    $("#modalFormAluno").validate({
        rules: {
            nome: {
                required: true
            },
            data_nascimento: {
                required: true
            },
            cpf: {
                required: true
            },
            celular: {
                required: true
            },
            curso: {
                required: true,
                number: true
            },
        },
        messages: {
            nome: {
                required: "<span style='color:red;'>Este campo não pode ser vazio</span>"
            },
            data_nascimento: {
                required: "<span style='color:red;'>Este campo não pode ser vazio</span>"
            },
            cpf: {
                required: "<span style='color:red;'>Este campo não pode ser vazio</span>"
            },
            celular: {
                required: "<span style='color:red;'>Este campo não pode ser vazio</span>"
            },
            curso: {
                required: "<span style='color:red;'>Selecione um item</span>",
                required: "<span style='color:red;'>Selecione um item</span>"
            },
        },
        submitHandler: function (form) {
            save_it();
        }
    });
    read();
    CarregarSelectCursos();
});

function add() {
    $("#modalFormAluno").validate().resetForm();
    edit = false; // seta o flag para criação
    limpaModal(); //limpa o modal
    removeAlertas(); //remove os alertas
    $('#modal').modal(); //mostra o modal
}

//Limpa o modal
function limpaModal() {
    document.getElementById('nome').value = ''; //seta o valor do campo nome para ''
    document.getElementById('data_nascimento').value = ''; //seta o valor do campo matricula para ''
    document.getElementById('cpf').value = ''; // ...
    document.getElementById('telefone').value = ''; // ...
    document.getElementById('celular').value = ''; // ...
    document.getElementById('curso').value = 'Selecione';
//    document.getElementById('curso').value = ''; // ...
}

function removeAlertas() {
    window.setTimeout(function () { //seta um timer para rodar depois de 3 segundos
        $('#alerta_erro').removeClass('show'); //esconde alerta de erro
        $('#alerta_sucesso').removeClass('show'); //esconde alerta de sucesso
        $('#alerta_wait').removeClass('show'); //esconde alerta de aguarde
    }, 3000) //os 3 segundos configura aqui
}

function save_it() {

    if (edit) { //verificar flag. se editando chama update, se nao, chama o create
        update();
    } else {
        create();
    }
}

function edit_it(caller) {
    edit = true;
    let data = table.row($(caller).closest('tr')).data();

    limpaModal();
    document.getElementById('nome').value = data[2];
    document.getElementById('data_nascimento').value = FormataStringData(data[3]);
    document.getElementById('cpf').value = data[4];
    document.getElementById('telefone').value = data[5];
    document.getElementById('celular').value = data[6];
    document.getElementById('curso').value = data[0];

    editing_id = data[1];


    $('#modal').modal();
}

function delete_it(caller) {
    //cria variavel data e armazena nela o conteudo pega naquela tr(linha) vetor de elementos
    let data = table.row($(caller).closest('tr')).data();
    //a variavel recebe o elemento que esta na posição 0 que é o id 
    editing_id = data[1];
    //chama bootbox
    bootbox.confirm({
        title: "Excluir?",
        message: "Deseja realmente excluir esse Aluno?",
        className: 'bounceIn animated',
        buttons: {
            confirm: {
                label: 'Sim',
                className: 'btn-danger'
            },
            cancel: {
                label: 'Não',
                className: 'btn-secondary'
            }

        },

        callback: function (result) {
            //console.log('O valor selecionado foi : ' + result);
            //se o usuario clicar sim entra aqui
            if (result) {
                //chama a função deleta
                deleta();
            }

        }

    });
    //pega elemento pela classe
    let remover = document.body.getElementsByClassName("modal-backdrop fade show")[0];
    //remove o elemento pego
    document.body.removeChild(remover);
    //pega a div com problema
    let muda = document.body.children[3];
    //remove o nome na tag que estava dando problema
    muda.classList.remove("fade");


}


//create
function create() {
    let obj = {};
    obj.nome = document.getElementById('nome').value;
    obj.data_nascimento = document.getElementById('data_nascimento').value;
    obj.cpf = document.getElementById('cpf').value;
    obj.telefone = document.getElementById('telefone').value;
    obj.celular = document.getElementById('celular').value;
    obj.curso_id = document.getElementById('curso').value;

    removeAlertas();

    $.ajax({
        type: "POST",
        url: "./Services/AlunoService/createAluno.php",
        dataType: "html",
        async: true,
        timeout: 30000,
        data: {data: JSON.stringify(obj)},
        success: function (response) {
            //vai rodar aqui se der certo
//            console.log(response);
            $('#alerta_sucesso').addClass('show');

            read();
        },
        error: function (error) {
            //roda aqui se der errado
//            console.log(error);
            document.getElementById('alerta_erro').innerHTML = error.responseText;
            $('#alerta_erro').addClass('show');

        },
        complete: function () {
            $('#modal').modal('hide');
            removeAlertas();
        }
    });


}

//update
function update() {
    let obj = {};
    obj.nome = document.getElementById('nome').value;
    obj.data_nascimento = document.getElementById('data_nascimento').value;
    obj.cpf = document.getElementById('cpf').value;
    obj.telefone = document.getElementById('telefone').value;
    obj.celular = document.getElementById('celular').value;
    obj.curso_id = document.getElementById('curso').value;

    obj.id = editing_id;

    removeAlertas();

    $.ajax({
        type: "POST",
        url: "./Services/AlunoService/updateAluno.php",
        dataType: "html",
        async: true,
        timeout: 30000,
        data: {data: JSON.stringify(obj)},
        success: function (response) {
            //vai rodar aqui se der certo
//            console.log(response);
            $('#alerta_sucesso').addClass('show');

            read();
        },
        error: function (error) {
            //roda aqui se der errado
//            console.log(error);
            document.getElementById('alerta_erro').innerHTML = error.responseText;
            $('#alerta_erro').addClass('show');

        },
        complete: function () {
            $('#modal').modal('hide');
            removeAlertas();
        }
    });


}

function CarregarSelectCursos() {
    removeAlertas();
    $.ajax({
        type: "POST",
        url: "./Services/CursoService/readCurso.php",
        dataType: "html",
        async: true,
        timeout: 30000,
        data: {},
        success: function (response) {
            //vai rodar aqui se der certo
            //console.log(response);
            let dados = JSON.parse(response);
            let selectboxCurso = $('#curso');

            dados.forEach(function (object, key) {
                $('<option>').val(object.id).text(object.nome).appendTo(selectboxCurso);
            });

        },
        error: function (error) {

            console.log(error);
            document.getElementById('alerta_erro').innerHTML = error.responseText;
            $('#alerta_erro').addClass('show');
        },
        complete: function () {
            removeAlertas();
        }
    });
}

//delete
function deleta() {

    let obj = {};

    obj.id = editing_id;

    removeAlertas();



    $.ajax({
        type: "POST",
        url: "./Services/AlunoService/deleteAluno.php",
        dataType: "html",
        async: true,
        timeout: 30000,
        data: {data: JSON.stringify(obj)},
        success: function (response) {
            //vai rodar aqui se der certo
//            console.log(response);
            $('#alerta_sucesso').addClass('show');

            read();
        },
        error: function (error) {
            //roda aqui se der errado
            console.log(error);
            document.getElementById('alerta_erro').innerHTML = error.responseText;
            $('#alerta_erro').addClass('show');

        },
        complete: function () {
            $('#modal').modal('hide');
            removeAlertas();
        }
    });


}

//read
function read() {

    removeAlertas();

    $.ajax({
        type: "POST",
        url: "./Services/AlunoService/readAluno.php",
        dataType: "html",
        async: true,
        timeout: 30000,
        data: {},
        success: function (response) {
            //vai rodar aqui se der certo
            //console.log(response);
            let dados = JSON.parse(response);
            parseData(dados);
        },
        error: function (error) {
            //roda aqui se der errado
            document.getElementById('alerta_erro').innerHTML = error.responseText;
            $('#alerta_erro').addClass('show');

        },
        complete: function () {
            removeAlertas();
        }
    });


}

function FormataStringData(data) {
    var dia = data.split("/")[0];
    var mes = data.split("/")[1];
    var ano = data.split("/")[2];

    return ano + '-' + ("0" + mes).slice(-2) + '-' + ("0" + dia).slice(-2);
    // Utilizo o .slice(-2) para garantir o formato com 2 digitos.
}


//parse
function parseData(dados) {
    table.clear().draw();
    var lines = Array();
    dados.forEach(function (object, key) {
        lines[key] = [object.curso_id.trim(), object.id.trim(), object.nome.trim(), object.data_nascimento.trim(), object.cpf.trim(), object.telefone.trim(), object.celular.trim(), object.curso_nome.trim(), object.data_cadastro.trim(), '<img title="editar" src="./img/edit.png" onclick="edit_it(this)" class="img_table"> &nbsp; <img title="remover" src="./img/remove.png" onclick="delete_it(this)" class="img_table">'];
    });
    table.rows.add(lines).draw(false);
    table.columns.adjust().responsive.recalc();
}