const newListButton = document.getElementById("create-new-list-button");
newListButton.onclick = createNewListClick;
const addButton = document.getElementById("addButton");
addButton.onclick = addButtonClick;
let information;
let selectedList;
loadInformation();

function createNewListClick() {
    let newList = {
        listName: document.getElementById("list-name").value,
        listItems: []
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
    
    fetch("http://kalistabaig.com:4000/list", fetchOptions) //send button on postman, mae s actual call to server
    .then((response) =>{
        return response.json();
    })
    .then((data) => {
        var list = data;
        information.push(list);
        callback(list);
        const listDisplay = document.getElementById('taskList');
        while (listDisplay.firstChild) {
            listDisplay.removeChild(listDisplay.firstChild);
        }
        for (let task of list.listItems){
            addTaskToUI(task);
        }
    })
}

function addListToUI(list) {
    console.log('list', list);
    let newList = document.createElement('LI');
    newList.addEventListener('click', displayList)
    newList.setAttribute('data-id', list.id)
    newList.classList.add('list');
    newList.innerHTML = list.listName;

    const deleteListButton = document.createElement("button");
    deleteListButton.className = "delete-list-button";
    deleteListButton.onclick = deleteListClick;
    deleteListButton.innerText = "x";
    
    newList.appendChild(deleteListButton);
    console.log(newList);
    document.getElementById("lists").appendChild(newList);
}

function displayList(e) {
    let selectedListId = e.target.dataset.id;
    selectedList = information.find(list => list.id == selectedListId);
    let tasks = selectedList.listItems;
    const listDisplay = document.getElementById('taskList');
    while (listDisplay.firstChild) {
        listDisplay.removeChild(listDisplay.firstChild);
    }
    document.getElementById('list-title').innerHTML = selectedList.listName;
    for (let task of tasks) {
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
    
    fetch("http://kalistabaig.com:4000/task/", fetchOptions) //send button on postman, mae s actual call to server
    .then((response) =>{
        return response.json();
    })
    .then((data) => {
        var task = data;
        information.find(list => list.id == task.list_id).listItems.push(task);
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

function loadInformation() {
    fetch("http://kalistabaig.com:4000/task") //fetch returns a promise        by default fetch is a get
    .then((response) => response.json())
    .then((data) => {
        information = data; //was tasks
        let list;
        for (list of information) {
            addListToUI(list);
        }
        let defaultList = information[0];
        console.log('default list' , defaultList);
        selectedList = defaultList;
        let task;
        document.getElementById('list-title').innerHTML = defaultList.listName;
        for (task of defaultList.listItems){
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
    fetch("http://kalistabaig.com:4000/list/" + listId, fetchOptions)
    .then((response) => console.log("post status:" + response.status))
}

function deleteButtonClick(){
    setTimeout(() => {
        document.getElementById("taskList").removeChild(this.parentNode);
        var taskId = this.parentNode.getAttribute("data-id");
        const fetchOptions = {
            method: "DELETE"
        }
        fetch("http://kalistabag.com:4000/task/" + taskId + "/" +selectedList.id, fetchOptions)
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
    fetch("http://kalistabaig.com:4000/task/" + taskId, fetchOptions)
    .then((response) => console.log("post status:" + response.status))

}