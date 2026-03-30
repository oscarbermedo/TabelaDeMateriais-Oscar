sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel" // Importação necessária para usar a Model
],
function (Controller, JSONModel) {
    "use strict";

    return Controller.extend("tabelamateriais.controller.View1", {

        onInit: function () {
            // 1. Dentro do onInit, cria a rota que chamará o handler
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("RouteView1").attachPatternMatched(this._routeHandler, this);
        },

        // 2. Crie um handler...
        _routeHandler: function (oEvent) {
            // ...e dentro dele crie uma função que irá cadastrar a Model na página
            this._cadastrarModel();
            
            // ...e outra função que irá carregar dados da tabela, na model
            this._carregarDadosIniciais();
        },

        _cadastrarModel: function () {
            // Na Model, define a entidade tableMaterial (inicialmente vazia)
            var oModel = new JSONModel({
                tableMaterial: []
            });
            // Cadastra a Model na página (View) para que a tabela XML consiga enxergar
            this.getView().setModel(oModel);
        },

_carregarDadosIniciais: function () {
            // Pega a model que já foi cadastrada na tela
            var oModel = this.getView().getModel();
            var that = this; // Salva o contexto do controller para usar dentro da Promise

            // Faz uma chamada HTTP GET para a URL do seu serviço CAP
            fetch("/odata/v4/material/Materiais")
                .then(function (response) {
                    if (!response.ok) {
                        throw new Error("Falha ao comunicar com o servidor CAP.");
                    }
                    return response.json(); // Converte a resposta do servidor para JSON
                })
                .then(function (oDadosDoServidor) {
                    // O protocolo OData sempre devolve os resultados dentro de uma lista chamada "value"
                    var aMateriais = oDadosDoServidor.value;

                    // Atualiza a model com os dados reais vindos do banco
                    oModel.setProperty("/tableMaterial", aMateriais);
                    
                    sap.m.MessageToast.show("Dados carregados com sucesso!");
                })
                .catch(function (error) {
                    // Se o servidor estiver fora do ar ou der erro, avisa o usuário
                    sap.m.MessageToast.show("Erro ao carregar materiais: " + error.message);
                });
        },

onFiltrar: function () {
            // 1. Pega as referências da View e da Model
            var oView = this.getView();
            var oModel = oView.getModel();

            // 2. Resgata o valor digitado no campo Input
            var sValor = this.byId("inputFiltro").getValue();
            var iQuantidade = parseInt(sValor, 10);

            // 3. Validação 
            if (!sValor || isNaN(iQuantidade) || iQuantidade <= 0) {
                sap.m.MessageToast.show("Por favor, digite uma quantidade válida maior que zero.");
                return; // Interrompe a execução
            }

            // 4. Monta a URL chamando a Função do CAP passando o parâmetro
            // OData v4 exige que os parâmetros da function fiquem entre parênteses
            var sUrl = "/odata/v4/material/filtroMateriais(quantidade=" + iQuantidade + ")";

            // 5. Faz a requisição HTTP (GET) para o servidor
            fetch(sUrl)
                .then(function (response) {
                    if (!response.ok) {
                        // Se o CAP retornar um erro (ex: pediu mais materiais do que existe), 
                        // extraímos a mensagem exata que escrevemos lá no service.js
                        return response.json().then(function(errData) {
                            throw new Error(errData.error ? errData.error.message : "Erro ao filtrar.");
                        });
                    }
                    return response.json();
                })
                .then(function (oDadosDoServidor) {
                    // A resposta da function vem dentro da propriedade 'value'
                    var aMateriaisFiltrados = oDadosDoServidor.value;

                    // Substitui os dados antigos da Model pelos novos
                    oModel.setProperty("/tableMaterial", aMateriaisFiltrados);
                    
                    sap.m.MessageToast.show("Filtro aplicado: " + aMateriaisFiltrados.length + " materiais exibidos.");
                })
                .catch(function (error) {
                    // Mostra na tela o erro (ex: "Temos apenas 10 materiais...")
                    sap.m.MessageToast.show(error.message);
                });
        }

    });
});