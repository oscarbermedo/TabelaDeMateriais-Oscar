using app.materiais from '../db/schema';

service MaterialService {
    entity Materiais as projection on materiais.Material;

    // Declaração da nova função
    function filtroMateriais(quantidade: Integer) returns array of Materiais;

    // Nova Ação para inserir materiais
    action adicionarMaterial(NumMat: Integer, Nome: String(100), Descr: String(255)) returns String;

}