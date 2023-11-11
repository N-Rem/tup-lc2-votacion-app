import { provinciasSVG } from "./mapas.js";

const periodosURL = "https://resultados.mininterior.gob.ar/api/menu/periodos";
const cargoURL = "https://resultados.mininterior.gob.ar/api/menu?año=";
const getResultados = "https://resultados.mininterior.gob.ar/api/resultados/getResultados"

//Se usa el $ para poder distingir con mayor facilidad los elementos directos del DOM
const $selectAnio = document.getElementById("anio");
const $selectCargo = document.getElementById("cargo");
const $selectDistrito = document.getElementById("distrito");
const $seccionSelect = document.getElementById("seccion");
const $inputSeccionProvincial = document.getElementById("hdSeccionProvincial") //!esta oculto para el usuario y solo guarda IDSecccionProvincial
const $botonFiltrar = document.getElementById('filtrar')
const $msjRojoError = document.getElementById("error")
const $msjVerdeExito = document.getElementById("exito")
const $msjAmarilloAdver = document.getElementById("adver")
const $cuadros = document.querySelector("#cuadros")
const $tituloSubTitulo = document.querySelector("#sec-titulo")
const $contenido = document.querySelector("#sec-contenido")
const $btnAgregarInforme = document.querySelector("#agregar-informe")
const $spiner = document.querySelector("#spiner")


//!!span para cambiar con el filtro.
const $spanMesasComputadas = document.getElementById("mesas-computadas-porsen")
const $spanElectores = document.getElementById("electores")
const $spanSobreRecuento = document.getElementById("sobre-recuento")

const $spanMapaSvg = document.querySelector("#svg-mapa")

const ELECCION_JSON = {} //? se gusra el json en una variable gloval

//!Guardamos los datos a medida que se van filtrando en estas Variables
let periodosSelect = "" //? año seleciconad
let cargoSelect = "" //? ID de cargo para ir filtrando
let distritoSelect = "" //? ID de distrito para ir filtrando
let seccionSeleccionadaID = ""  //? ID SeccionProvincial del Input escondido/invicible. para el filtrado
let idSeccionProv = "" //? ID de la Seccion provicial del Select para el filtrado
const tipoEleccion = 1; //? tipo 1 eleccion PASOS
const tipoRecuento = 1;
let valorCargo = ""
let valorDistrito = ""
let valorSeccion = ""
let valorTipoEleccion = ""
let valorSvg = ""
let valorCantidadElectores = ""
let valorMesasTotalizadas = ""
let valorParticipacionPorcentaje = ""

reconoceTipoElecion()
//*---------------Start-----------------------
document.addEventListener('DOMContentLoaded', () => {
  mostrarMensaje($msjAmarilloAdver, `Debe seleccionar los valores a filtrar y hacer clic en el botón FILTRAR`)

  $botonFiltrar.addEventListener('click', filtrar);
  $btnAgregarInforme.addEventListener("click", agregarAInforme);
});

document.addEventListener('DOMContentLoaded', seleccionAnio); //cuando sudeda este evento se llama automaticamente la funcion async
$selectAnio.addEventListener('change', seleccionCargo); //cuando el <select> cambie se llama a la siguiente fun
$selectCargo.addEventListener('change', seleccionDistrito); //cuando el <select> cambie se llama a la siguiente fun
$selectDistrito.addEventListener('change', seleccionSeccionProv); //cuando el <select> cambie se llama a la siguiente fun
$seccionSelect.addEventListener('change', seleccionCargo); //cuando el <select> cambie se llama a la siguiente fun
$seccionSelect.addEventListener('change', () => {
  let opcionSeleccionada = $seccionSelect.options[$seccionSelect.selectedIndex];
  valorSeccion = opcionSeleccionada.textContent; // el texto de la opción seleccionada
});

