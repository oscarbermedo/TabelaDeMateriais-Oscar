using app.materiais from '../db/schema';

service MaterialService {
    entity Materiais as projection on materiais.Material;
}