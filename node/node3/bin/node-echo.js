#!/usr/bin/env node

var argv = require('argv'),
		echo = require('../lib/echo');
echo(process.argv.slice(2));