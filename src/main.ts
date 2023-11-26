import * as core from '@actions/core'
import * as fs from 'fs'
import * as path from 'path'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const input_directory = core.getInput('input_directory');
    const output_file = core.getInput('output_file');

    const files = fs.readdirSync(input_directory).map((file) => path.join(input_directory, file));
    const annotations = files.reduce((acc, file) => {
      const rawReport = fs.readFileSync(file, 'utf8');
      const parsedReport = JSON.parse(rawReport);
      return [...acc, ...parsedReport];
    }, []);

    fs.writeFileSync(output_file, JSON.stringify(annotations, null, 2));
    core.setOutput('output_file', output_file);
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
