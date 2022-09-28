function validar(){
    let bandera = false;
    let nombre = document.getElementById("nombre").value;
    let usuario = document.getElementById("usuario").value;
    let password = document.getElementById("password").value;

    if(nombre != "" && usuario != "" && password != ""){
        bandera = true;
    }
    else{
        if(nombre == ""){
            let spanNombre = document.getElementById("spanNombre");
            spanNombre.classList.remove('noVisible');
            spanNombre.classList.add('siVisible');
        }

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
    





