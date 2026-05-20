import CalibrationsService from "./services/calibrations.service.js";
// import DecisionTree from 'decision-tree';
// import RandomForest from 'decision-tree';
import RandomForest from 'decision-tree/random-forest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


async function predictModel(data) {
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
    
    const modelPath = path.resolve(__dirname, './random_forest_model/model.json');
    const modelJson = JSON.parse(await fs.promises.readFile(modelPath, 'utf8'));
    console.log(`Modelo cargado desde: ${modelPath}`);

    // Entrenar modelos RandomForest
    const forest = new RandomForest(modelJson);
    //Prediccion de la insercion de datos del paciente
    const right_predicted_class = forest.predict({
      sp: RIGHT_SPHERE,
      cyl: RIGHT_CYLINDER 
    });
    console.log('Predicción implementada para ojo derecho:', right_predicted_class);

    const left_predicted_class = forest.predict({
      sp: LEFT_SPHERE,
      cyl: LEFT_CYLINDER
    });
    console.log('Predicción implementada para ojo izquierdo:', left_predicted_class);

    return {
      right_predicted_class,
      left_predicted_class,
    };
  } catch (err) {
    console.error('Error entrenando modelos:', err);
    throw err;
  }
}


// Exportaciones
export default predictModel;
export { predictModel };
