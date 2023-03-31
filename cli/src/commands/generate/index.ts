import { Command } from '@oclif/core';
import * as inquirer from 'inquirer';
import { flows } from '../../input/flows.json';
import questions from './prompt/questions';
import generateDefaultFlows from '../../scripts/generateDefaultFlows';
import getAllExistingFlows from '../../scripts/getAllExistingFlows';
import createField from '../../scripts/createField';
import createFlowWithFields from '../../scripts/createFlowWithFields';
import { Field, Flow } from '../../types/types';

export class Generate extends Command {
  async run(): Promise<void> {
    const getAvailableFlowNames = (data: Flow[]) => {
      return data.map((flow: Flow) => {
        return {
          name: flow.name
        };
      });
    };

    const getAvailableFieldNames = (flowName: string) => {
      const flow = flows.find((flowsItem) => flowsItem?.name === flowName);
      if (flow?.fields) {
        const { fields } = flow;
        return fields?.map((field: Field) => {
          return {
            name: field.name
          };
        });
      }
    };

    const getFlowFromJson = (flowName: string) => {
      const flow = flows.find((flowsItem) => flowsItem?.name === flowName);
      if (flow) {
        return flow;
      }
    };

    const getFlowId = async (flowName: string) => {
      const existingFlows = await getAllExistingFlows();
      if (!existingFlows) return;
      return existingFlows?.find(
        (flow) => flow.name === flowName
      )?.id;
    };

    const availableFlows = getAvailableFlowNames(flows);

    const initPrompt = async (): Promise<any> => {
      const initialResponse: any = await inquirer.prompt([
        {
          name: questions.initial.name,
          message: questions.initial.message,
          type: questions.initial.type,
          choices: [
            questions.initial.choices.generate_all,
            questions.initial.choices.generate_custom
          ]
        }
      ]);

      if (
        initialResponse.initial === questions.initial.choices.generate_all.name
      ) {
        const confirmOperation: any = await inquirer.prompt([
          {
            name: questions.initial.confirm.generate_all.name,
            message: questions.initial.confirm.generate_all.message,
            type: questions.initial.confirm.generate_all.type
          }
        ]);
        if (confirmOperation.confirm_generate_all) {
          await generateDefaultFlows();
          return;
        }
      }

      const flowsResponse: any = await inquirer.prompt([
        {
          name: questions.flows.name,
          message: questions.flows.message,
          type: questions.flows.type,
          choices: [
            ...availableFlows,
            questions.fields.choices.exit
          ]
        }
      ]);

      if (flowsResponse.flows === questions.fields.choices.exit.name) {
        return false;
      }

      const flowFields = getAvailableFieldNames(flowsResponse.flows);
      const fieldChoices = [
        questions.fields.choices.exit
      ];
      if (flowFields) {
        fieldChoices.unshift(...flowFields);
      }

      const fieldsResponse = await inquirer.prompt([
        {
          name: questions.fields.name,
          message: questions.fields.message,
          type: questions.fields.type,
          choices: fieldChoices
        }
      ]);

      if (fieldsResponse.fields) {
        const selectedFlowName = flowsResponse.flows;
        const selectedFieldNames = fieldsResponse.fields;
        const selectedFlowId = await getFlowId(selectedFlowName);
        const selectedFlowFields = flows.find(
          (flow: Flow) => flow.name === selectedFlowName
        )?.fields as Field[];

        const selectedFields = selectedFlowFields?.filter((field: Field) =>
          selectedFieldNames.includes(field.name)
        );

        if (selectedFlowId && selectedFields?.length) {
          selectedFields.forEach(async (field: Field) => {
            await createField(selectedFlowId, field);
          });
        } else if (!selectedFlowId && selectedFields?.length) {
          this.log(
            `Flow ${selectedFlowName} does not exist yet, creating the flow...`
          );
          const selectedFlowData = getFlowFromJson(selectedFlowName);
          if (selectedFlowData) {
            await createFlowWithFields(selectedFlowData, selectedFields);
          }
        } else {
          this.log('Field data could not be found. Please make sure you have selected at least a single field by pressing space.');
        }
      }
    };

    initPrompt();
  }
}
