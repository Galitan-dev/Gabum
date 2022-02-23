import chalk from 'chalk';
import path from 'path';
import argvSync from './parseArgs';

(async () => {
	const argv = await argvSync;

	let command;
	const trace = [__dirname, 'commands'];
	const args: (string | number)[] = [];
	for (const arg of argv._) {
		if (command) {
			args.push(arg);
		}

		trace.push(arg.toString());
		try {
			command = await import(path.resolve(...trace));
		} catch {
			continue;
		}
	}

	if (!command) {
		console.error(
			chalk.red('Unknown command') +
				', please refer to the help page ' +
				chalk.grey('(gabum --help)') +
				'.'
		);
		process.exit(1);
	}

	command.default(argv, args);
	return 0;
})();
