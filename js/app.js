var fTotalTarefas = 0;
var fTotalTarefasConcluidas = 0;
var fHojeBruto = new Date();
var fHoje = new Date(fHojeBruto.getMonth() , fHojeBruto.getDay(), fHojeBruto.getYear(), fHojeBruto.getHours(), fHojeBruto.getMinutes());

var fTinfra = 0;
var fTinterno = 0;

var fAtual    = new Date();
var fContador = 0;
var fAtra = 0;
var fAnda = 0;

//INI - Funções Auxiliares

function validaUsr(vUsr, vSenha){

    if(vUsr == "m" && vSenha == "1"){
a
        return "hmjeh";

    }else{

        if(vUsr == "h" && vSenha == "1"){

            return "hori";

        }else{

            if(vUsr == "p" && vSenha == "1"){

                return "pronto";

            }else{

                if(vUsr == "psa" && vSenha == "1"){

                    return "psa";

                }else{
                    alert("Arquivo não encontrado");
                    location.href="index.html";

                }
            }
        }
    }

}

function ajax(){

    $.ajax({
      url: 'developer.html',
      cache: false,
      data: {
         format: 'html'
      },
      error: function() {
         $('#info').html('<p>An error has occurred</p>');
      },
      dataType: 'html',
      success: function(data) {
         $("#txtConteudo").before(data);
         //extraiScript(data);
      },
      type: 'POST'
   });

}

$("#btnLogar").click(function(){

    var fUsr   = String( document.getElementById("txtUsr").value );
    var fSenha = String( document.getElementById("txtSenha").value );

    if(fUsr.length > 0 && fSenha.length > 0 ){

        var fUnidade = validaUsr(fUsr,fSenha);
        if(fUnidade != "F"){

            $("#login").hide();
            $("#principal").show();
            $(".item").hide();

            var fDados = fUnidade+".json";

            montaTarefas(fDados,"tarefas",fUnidade);
                setTimeout(function(){
                //$(".well").hide();
            },2000)

        }

    }

});

function getDiaSemana(vIndice){

    if(vIndice == 0){
        return "Dom";
    }else{
        if(vIndice == 1){
            return "Seg";
        }else{
            if(vIndice == 2){
                return "Ter";
            }else{
                if(vIndice == 3){
                    return "Quar";
                }else{
                    if(vIndice == 4){
                        return "Quin";
                    }else{
                        if(vIndice == 5){
                            return "Sex";
                        }else{
                            if(vIndice == 6){
                                return "Sab";
                            }else{
                                return "";
                            }
                        }
                    }
                }
            }
        }
    }

}

function formataData(vData){

    if(vData.length == 0){

        return "";

    }else{

        var fResultado = "";

        var dtInicio = vData.substring(0,10).split("/");
        var fHInicio = vData.substring(11,16).split(":");

        var data1 = new Date(dtInicio[2] , ( parseInt( dtInicio[1] ) -1 ), dtInicio[0], fHInicio[0], fHInicio[1]);

        var fDiaSemana = getDiaSemana(data1.getDay());

        return vData+" "+fDiaSemana;

    }

}

function dDatas(vData1, vData2, vConcluido){

    if(vData1.length == 0 || vData2.length == 0 ){

        return "";

    }else{

        var fResultado = "";

        var dtInicio = vData1.substring(0,10).split("/");
        var dtFim    = vData2.substring(0,10).split("/");

        var fHInicio = vData1.substring(11,16).split(":");
        var fHFim    = vData2.substring(11,16).split(":");

        var data1 = new Date(dtInicio[2] , ( parseInt( dtInicio[1] ) -1 ), dtInicio[0], fHInicio[0], fHInicio[1]);
        var data2 = new Date(dtFim[2] , ( parseInt( dtFim[1] ) -1), dtFim[0], fHFim[0], fHFim[1]);

        var fDias    = data2.getDate() - data1.getDate();
        var fHoras   = data2.getHours() - data1.getHours();
        var fMinutos = data2.getMinutes() - data1.getMinutes();

        if(fHoras < 0){

            if(fDias > 1){
                fDias = fDias - 1;
            }else{
                fDias = 0;
            }

            fHoras = 24 - (fHoras * -1);

        }

        if(fMinutos < 0 ){
            if(fHoras > 1){
                fHoras = fHoras - 1;
            }else{
                fHoras = 0;
            }

            fMinutos = 60 - (fMinutos * -1);

        }

        if(vConcluido == "SIM"){

            fTotalTarefasConcluidas += 1;

        }

        fTotalTarefas += 1;

        if(fAtual > data1 && fAtual < data2 && vConcluido == "NÃO" ){
            fResultado = "<span class=\"label label-warning\">"+fDias+"d "+fHoras+"h "+fMinutos+"m</span>";
            fAnda = fAnda + 1;
        }else{

            if(fAtual > data2 && vConcluido == "NÃO" ){

                fResultado = "<span class=\"label label-danger\">"+fDias+"d "+fHoras+"h "+fMinutos+"m</span>";
                fAtra = fAtra + 1;
            }else{

                fResultado = fDias+"d "+fHoras+"h "+fMinutos+"m";
            }
        };

        return fResultado;
    }


};

