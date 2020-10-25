const inquirer = require('inquirer')

const orm = require('./config/orm')
const Employee = require('./public/Employee')
const Role = require('./public/Role')
const Department = require('./public/Department')

async function main(){



    await orm.closeORM()
}
main()