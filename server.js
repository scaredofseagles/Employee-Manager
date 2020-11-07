const inquirer = require('inquirer')
const figlet = require('figlet')
const orm = require('./config/orm')


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
    let roles = await orm.getRoleTitles()
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
    let roleDetails = roles.find(object => object.title === employee.role)
    let manager = managers.find(object => object.Manager === employee.manager)
    employee.role = roleDetails
    employee.manager = manager

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
        choices: orm.getRoleTitles()
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
    main()
}

async function deleteAll(){
    let deletePrompt = await inquirer.prompt([{
            type: "list",
            name:"deletechoice",
            message: "What would you like to delete?",
            choices: ["Employee", "Role", "Department"]
    }])
    switch(deletePrompt.deletechoice){
        case "Employee":
            deleteEmployee()
            break;
        case "Role":
            deleteRole()
            break;
        case "Department":
            deleteDept()
            break;
    }
}

async function deleteEmployee(){
    console.log("[deleteEmployee] function reached ...")
    let deletePrompt = await inquirer.prompt([
        {
            type: "list",
            name: "deleteChoice",
            message: "Select the employee you would like to delete",
            choices: orm.getEmployeeNames()
        }
    ])
    console.log(`returning ${deletePrompt.deleteChoice}...`)

    await orm.deleteEmployee(deletePrompt.deleteChoice)
}

async function deleteRole(){
    let deletePrompt = await inquirer.prompt([{
        type: "list",
        name: "deleteChoice",
        message: "Select the role you would like to delete",
        choices: orm.getRoleTitles()
    }])
    await orm.deleteRole(deletePrompt.deleteChoice)
}

async function deleteDept(){
    let deletePrompt = await inquirer.prompt([{
        type: "list",
        name: "deleteChoice",
        message: "Select the Department you would like to delete",
        choices: orm.getAllDepartments()
    }])
    await orm.deleteDepartment(deletePrompt.deleteChoice)
}

async function main(){
    let promptAnswers = await inquirer.prompt([{
            type: "list",
            message:"What would you like to do?",
            choices: [
                "Add Employee", 
                "Add Role", 
                "Add Department", 
                "View Employees", 
                "View Roles", 
                "View Departments", 
                "Update Role", 
                "Delete Employees, Roles, and Departments"
            ],
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
        case "Delete Employees, Roles, and Departments":
            deleteAll()
            break;
    }


    //await orm.closeORM()
}


console.log(figlet.textSync('Employee Manager', {
    font: '3D-ASCII',
    horizontalLayout: 'default',
    verticalLayout: 'default',
    width: 100,
    whitespaceBreak: true
}))

main()