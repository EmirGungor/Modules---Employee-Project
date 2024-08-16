import { Request } from "./request";
import { UI } from "./ui";


// Select Elements
const form = document.querySelector("#employee-form");
const nameInput = document.querySelector("#name");
const departmentInput = document.querySelector("#department");
const salaryInput = document.querySelector("#salary");
const employeesList = document.querySelector("#employees");
const updateEmployeeButton = document.querySelector("#update");

const request = new Request("http://localhost:3000/employees");
const ui = new UI();
let updateState = null;

eventListeners();

function eventListeners(){
    document.addEventListener("DOMContentLoaded", getallEmployees);
    form.addEventListener("submit", addEmployee);
    employeesList.addEventListener("click", UpdateOrDelete);
    updateEmployeeButton.addEventListener("click", updateEmployee);
}

function getallEmployees(){
    request.get()
    .then(employees => {
        ui.addAllEmployesToUI(employees);
        
    })
    .catch(err => console.log(err))
}

function addEmployee(e){
    const employeeName = nameInput.value.trim();
    const employeeDepartment = departmentInput.value.trim();
    const employeeSalary = salaryInput.value.trim();
    // let newId = Math.random() * 1000
    let randomID=Math.floor(Math.random()*10000)

    if(employeeName === "" || employeeDepartment === "" || employeeSalary === ""){
        alert("Please fill in all fields")
    }
    else{
        request.post({name:employeeName,department:employeeDepartment,salary:Number(employeeSalary),id:randomID})
        .then(employee => {
            ui.addAllEmployeeToUI(employee)
        })
        .catch(err => console.log(err))
        
    }

    ui.clearInputs();
    e.preventDefault();
}

function UpdateOrDelete(e){ //We send the event object to understand where it was pressed.
    if(e.target.id === "delete-employee"){ //DELETE
        deleteEmployee(e.target)
    }

    else if (e.target.id === "update-employee"){ //UPDATE
        updateEmployeeController(e.target.parentElement.parentElement) //tr element
    }
}

function deleteEmployee(targetEmployee){
    const id = targetEmployee.parentElement.previousElementSibling.previousElementSibling.textContent //a element

    request.delete(id)
    .then(message => {
        ui.deleteEmployeeFromUI(targetEmployee.parentElement.parentElement) //tr element
    })
    .catch(err => console.log(err))
}


function updateEmployeeController(targetEmployee){
    ui.toggleUpdateButton(targetEmployee)
    if (updateState === null){
        updateState = {
            updateID : targetEmployee.children[3].textContent,
            updateParent : targetEmployee
        }
    }
    else{
        updateState = null;
    }
}

function updateEmployee(){
    if (updateState){
        //Update
        const data = {name:nameInput.value.trim(),department:departmentInput.value.trim(),salary:Number(salaryInput.value.trim())}

        request.put(updateState.updateID, data)
        .then(updatedEmployee => {
            ui.updateEmployeeOnUI(updatedEmployee,updateState.updateParent)
            
        })
        .catch(err=> console.log(err))
    }
}

























// request.get()
// .then(employees => console.log(employees))
// .catch(err => console.log(err))

// request.post({name:"Özgür Şahan",department:"IT",salary:"110000"})
// .then(employee => console.log(employee))
// .catch(err => console.log(err))

// request.put(4, {name:"Uxgyr Shan",department:"IT",salary:"110000"})
// .then(employee => console.log(employee))
// .catch(err => console.log(err))

// request.delete(4)
// .then(message => console.log(message))
// .catch(er => console.log(err))
