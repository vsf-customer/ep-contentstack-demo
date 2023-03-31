import createFlowWithFields from './createFlowWithFields';
import createFlow from './createFlow';
import * as flowsJson from '../input/flows.json';
import { Flow, Field } from '../types/types';
import getAllExistingFlows from './getAllExistingFlows';
import createField from './createField';

const generateDefaultFlows = async (): Promise<void> => {
  console.log('Generating All Available Flows and Fields');
  const existingFlows = await getAllExistingFlows();

  if (!existingFlows) return;

  const { flows } = flowsJson;
  for (const flow of flows) {
    const { name, fields } = flow;
    const existingFlow = existingFlows?.filter((item) => item.name === name);
    if (existingFlow?.[0]?.id && fields) {
      for (const field of fields) {
        await createField(existingFlow?.[0]?.id, field);
      }
    } else if (fields) {
      await createFlowWithFields(flow as Flow, fields as Field[]);
    } else {
      await createFlow(flow as Flow);
    }
  }
};

export default generateDefaultFlows;
