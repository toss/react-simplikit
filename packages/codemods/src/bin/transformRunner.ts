import execa from 'execa';
import { statSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import prompts from 'prompts';

export const TRANSFORMER_INQUIRER_CHOICES = [
  {
    title: 'mobile-to-root',
    description: 'Migrate @react-simplikit/mobile imports and dependencies to react-simplikit',
    rewritesPackageJson: true,
    nextSteps: [
      'Act on every REP line above by hand.',
      'Reinstall (npm install, yarn or pnpm install) so the lockfile drops @react-simplikit/mobile.',
      'Run your formatter or linter fix on the changed files: import order rules sort react-simplikit elsewhere.',
    ],
  },
];

const IGNORE_PATTERNS = [
  '**/node_modules/**',
  '**/dist/**',
  '**/build/**',
  '**/out/**',
  '**/coverage/**',
  '**/.next/**',
  '**/.yarn/**',
  '**/.git/**',
  '**/.pnp.*',
];

function onCancel() {
  process.exit(1);
}

// Through the package's own bin file, not `.bin/jscodeshift`: Yarn PnP installs have no `.bin` folder.
export const jscodeshiftExecutable = require.resolve('jscodeshift/bin/jscodeshift.js');
export const transformerDirectory = join(__dirname, '../', '../', 'dist', 'transforms');

type TransformRunnerOptions = {
  dry?: boolean;
  print?: boolean;
  force?: boolean;
  jscodeshift?: string;
};

export async function transformRunner(transform?: string, path?: string, options?: TransformRunnerOptions) {
  let transformer = transform ?? '';
  let directory = path ?? '';

  // Without a terminal the prompt never gets an answer, and Node would exit 0 having done nothing.
  if ((transform === undefined || path === undefined) && process.stdin.isTTY !== true) {
    console.error('Pass both the transform and the path when not running in a terminal, for example:');
    console.error('  npx @react-simplikit/codemods mobile-to-root .');
    process.exit(1);
  }

  if (transform === undefined) {
    const res = await prompts(
      {
        type: 'select',
        name: 'transformer',
        message: 'Which transform would you like to apply?',
        choices: TRANSFORMER_INQUIRER_CHOICES.map(({ title, description }) => ({ title, description, value: title })),
      },
      { onCancel }
    );

    transformer = res.transformer;
  }

  const choice = TRANSFORMER_INQUIRER_CHOICES.find(x => x.title === transformer);

  if (choice === undefined) {
    console.error('Invalid transform choice, pick one of:');
    console.error(TRANSFORMER_INQUIRER_CHOICES.map(x => `- ${x.title}`).join('\n'));
    process.exit(1);
  }

  if (path === undefined) {
    const res = await prompts(
      {
        type: 'text',
        name: 'path',
        message: 'On which files or directory should the codemods be applied?',
        initial: '.',
      },
      { onCancel }
    );

    directory = res.path;
  }

  const args: string[] = [];

  if (options?.dry === true) {
    args.push('--dry');
  }
  if (options?.print === true) {
    args.push('--print');
  }
  args.push('--no-babel');
  args.push('--fail-on-error');

  args.push(...IGNORE_PATTERNS.map(pattern => `--ignore-pattern=${pattern}`));

  const extensions = ['tsx', 'ts', 'mts', 'cts', 'jsx', 'js', 'mjs', 'cjs'];

  if (choice.rewritesPackageJson) {
    extensions.push('json');
  }

  args.push(`--extensions=${extensions.join(',')}`);

  if (options?.jscodeshift !== undefined) {
    args.push(...options.jscodeshift.split(/\s+/).filter(flag => flag !== ''));
  }

  const target = resolve(directory);
  const stats = statSync(target, { throwIfNoEntry: false });

  if (stats === undefined) {
    console.error(`Path not found: ${directory}`);
    process.exit(1);
  }

  // jscodeshift matches the ignore patterns against the whole path, so it runs from inside the target:
  // otherwise a project under a `build` or `dist` folder would have every file ignored.
  const cwd = stats.isDirectory() ? target : dirname(target);

  if (options?.dry !== true) {
    // A folder outside any git repository, or a machine without git, fails here and has nothing to check.
    const git = await execa('git', ['status', '--porcelain'], { cwd, reject: false });

    if (!git.failed && git.stdout !== '') {
      if (options?.force !== true) {
        console.error('Before we continue, please stash or commit your git changes.');
        console.error('You may use the --force flag to override this safety check.');
        process.exit(1);
      }

      console.warn('WARNING: Git directory is not clean. Forcibly continuing.');
    }
  }

  args.push('--transform', join(transformerDirectory, `${transformer}.cjs`));
  args.push(stats.isDirectory() ? '.' : basename(target));

  console.log(`Executing command: jscodeshift ${args.join(' ')}`);

  // jscodeshift already prints each failed file and the summary.
  const result = await execa(process.execPath, [jscodeshiftExecutable, ...args], {
    cwd,
    stdio: 'inherit',
    reject: false,
  });

  if (result.failed) {
    process.exit(1);
  }

  if (options?.dry !== true) {
    console.log(['', 'Next steps:', ...choice.nextSteps.map((step, index) => `  ${index + 1}. ${step}`)].join('\n'));
  }
}
