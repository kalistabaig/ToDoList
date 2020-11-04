const newList = document.getElementById("create-new-list");
newList.onclick = createNewListClick();
const addButton = document.getElementById("addButton");
addButton.onclick = addButtonClick;
var tasks = [];
loadTasks();

function createNewListClick() {
    const listName = document.getElementById("list-name").value;
    addListToApi(listName, addListToUI);
}


function addButtonClick() {
    var newTask = {
        name: document.getElementById('todoText').value,
        priority: document.getElementById('prioritySelector').value
    }

    document.getElementById('todoText').value = "";
    document.getElementById('prioritySelector').value = 0;
    addTaskToApi(newTask, addTaskToUI);
    
   
}

function addTaskToUI(task){

    console.log(task);
    
    const listItem = document.createElement("li");
    listItem.setAttribute("data-id",task.id)
    const nameSpan = document.createElement("span");
    nameSpan.className = "nameSpan";
    nameSpan.innerHTML = task.name;
    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.className = "nameInput";
    const prioritySelect = document.createElement("select");
    prioritySelect.className = "prioritySelect";
    

    var i;
    optionNames = ["None", "Low", "Medium", "High", "Critical"];

    for (i = 0; i < 5; i++){
        const option = document.createElement("option");
        option.innerHTML = optionNames[i];
        option.value = i;
        prioritySelect.appendChild(option);
    }
    prioritySelect.value = task.priority;

    const deleteItem = document.createElement("button");
    deleteItem.className = "deleteButton";
    deleteItem.onclick = deleteButtonClick;
    deleteItem.innerText = "Delete"

    const editButton = document.createElement("button");
    editButton.className = "editButton";
    editButton.onclick = editButtonClick;
    editButton.innerText = "Edit";
    
    const saveButton = document.createElement("button");
    saveButton.className = "saveButton";
    saveButton.onclick = saveButtonClick;
    saveButton.innerText = "Save";

    listItem.appendChild(nameSpan);
    listItem.appendChild(nameInput);
    listItem.appendChild(prioritySelect);
    listItem.appendChild(deleteItem);
    listItem.appendChild(editButton);
    listItem.appendChild(saveButton);
    

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
    
    fetch("http://kalistabaig.me:4000/task", fetchOptions) //send button on postman, mae s actual call to server
    .then((response) =>{
        return response.json();
    })
    .then((data) => {
        var task = data;
        tasks.push(task);
        callback(task)
    })

}

function loadTasks() {
    fetch("http://kalistabaig.me:4000/task") //fetch returns a promise        by default fetch is a get
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
    fetch("http://kalistabaig.me:4000/task/" + taskId, fetchOptions)
    .then((response) => console.log("post status:" + response.status))

}

function editButtonClick(){
    const nameSpan = this.parentNode.getElementsByClassName("nameSpan")[0];
    nameSpan.style.display = "none";
    const nameInput = this.parentNode.getElementsByClassName("nameInput")[0];
    nameInput.style.display = "inline-block";
    nameInput.value = nameSpan.innerHTML;
    const editButton = this.parentNode.getElementsByClassName("editButton")[0];
    editButton.style.display = "none";
    const saveButton = this.parentNode.getElementsByClassName("saveButton")[0];
    saveButton.style.display = "inline-block";
}

function saveButtonClick(){
    const nameSpan = this.parentNode.getElementsByClassName("nameSpan")[0];
    nameSpan.style.display = "inline-block";
    const nameInput = this.parentNode.getElementsByClassName("nameInput")[0];
    nameInput.style.display = "none";
    nameSpan.innerHTML = nameInput.value;
    const editButton = this.parentNode.getElementsByClassName("editButton")[0];
    editButton.style.display = "inline-block";
    const saveButton = this.parentNode.getElementsByClassName("saveButton")[0];
    saveButton.style.display = "none";

    const newPriority = this.parentNode.getElementsByClassName("prioritySelect")[0].value;

    var taskId = this.parentNode.getAttribute("data-id");
    var task = tasks.find(task => task.id == taskId);
    if(!task){
        console.log("Task not found");
        return;
    }
    task.priority = newPriority;
    task.name = nameSpan.innerHTML;

    const fetchOptions = {
        method: "PUT",
        body: JSON.stringify(task),
        mode: 'cors',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }
    fetch("http://kalistabaig.me:4000/task/" + taskId, fetchOptions)
    .then((response) => console.log("post status:" + response.status))

}