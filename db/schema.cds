namespace app.materiais;

entity Material {
    key ID     : Integer;
    key NumMat : Integer;
    Nome       : String(100);
    Descr      : String(255);
}