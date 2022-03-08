import { Command } from '@oclif/core';
import * as Conf from 'conf';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { prompt } from 'prompts';
import * as licenses from 'spdx-license-list';
import { PromptObject } from '../../types/prompts';

const config = new Conf();

export default class ProjectCreate extends Command {
	static description = 'Create a new project';
	static aliases = ['create'];

	static examples = ['<%= config.bin %> <%= command.id %>'];

	public async run(): Promise<void> {
		const homedir = this.config.home;
		const projectDir = <string>(
			config.get('project_dir', path.join(homedir, 'Documents/Development'))
		);

		const questions: PromptObject[] = [
			{
				name: 'name',
				type: 'text',
				message: 'Project Name',
				validate(value) {
					if (typeof value !== 'string') return 'Invalid input';
					if (value.length > 30) return 'Too long project name';
					if (value.length === 0) return 'Please provide a project name';
					if (value.length < 3) return 'Too small project name';
					if (fs.existsSync(path.join(projectDir, value)))
						return 'Project already exists';
					return true;
				},
				onRender(color) {
					if (!this._value) return;

					const exists = fs.existsSync(path.join(projectDir, this._value));

					this.rendered = (exists ? color.red : color.green)(
						this.rendered?.match(/[\s"#%/<>|]+([^\s"#%/<>|]+)/g)
							? this.rendered
									?.replace(/(["#%/<>|])+/g, color.red('$1'))
									.replace(/\s+(\S+)/g, color.grey('-') + '$1')
									.replace(/\s+/g, '')
							: this.rendered
					);
				},
				format(input) {
					return (<string>input)
						.replace(/["#%/<>|]+/g, '-')
						.replace(/\s+(\S+)/g, '-$1')
						.replace(/\s+/g, '');
				},
			},
			{
				name: 'description',
				type: 'text',
				message: 'Project Description',
				validate(value) {
					if (typeof value !== 'string') return 'Invalid input';
					if (value.length > 100) return 'Too long project description';
					if (value.length === 0) return 'Please provide a project description';
					if (value.length < 10) return 'Too small project description';
					return true;
				},
			},
			{
				name: 'private',
				type: 'toggle',
				message: 'Project Visibility',
				initial: <boolean>config.get('default-project-private', false),
				active: 'Private',
				inactive: 'Public',
			},
			{
				type: 'autocomplete',
				name: 'type',
				message: 'Project Type',
				initial: <string>config.get('default-project-type', 'simple'),
				choices: [
					{
						title: 'API',
						value: 'api',
					},
					{
						title: 'Blank',
						value: 'blank',
					},
					{
						title: 'CLI',
						value: 'cli',
					},
					{
						title: 'Discord Bot',
						value: 'discord',
					},
					{
						title: 'Simple',
						value: 'simple',
					},
					{
						title: 'Web App',
						value: 'webapp',
					},
					{
						title: 'Website',
						value: 'website',
					},
				],
			},
			{
				type: 'autocomplete',
				name: 'language',
				message: 'Project Language',
				initial: <string>config.get('default-project-language', 'js'),
				choices: [
					{
						title: 'JavaScript',
						value: 'js',
					},
					{
						title: 'TypeScript',
						value: 'ts',
					},
					{
						title: 'Web (HTML, CSS, JS)',
						value: 'web',
					},
					{
						title: 'Rust',
						value: 'rs',
					},
					{
						title: 'Other',
						value: 'other',
					},
				],
			},
			{
				type: 'autocomplete',
				name: 'license',
				message: 'Project License',
				initial: <string>config.get('default-project-license', 'MIT License'),
				choices: Object.values(licenses).map((l) => ({
					title: l.name,
					value: l,
				})),
			},
		];

		const answers = await prompt(questions);
		this.log(answers);
	}
}
