import CalibrationsService from "./services/calibrations.service.js";
import RandomForest from 'decision-tree/random-forest';
import fs from 'fs';
import path from 'path';


// Entrena, evalúa y muestra precisión de RandomForest para ambos ojos
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

async function trainModels() {
  try {
    // Obtener todos los registros de calibrations
    const data = await CalibrationsService.findAll();
    if (!data || data.length === 0) {
      throw new Error('No hay datos de calibraciones para entrenar.');
    }

    // Preparar datos para cada ojo
    const rightData = data.map(row => ({
      sp: row.right_sp,
      cyl: row.right_cyl,
      axis: row.right_axis,
      condition: row.right_condition
    })).filter(row => row.condition != null);

    const leftData = data.map(row => ({
      sp: row.left_sp,
      cyl: row.left_cyl,
      axis: row.left_axis,
      condition: row.left_condition
    })).filter(row => row.condition != null);

    const features = ['sp', 'cyl', 'axis'];
    const className = 'condition';

    // Mezclar y dividir datos (80% train, 20% test)
    function splitTrainTest(arr) {
      const arrCopy = [...arr];
      shuffleArray(arrCopy);
      const splitIdx = Math.floor(arrCopy.length * 0.8);
      return {
        train: arrCopy.slice(0, splitIdx),
        test: arrCopy.slice(splitIdx)
      };
    }

    const rightSplit = splitTrainTest(rightData);
    const leftSplit = splitTrainTest(leftData);



      // Entrenar modelos RandomForest
      const rightForest = new RandomForest(className, features);
      rightForest.train(rightSplit.train);
      const leftForest = new RandomForest(className, features);
      leftForest.train(leftSplit.train);

      // Evaluar precisión
      const rightAccuracy = rightForest.evaluate(rightSplit.test);
      const leftAccuracy = leftForest.evaluate(leftSplit.test);

      console.log(`Precisión ojo derecho: ${(rightAccuracy * 100).toFixed(2)}%`);
      console.log(`Precisión ojo izquierdo: ${(leftAccuracy * 100).toFixed(2)}%`);
  } catch (err) {
    console.error('Error entrenando modelos:', err);
  }
}


