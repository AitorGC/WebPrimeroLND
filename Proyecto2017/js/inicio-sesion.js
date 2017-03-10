window.onload = inicializar;

var formularioInicioSesion;

function inicializar(){
  formularioInicioSesion = document.getElementById("formularioSesion");
  formularioInicioSesion.addEventListener("submit", dejarEntrar, false);
}

function dejarEntrar(event){
  event.preventDefault();
  var user = event.target.emailSesion.value;
  var password = event.target.password.value;

  firebase.auth().signInWithEmailAndPassword(user, password)
    .then(function(result){
      window.location.href = "intranet.html";
      console.log("entraste!!");
    })
    .catch(function(error) {
      document.getElementById("errorPassSesion").style.display = "block";
      console.log("No entras");
    });
}
