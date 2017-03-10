window.onload = inicializar;
var formIntranet;
var refAlumnos;
var refImagenes;
var storageRef;
var downloadURL;
var imagenASubir;
var tablaIntranet;
var CREATE = "Añadir alumno";
var UPDATE = "Modificar alumno";
var refAlumnoAEditar;
var modo = CREATE;
var soloLectura;
var usuario;

function inicializar(){
  formIntranet = document.getElementById("formIntranet");
  cargarSesion();

  formIntranet.addEventListener("submit", validacionFormIntranet, false);
  document.getElementById("adiosUsuario").addEventListener("click", cambiaDeUsuario, false);

  refAlumnos = firebase.database().ref().child("Alumnos");
  refImagenes = firebase.database().ref().child("Imagenes");
  tablaIntranet = document.getElementById("tabla-intranet");

  storageRef = firebase.storage().ref();

  mostrarListaAlumnosFirebase();
}

/*
* Esta parte de la función ver si el usuario
* que entra tiene los permisos root o no
*/
function cargarSesion(){
  firebase.auth().onAuthStateChanged(function(user) {
    usuario = user;
    if (user.email == "prueba@prueba.com") {
      document.getElementById("formIntranet").style.display = "block";
      soloLectura = false;
    } else {
      soloLectura = true;
      document.getElementById("soloLectura").style.display = "block";
    }
  });
}

function validacionFormIntranet(event){
  event.preventDefault();
  var comodin = 0;
  var elementoConFoco = null;

  /*
  * Esta parte de la función sirve para validar que los
  * campos no estén vacíos
  */

//**************************NOMBRE*****************************************
  var PrimerCampo = document.getElementById("nombre");
  if (PrimerCampo.value.length === 0){
    document.getElementById("errorNombre").style.display = "block";
    elementoConFoco = document.getElementById("nombre");
    comodin = 0;
  } else {
    comodin++;
    document.getElementById("errorNombre").style.display = "none";
    console.log("llegó1");
  }

//************************APELLIDOS****************************************
  var SegundoCampo = document.getElementById("apellidos");
  if (SegundoCampo.value.length === 0){
    if (elementoConFoco === null) {
      document.getElementById("errorApellidos").style.display = "block";
      elementoConFoco = document.getElementById("apellidos");
    } else {
      document.getElementById("errorApellidos").style.display = "none";
    }
    comodin = 0;
  } else {
    comodin++;
    console.log("llegó2");
  }

  /**************************EDAD*****************************************
  * Esta parte de la función sirve para validar la edad
  * que estará entre 16 y 99 años
  */
  var edad = document.getElementById("edad").value;
  if (isNaN(edad) || edad <= 16 || edad >= 99){
    if (elementoConFoco === null) {
      document.getElementById("errorEdad").style.display = "block";
      elementoConFoco = document.getElementById("edad");
    } else {
      document.getElementById("errorEdad").style.display = "none";
    }
    comodin = 0;
  } else {
    comodin++;
    console.log("llegó3");
  }

//**************************SELECT******************************************
  var validarMunicipio = document.getElementById("municipio");
  if(validarMunicipio.value === 0) {
    if (elementoConFoco === null) {
      document.getElementById("errorMunicipio").style.display = "block";
      elementoConFoco = document.getElementById("municipio");
    } else {
      document.getElementById("errorMunicipio").style.display = "none";
    }
    comodin= 0;
  } else {
    comodin++;
  }

//********************RADIO BUTTON******************************************
  var matriculado = event.target.matricula.value;
//***************************CURSO******************************************
  var CuartoCampo = document.getElementById("curso");
  if (CuartoCampo.value.length === 0){
    if (elementoConFoco === null) {
      document.getElementById("errorCurso").style.display = "block";
      elementoConFoco = document.getElementById("curso");
    } else {
      document.getElementById("errorCurso").style.display = "none";
    }
    comodin = 0;
  } else {
    comodin++;
    console.log("llegó4");
  }

//**************************CICLO******************************************
  var QuintoCampo = document.getElementById("ciclo");
  if (QuintoCampo.value.length === 0){
    if (elementoConFoco === null) {
      document.getElementById("errorCiclo").style.display = "block";
      elementoConFoco = document.getElementById("ciclo");
    } else {
      document.getElementById("errorCiclo").style.display = "none";
    }
    comodin = 0;
  } else {
    comodin++;
    console.log("llegó5");
  }

//**************************EMAIL******************************************
  var SextoCampo = document.getElementById("email");
  if (SextoCampo.value.length === 0){
    comodin = 0;
  } else {
    comodin++;
    console.log("llegó6");
  }

//**************************SALIDA*****************************************
  if (comodin == 7) {
    console.log("llegó antes de mandar el form");
    subirImagenAFirebase(event);
  } else {
    elementoConFoco.focus();
  }
}

