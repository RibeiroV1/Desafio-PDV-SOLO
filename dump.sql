create table usuarios(
  id serial primary key,
  nome text not null,
  email text unique,
  senha text
  );

create table produtos (
  id serial primary key,
  descricao text,
  valor int,
  produto_imagem text
  );

create table pedidos (
  id serial primary key,
  data TIMESTAMP DEFAULT Now(),
  valor_total int
  );

create table  pedido_produtos(
    id serial primary KEY,
    pedido_id int REFERENCES pedidos(id),
    produto_id int REFERENCES produtos(id),
    quantidade_produto int
    );
