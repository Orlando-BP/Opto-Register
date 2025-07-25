-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 25, 2025 at 09:05 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `optica_barba_bd`
--

-- --------------------------------------------------------

--
-- Table structure for table `clientes`
--

CREATE TABLE `clientes` (
  `id_cliente` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `domicilio` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `correos`
--

CREATE TABLE `correos` (
  `id_correo` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `mensaje` text NOT NULL,
  `fecha_envio` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `correos`
--

INSERT INTO `correos` (`id_correo`, `nombre`, `email`, `mensaje`, `fecha_envio`) VALUES
(1, 'Marco', 'darkness0928.sm@gmail.com', 'Ci', '2025-07-19 19:49:28');

-- --------------------------------------------------------

--
-- Table structure for table `graduaciones`
--

CREATE TABLE `graduaciones` (
  `id_graduacion` int(11) NOT NULL,
  `id_nota` int(11) DEFAULT NULL,
  `ojo` enum('OD','OI') NOT NULL,
  `distancia` enum('Lejos','Cerca') NOT NULL,
  `esf` decimal(4,2) DEFAULT NULL,
  `cil` decimal(4,2) DEFAULT NULL,
  `eje` int(11) DEFAULT NULL,
  `dp` int(11) DEFAULT NULL,
  `o` varchar(10) DEFAULT NULL,
  `fecha_registro` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `notas_venta`
--

CREATE TABLE `notas_venta` (
  `id_nota` int(11) NOT NULL,
  `id_cliente` int(11) DEFAULT NULL,
  `fecha_expedicion` date NOT NULL,
  `fecha_entrega` date DEFAULT NULL,
  `precio_total` decimal(10,2) NOT NULL,
  `anticipo` decimal(10,2) NOT NULL,
  `resta` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `productos`
--

CREATE TABLE `productos` (
  `id_producto` int(11) NOT NULL,
  `id_nota` int(11) DEFAULT NULL,
  `tipo` varchar(50) NOT NULL,
  `material` varchar(50) DEFAULT NULL,
  `armazon` varchar(50) DEFAULT NULL,
  `color` varchar(30) DEFAULT NULL,
  `tamano` varchar(20) DEFAULT NULL,
  `observaciones` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `productos_vista`
--

CREATE TABLE `productos_vista` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `precio` decimal(10,2) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `img` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `productos_vista`
--

INSERT INTO `productos_vista` (`id`, `nombre`, `precio`, `descripcion`, `img`) VALUES
(1, 'Lentes de Sol', 500.00, 'Protege tus ojos con estilo. Disponibles en varios diseños.', '../images/lentes1.jpg'),
(2, 'Lentes Graduados', 1200.00, 'Corrección visual con monturas modernas.', '../images/lentes2.png'),
(3, 'Lentes de Contacto', 800.00, 'Variedad de lentes de contacto para diferentes necesidades.', '../images/lentes3.webp'),
(4, 'Ci', 69420.00, 'Ci', '../images/opticas1.jpg');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `clientes`
--
ALTER TABLE `clientes`
  ADD PRIMARY KEY (`id_cliente`);

--
-- Indexes for table `correos`
--
ALTER TABLE `correos`
  ADD PRIMARY KEY (`id_correo`);

--
-- Indexes for table `graduaciones`
--
ALTER TABLE `graduaciones`
  ADD PRIMARY KEY (`id_graduacion`),
  ADD KEY `id_nota` (`id_nota`);

--
-- Indexes for table `notas_venta`
--
ALTER TABLE `notas_venta`
  ADD PRIMARY KEY (`id_nota`),
  ADD KEY `id_cliente` (`id_cliente`);

--
-- Indexes for table `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`id_producto`),
  ADD KEY `id_nota` (`id_nota`);

--
-- Indexes for table `productos_vista`
--
ALTER TABLE `productos_vista`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `clientes`
--
ALTER TABLE `clientes`
  MODIFY `id_cliente` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `correos`
--
ALTER TABLE `correos`
  MODIFY `id_correo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `graduaciones`
--
ALTER TABLE `graduaciones`
  MODIFY `id_graduacion` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `notas_venta`
--
ALTER TABLE `notas_venta`
  MODIFY `id_nota` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `productos`
--
ALTER TABLE `productos`
  MODIFY `id_producto` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `productos_vista`
--
ALTER TABLE `productos_vista`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `graduaciones`
--
ALTER TABLE `graduaciones`
  ADD CONSTRAINT `graduaciones_ibfk_1` FOREIGN KEY (`id_nota`) REFERENCES `notas_venta` (`id_nota`) ON DELETE CASCADE;

--
-- Constraints for table `notas_venta`
--
ALTER TABLE `notas_venta`
  ADD CONSTRAINT `notas_venta_ibfk_1` FOREIGN KEY (`id_cliente`) REFERENCES `clientes` (`id_cliente`) ON DELETE SET NULL;

--
-- Constraints for table `productos`
--
ALTER TABLE `productos`
  ADD CONSTRAINT `productos_ibfk_1` FOREIGN KEY (`id_nota`) REFERENCES `notas_venta` (`id_nota`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
