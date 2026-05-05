const BASE_URL = "https://taskapp-laravel.onrender.com/api";

//login
async function login() {
    showLoader();

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
        window.location.href = "dashboard.html";
    }else{
        alert(data.message);
    }

    hideLoader();
}

//register
async function register() {
    showLoader();

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

    hideLoader();

}

function showLoader() {
  document.getElementById("loader").style.display = "flex";
}

function hideLoader() {
  document.getElementById("loader").style.display = "none";
}