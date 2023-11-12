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

const $divAgrupaciones = document.querySelector("#agrupaciones")

//*span a cambiar con filtro().
const $spanMesasComputadas = document.getElementById("mesas-computadas-porsen")
const $spanElectores = document.getElementById("electores")
const $spanSobreRecuento = document.getElementById("sobre-recuento")

const $spanMapaSvg = document.querySelector("#svg-mapa")

let eleccion_JSON = {} //? se gusra el json en una variable gloval
let filtrado_JSON = {}

//*Guardamos los datos a medida que se van filtrando en estas Variables
let anioElegido = "" //? año seleciconad
let cargoId = "" //? ID de cargo para ir filtrando
let distritoId = "" //? ID de distrito para ir filtrando
let seccionId = ""  //? ID SeccionProvincial del Input escondido/invicible. para el filtrado
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

//---------------Colores---------------
//? getComputedStyle = devuelve los estilos/style que el navegador ha calculado COMO OBJETO
//? (document.docunetElement) = selecciona <html> 
//? getPropretyValue()= toma como argumento el nombre de la propiedad CSS de la cual deseas obtener el valor.
//? cada representa un color = #ee3d8f
const colorPleno = ['--grafica-amarillo', '--grafica-celeste', '--grafica-bordo', '--grafica-lila', '--grafica-lila2', '--grafica-verde', '--grafica-gris']
const colorLiviano = ['--grafica-amarillo-claro', '--grafica-celeste-claro', '--grafica-bordo-claro', '--grafica-lila-claro', '--grafica-lila2-claro', '--grafica-verde-claro', '--grafica-gris-claro']

reconoceTipoElecion()
//*---------------Start-----------------------
document.addEventListener('DOMContentLoaded', () => {
  mostrarMensaje($msjAmarilloAdver, `Debe seleccionar los valores a filtrar y hacer clic en el botón FILTRAR`)

  $botonFiltrar.addEventListener('click', filtrar);
  $btnAgregarInforme.addEventListener("click", agregarAInforme);
});
document.addEventListener('DOMContentLoaded', seleccionAnio); //cuando sudeda este evento se llama automaticamente la funcion async
$selectAnio.addEventListener('change', seleccionCargo); //cuando el <select> cambie se llama a la fun
$selectCargo.addEventListener('change', seleccionDistrito);
$selectDistrito.addEventListener('change', seleccionSeccionProv);
$seccionSelect.addEventListener('change', seleccionCargo);
$seccionSelect.addEventListener('change', () => {
  let opcionSeleccionada = $seccionSelect.options[$seccionSelect.selectedIndex];
  valorSeccion = opcionSeleccionada.textContent; // el texto de la opción seleccionada
});

