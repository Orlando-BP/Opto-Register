CREATE DATABASE optica_barba_bd CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE Clientes (
    id_cliente INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    correo VARCHAR(100),
    domicilio TEXT
);

CREATE TABLE Notas_Venta (
    id_nota INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT,
    fecha_expedicion DATE NOT NULL,
    fecha_entrega DATE,
    precio_total DECIMAL(10,2) NOT NULL,
    anticipo DECIMAL(10,2) NOT NULL,
    resta DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (id_cliente) REFERENCES Clientes(id_cliente) ON DELETE SET NULL
);

CREATE TABLE Graduaciones (
    id_graduacion INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT,
    edad INT,
    right_SP DECIMAL(4,2),
    right_CYL DECIMAL(4,2),
    right_Axis INT,
    left_SP DECIMAL(4,2),
    left_CYL DECIMAL(4,2),
    left_Axis INT,
    fecha_registro DATE NOT NULL,
    FOREIGN KEY (id_cliente) REFERENCES Clientes(id_cliente) ON DELETE SET NULL
);

CREATE TABLE Productos (
    id_producto INT AUTO_INCREMENT PRIMARY KEY,
    id_nota INT,
    tipo VARCHAR(50) NOT NULL,
    material VARCHAR(50),
    armazon VARCHAR(50),
    color VARCHAR(30),
    tamano VARCHAR(20),
    observaciones TEXT,
    FOREIGN KEY (id_nota) REFERENCES Notas_Venta(id_nota) ON DELETE CASCADE
);