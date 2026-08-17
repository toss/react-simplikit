import { spawn } from 'node:child_process';

type ExecWithOutputOptions = {
  cwd: string;
};

// Tees stdout/stderr: writes each chunk live (so a multi-second build/install isn't
// silent) while also buffering it, so a failure can carry the child's actual output.
// Both streams are merged into one transcript (in `error.stdout`, the field
// `describeExecError` checks first) rather than kept separate — which stream a given
// tool writes its actual error to isn't something this helper can assume, so keeping
// them apart risks a digest that shows only the other stream's progress noise.
export function execWithOutput(command: string, args: string[], options: ExecWithOutputOptions): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd: options.cwd, stdio: ['inherit', 'pipe', 'pipe'] });
    let output = '';

    child.stdout.on('data', (chunk: Buffer) => {
      process.stdout.write(chunk);
      output += chunk.toString();
    });
    child.stderr.on('data', (chunk: Buffer) => {
      process.stderr.write(chunk);
      output += chunk.toString();
    });

    child.on('error', reject);
    child.on('close', code => {
      if (code === 0) {
        resolve();
        return;
      }
      const error = new Error(`Command failed: ${command} ${args.join(' ')}`) as Error & { stdout: string };
      error.stdout = output;
      reject(error);
    });
  });
}
