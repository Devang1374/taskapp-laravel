const BASE_URL = "http://127.0.0.1:8000/api";

window.onload = getTasks();

//add Task To database
async function createTask() {
    let title = document.getElementById("title").value;

    let res = await fetch(BASE_URL+'/task',{
        method:"POST",
        headers:{
            "Content-Type":"application/json",
            "Authorization":"Bearer "+localStorage.getItem("token")
        },
        body:JSON.stringify({title})
    });

    let data = await res.json();
    alert(data.message);

    getTasks();
}

//get Task from Database
async function getTasks() {
    if(localStorage.getItem("token") == null){
        window.location.href = "index.html";
    }

    let res = await fetch(BASE_URL+'/task',{
        method:"GET",
        headers:{   
            "Authorization":"Bearer "+localStorage.getItem("token")
        }
    });

    let data = await res.json();

    let list = document.getElementById("tasklist");
    list.innerHTML = "";

    data.task.forEach(task => {
        let li = document.createElement("li");
        li.innerText = task.title;
        list.appendChild(li);
    });

}

function logout(){
    localStorage.removeItem("token");
    window.location.href = "index.html";
}