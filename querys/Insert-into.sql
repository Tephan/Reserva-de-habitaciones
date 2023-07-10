-- Insertar datos en la tabla Usuario
INSERT INTO usuarios (nombre, reservar, verReservas, correo, contraseña)
VALUES
    ('Juan Diaz', true, false, 'CARDOSO201641@hotmal.com', '12345'),
    ('Pamela Rivera', false, true, 'tephanrp@gmail.com', '12345');

-- Insertar datos en la tabla Habitación
INSERT INTO habitacion (vista_a, precio, tipo_habitacion)
VALUES
    ('Vista al mar', 1500, 'Estándar'),
    ('Vista a la alberca', 2000, 'Familiar');

-- Insertar datos en la tabla Reserva
INSERT INTO reserva (fecha_entrada, fecha_salida, personas, fecha_reserva, habitacion_id, usuario_id)
VALUES
    ('2023-08-10', '2023-08-15', 2, '2023-07-01', 1, 1),
    ('2023-09-05', '2023-09-12', 4, '2023-07-02', 2, 2);

