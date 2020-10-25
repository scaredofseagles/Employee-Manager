class Employee{
    constructor(firstName, lastName, roleId, managerId){
        this.firstName = firstName
        this.lastName = lastName
        this.roleId = roleId
        this.managerId = managerId
    }
    getfirstName(){return this.firstName}
    getlastName(){return this.lastName}
    getroleId(){return this.roleId}
    getmanagerId(){return this.managerId}
}

module.exports = Employee