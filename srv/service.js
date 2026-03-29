module.exports = (srv) => {
    
    // 'on' escuta a chamada da função 'filtroMateriais'
    srv.on('filtroMateriais', async (req) => {
        // Pega o número que o usuário enviou na requisição
        const quantidade = req.data.quantidade;

        // Validação básica de segurança
        if (!quantidade || quantidade <= 0) {
            return req.error(400, "A quantidade deve ser maior que zero.");
        }

        // Executa uma query no banco limitando pela quantidade desejada
        // O SELECT.from é uma funcionalidade nativa do CAP (CQN)
        const materiaisFiltrados = await SELECT.from('MaterialService.Materiais').limit(quantidade);

        // Retorna o resultado
        return materiaisFiltrados;
    });

};