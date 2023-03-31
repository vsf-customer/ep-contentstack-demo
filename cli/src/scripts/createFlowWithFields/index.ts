import createField from '../createField';
import createFlow from '../createFlow';
import { Flow, Field } from '../../types/types';

const createFlowWithFields = async (flow: Flow, fields: Field[]): Promise<void> => {
  try {
    const response = await createFlow(flow);
    if (!response) return;
    const flowId = response?.data?.id;
    if (flowId) {
      const fieldPromises = fields.map((field) => createField(flowId, field));
      await Promise.all(fieldPromises);
    } else {
      console.log(`There was an error creating the flow - ${flow.name}`);
    }
  } catch (error) {
    console.log(error);
  }
};

export default createFlowWithFields;
