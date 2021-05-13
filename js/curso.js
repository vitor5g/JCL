//required("./jquery.validate");

var table;
var edit = false;
var editing_id;

$().ready(async function() {

    table = $('#my_table').DataTable({
        "columnDefs": [
            { "targets": [0], "visible": false },
            { "targets": [0], "ordenable": false },
            { "targets": [0], "searchable": false },
            { "targets": 1, "responsivePriority": 1 },
            { "targets": 1, "responsivePriority": 2 },
            { "targets": [1], "className": "text-center" },
            { "targets": [1], "className": "text-center text-nowrap" },
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
    $("#modalFormCurso").validate({
        rules: {
            nome: {
                required: true
            },
        },
        messages: {
            nome: {
                required: "<span style='color:red;'>Preencha este campo</span>"
            }
        },
        submitHandler: function(form) {
            save_it();
        }
    });
    read();

});



function add() {
    $("#modalFormCurso").validate().resetForm();
    edit = false; // seta o flag para criação
    limpaModal(); //limpa o modal
    removeAlertas(); //remove os alertas
    $('#modal').modal(); //mostra o modal
}

function limpaModal() {
    document.getElementById('nome').value = ''; //seta o valor do campo nome para ''
}

function removeAlertas() {
    window.setTimeout(function() { //seta um timer para rodar depois de 3 segundos
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
    //console.log(data);
    document.getElementById('nome').value = data[1];
    editing_id = data[0];
    $('#modal').modal();
}

function delete_it(caller) {
     //cria variavel data e armazena nela o conteudo pega naquela tr(linha) vetor de elementos
     let data = table.row($(caller).closest('tr')).data();
     //a variavel recebe o elemento que esta na posição 0 que é o id 
     editing_id = data[0];
     //chama bootbox
     bootbox.confirm({
         title: "Excluir?",
         message: "Deseja realmente excluir esse curso?",
         className: 'bounceIn animated',
         buttons:{
             confirm:{
                 label:'Sim',
                 className: 'btn-danger'
             },
             cancel:{
                 label: 'Não',
                 className: 'btn-secondary'
             }
             
         },
 
         callback: function (result){
             //console.log('O valor selecionado foi : ' + result);
             //se o usuario clicar sim entra aqui
             if(result){
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

    removeAlertas();
    $.ajax({

        type: "POST",
        url: "./Services/CursoService/createCurso.php",
        dataType: "html",
        async: true,
        timeout: 30000,
        data: { data: JSON.stringify(obj) },
        success: function(response) {
            //vai rodar aqui se der certo
            console.log(response);
            $('#alerta_sucesso').addClass('show');
            read();
        },
        error: function(error) {
            //roda aqui se der errado
            console.log(error);
            document.getElementById('alerta_erro').innerHTML = error.responseText;
            $('#alerta_erro').addClass('show');
        },
        complete: function() {
            $('#modal').modal('hide');
            removeAlertas();
        }
    });
}

//update
function update() {
    let obj = {};
    obj.nome = document.getElementById('nome').value;
    obj.id = editing_id;
    removeAlertas();
    $.ajax({
        type: "POST",
        url: "./Services/CursoService/updateCurso.php",
        dataType: "html",
        async: true,
        timeout: 30000,
        data: { data: JSON.stringify(obj) },
        success: function(response) {
            //vai rodar aqui se der certo
            console.log(response);
            $('#alerta_sucesso').addClass('show');
            read();
        },
        error: function(error) {
            //roda aqui se der errado
            console.log(error);
            document.getElementById('alerta_erro').innerHTML = error.responseText;
            $('#alerta_erro').addClass('show');
        },
        complete: function() {
            $('#modal').modal('hide');
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
        url: "./Services/CursoService/deleteCurso.php",
        dataType: "html",
        async: true,
        timeout: 30000,
        data: { data: JSON.stringify(obj) },
        success: function(response) {
            //vai rodar aqui se der certo
            console.log(response);
            $('#alerta_sucesso').addClass('show');
            read();
        },
        error: function(error) {
            //roda aqui se der errado
            console.log(error);
            document.getElementById('alerta_erro').innerHTML = error.responseText;
            $('#alerta_erro').addClass('show');
        },
        complete: function() {
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
        url: "./Services/CursoService/readCurso.php",
        dataType: "html",
        async: true,
        timeout: 30000,
        data: {},
        success: function(response) {
            //vai rodar aqui se der certo
            //console.log(response);
            let dados = JSON.parse(response);
            parseData(dados);
            console.log(dados)
        },
        error: function(error) {
            //roda aqui se der errado
            console.log(error);
            document.getElementById('alerta_erro').innerHTML = error.responseText;
            $('#alerta_erro').addClass('show');
        },
        complete: function() {
            removeAlertas();
        }
    });
}



//parse
function parseData(dados) {
    table.clear().draw();
    var lines = Array();
    dados.forEach(function(object, key) {
        lines[key] = [object.id, object.nome, '<img title="editar" src="./img/edit.png" onclick="edit_it(this)" class="img_table"> &nbsp;'];
    });
    table.columns.adjust().responsive.recalc();
    table.rows.add(lines).draw(false);
}