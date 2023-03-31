import client from '../utils/client';
import { Flow, GetFlowsResponse } from '../../types/types';

const getAllExistingFlows = async (): Promise<Flow[] | void> => {
  try {
    console.log('Get All Flows: Flows are being fetched');
    const response = await client<GetFlowsResponse>({
      method: 'GET',
      slug: 'v2/flows'
    });
    if (response.data) {
      console.log('Get All Flows: Flows are fetched successfully');
    }

    return response.data;
  } catch (error) {
    console.log('Get All Flows: an error occured while fetching flows-', error);
  }
};

export default getAllExistingFlows;
