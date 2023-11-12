
const $msjRojoError = document.getElementById("error")
const $msjVerdeExito = document.getElementById("exito")
const $msjAmarilloAdver = document.getElementById("adver")
const $spiner = document.querySelector("#spiner")
const $seccionContenido = document.querySelector("#sec-contenido");

let datosLocalStorage = JSON.parse(localStorage.getItem(`INFORMES`))
console.log(datosLocalStorage)

//?valores del localStorage()
let valorSvgMapa = ""
let valorTitulo = ""
let valorAnio = ""
let valorTipoEleccion = ""
let valorCago =""
let valorDistrito=""
let valorSeccion=""
let mesasEscrutadas = ""
let electorales = ""
let participacion = ""
let filtroUrlJson = ""

//!!porIndice
let valorPartido=""
let valorVotosPorcentaje = ""
let valroVotosDePartidos=""
//! o como objeto. o puedo usar a los dos con un foreach()
let partidos = [{nombre: "nomb del partido", porcentaje: "25%", votosDePartidos: "2000"},{}]


// let valorCargo = ""
// let valorDistrito = ""
// let valorSeccion = ""
// let valorTipoEleccion = ""
// let valorSvg = ""
// let valorCantidadElectores = ""
// let valorMesasTotalizadas = ""
// let valorParticipacionPorcentaje = ""

//-------Secion Targejta------
//Mapa-porvicioa-svg = svg-Mapa
//seccion-Eleccion = titulo/subtitulo   anio>generales>porvisoiro>senadoers>naciones>bsas
//Datos-Generales = mesas estructuadas / Electorales / Participación sobre Escrutado
//Datos por Agrupaicón = class="tabla-agrupacion"

//*------Start--------
// !! se oculta todo y asta que no se cargue la pagina se deja el sipiner


//!! hay que llamar a la api para volver a extraer los datos



$seccionContenido.classList.add("escondido")
document.addEventListener('DOMContentLoaded', () => {
        mostrarSpiner()
    if (localStorage.getItem("INFORMES") === null) {
        ocultarSpiner(100)
        console.log("No hay nada guardado en le localStorage")
        mostrarMensaje($msjAmarilloAdver, `Debe AGREGAR INFORMES en Pasos o Generales`)
    } else {
        console.log(`Hay algo guardado en el localStorage.\n${datosLocalStorage}`)
        //!! Deberia agregar una fucnion que valla creando las targentas con la info del localStroage()

    }
});




function reconoceTipoElecion(tipo) {
    if (tipoEleccion === tipo) {
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


