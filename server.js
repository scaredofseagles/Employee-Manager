const inquirer = require('inquirer')
const figlet = require('figlet')
const orm = require('./config/orm')
const Employee = require('./public/Employee')
const Role = require('./public/Role')
const Department = require('./public/Department')


async function viewEmployees() {
   let result = await orm.getAllEmployees()
   console.table(result)
   main()
}

async function viewRoles(){
    let result = await orm.getAllRoles()
    console.table(result)
    main()
}

async function viewDepartments(){
    let result = await orm.getAllDepartments()
    console.table(result)
    main()
}

async function addEmployee(){
    let roles = await orm.getAllRoles()
    let managers = await orm.getManager()
    managers.unshift({id: null, Manager: "None"})

    let employee = await inquirer.prompt([
        {
            message: "What is the employee's first name?",
            name: "firstName"
        },
        {
            message: "What is the employee's last name?",
            name: "lastName"
        },
        {
            type: "list",
            message:"Select the employee's role",
            choices: roles.map(object => object.title),
            name: "role"
        },
        {
            type: "list",
            name: "manager",
            message: "Select the employee's manager",
            choices: managers.map(object => object.Manager)
        }
    ])
    orm.addEmployee(employee)
    console.log(employee)
    main()
}

async function addRole(){
    let departments = orm.getAllDepartments()
    let role = await inquirer.prompt([
        {
            message: "What is the title of this role?",
            name: "title"
        },
        {
            message: "What is the salary for this role?",
            name: "salary"
        },
        {
            type: "list",
            name: "department",
            message: "Select the department for this role",
            choices: departments.map(object => object.title)
        }
    ])
    orm.addRole(role)
    console.log(role)
    main()
}



async function main(){
    let users = []
    let roles = []
    let departments = []
    let promptAnswers = await inquirer.prompt([{
            type: "list",
            message:"What would you like to do?",
            choices: ["Add Department", "Add Role", "Add Employee"],
            name: "choiceList"
    }])
    if (promptAnswers.choiceList === "Add Employee"){
        let addEmployee = await inquirer.prompt([
            {
                message: "What is the employee's first name?",
                name: "firstName"
            },
            {
                message: "What is the employee's last name?",
                name: "lastName"
            },
            {
                type: "list",
                message:"What is the employee's role?",
                choices: [function(){
                    if (roles > 0)
                    orm.getAllRoles()}],
                name: "role"
            }
        ])
        const employee = new Employee(addEmployee.firstName, addEmployee.lastName, addEmployee.role)
        orm.addEmployee(employee)
        users.push(employee)
    } else if (promptAnswers.choiceList === "Add Role"){
        let addRole = await inquirer.prompt([
            {
                message: "What is the title of this role?",
                name: "title"
            },
            {
                message: "What is the salary for this role?",
                name: "salary"
            }
        ])
        const role = new Role(addRole.title, addRole.salary)
        roles.push(role)
    } else if (promptAnswers.choiceList === "Add Department"){
        let addDepartment = await inquirer.prompt([
            {
                message: "What is the Department's title?",
                name: "name"
            }
        ])
        const department = new Department(addDepartment.name)
        departments.push(department)
    }


    await orm.closeORM()
}


console.log(figlet.textSync('Employee Manager', {
    font: '3D-ASCII',
    horizontalLayout: 'default',
    verticalLayout: 'default',
    width: 100,
    whitespaceBreak: true
}))

main()