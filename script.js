let intentos = 6;
let palabra = "";
let aciertos = 0;

let API = 'https://random-word-api.vercel.app/api?words=1&length=5';

window.addEventListener('load', init)
function init() {
  console.log('Esto se ejecuta solo cuando se carga la pagina web');
  actualizarContadores();
  getWord();
}

//FUNCION ASINCRONA
function getWord(){
  fetch(API).then(response => response.json())
    .then(response => {
      palabra = response[0].toUpperCase();
      console.log(palabra);
      console.log(API);
    })
    .catch(err => {//Si hay un error usar array de palabras
      console.log(err);
      let diccionario = ["APPLE", "BEACH", "BLACK", "BLOOM", "BREAD", "BRICK", "BRUSH", "EXACT",
        "BUNCH", "CANDY", "CHAIR", "CHEST", "CHORD", "CLIFF", "CLOCK", "EXTRA",
        "CLOUD", "COAST", "CRASH", "CREAM", "DANCE", "DESKS", "DOUBT", "EQUAL",
        "DREAM", "DRIFT", "DRILL", "DRINK", "DRIVE", "DWARF", "EARTH", "TABLE",
        "FAINT", "FAITH", "FLAME", "EMPTY", "ENEMY", "ENJOY", "ENTER", "ERROR"];
      palabra = diccionario[Math.floor(Math.random() * diccionario.length)];
    }
  );
}
console.log(palabra);

const BOTON = document.getElementById("guess-button");
const OTRO_INTENTO = document.getElementById("recargar");
const INPUT = document.getElementById("guess-input");
const valor = INPUT.value;
const GRID = document.getElementById("grid");
const LANG = document.getElementById("lang");

OTRO_INTENTO.addEventListener('click', function (e) {
  getWord();
  reiniciar();
});

//Para ue funcione el enter
INPUT.addEventListener("keyup", function (e) {
  BOTON.disabled = !INPUT.value.length;
  if (e.code === 'Enter') {
    BOTON.click();
  }
});
BOTON.addEventListener('click', intentar);
function intentar() {
  const INTENTO = leerIntento();
  //Validar intento
  if(!INTENTO){
    mostrarMensaje("<h2>Debes escribir una palabra</h2>");
    return;
  } else if(INTENTO.length !== 5){
    mostrarMensaje("<h2>La palabra debe tener solo CINCO letras</h2>");
    return;
  }
  mostrarMensaje("");
  if (INTENTO === palabra) {
    mostrarIntento(INTENTO);
    aciertos++;
    intentos--;
    actualizarContadores();
    terminar("<h2>GANASTE!😀</h2>");
    return;
  }
  mostrarIntento(INTENTO);
  intentos--;
  actualizarContadores();
  INPUT.value = '';
  if (intentos == 0) {
    let mensaje = "<h2>PERDISTE!😖</h2>";
    let contenedor = document.getElementById('correct');
    contenedor.innerHTML = mensaje;
    terminar(`<h2>La palabra correcta era ${palabra}</h2>`);
  }
}

LANG.addEventListener('change',showSelected)
function showSelected(){
  /* Para obtener el codigo del lenguaje*/
  var cod = LANG.value;
  console.log(cod);
  API = cod === 'ES' ? 'https://random-word-api.herokuapp.com/word?lang=es&length=5':
    'https://random-word-api.vercel.app/api?words=1&length=5';
    getWord();
    reiniciar();
}

function reiniciar(){
  /*Ocultar mensaje de ganaste o perdiste */
  document.getElementById('guesses').style.display='none';
  /*Ocultar boton de volver a jugar */
  OTRO_INTENTO.style.display = 'none';
  let rows = document.getElementsByClassName('row');
  if(rows.length > 0){
    Array.from(rows).forEach((row) =>{
      console.log(row);
      GRID.removeChild(row);
     });
  }
  /*Reiniciar intentos */
  intentos=6;
  actualizarContadores();
  /*Habilitar input y boton */
  INPUT.disabled = false;
  BOTON.disabled = false;
  INPUT.value = '';
}

function leerIntento() {
  let intento = document.getElementById("guess-input");
  intento = intento.value;
  intento = intento.toUpperCase();
  return intento;
}

function terminar(mensaje) {
  INPUT.disabled = true;
  BOTON.disabled = true;
  OTRO_INTENTO.style.display='block';
  mostrarMensaje(mensaje);
}

function mostrarMensaje(mensaje){
  let contenedor = document.getElementById('guesses');
  contenedor.innerHTML = mensaje;
}

function mostrarIntento(intento){
  const ROW = document.createElement('div');//Este elemento todavia no existe en el HTML y hay que inyectar
  ROW.className = 'row';
  for (let i in palabra) {
    const SPAN = document.createElement('span');
    SPAN.className = 'letter';
    SPAN.innerHTML = intento[i];
    if (intento[i] === palabra[i]) { //VERDE
      SPAN.style.backgroundColor = '#3cb34a';
    } else if (palabra.includes(intento[i])) { //AMARILLO
      SPAN.style.backgroundColor = '#f3c237';
    } else { //GRIS
      SPAN.style.backgroundColor = '#ced7da';
    }
    ROW.appendChild(SPAN);
  }
  GRID.appendChild(ROW);
}

function actualizarContadores(){
  let contenedorIntentos = document.getElementById('intentos-restantes');
  contenedorIntentos.innerHTML = `<p id="intentos-restantes">❤ ${intentos}</p>`;
  let contenedorAciertos = document.getElementById('aciertos');
  contenedorAciertos.innerHTML = `<p id="aciertos">Aciertos: ${aciertos}</p>`;
}