//*-------------end--------------
//!! ----------AÑO CON FUNCION ASYNC--------------
async function seleccionAnio() {

  try {
    mostrarSpiner()
    console.log(" ----INICIA el TRY ASYNC DE seleccionAnio---- ")
    resetFiltro()//!deberia reiniciar el filtro
    const respuesta = await fetch(periodosURL); //?aca use await para pausar la ejecución del programa hasta que la API devuelva algo, los datos en crudo se guardan en la variable respuesta.

    if (respuesta.ok) {
      ocultarSpiner()
      borrarTodosLosHijos() //!Deberia borrar todos los hijos de los select

      const anios = await respuesta.json();
      console.log("----Json, Año para Cargo----")
      console.log(anios)

      anios.forEach((anio) => { //?se recorre todo el json()
        const nuevaOption = document.createElement("option"); //? Se Crea una etiqueta <opcion> se le agrega el value y su texto (en este caso el año)
        nuevaOption.value = anio;
        nuevaOption.innerHTML = ` ${anio}`;
        $selectAnio.appendChild(nuevaOption); //? <la nueva etiqueta se agrega como hija de <select> de nuesto html.
      });
    }
    else {
      ocultarSpiner()
      mostrarMensaje($msjRojoError, "Error: Se pordujo un error al intentar agregar reusultados al informe");
    }
    console.log(" ----FINALIZA el TRY ASYNC DE seleccionAnio---- ")

  }
  catch (error) {  //!Si en try aparece un error se va a pasar al parametro "error" y entra directamente a catch().
    ocultarSpiner()
    mostrarErrorCatch(error)
  }
}

//!! ------------CARGO CON FUN ASYNC-----------
async function seleccionCargo() {
  periodosSelect = $selectAnio.value //!!YA se selecciona para el filtro final. Creo que habria que validarlo, si realmente tiene un valor, pero creo que no hace falta, talvez el no validar puede dar un error.
  try {
    mostrarSpiner()
    console.log(" ----INICIA el TRY ASYNC DE seleccionCargo---- ")

    const respuesta = await fetch(cargoURL + periodosSelect);
    if (respuesta.ok) {
      ocultarSpiner()
      borrarTodosLosHijos()
      ELECCION_JSON = await respuesta.json(); //!! Se agrega a la constante global
      console.log("----Json, año para elecciones----")
      console.log(ELECCION_JSON)

      ELECCION_JSON.forEach((eleccion) => {
        if (eleccion.IdEleccion == tipoEleccion) {  //?Se selecciona el tipo 1 de todos los cargos
          eleccion.Cargos.forEach((cargo) => { //?se recorre todo el json()
            const nuevaOption = document.createElement("option"); //? Se Crea una etiqueta <opcion> se le agrega el value y su texto
            nuevaOption.value = cargo.IdCargo;
            nuevaOption.innerHTML = `${cargo.Cargo}`;
            $selectCargo.appendChild(nuevaOption); //?la nueva etiqueta se agrega como hija de <select> de nuesto html.
          })
        }
      });
    }
    else {
      ocultarSpiner()
      mostrarMensaje($msjRojoError, "Error: Se pordujo un error al intentar agregar reusultados al informe");
    }
    console.log(" ----FINALIZA el TRY de ASYNC DE seleccionCargo---- ")
  }
  catch (error) { //!Si en try aparece un error se va a pasar al parametro "error" y entra directamente a catch().
    ocultarSpiner()
    mostrarErrorCatch(error)
  }
}

//!!-------------Distrito con fun---------------------
function seleccionDistrito() {
  console.log(" ----INICIA el FUN DE seleccionDistrito---- ")
  cargoSelect = $selectCargo.value //!se guarda el cargo elegido anteriormente
  borrarHijos($selectDistrito)
  borrarHijos($seccionSelect)
  ELECCION_JSON.forEach((eleccion) => {
    if (eleccion.IdEleccion == tipoEleccion) {  //?Se selecciona el tipo 1 de todos los cargos
      eleccion.Cargos.forEach((cargo) => { //se recorre el array de cargos
        if (cargo.IdCargo == cargoSelect) { //? Se selecciona el cargo anteriormente seleccionado.
          valorCargo = `${cargo.Cargo}` //? Se guarda el nombre del cargo para imprimirlo

          console.log("----Json Cargo para Distrito----")
          console.log(cargo)

          cargo.Distritos.forEach((distrito) => {
            const nuevaOption = document.createElement("option"); //? Se Crea una etiqueta <opcion> se le agrega el value y su texto
            nuevaOption.value = distrito.IdDistrito;
            nuevaOption.innerHTML = `${distrito.Distrito}`;
            $selectDistrito.appendChild(nuevaOption)
          })
        }
      })
    }
  });
  console.log(" ----FINALIZA la FUN DE seleccionDistrito---- ")
}

