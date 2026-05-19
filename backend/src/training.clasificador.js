import CalibrationsService from "./services/calibrations.service.js";
// import DecisionTree from 'decision-tree';
// import RandomForest from 'decision-tree';
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

async function trainModels(data) {
  try {
    const RIGHT_SPHERE = data.right_sp || 0;
    const LEFT_SPHERE = data.left_sp || 0;
    const RIGHT_CYLINDER = data.right_cyl || 0;
    const LEFT_CYLINDER = data.left_cyl || 0;

    console.log('Datos recibidos para predecir:', {
      right_sp: RIGHT_SPHERE,
      left_sp: LEFT_SPHERE,
      right_cyl: RIGHT_CYLINDER,
      left_cyl: LEFT_CYLINDER
    });
    
    // Obtener todos los registros de calibrations
    const calibrationData = await CalibrationsService.findAll();
    if (!calibrationData || calibrationData.length === 0) {
      throw new Error('No hay datos de calibraciones para entrenar.');
    }

    // Preparar datos para RandomForest (un registro por ojo)
    const ForestData = calibrationData.flatMap(row => [
    {
      sp: row.right_sp,
      cyl: row.right_cyl,
      // axis: row.right_axis,
      // age: row.age,
      condition: row.right_condition
    },
    {
      sp: row.left_sp,
      cyl: row.left_cyl,
      // axis: row.left_axis,
      // age: row.age,
      condition: row.left_condition
    }]).filter(row => row.condition != null);

    const features = ['sp', 'cyl'];
    const className = 'condition';

    // Mezclar y dividir datos (60% train, 40% test)
    function splitTrainTest(arr) {
      const arrCopy = [...arr];
      shuffleArray(arrCopy);
      const splitIdx = Math.floor(arrCopy.length * 0.6);
      return {
        train: arrCopy.slice(0, splitIdx),
        test: arrCopy.slice(splitIdx)
      };
    }

    const ForestSplit = splitTrainTest(ForestData);

    const config = {
      nEstimators: 500,        // Number of trees (default: 100)
      maxFeatures: 2,     // Features per split: 'sqrt', 'log2', 'auto', or number
      bootstrap: true,         // Use bootstrap sampling (default: true)
      randomState: 76,         // Random seed for reproducibility
      maxDepth: 100,            // Maximum tree depth
      minSamplesSplit: 10       // Minimum samples to split
    };

    // Entrenar modelos RandomForest
    const forest = new RandomForest(className, features, config);
    forest.train(ForestSplit.train);

    //comprobar configuracion
    const configforest = forest.getConfig();
    console.log('Configuration:', configforest);

    // Evaluar precisión
    const Accuracy = forest.evaluate(ForestSplit.test);
    // console.log('Datos de prueba:', ForestSplit.test);
    // console.log('Datos de entrenamiento:', ForestSplit.train);
    console.log(`Precisión de Forest : ${(Accuracy * 100).toFixed(2)}%`);

    //Prediccion de la insercion de datos del paciente
    const right_predicted_class = forest.predict({
      sp: RIGHT_SPHERE,
      cyl: RIGHT_CYLINDER 
    });
    console.log('Predicción para ojo derecho:', right_predicted_class);

    const left_predicted_class = forest.predict({
      sp: LEFT_SPHERE,
      cyl: LEFT_CYLINDER
    });
    console.log('Predicción para ojo izquierdo:', left_predicted_class);

    
  } catch (err) {
    console.error('Error entrenando modelos:', err);
  }
}


// Exportaciones
export default trainModels;
export { trainModels };
