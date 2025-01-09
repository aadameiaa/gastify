import chalk from 'chalk'

export class Logger {
	info(message: string) {
		console.log(chalk.blue(`🔄 ${message}`))
	}

	success(message: string) {
		console.log(chalk.green(`✅ ${message}`))
	}

	warn(message: string) {
		console.log(chalk.yellow(`⚠️ ${message}`))
	}

	error(message: string) {
		console.log(chalk.red(`❌ ${message}`))
	}

	debug(message: string) {
		console.log(chalk.magenta(`🐛 ${message}`))
	}
}
