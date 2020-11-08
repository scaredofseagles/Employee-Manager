const mysql = require('mysql')

class Database{
    constructor(config){
        this.connecttion = mysql.createConnection(config)
    }
    query(sql, args=[]){
        return new Promise((resolve, reject) =>{
            this.connecttion.query(sql, args, (err, rows) => {
                if (err)
                    return reject (err)
                resolve (rows)
            })
        })
    }
    close(){
        return new Promise((resolve, reject) => {
            this.connecttion.end(err =>{
                if (err)
                    return reject (err)
                resolve ()
            })
        })
    }
}

const db = new Database({
    host:"localhost",
    port: 3306,
    user:"",
    password: "",
    database: "employee_manager"
})

function getAllRoles(){
    return db.query("SELECT * FROM `role`")
}

function getRoleTitles(){
    return db.query("SELECT title FROM `role`")
}

function getAllEmployees(){
    return db.query("SELECT * FROM employee")
}

function getEmployeeNames(){
    console.log('[getEmployeeNames] function reached ...')
    return db.query("SELECT id, CONCAT(first_name, ' ', last_name) AS name FROM employee")
}

function getAllDepartments(){
    return db.query("SELECT name FROM department")
}

function getManager(){
    return db.query('SELECT id, CONCAT(first_name, " ", last_name) AS Manager FROM employee')
}

function addEmployee(employee){
    return db.query(`INSERT INTO employee (first_name, last_name) VALUES("${employee.firstName}", "${employee.lastName}");`)
}

function addRole(role){
    return db.query(`INSERT INTO role (title, salary) VALUES("${role.title}", "${role.salary}");`)
}

function addDepartment(department){
    return db.query(`INSERT INTO department (name) VALUES("${department.name}")`)
}

function updateRole(columnName, roleInfo, id){
    // console.log('[updateRole] function reached ...')
    return db.query (`UPDATE role SET ${columnName}="${roleInfo}" WHERE id=${id}`)
}

function deleteEmployee(id){
    return db.query(`DELETE FROM employee WHERE id=${id}`)
}

function deleteRole(title){
    return db.query(`DELETE FROM role WHERE title="${title}"`)
}

function deleteDepartment(name){
    return db.query(`DELETE FROM department WHERE name="${name}"`)
}

function closeORM(){
    return db.close()
}

module.exports = {getEmployeeNames, getAllEmployees, getAllRoles, getRoleTitles, getAllDepartments, getManager, addEmployee, addRole, addDepartment, updateRole, deleteEmployee, deleteRole, deleteDepartment, closeORM} 