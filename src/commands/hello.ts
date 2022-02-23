import { Animation, rainbow } from 'chalk-animation';
import { textSync } from 'figlet';

export default (argv: {
	[x: string]: unknown;
	_: (string | number)[];
	$0: string;
}) => {
	let msg: string | Animation = 'Hello ' + argv.name;
	if (argv.ascii) msg = textSync(msg);
	if (argv.rainbow) msg = rainbow(msg, 0.5);

	if (typeof msg === 'string') console.log(msg);
	else msg.render();
};
