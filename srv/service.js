const cds = require('@sap/cds');
const { SELECT } = require('@sap/cds/lib/ql/cds-ql');

module.exports = cds.service.impl(async function () {
    
    // Acessamos as entidades através do 'this' em vez de 'srv'
    const { Materiais } = this.entities;

    // --- FUNÇÃO: FILTRO DE MATERIAIS ---
    this.on('filtroMateriais', async (req) => {
        const quantidade = req.data.quantidade;

        if (!quantidade || quantidade <= 0) {
            return req.error(400, "A quantidade deve ser maior que zero.");
        }

        // Usamos o SELECT que foi importado no topo do arquivo
        const todosMateriais = await SELECT.from(Materiais) ;

        if (quantidade > todosMateriais.length) {
            return req.error(400, `Temos apenas ${todosMateriais.length} materiais cadastrados. Por favor, escolha um número menor.`);
        }

        const materiaisEmbaralhados = todosMateriais.sort(() => 0.5 - Math.random());
        const materiaisAleatorios = materiaisEmbaralhados.slice(0, quantidade);

        return materiaisAleatorios;
    });

    // --- AÇÃO: ADICIONAR MATERIAL ---
    this.on('adicionarMaterial', async (req) => {
        const { NumMat, Nome, Descr } = req.data;

        // 1. Validar campos obrigatórios
        if (!NumMat || !Nome || !Descr) {
            return req.error(400, "Erro: Os campos NumMat, Nome e Descr são obrigatórios.");
        }

        // 2. Validar se o material já existe
        const materialExistente = await SELECT.one.from(Materiais).where({ NumMat: NumMat });
        if (materialExistente) {
            return req.error(400, `Erro: O material com Número ${NumMat} já está cadastrado no sistema.`);
        }

        // 3. Calcular próximo ID
        const ultimoMaterial = await SELECT.one.from(Materiais).columns('ID').orderBy('ID desc');
        const proximoID = ultimoMaterial ? (ultimoMaterial.ID + 1) : 1;

        // 4. Inserir novo material
        // O INSERT faz parte do escopo global do CAP, assim como o SELECT, mas pode ser usado diretamente
        await INSERT.into(Materiais).entries({
            ID: proximoID,
            NumMat: NumMat,
            Nome: Nome,
            Descr: Descr
        });

        // 5. Retornar mensagem
        return `Sucesso: Material '${Nome}' cadastrado com o ID sequencial ${proximoID}.`;
    });

});