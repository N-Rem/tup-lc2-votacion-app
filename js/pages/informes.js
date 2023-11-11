
const $msjRojoError = document.getElementById("error")
const $msjVerdeExito = document.getElementById("exito")
const $msjAmarilloAdver = document.getElementById("adver")
const $spiner = document.querySelector("#spiner")
const $seccionContenido = document.querySelector("#sec-contenido");

//?valores del localStorage()
let valorSvgMapa = ""
let valorTitulo =""
let valorAnio =""
let valorTipoEleccion =""
let valor

//-------Secion Targejta------
//Mapa-porvicioa-svg = svg-Mapa
//seccion-Eleccion = titulo/subtitulo   anio>generales>porvisoiro>senadoers>naciones>bsas
//Datos-Generales = mesas estructuadas / Electorales / Participación sobre Escrutado
//Datos por Agrupaicón = class="tabla-agrupacion"

//*------Start--------
$seccionContenido.classList.add("escondido")
mostrarSpiner()
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem("INFORMES") === null ){
        ocultarSpiner(200)
        console.log("no hay nada guardado en le localStorage")
        mostrarMensaje($msjAmarilloAdver, `Debe AGREGAR INFORMES en Pasos o Generales`)
    }else{
        console.log(`Hay algo guardado en el localStorage.\n${localStorage.getItem(INFORMES)}`)
        //!! Deberia agregar una fucnion que valla creando las targentas con la info del localStroage()
    
    }
  });




function reconoceTipoElecion() {
    if (tipoEleccion === 1) {
        valorTipoEleccion = "Pasos"
    }
    else {
        valorTipoEleccion = "Generales"
    }
}

function mostrarSpiner() {
    $spiner.classList.remove("escondido")
    $spiner.style.opacity = "1";
}
function ocultarSpiner(tiempo = 2000) {
    setTimeout(() => {
        $spiner.style.opacity = "0";
        $spiner.addEventListener("transitionend", () => {
            $spiner.classList.add("escondido")
        }), { once: true }
    }, tiempo)
}

function mostrarMensaje(msj, cadena, tiempo = 4000) {
    msj.querySelector(`.mensaje`).textContent = cadena;
    msj.classList.remove("escondido");
    setTimeout(() => {
        msj.classList.add("escondido");
    }, tiempo);
}

function reconoceTipoElecion() {
    if (tipoEleccion === 1) {
      valorTipoEleccion = "Pasos"
    }
    else {
      valorTipoEleccion = "Generales"
    }
  }


  