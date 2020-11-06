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

async function addDepartment(){
    let department = await inquirer.prompt([
        {
            message: "What is the Department's title?",
            name: "name"
        }
    ])
    orm.addDepartment(department)
    console.log(department)
    main()
}

async function updateRole(){
    let choice = await inquirer.prompt([{
        type:"list",
        name: "allRoles",
        message: "Select which role you would like to update",
        choices: orm.getAllRoles()
    },
    {
        type:"list",
        name: "roleTable",
        message: "What would you like to update?",
        choices: ["Title", "Salary", "Department"]
    },
    {
        name: "roleInfo",
        message: "Enter the updated info"
    }])

    switch(choice.roleInfo){
        case "Title":
            orm.updateRole(choice.allRoles, choice.roleTable, choice.roleInfo)
            break;
        case "Salary":
            orm.updateRole(choice.allRoles, choice.roleTable, choice.roleInfo)
            break;
        case "Department":
            orm.updateRole(choice.allRoles, choice.roleTable, choice.roleInfo)
            break;
    }
}


async function main(){
    let promptAnswers = await inquirer.prompt([{
            type: "list",
            message:"What would you like to do?",
            choices: ["Add Employee", "Add Role", "Add Department", "View Employees", "View Roles", "View Departments", "Update Role"],
            name: "choiceList"
    }])
    
    switch(promptAnswers.choiceList) {
        case "Add Department":
            addDepartment()
            break;
        case "Add Role":
            addRole()
            break;
        case "Add Employee":
            addEmployee()
            break;
        case "View Employees":
            viewEmployees()
            break;
        case "View Roles":
            viewRoles()
            break;
        case "View Departments":
            viewDepartments()
            break;
        case "Update Role":
            updateRole()
            break;
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