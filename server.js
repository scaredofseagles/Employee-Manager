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
    console.log(`Adding ${employee.firstName} ${employee.lastName} to the database`)
    main()
}

async function addRole(){
    let departments = await orm.getAllDepartments()
    let role = await inquirer.prompt([
        {
            message: "What is the title of this role?",
            name: "title"
        },
        {
            type: "number",
            message: "What is the salary for this role?",
            name: "salary"
        },
        {
            type: "list",
            name: "department",
            message: "Select the department for this role",
            choices: departments
        }
    ])
    orm.addRole(role)
    console.log(`Adding ${role.title} to the database`)
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
    console.log(`Adding ${department.name} to the database`)
    main()
}

async function updateRole(){
    let roles = await orm.getAllRoles()
    let choice = await inquirer.prompt([{
        type:"list",
        name: "allRoles",
        message: "Select which role you would like to update",
        choices: roles.map(object => object.title)
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

    let roleDetails = roles.find(object => object.title === choice.allRoles)
    // console.log(roleDetails.id)

    switch(choice.roleTable){
        case "Title":
            // console.log('updating title ...')
            orm.updateRole(choice.roleTable, choice.roleInfo, roleDetails.id)
            break;
        case "Salary":
            orm.updateRole(choice.roleTable, choice.roleInfo, roleDetails.id)
            break;
        case "Department":
            orm.updateRole(choice.roleTable, choice.roleInfo, roleDetails.id)
            break;
    }
    console.log(`Updating ${choice.allRoles} to ${choice.roleInfo} for ${choice.roleTable}`)
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
    let employees = await orm.getEmployeeNames()
    //employees.push({id: null, name: 'Cancel'})
    let deletePrompt = await inquirer.prompt([{
            type: "list",
            name: "deleteChoice",
            message: "Select the employee you would like to delete",
            choices: employees.map(object => object.name)
        }])
    let selectedEmployee = employees.find(object => object.name === deletePrompt.deleteChoice)
    console.log(`Removing id=${selectedEmployee.id}, ${deletePrompt.deleteChoice} from the database`)

    await orm.deleteEmployee(selectedEmployee.id)
    main()
}

async function deleteRole(){
    let roles = await orm.getRoleTitles()
    let deletePrompt = await inquirer.prompt([{
        type: "list",
        name: "deleteChoice",
        message: "Select the role you would like to delete",
        choices: roles.map(object => object.title)
    }])
    console.log(`Removing ${deletePrompt.deleteChoice} from the database`)
    await orm.deleteRole(deletePrompt.deleteChoice)
    main()
}

async function deleteDept(){
    let departments = await orm.getAllDepartments()
    let deletePrompt = await inquirer.prompt([{
        type: "list",
        name: "deleteChoice",
        message: "Select the Department you would like to delete",
        choices: departments.map(object => object.name)
    }])
    console.log(`Removing ${deletePrompt.deleteChoice} from the database`)
    await orm.deleteDepartment(deletePrompt.deleteChoice)
    main()
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