//***************************IMAGEN****************************************
function subirImagenAFirebase(event){

  var avatar = document.getElementById("avatar");
  imagenASubir = avatar.files[0];

  if (storageRef.child('img/' + imagenASubir.name).put(imagenASubir) === null) {
    document.getElementById("errorIMG").style.display = "block";
    console.log("despliega error imagen");
  } else {
    var uploadTask = storageRef.child('img/' + imagenASubir.name).put(imagenASubir);

    uploadTask.on('state_changed',
    function(snapshot){
      // Progreso de subida de la imagen
    }, function(error) {
      // Error de subida de la imagen
      document.getElementById("errorIMG").style.display = "block";
    }, function() {
      // Imagen enviada correctamente
      downloadURL = uploadTask.snapshot.downloadURL;
      // crearNodoEnFB(imagenASubir.name, downloadURL);
      enviarAltaAfirebase(event, downloadURL);
    });

    document.getElementById("errorIMG").style.display = "none";
    console.log("llegó a mandar la imagen");
  }
}

//************************MOSTRAR LISTA************************************
function mostrarListaAlumnosFirebase(){
  refAlumnos.on("value", function(snap){
    var datos = snap.val();
    var filasQueMostrar = "";
    for (var key in datos) {
      filasQueMostrar += "<tr>" +
                          '<td><img width="32" heigth="32" src="' + datos[key].imagenUrl + '" alt="imagen"></img></td>' +
                          "<td>" + datos[key].nombre + "</td>" +
                          "<td>" + datos[key].apellidos + "</td>" +
                          "<td>" + datos[key].edad + "</td>" +
                          "<td>" + datos[key].municipio + "</td>" +
                          "<td>" + datos[key].matriculado + "</td>" +
                          "<td>" + datos[key].curso + "</td>" +
                          "<td>" + datos[key].ciclo + "</td>" +
                          "<td>" + datos[key].email + "</td>" +
                          "<td>" +
                            '<button class="btn btn-default editarAlumno" data-alumno="' + key + '">' +
                            '<span class="glyphicon glyphicon-pencil"></span>' +
                            '</button>' +
                          "</td>" +
                          '<td>' +
                            '<button class="btn btn-danger borrarAlumno" data-alumno="' + key + '">' +
                            '<span class="glyphicon glyphicon-trash"></span>' +
                            '</button>' +
                          '</td>' +
                        "</tr>";
    }
    tablaIntranet.innerHTML = filasQueMostrar;
    if (soloLectura === false) {
      if(filasQueMostrar !== ""){
        var editarRegistro = document.getElementsByClassName("editarAlumno");
        for (var i = 0; i < editarRegistro.length; i++){
          editarRegistro[i].addEventListener("click", editarAlumnoDeFirebase, false);
        }
        var borrarRegistro = document.getElementsByClassName("borrarAlumno");
        for (i = 0; i < borrarRegistro.length; i++){
          borrarRegistro[i].addEventListener("click", borrarAlumnoDeFirebase, false);
        }
      }
    }
  });
}

function editarAlumnoDeFirebase(){
  var claveDeRegistroAlumnoAEditar = this.getAttribute("data-alumno");
  refAlumnoAEditar = refAlumnos.child(claveDeRegistroAlumnoAEditar);
  refAlumnoAEditar.once("value", function(snap){
    var datos = snap.val();
    document.getElementById("nombre").value = datos.nombre;
    document.getElementById("apellidos").value = datos.apellidos;
    document.getElementById("edad").value = datos.edad;
    document.getElementById("municipio").value = datos.municipio;
    document.getElementById("radioMatricula").value = datos.matricula;
    document.getElementById("curso").value = datos.curso;
    document.getElementById("ciclo").value = datos.ciclo;
    document.getElementById("email").value = datos.email;
  });
  document.getElementById("dar-Alta").value = UPDATE;
  modo = UPDATE;
}

function borrarAlumnoDeFirebase(){
  var claveDeRegistroAlumnoABorrar = this.getAttribute("data-alumno");
  var refAlumnoABorrar = refAlumnos.child(claveDeRegistroAlumnoABorrar);
  refAlumnoABorrar.remove();
}

function enviarAltaAfirebase(event, downloadURL) {
    //event.preventDefault();

    switch (modo) {
      case CREATE:
          console.log("llegó a enviar el form");
          refAlumnos.push({
            nombre: event.target.nombre.value,
            apellidos: event.target.apellidos.value,
            edad: event.target.edad.value,
            municipio: event.target.municipio.value,
            curso: event.target.curso.value,
            ciclo: event.target.ciclo.value,
            matriculado: event.target.matricula.value,
            email: event.target.email.value,
            imagenUrl: downloadURL
          });
          formIntranet.reset();
        break;
      case UPDATE:
          console.log("llegó a enviar el form");
          refAlumnoAEditar.update({
            nombre: event.target.nombre.value,
            apellidos: event.target.apellidos.value,
            edad: event.target.edad.value,
            municipio: event.target.municipio.value,
            curso: event.target.curso.value,
            ciclo: event.target.ciclo.value,
            matriculado: event.target.matricula.value,
            email: event.target.email.value,
            imagenUrl: downloadURL
          });
          modo = CREATE;
          document.getElementById("dar-Alta").value = CREATE;
          formIntranet.reset();
        break;
    }
}

//------------------OTRAS FUNCIONES FUERA DEL CRUD---------------------------//

function cambiaDeUsuario(){
  console.log(usuario.email);
  firebase.auth().signOut()
  .then(function(result){
    console.log("cierre de sesión con éxito");
    window.location.href = "inicioSesion.html";
  })
  .catch(function(error) {
    document.getElementById("errorSalirSesion").style.display = "block";
  });
}