//*-------------end--------------
// ----------AÑO CON FUNCION ASYNC--------------
async function seleccionAnio() {
  try {
    mostrarSpiner()
    console.log(" ----INICIA el TRY ASYNC DE seleccionAnio---- ")
    resetFiltro()//?deberia reiniciar el filtro
    const respuesta = await fetch(periodosURL); //?aca use await para pausar la ejecución del programa hasta que la API devuelva algo, los datos en crudo se guardan en la variable respuesta.

    if (respuesta.ok) {
      ocultarSpiner()
      borrarTodosLosHijos() //?Deberia borrar todos los hijos de los select

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
  catch (error) {  //?Si en try aparece un error se va a pasar al parametro "error" y entra directamente a catch().
    // ocultarSpiner()
    mostrarErrorCatch(error)
  }
}

// ------------CARGO-----------
async function seleccionCargo() {
  anioElegido = $selectAnio.value //?Ya se selecciona para el filtro final..
  try {
    mostrarSpiner()
    console.log(" ----INICIA el TRY ASYNC DE seleccionCargo---- ")

    const respuesta = await fetch(cargoURL + anioElegido);
    if (respuesta.ok) {
      ocultarSpiner()
      eleccion_JSON = await respuesta.json(); //! Se agrega a la variable global<----------------------
      console.log("----Json, año para elecciones----")
      console.log(eleccion_JSON)

      eleccion_JSON.forEach((eleccion) => {
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
  catch (error) {
    ocultarSpiner()
    mostrarErrorCatch(error)
  }
}

//-------------Distrito con fun---------------------
function seleccionDistrito() {
  console.log(" ----INICIA el FUN DE seleccionDistrito---- ")
  cargoId = $selectCargo.value //?se guarda el cargo elegido anteriormente
  borrarHijos($selectDistrito)
  borrarHijos($seccionSelect)
  eleccion_JSON.forEach((eleccion) => {
    if (eleccion.IdEleccion == tipoEleccion) {  //?Se selecciona el tipo 1 de todos los cargos
      eleccion.Cargos.forEach((cargo) => { //se recorre el array de cargos
        if (cargo.IdCargo == cargoId) { //? Se selecciona el cargo anteriormente seleccionado.
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

//-------------Seccion Provincial con fun---------------
function seleccionSeccionProv() {
  console.log(" ----INICIA LA FUN de seleccionSeccionProv---- ")
  distritoId = $selectDistrito.value
  borrarHijos($seccionSelect)

  eleccion_JSON.forEach((eleccion) => {
    if (eleccion.IdEleccion == tipoEleccion) {  //?Se selecciona el tipo 1 de todos los cargos
      eleccion.Cargos.forEach((cargo) => { //se recorre todo el json()
        if (cargo.IdCargo == cargoId) { //? Se selecciona el cargo anteriormente seleccionado.
          cargo.Distritos.forEach((distrito) => {
            if (distrito.IdDistrito == distritoId) {
              valorDistrito = `${distrito.Distrito}`
              console.log("----Json Distrito para SeccionProv----")
              console.log(distrito)

              distrito.SeccionesProvinciales.forEach((seccionProv) => {
                idSeccionProv = seccionProv.IDSeccionProvincial;
                $inputSeccionProvincial.value = idSeccionProv; //? agrega el valor al input oculto
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

//!!-----------Filtrar-------------
async function filtrar() {
  idSeccionProv = $inputSeccionProvincial.value
  seccionId = $seccionSelect.value

  if (anioElegido === "" || cargoId === "" || distritoId === "" || seccionId === "") {
    mostrarMensaje($msjAmarilloAdver, "Por favor seleccione todos los campos requeridos.");
    console.log(anioElegido + " " + cargoId + " " + distritoId + " " + idSeccionProv)
    $tituloSubTitulo.classList.remove("escondido");
    return;
  }
  let parametros = `?anioEleccion=${anioElegido}&tipoRecuento=${tipoRecuento}&tipoEleccion=${tipoEleccion}&categoriaId=${cargoId}&distritoId=${distritoId}&seccionProvincialId=${idSeccionProv}&seccionId=${seccionId}&circuitoId=&mesaId=`
  let url = getResultados + parametros
  console.log(url);

  let p = `ANIO ${anioElegido} - TIPO RECUENTO ${tipoRecuento} - TIPO ELECCION ${tipoEleccion}CARGO ${cargoId} DISTRITO ${distritoId} SEC PROV${seccionId} idSECCION PROV ${idSeccionProv}`
  console.log(p)
  try {
    mostrarSpiner()
    const respuesta = await fetch(url)
    if (respuesta.ok) {
      ocultarSpiner(200)
      filtrado_JSON = await respuesta.json()
      console.log(filtrado_JSON);
      mostrarMensaje($msjVerdeExito, "Se agrego con éxito el resultado al informe")

      //?se agrega titulo y subtitulo--
      $tituloSubTitulo.querySelector("h1").textContent = `Elecciones ${anioElegido} | ${valorTipoEleccion}`
      let subTitulo = `${anioElegido} > ${valorTipoEleccion} > ${valorCargo} > ${valorDistrito} > ${valorSeccion}`
      $tituloSubTitulo.querySelector("p").textContent = subTitulo

      //?--Guardado en variables globales
      valorCantidadElectores = filtrado_JSON.estadoRecuento.cantidadElectores
      valorMesasTotalizadas = filtrado_JSON.estadoRecuento.mesasTotalizadas
      valorParticipacionPorcentaje = filtrado_JSON.estadoRecuento.participacionPorcentaje
      valorSvg = buscaMapa(valorDistrito)

      //?--Agrega valores a la: <section id="sec-contenido"
      $spanElectores.textContent = valorCantidadElectores
      $spanMesasComputadas.textContent = valorMesasTotalizadas
      $spanSobreRecuento.textContent = valorParticipacionPorcentaje
      $spanMapaSvg.innerHTML = valorSvg //?cambia el svg
      //!agregar cuadro de agrup poli
      // agregaCuadrosAgrupaciones()
      //!y Resumen de votos ---2 cosas---
      //?--Agrega valores a la: <section id="cuadros"



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
  let nuevaCadenaValores = `${anioElegido},${tipoRecuento}, ${tipoEleccion}, ${cargoId}, ${distritoId}, ${idSeccionProv}, ${seccionId}, ${""}, ${""}`//? Crea la lista de todosl lso valores filtrados.
  let listaInforme = []

  if (localStorage.getItem('INFORMES')) {//? si debuelbe null es poque no hay ningun valor asociado la key, entonces no entra en el if.
    listaInforme = JSON.parse(localStorage.getItem('INFORMES'));//? Si key tiene algo, se saca todo lo que esta dentro del localStroage(informes) y se lo guarda en listaInfrome
  }

  if (listaInforme.includes(nuevaCadenaValores)) { //?retorna true si el array contiene el elemento especificado y false si no lo contiene.
    mostrarMensaje($msjAmarilloAdver, "El informe ya se encuentra añadido.");
  } else { //? si la nueva cadena no esta en listaInforme se la agrega al array
    listaInforme.push(nuevaCadenaValores);
    localStorage.setItem('INFORMES', JSON.stringify(listaInforme)); //? y se la agrega a un nuevo item llamado informes
    mostrarMensaje($msjVerdeExito, "Informe agregado con exito");
  }
}

function mostrarMensaje(msj, cadena, tiempo = 4000) {
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
  $tituloSubTitulo.classList.remove("escondido"); //?Se hace vicible el contendio de la pagina
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
  anioElegido = ""
  cargoId = ""
  distritoId = ""
  seccionId = ""
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
function ocultarSpiner(tiempo = 1000) {
  setTimeout(() => {
    $spiner.style.opacity = "0";
    $spiner.addEventListener("transitionend", () => {
      $spiner.classList.add("escondido")
    }), { once: true }
  }, tiempo)
}

//*--Parte dos --- 

function agregaCuadrosAgrupaciones() {
  let agrupaciones = filtrado_JSON.valoresTotalizadosPositivos.sort((a, b) => b.votos - a.votos);
  let idColor = -1;
  let cadenaInnerhtml = ""
  let listaNomb = ""
  let listaNum = ""
  let listaVoto = ""
  let cadenaInicial = `<div class="cuadro-Agrupaciones-centrado">
  <div class="Agrupacion">`
  let cadenaIterada = ``
  if (agrupaciones) { //?si agrupaciones no es null se crea agrupaciones
    agrupaciones.forEach((agrupacion) => {
      if (idColor < 7){
        idColor++
      }
      let indColor = idColor
      let tituloAgrupacion = agrupacion.nombreAgrupacion
      cadenaTitulo = `<p>${tituloAgrupacion}</p>`
      let partidos = agrupacion.listas
      partidos.forEach((partido) => {
        let nombre = partido.nombre
        let porcentajeVotos = (parseFloat(partido.votos * 100) / parseFloat(agrupacion.votos))
        let votos = ` ${partido.votos} votos`
        cadenaPartidos = `<p>JUNTOS</p>
        <div class="progress" style="background: var(--grafica-amarillo-claro);">
            <div class="progress-bar" style="width:75%; background: var(--grafica-amarillo);">
                <span class="progress-bar-text">75%</span>
            </div>
        </div>`
        })
      })
      let cadenaFinal = `</div>
      </div>`
      cadenaInnerhtml = cadenaInicial + cadenaIterada + cadenaFinal;


    $divAgrupaciones.innerHTML = cadenaInnerhtml
  }

}



` <div class="cuadro-Agrupaciones-centrado">
<div class="Agrupacion">


    <p>JUNTOS POR EL CAMBIO</p>


    <p>JUNTOS</p>
        <div class="progress" style="background: var(--grafica-amarillo-claro);">
            <div class="progress-bar" style="width:75%; background: var(--grafica-amarillo);">
                <span class="progress-bar-text">75%</span>
            </div>
        </div>


</div>
</div>`



