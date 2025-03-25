-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 25-03-2025 a las 02:46:38
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `optica_barba_bd`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clientes`
--

CREATE TABLE `clientes` (
  `id_cliente` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `domicilio` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `graduaciones`
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
-- Estructura de tabla para la tabla `notas_venta`
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
-- Estructura de tabla para la tabla `productos`
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

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `clientes`
--
ALTER TABLE `clientes`
  ADD PRIMARY KEY (`id_cliente`);

--
-- Indices de la tabla `graduaciones`
--
ALTER TABLE `graduaciones`
  ADD PRIMARY KEY (`id_graduacion`),
  ADD KEY `id_nota` (`id_nota`);

--
-- Indices de la tabla `notas_venta`
--
ALTER TABLE `notas_venta`
  ADD PRIMARY KEY (`id_nota`),
  ADD KEY `id_cliente` (`id_cliente`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`id_producto`),
  ADD KEY `id_nota` (`id_nota`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `clientes`
--
ALTER TABLE `clientes`
  MODIFY `id_cliente` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `graduaciones`
--
ALTER TABLE `graduaciones`
  MODIFY `id_graduacion` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `notas_venta`
--
ALTER TABLE `notas_venta`
  MODIFY `id_nota` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `id_producto` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `graduaciones`
--
ALTER TABLE `graduaciones`
  ADD CONSTRAINT `graduaciones_ibfk_1` FOREIGN KEY (`id_nota`) REFERENCES `notas_venta` (`id_nota`) ON DELETE CASCADE;

--
-- Filtros para la tabla `notas_venta`
--
ALTER TABLE `notas_venta`
  ADD CONSTRAINT `notas_venta_ibfk_1` FOREIGN KEY (`id_cliente`) REFERENCES `clientes` (`id_cliente`) ON DELETE SET NULL;

--
-- Filtros para la tabla `productos`
--
ALTER TABLE `productos`
  ADD CONSTRAINT `productos_ibfk_1` FOREIGN KEY (`id_nota`) REFERENCES `notas_venta` (`id_nota`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
