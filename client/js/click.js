let input = document.querySelectorAll("input");

input.forEach(item => item.addEventListener('click',(e) => {
    tipo = e.target.id;

    //QUITAR LOS SPANS CON RESPECTO A SU INPUT
    if(tipo == "nombre"){
        let spanNombre = document.getElementById("spanNombre");
        if(spanNombre.className == "siVisible"){
            spanNombre.classList.remove('siVisible');
            spanNombre.classList.add('noVisible');
        }
    }

    if(tipo == "usuario"){
        let spanUsuario = document.getElementById("spanUsuario");
        if(spanUsuario.className == "siVisible"){
            spanUsuario.classList.remove('siVisible');
            spanUsuario.classList.add('noVisible');
        }
    }

    if(tipo == "password"){
        let spanPassword = document.getElementById("spanPassword");

        if(spanPassword.className == "siVisible"){
            spanPassword.classList.remove('siVisible');
            spanPassword.classList.add('noVisible');
        }
    }
}))
    