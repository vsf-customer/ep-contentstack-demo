import client from '../utils/client';
import { CreateFlowResponse, Flow } from '../../types/types';

const createFlow = async (flow: Flow): Promise<CreateFlowResponse | void> => {
  try {
    console.log('Flow :', flow?.name, 'is being created');
    const response = await client<CreateFlowResponse>({
      method: 'POST',
      slug: 'v2/flows',
      body: {
        data: {
          type: 'flow',
          ...flow
        }
      }
    });
    if (response) {
      console.log('Flow :', flow?.name, 'was created');
    }

    return response;
  } catch (error) {
    console.log('Flow :', flow?.name, 'was not created -', error);
  }
};

export default createFlow;
