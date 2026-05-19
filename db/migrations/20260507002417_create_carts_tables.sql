-- migrate:up
CREATE TABLE carts(
  id SERIAL PRIMARY KEY,
  create_at TIMESTAMP NOT NULL DEFAULT NOW(),
  update_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE TABLE cart_items(
  id SERIAL PRIMARY KEY,
  cart_id INTEGER NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
   -- ON DELETE CASCADE -> 
   /*
   si la tabla
   -- padre se elimina , todos sus registros de (tablas hijas) 
   -- referenciados a su id, se ELIMINARAN tambien
   */ 
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  -- ON DELETE RESTRICT -> 
  /*
   -- prohibe la eliminacion de la tabla padre o su id padre si 
   -- aun existen tablas hijos o id foraneas  dependientes de el
  */
  quantity INTEGER NOT NULL CHECK (quantity > 0), -- verifca que el dato cumpla la expresion ,si no no registra
  create_at TIMESTAMP NOT NULL DEFAULT NOW(),
  update_at TIMESTAMP NOT NULL DEFAULT NOW()
);
-- migrate:down
DROP TABLE cart_items;
DROP TABLE carts;