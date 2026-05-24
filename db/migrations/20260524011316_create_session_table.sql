-- migrate:up
CREATE TABLE "session" (
  "sid"    VARCHAR   NOT NULL COLLATE "default", 
  /*
  COLLATE -> indica un conjunto de reglas (caracteres) o formato 
  para el tipo de dato,ordenacion y comparación
  */
  "sess"   JSON      NOT NULL,
  "expire" TIMESTAMP NOT NULL
);
 
ALTER TABLE "session"
  ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid")
  NOT DEFERRABLE INITIALLY IMMEDIATE;
  /*
  NOT DEFERRABLE INITIALLY IMMEDIATE -> 
  indica que la validacion de restriccion es fila por fila (para validar unicidad)
  */
 
CREATE INDEX "IDX_session_expire" ON "session" ("expire");
/*
 facilita la busqueda de registro de sessiones al termininar una fila
*/
 
-- migrate:down
DROP TABLE "session";
