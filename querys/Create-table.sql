-- Creación de la tabla Usuario
CREATE TABLE Usuarios (
  id SERIAL PRIMARY KEY,
  Nombre VARCHAR(255) NOT NULL,
  Reservar BOOLEAN NOT NULL,
  VerReservas BOOLEAN NOT NULL,
  Correo VARCHAR(255) NOT NULL,
  Contraseña VARCHAR(255) NOT NULL
);

-- Creación de la tabla Habitación
CREATE TABLE Habitacion (
  id SERIAL PRIMARY KEY,
  Vista_a VARCHAR(255) NOT NULL,
  Precio DECIMAL(10, 2) NOT NULL,
  tipo_habitacion VARCHAR(255) NOT NULL
);

-- Creación de la tabla Reserva
CREATE TABLE Reserva (
  id SERIAL PRIMARY KEY,
  Fecha_entrada DATE NOT NULL,
  Fecha_salida DATE NOT NULL,
  Personas INT NOT NULL,
  Fecha_reserva DATE NOT NULL,
  habitacion_id INT NOT NULL,
  usuario_id INT NOT NULL,
  FOREIGN KEY (habitacion_id) REFERENCES Habitación (id),
  FOREIGN KEY (usuario_id) REFERENCES Usuarios (id)
);