//!!-------------Seccion Provincial con fun---------------
function seleccionSeccionProv() {
  console.log(" ----INICIA LA FUN de seleccionSeccionProv---- ")
  distritoSelect = $selectDistrito.value
  borrarHijos($seccionSelect)

  ELECCION_JSON.forEach((eleccion) => {
    if (eleccion.IdEleccion == tipoEleccion) {  //?Se selecciona el tipo 1 de todos los cargos
      eleccion.Cargos.forEach((cargo) => { //se recorre todo el json()
        if (cargo.IdCargo == cargoSelect) { //? Se selecciona el cargo anteriormente seleccionado.
          cargo.Distritos.forEach((distrito) => {
            if (distrito.IdDistrito == distritoSelect) {
              valorDistrito = `${distrito.Distrito}`
              console.log("----Json Distrito para SeccionProv----")
              console.log(distrito)

              distrito.SeccionesProvinciales.forEach((seccionProv) => {
                idSeccionProv = seccionProv.IDSeccionProvincial;
                $inputSeccionProvincial.value = idSeccionProv; //! agrega el valor al input oculto
                seccionProv.Secciones.forEach((seccion) => {
                  console.log("----Json Selecciones Provinciales para Secciones----")
                  console.log(seccion)

                  const nuevaOption = document.createElement("option");
                  nuevaOption.value = seccion.IdSeccion;
                  nuevaOption.innerHTML = `${seccion.Seccion}`;
                  $seccionSelect.appendChild(nuevaOption)
                })
              })
            }
          })
        }
      })
    }
  })
  console.log(" ----FINALIZA LA FUN ASYNC DE seleccionSeccionProv---- ")
}

//!!-----------Fun Filtrar-------------
async function filtrar() {
  idSeccionProv = $seccionSelect.value
  seccionSeleccionadaID = $inputSeccionProvincial.value
  let idCircuito = "";
  let IdMesa = "";

  if (periodosSelect === "" || cargoSelect === "" || distritoSelect === "" || idSeccionProv === "") {
    mostrarMensaje($msjAmarilloAdver, "Por favor seleccione todos los campos requeridos.");
    $tituloSubTitulo.classList.remove("escondido");
    return;
  }

  let parametros = `?anioEleccion=${periodosSelect}&tipoRecuento=${tipoRecuento}&tipoEleccion=${tipoEleccion}&categoriaId=${cargoSelect}&distritoId=${distritoSelect}seccionProvincialId=${seccionSeleccionadaID}&seccionId=${idSeccionProv}&circuitoId=${idCircuito}&mesaId=${IdMesa}`
  let url = getResultados + parametros
  console.log(url);
  try {
    mostrarSpiner()
    const respuesta = await fetch(url)
    if (respuesta.ok) {
      ocultarSpiner()
      const filtrado = await respuesta.json()
      console.log(filtrado);
      mostrarMensaje($msjVerdeExito, "Se agrego con éxito el resultado al informe")

      //?se agrega titulo y subtitulo--
      $tituloSubTitulo.querySelector("h1").textContent = `Elecciones ${periodosSelect} | ${valorTipoEleccion}`
      let subTitulo = `${periodosSelect} > ${valorTipoEleccion} > ${valorCargo} > ${valorDistrito} > ${valorSeccion}`
      $tituloSubTitulo.querySelector("p").textContent = subTitulo

      //?--Guardado en variables globales
      valorCantidadElectores = filtrado.estadoRecuento.cantidadElectores
      valorMesasTotalizadas = filtrado.estadoRecuento.mesasTotalizadas
      valorParticipacionPorcentaje = filtrado.estadoRecuento.participacionPorcentaje
      valorSvg = buscaMapa(valorDistrito)

      //?--Agrega valores al html
      $spanElectores.textContent = valorCantidadElectores
      $spanMesasComputadas.textContent = valorMesasTotalizadas
      $spanSobreRecuento.textContent = valorParticipacionPorcentaje
      $spanMapaSvg.innerHTML = valorSvg //?cambia el svg
      //!agregar cuadro de agrup poli y Resumen de votos ---2 cosas---
      mostrarTodo()
    }
    else {
      ocultarSpiner()
      mostrarMensaje($msjRojoError, "Error: El servicio se a caido. Intente mas tarde");
      $tituloSubTitulo.classList.remove("escondido");
    }
  }
  catch (error) {
    ocultarSpiner()
    mostrarErrorCatch(error)
    $tituloSubTitulo.classList.remove("escondido");

  }
}

