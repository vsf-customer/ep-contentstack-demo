/* eslint-disable camelcase */

/*
 * Input data to create a Field
 */
export interface Field {
  type?: string;
  id?: string;
  name: string;
  slug: string;
  description?: string;
  enabled: boolean;
  field_type: string;
  validation_rules?: Array<any>;
  required?: boolean;
  default?: any;
  relationships?: object;
  order?: number;
  meta?: object;
  omit_null?: boolean;
}
/*
 * Input data to create a Flow
 */
export interface Flow {
  id?: string;
  name: string;
  slug: string;
  description: string;
  enabled: boolean;
  fields?: Field[];
}
/*
 * JSON object with the data to create Flows
 */
export interface FlowJson {
  flows: Flow[];
}
/*
 * Get All Flows endpoint response containing data
 */
export interface GetFlowsResponse {
  data: Flow[];
}
/*
 * Create Flow endpoint response containing data
 */
export interface CreateFlowResponse {
  data: Flow;
}
