const baseURL = 'http://localhost:4000';
// const baseURL = 'http://kalistabaig.com:4000';
const newListButton = document.getElementById("create-new-list-button");
newListButton.onclick = createNewListClick;
const addButton = document.getElementById("addButton");
addButton.onclick = addButtonClick;
let lists;
let selectedList;
getLists();

function createNewListClick() {
    let newList = {
        name: document.getElementById("list-name").value,
    }
    document.getElementById("list-name").value ='';
    addListToApi(newList, addListToUI);
}

function addListToApi(list, callback) {
    const fetchOptions = {
        method: "POST",
        body: JSON.stringify(list),        
        mode: 'cors',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    }
    
    fetch(`${baseURL}/lists`, fetchOptions) //send button on postman, mae s actual call to server
    .then((response) =>{
        return response.json();
    })
    .then((data) => {
        var list = data;
        lists.push(list);
        callback(list);
        const listDisplay = document.getElementById('taskList');
        while (listDisplay.firstChild) {
            listDisplay.removeChild(listDisplay.firstChild);
        }
        for (let task of list.tasks){
            addTaskToUI(task);
        }
    })
}

function addListToUI(list) {
    let newList = document.createElement('LI');
    newList.addEventListener('click', displayList);
    newList.setAttribute('data-id', list.id);
    newList.classList.add('list');
    newList.innerHTML = list.name;

    const deleteListButton = document.createElement("button");
    deleteListButton.className = "delete-list-button";
    deleteListButton.onclick = deleteListClick;
    deleteListButton.innerText = "x";
    
    newList.appendChild(deleteListButton);
    document.getElementById("lists").appendChild(newList);
}

function displayList(e) {
    const listDisplay = document.getElementById('taskList');
    while (listDisplay.firstChild) {
        listDisplay.removeChild(listDisplay.firstChild);
    }
    let selectedListId = e.target.dataset.id;
    selectedList = lists.find(list => list.id == selectedListId);
    console.log('selected list ', selectedList);
    document.getElementById('list-title').innerHTML = selectedList.name;
    for (let task of selectedList.tasks) {
        addTaskToUI(task);
    }
}

function addButtonClick() {
    var newTask = {
        name: document.getElementById('todoText').value,
        list_id: selectedList.id,
        priority: document.getElementById('prioritySelector').value
    }
    document.getElementById('todoText').value = "";
    document.getElementById('prioritySelector').value = 0;
    addTaskToApi(newTask, addTaskToUI);  
}

function addTaskToApi(task, callback) { 
    const fetchOptions = {
        method: "POST",
        body: JSON.stringify(task),        
        mode: 'cors',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    }
    
    fetch(`${baseURL}/tasks`, fetchOptions) 
    .then((response) =>{
        return response.json();
    })
    .then((data) => {
        var task = data;
        lists.find(list => list.id == task.list_id).tasks.push(task);
        callback(task)
    })

}

function addTaskToUI(task){
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.onclick = deleteButtonClick;
    const listItem = document.createElement("li");
    listItem.setAttribute("data-id",task.id);
    listItem.classList.add('list-item');
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

    const editButton = document.createElement("button");
    editButton.className = "editButton";
    editButton.onclick = editButtonClick;
    editButton.innerText = "Edit";
    
    const saveButton = document.createElement("button");
    saveButton.className = "saveButton";
    saveButton.onclick = saveButtonClick;
    saveButton.innerText = "Save";

    listItem.appendChild(checkbox);
    listItem.appendChild(nameSpan);
    listItem.appendChild(nameInput);
    listItem.appendChild(prioritySelect);
    listItem.appendChild(editButton);
    listItem.appendChild(saveButton);
    document.getElementById("taskList").appendChild(listItem);
}

function getLists() {
    fetch(`${baseURL}/lists`)
    .then((response) => response.json())
    .then((data) => {
        lists = data; //was tasks
        for (let list of lists) {
            addListToUI(list);
        }
        let defaultList = lists[0];
        selectedList = defaultList;
        document.getElementById('list-title').innerHTML = defaultList.listName;
        for (let task of defaultList.listItems){
            addTaskToUI(task);
        }
    })   
}

function deleteListClick() {
    document.getElementById('lists').removeChild(this.parentNode);
    let listId = this.parentNode.getAttribute("data-id");
    const fetchOptions = {
        method: "DELETE"
    }
    fetch(`${baseURL}/lists/${listId}`, fetchOptions)
    .then((response) => console.log("post status:" + response.status))
}

function deleteButtonClick(){
    setTimeout(() => {
        document.getElementById("taskList").removeChild(this.parentNode);
        var taskId = this.parentNode.getAttribute("data-id");
        const fetchOptions = {
            method: "DELETE"
        }
        fetch(`${baseURL}/tasks/${taskId}`, fetchOptions)
        .then((response) => console.log("post status:" + response.status))
    },1000)
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

    const taskId = this.parentNode.getAttribute("data-id");
    const task = selectedList.tasks.find(task => task.id == taskId);
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
    fetch(`${baseURL}/tasks/${taskId}`, fetchOptions)
    .then((response) => console.log("post status:" + response.status))

}