import yargs from 'yargs';

const MAX_WIDTH = 120;

const terminalWidth = yargs.terminalWidth();
const width = terminalWidth > MAX_WIDTH ? MAX_WIDTH : terminalWidth;

export default yargs
	.command('hello', 'Say hello to somebody', {
		name: {
			alias: ['name', 'n'],
			description: 'Name of the person to say hello',
			required: true,
			type: 'string',
			default: 'Anonymous'
		},
		ascii: {
			alias: ['a'],
			description: 'Use ASCII Art',
			type: 'boolean'
		},
		rainbow: {
			alias: ['r'],
			description: 'Anymate the text with rainbow waves',
			type: 'boolean'
		}
	})
	.help()
	.alias('h', 'help')
	.version()
	.alias('v', 'version')
	.wrap(width).argv;
