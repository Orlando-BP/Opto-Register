# Opto-Register

Sistema web para la gestión de clientes en ópticas, integrando registro de datos personales, historial de graduaciones visuales, compras y un módulo de clasificación automática de condiciones visuales mediante algoritmos de aprendizaje automático.

## Objetivo del Proyecto
El proyecto surge como solución para **Óptica Barba** en Guadalajara, que llevaba más de 25 años gestionando información en papel.  
Opto-Register digitaliza este proceso, ofreciendo:
- Registro seguro de clientes y sus datos oftalmológicos.  
- Seguimiento de graduaciones visuales y compras.  
- Clasificación automática de condiciones visuales (miopía, hipermetropía, astigmatismo).  
- Comunicación directa entre cliente y optometrista mediante chat en tiempo real.  

## Tecnologías Utilizadas
- **Frontend:** React JS, TypeScript, Tailwind CSS  
- **Backend:** Node.js, JavaScript, TypeScript  
- **Base de datos:** PostgreSQL  
- **Comunicación en tiempo real:** Socket.io  
- **Clasificación visual:** Algoritmo Random Forest (librería `decision-tree`)  

## Arquitectura del Sistema
El sistema se organiza en módulos principales:
- **Clientes:** Registro y consulta de datos personales.  
- **Graduaciones:** Almacenamiento de valores SP, CYL y AXIS para cada ojo.  
- **Ventas:** Notas de venta y productos asociados.  
- **Clasificación:** Modelo Random Forest para identificar condiciones visuales.  
- **Chat:** Comunicación cliente–optometrista en tiempo real.  
- **Administración:** Dashboard seguro para gestión interna.  

## Instalación y Uso
1. Clonar el repositorio:  
   ```bash
   git clone https://github.com/Orlando-BP/Opto-Register.git
    ```
2. Instalar dependencias en frontend y backend:
   ```bash
   npm install
    ```
3. Configurar la base de datos PostgreSQL según el esquema incluido.
4. Ejecutar el servidor en backend y frontend:
   ```bash
   npm run dev
   ```
## Resultados Actuales
- Optimización del registro y gestión de clientes.

- Clasificación inicial de condiciones visuales (precisión ~76% a la fecha 20/05/2026).

- Chat en tiempo real para seguimiento personalizado.

## Trabajo Futuro
- Mejorar la precisión del modelo de clasificación con más datos.

- Integrar reportes estadísticos para análisis poblacional.

- Adaptación del sistema a aplicaciones móviles.

## Autores
- Orlando Agustín Barba Palacios

- Marco Arturo Barrones Esparza

- Martha del Carmen Gutiérrez Salmerón

