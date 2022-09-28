function validar(){
    let bandera = false;
    let usuario = document.getElementById("usuario").value;
    let password = document.getElementById("password").value;

    if(usuario != "" && password != ""){
        bandera = true;
    }
    else{
        if(usuario == ""){
            let spanUsuario = document.getElementById("spanUsuario");
            spanUsuario.classList.remove('noVisible');
            spanUsuario.classList.add('siVisible');
        }

        if(password == ""){
            let spanPassword = document.getElementById('spanPassword');
            spanPassword.classList.remove('noVisible');
            spanPassword.classList.add('siVisible');
        }
    }

    return bandera;
}