function buscaMapa(nombreProvincia) {
  let ProvEncontrado = provinciasSVG.find(provincia => provincia.provincia.toUpperCase() === nombreProvincia.toUpperCase());
  return ProvEncontrado.svg
}

function agregarAInforme() {
  let nuevaCadenaValores = `${periodosSelect}, ${valorTipoEleccion}, ${valorCargo}, ${valorDistrito}, ${valorSeccion}, ${valorSvg}, ${valorCantidadElectores}, ${valorMesasTotalizadas}, ${valorParticipacionPorcentaje}`//? Crea la lista de todosl lso valores filtrados.
  let listaInforme = []

  if (localStorage.getItem('INFORMES')) {//? si debuelbe null es poque no hay ningun valor para la key, entonces no entra en el if.
    listaInforme = JSON.parse(localStorage.getItem('INFORMES'));//? Si key tiene algo, se guarda en informes lo que hay dentro de INFORMES. El parse si no me equivoco lo hace obj
  }

  if (listaInforme.includes(nuevaCadenaValores)) { //?retorna true si el array contiene el elemento especificado y false si no lo contiene.
    mostrarMensaje($msjAmarilloAdver, "El informe ya se encuentra añadido.");
  } else {
    listaInforme.push(nuevaCadenaValores);
    localStorage.setItem('INFORMES', JSON.stringify(listaInforme));
    mostrarMensaje($msjVerdeExito, "Informe agregado con exito");
  }
}

function mostrarMensaje(msj, cadena, tiempo = 6000) {
  msj.querySelector(`.mensaje`).textContent = cadena;
  msj.classList.remove("escondido");
  setTimeout(() => {
    msj.classList.add("escondido");
  }, tiempo);
}

function mostrarErrorCatch(error) {
  mostrarMensaje($msjRojoError, "Error: El servicio se a caido. Intente mas tarde")
  console.log("algo salio mal.. puede que el servico este caido.")
  console.log(error)
}

function mostrarTodo() {
  $tituloSubTitulo.classList.remove("escondido"); //!SE hace vicible el contendio de la pagina
  $contenido.classList.remove("escondido");
  $cuadros.classList.remove("escondido");
}

function borrarHijos(padre) {
  let cantHijos = padre.options.length
  for (let i = 1; i <= cantHijos; i++) {
    padre.remove(1)
  }
}

function borrarTodosLosHijos() {
  borrarHijos($selectCargo)
  borrarHijos($selectDistrito)
  borrarHijos($seccionSelect)
}
function resetFiltro() {
  periodosSelect = ""
  cargoSelect = ""
  distritoSelect = ""
  seccionSeleccionadaID = ""
  idSeccionProv = ""
}

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
function ocultarSpiner(tiempo = 3000) {
  setTimeout(() => {
    $spiner.style.opacity = "0";
    $spiner.addEventListener("transitionend", () => {
      $spiner.classList.add("escondido")
    }), { once: true }
  }, tiempo)

}
