const addButton = document.getElementById("addButton");
addButton.onclick = addButtonClick;
var tasks = [];
loadTasks();

function addButtonClick(){
    var newTask = {
        name: document.getElementById('todoText').value,
        priority: 3
    }
    document.getElementById('todoText').value = "";
    addTaskToApi(newTask, addTaskToUI);
    
   
}

function addTaskToUI(task){

    console.log(task);
    
    const listItem = document.createElement("li");
    listItem.setAttribute("data-id",task.id)
    const nameSpan = document.createElement("span");
    nameSpan.innerHTML = task.name;
    const deleteItem = document.createElement("button");
    deleteItem.onclick = deleteButtonClick;
    deleteItem.innerText = "Delete"
    listItem.appendChild(nameSpan);
    listItem.appendChild(deleteItem);

    document.getElementById("taskList").appendChild(listItem);
}

function addTaskToApi(task, callback){ //request like in postman
    const fetchOptions = {
        method: "POST",
        body: JSON.stringify(task),        
        mode: 'cors',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    }
    
    fetch("http://localhost:4000/task", fetchOptions) //send button on postman, mae s actual call to server
    .then((response) =>{
        console.log("post status: " + response.status);
        return response.json();
    })
    .then((data) => {
        var task = data;
        callback(task)
    })
}

function loadTasks() {
    fetch("http://localhost:4000/task") //fetch returns a promise        by default fetch is a get
    .then((response) => response.json())
    .then((data) => {
        tasks = data
        var task;
        for (task of tasks){
            addTaskToUI(task);
        }
    })   
}

function deleteButtonClick(){
    document.getElementById("taskList").removeChild(this.parentNode);
    var taskId = this.parentNode.getAttribute("data-id");
    const fetchOptions = {
        method: "DELETE"
    }
    fetch("http://localhost:4000/task/" + taskId, fetchOptions)
    .then((response) => console.log("post status:" + response.status))

}