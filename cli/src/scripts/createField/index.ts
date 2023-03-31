import client from '../utils/client';
import { Field } from '../../types/types';

const createField = async (id: string, field: Field): Promise<unknown> => {
  if (!id || !field) {
    throw new Error('Create Field: id and field are required');
  }

  console.log('Field:', field, 'in flow:', id, 'is being created');
  try {
    const response = await client({
      method: 'POST',
      slug: 'v2/fields',
      body: {
        data: {
          type: 'field',
          ...field,
          relationships: {
            flow: {
              data: {
                type: 'flow',
                id
              }
            }
          }
        }
      }
    });
    if (response) {
      console.log('Field:', field, 'in flow:', id, 'was created');
    }

    return response;
  } catch (error) {
    console.log(
      'Field:',
      field,
      'in flow:',
      id,
      'failed to be created -',
      error
    );
  }
};

export default createField;