function Grade(){

    console.log("entrando na grade");

    $('#tbProjetos tbody').on('click', 'tr', function () {

        console.log("Primeira ="+ $('th', this).eq(0).text());

    } );


};

function btnDetalhes(vComp){

    var fProjeto = String(vComp.innerHTML).replace( /\s/g, '' );

    if( $("#"+fProjeto).is(":visible") ) {

        // está visível, faça algo
        $("#txtResumo").show(800);
        $("#"+fProjeto).hide(800);

    } else {
        // não está visível, faça algo
        $("#txtResumo").hide(800);
        $("#"+fProjeto).show(800);
    }



    console.log(fProjeto);

}

//FIM Funções Auxiliares

function montaTarefas(vDados,vComp, vUnidade){

    var fStatus = "";
    var fStatusResumo = "";
    var fContaInfra = 0;
    var fContaInter = 0;

    $.ajax({

        url : vDados,
        dataType : "json",
        cache:false,
        success : function(data){
                    // Funcionário
            for(var i = 0; i<data.length;i++){

                var fconcluido = 0;
                var fpercent   = 0;
                var fFuncionario = data[i].funcionario;

                $( "#"+vComp ).before("<div>");
                $( "#"+vComp ).before("<div><img src=\"img/"+vUnidade+".png\" width=\"60px\" class=\"img-circle\">");
                $( "#"+vComp ).before("<h1>"+fFuncionario+"<div id='txtProgressoGeral'></div></h1></div>");
                $( "#"+vComp ).before("<div id='txtResumo'>"
                                        +"<table id='tbProjetos' class=\"table\">"
                                            +"<thead>"
                                                +"<tr>"
                                                    +"<th>Projeto</td>"
                                                    +"<th>Concluido</td>"
                                                    +"<th>Data Início</td>"
                                                    +"<th>Data Fim</td>"
                                                    +"<th>Status</td>"
                                                +"</tr>"
                                            +"</thdead><tbody></tbody>"
                                        +"</div>");

                // Nas Pendenctamplate bootstrapsias
               for(var p = 0; p < data[i].pendencias.length; p++){

                    var fArraydatasIni = [];
                    var fArraydatasFim = [];

                    var fpendencia = data[i].pendencias[p].pendencia;

                    // Nas tarefas
                    var ftaredas = "<table class=\"table\"><thead><tr><td>Concluído</td><td>Sub.Tarefa</td><td>Data Início</td><td>Data Fim</td><td>Tempo</td><td>Status</td></thdead><tbody>";
                    for(var t = 0; t < data[i].pendencias[p].tarefas.length ; t++){

                        //Verificando status
                        if(data[i].pendencias[p].tarefas[t].pronto == "SIM"){

                            fStatus += "<span class='label label-prontoini'>...</span>   ";

                        }
                        if(data[i].pendencias[p].tarefas[t].infra == "SIM"){

                            fStatusResumo += "<span class='label label-default'>...</span>   "
                            fStatus += "<span class='label label-default'>...</span>   ";

                        }
                        if(data[i].pendencias[p].tarefas[t].interno == "SIM"){

                            fStatusResumo += "<span class='label label-info'>...</span>   "
                            fStatus += "<span class='label label-info'>...</span>";

                        }
                        if(data[i].pendencias[p].tarefas[t].concluido == "SIM"){

                            fStatus += "<span class='label label-success'>...</span>   ";
                            fconcluido = fconcluido+1;
                        }

                        //Verificando datas
                        if(data[i].pendencias[p].tarefas[t].datainicio == undefined){
                            var fDataInicio = "";
                        }
                        else{
                            var fDataInicio = data[i].pendencias[p].tarefas[t].datainicio;
                        }

                        if(data[i].pendencias[p].tarefas[t].datafim == undefined){

                            var fDataFim = "";
                        }
                        else{
                            var fDataFim = data[i].pendencias[p].tarefas[t].datafim;
                        }

                        fArraydatasIni[t] = fDataInicio;
                        fArraydatasFim[t] = fDataFim;
                        var fComp = String(data[i].pendencias[p].tarefas[t].sub).replace(" ","");
                        fComp = "txt"+fComp.replace(" ","");

                        if(data[i].pendencias[p].tarefas[t].descricao != null){

                            ftaredas += "<tr><td>"+data[i].pendencias[p].tarefas[t].concluido+"</td><td>"+data[i].pendencias[p].tarefas[t].sub+" <span class=\"label label-info\">Nota</span><br><br><div id='"+fComp+"' class='well'>"+data[i].pendencias[p].tarefas[t].descricao+"</div></td><td>"+formataData(fDataInicio)+"</td><td>"+formataData(fDataFim)+"</td><td>"+(dDatas(fDataInicio,fDataFim,data[i].pendencias[p].tarefas[t].concluido))+"</td><td>"+fStatus+"</td></tr>";

                        }else{

                            ftaredas += "<tr><td>"+data[i].pendencias[p].tarefas[t].concluido+"</td><td>"+data[i].pendencias[p].tarefas[t].sub+"</td><td>"+formataData(fDataInicio)+"</td><td>"+formataData(fDataFim)+"</td><td>"+(dDatas(fDataInicio,fDataFim,data[i].pendencias[p].tarefas[t].concluido))+"</td><td>"+fStatus+"</td></tr>";

                        }

                        fStatus = "";
                    }

                    ftaredas = ftaredas+"</tbody></table>";

                    var fFinalizado = "";

                    if(fconcluido > 0){

                        var total = data[i].pendencias[p].tarefas.length;
                        var denomindador = total /fconcluido;

                        fpercent = 100 / denomindador;

                        var fUltimoIndice = (fArraydatasIni.length - 1);

                        if(fpercent == 100){

                            fFinalizado = "<span class=\"label label-success\">Finalizado</span><h5>"+fArraydatasIni[0] +" - "+fArraydatasFim[fUltimoIndice]+"<h5><h6>"+dDatas(fArraydatasIni[0],fArraydatasFim[fUltimoIndice])+"</h6>";
                        }

                        fconcluido = 0;
                    }

                    var fTempo = fHoje - fArraydatasIni[0];

                    $( "#txtResumo table" ).append("<tr><th><h4 onclick='btnDetalhes(this);'>"+fpendencia+"</h4></th><th><div class=\"progress\"><div class=\"progress-bar progress-bar-striped active\" role=\"progressbar\" aria-valuenow=\"60\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: "+ Math.ceil( fpercent ) +"%\">"+ Math.ceil( fpercent ) +"%</div></div></th><th>"+ fArraydatasIni[0] +"</th><th>"+fArraydatasFim[fUltimoIndice]+"</th><th>"+fStatusResumo+"</th></tr>");
                    fStatusResumo = "";
                    fContaInfra = 0;

                    var fTarefaAtual =   fpendencia.replace( /\s/g, '' );

                    $( "#"+vComp ).before("<div id='"+ fTarefaAtual +"' class='item' ></div>");
                    $( "#"+fTarefaAtual ).append("---------------------------------------------------------------------------------------------------");
                    $( "#"+fTarefaAtual ).append("<h4 onclick='btnDetalhes(this);'>"+fpendencia+"</h4>");
                    $( "#"+fTarefaAtual ).append(fFinalizado);
                    $( "#"+fTarefaAtual ).append( "<div class=\"progress\"><div class=\"progress-bar progress-bar-striped active\" role=\"progressbar\" aria-valuenow=\"60\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: "+ Math.ceil( fpercent ) +"%\">"+ Math.ceil( fpercent ) +"%</div></div>" );
                    $( "#"+fTarefaAtual ).append( ftaredas );
                    $( "#"+fTarefaAtual ).hide();
                    $( "#"+vComp ).before("</div>");
                    fpercent = 0;
                    ftaredas = "";

                }
                //Mostrando
                $('#txtValorAtra').text(fAtra);
                $('#txtValorAnda').text(fAnda);
            }
            var fpercentGeral = 100 / (fTotalTarefas / fTotalTarefasConcluidas);
            $( "#txtProgressoGeral" ).before( "<div class=\"progress\"><div class=\"progress-bar progress-bar-success active\" role=\"progressbar\" aria-valuenow=\"60\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: "+ Math.ceil( fpercentGeral )+"%\">"+Math.ceil( fpercentGeral )+"%</div></div>" );
        }
        }
      )
    Grade();
};

function aoEntrar(){

    $("#principal").hide();
}
