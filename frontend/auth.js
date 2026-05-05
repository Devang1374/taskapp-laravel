const BASE_URL = "http://127.0.0.1:8000/api";

//login
async function login() {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    let res = await fetch(BASE_URL+'/login',{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({email,password})
    });

    let data = await res.json();

    if(data.token){
        localStorage.setItem("token",data.token);
        window.location.href = "tamp.html";
    }else{
        alert(data.message);
    }
}

//register
async function register() {
    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    let res = await fetch(BASE_URL + '/register',{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({name,email,password})
    });

    let data = await res.json();
    alert(data.message);

}