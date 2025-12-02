/*
IMPORTS
*/
gsap.registerPlugin(ScrollTrigger);
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

document.addEventListener("DOMContentLoaded", () => {
//  Elegir colores al cargar la página
let color1 = "";
let color2 = "";
let color3 = "";
let color4 = "";

function elegirColores() {
  const estilosRoot = getComputedStyle(document.documentElement);
  const coloresRoot = [estilosRoot.getPropertyValue("--morado"), estilosRoot.getPropertyValue("--verde"), estilosRoot.getPropertyValue("--amarillo"), estilosRoot.getPropertyValue("--rojo")];
  color1 = coloresRoot[Math.floor(Math.random() * coloresRoot.length)];
  color2 = coloresRoot[Math.floor(Math.random() * coloresRoot.length)];
  color3 = coloresRoot[Math.floor(Math.random() * coloresRoot.length)];
  color4 = coloresRoot[Math.floor(Math.random() * coloresRoot.length)];
}
elegirColores();

/*
PREPARACIÓN WEB 
*/
/* ScrollTrigger.config({ ignoreMobileResize: true });
ScrollTrigger.refresh(); */
window.onbeforeunload = function () {
    window.scrollTo(0, 0);
  };
window.addEventListener("load", () => { 
  gsap.to("#loader", {
    autoAlpha: 0,
    duration: 2
  })
});




function setFullHeight() {
  document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
}
setFullHeight();

//  Elegir cursor
let opcionesCursor = [
  "../img/cursor/cursor.png",
  "../img/cursor/cursor-verde.png",
  "../img/cursor/cursor-morado.png",
  "../img/cursor/cursor-amarillo.png",
  "../img/cursor/cursor-rojo.png"
];
document.body.style.cursor = "url(" + opcionesCursor[Math.floor(Math.random() * 5)] + "), auto";

//  Preparar imágenes
let opcionesImagenes = [
  "../img/duelo.png",
  "../img/interfaz.png",
  "../img/sociedad.png",
  "../img/transformacion.png",
  "../img/trafico.png",
  "../img/ordenador.png",
];
/*
Preparación modelos responsive
*/

let ancho;
let escalaModelos = 1;
let posicionamientoModelos = [0,0,0]
function obtenerEscala() {
  ancho = window.innerWidth;
  if (ancho < 480) {
    escalaModelos = 1;
    
  }
  else if (ancho < 768) escalaModelos = 1.2;
  else if (ancho < 1024) escalaModelos = 1.4;
  else{
    escalaModelos = 1.7;
    if (modeloInicio) {
      posicionamientoModelos = [2, -3, -18];
    }
    if (modeloEntrada) {
      posicionamientoModelos = [0, -2, -12];
      escalaModelos = 1.5;
    }
  } 
}


/*
VARIABLES GENERALES
*/
let t = 0;

let raton = { x: 0, y: 0 };
window.addEventListener('mousemove', (event) => {
    // Normalizamos la posición entre -1 y 1
    raton.x = (event.clientX / window.innerWidth) * 2 - 1;
    raton.y = -(event.clientY / window.innerHeight) * 2 + 1;
});


//  Grida inicial
let gridaRaton;
let tamanoGrida = Number(clamp(10, 12, 200));
gsap.set("#hero .titulo", { fontSize: tamanoGrida * 4.5 })

//  Texto con efecto glitch
let textoGlitch = document.getElementById("textoglitch");
let progresoPrevio = 0;

//  Configuraciones de la escena 3D
const canvas = document.getElementById("canvasWeb");
const escena = new THREE.Scene();
const render = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
  alpha: true
});
render.setSize(window.innerWidth, window.innerHeight);
render.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const camara = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camara.position.set(0, 0, -10);
escena.add(camara);

const luz = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
escena.add(luz);

//  Preparación del canvas de la grida
const canvasGrida = document.getElementById("canvasGrida");
const escenaGrida = new THREE.Scene();
const renderGrida = new THREE.WebGLRenderer({
  canvas: canvasGrida,
  antialias: true,
  alpha: true
});
renderGrida.setSize(window.innerWidth, window.innerHeight);
renderGrida.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const camaraGrida = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camaraGrida.position.set(0, 0, -10);
escenaGrida.add(camaraGrida);

const luzGrida = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
escenaGrida.add(luzGrida);

//  Preparación del canvas de la seccion corrientes
const canvasCorrientes = document.getElementById("canvasCorrientes");
const escenaCorrientes = new THREE.Scene();
const renderCorrientes = new THREE.WebGLRenderer({
  canvas: canvasCorrientes,
  antialias: true,
  alpha: true
});
renderCorrientes.setSize(window.innerWidth, window.innerHeight);
renderCorrientes.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const camaraCorrientes = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camaraCorrientes.position.set(0, 0, -10);
escenaCorrientes.add(camaraCorrientes);

const luzCorrientes = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
escenaCorrientes.add(luzCorrientes);

//  Preparación del canvas de la tele
const canvasTele = document.getElementById("canvasTele");
const escenaTele = new THREE.Scene();
const renderTele = new THREE.WebGLRenderer({
  canvas: canvasTele,
  antialias: true,
  alpha: true
});
renderTele.setSize(window.innerWidth, window.innerHeight);
renderTele.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const camaraTele = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camaraTele.position.set(0, 0, -10);
escenaTele.add(camaraTele);

const luzTele = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
escenaTele.add(luzTele);

//  Cortina de aparición del segundo modelo
const cortinaGeometria = new THREE.PlaneGeometry(4, 2);
const cortinaMaterial = new THREE.MeshBasicMaterial({ color: "#000000" });
const cortina = new THREE.Mesh(cortinaGeometria, cortinaMaterial);
cortina.position.set(0, 0, -14)
const aristas = new THREE.EdgesGeometry(cortina.geometry);
const arista = new THREE.LineSegments(aristas, new THREE.LineBasicMaterial({ color: cssToThree(color3) }));
cortina.add(arista); 

//  Modelos 3D
let modelo; 
let modeloInicio;
let modeloEntrada;
let modeloCorrientes;

let posicionModeloEntrada = 10;
let inicioMovimientoCanvas = false;

let zonaModeloInicio = true;
let zonaModeloEntradas = true;
let zonaModeloCorrientes = true;

const ejeModeloInicio = new THREE.Vector3(0, 1, 0);

const loader = new GLTFLoader();
let clock = new THREE.Clock();

//  Función de clamp artificial para el tamaño de las gridas
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
//  Grida decorativa
let grid;
const minRot = 0.04;
const maxRot = 0.09;
let rotDeseada;

if (( window.scrollY || window.pageYOffset) <=700) {
  grid =  new THREE.GridHelper(tamanoGrida, 30, 0x000000, 0x000000);
} else {
  grid =  new THREE.GridHelper(tamanoGrida, 30, 0xffffff, 0xffffff);
}

grid.material.opacity = 0.50;
grid.material.transparent = true;
grid.rotation.x = 0.03;
grid.rotation.y = 0.047;
grid.rotation.z = 0.02;
grid.position.z = -15;
grid.position.y = -0.1;
escenaGrida.add(grid);

// Adaptar a formato válido con three.js los colores de las secciones
function cssToThree(color) {
  return Number(color.replace("#", "0x"));
}
/* gsap.set("#canvasWeb", { zIndex: 100, y: 0 }) */
//  Prevenimos que el modelo inicial se cargue si se recarga la página en mitad de scroll

window.addEventListener("scroll", () => {
  let scrollPos = window.scrollY || window.pageYOffset;
 /*  console.log(scrollPos) */
  if (scrollPos <= 700) {
    gridaRaton = false;
    zonaModeloInicio = true;
    grid.material.color.set(0x000000); 
    grid.material.vertexColors = false;            
    grid.material.needsUpdate = true;      
    gsap.set(".letterbox", {
      autoAlpha: 1
    })
    gsap.set("#canvasWeb", { zIndex: 400, y: 0 })
  } else {
    gridaRaton = true;
    grid.material.color.set(0xffffff); 
    grid.material.vertexColors = false;            
    grid.material.needsUpdate = true;    
    zonaModeloInicio = false;
    gsap.set(".letterbox", {
      autoAlpha: 0
    })
  }
/*   if (scrollPos >= 9900) {
    gsap.set("#canvas2d", { autoAlpha: 1 })
  } else {
    gsap.set("#canvas2d", { autoAlpha: 0 })
  } */
  if (scrollPos > 700 && scrollPos <= 3100) {
/*     gsap.set("#canvasWeb", {
      y: "0"
    }) */
    if (!zonaModeloEntradas) {
      entrarZonaNacimiento()
    }
    zonaModeloEntradas = true;
  } else {
    if (zonaModeloEntradas) {
      salirZonaNacimiento()
    }
    zonaModeloEntradas = false;
  }
 /*  if ((scrollPos > 2500 && scrollPos <= 2900) || (scrollPos > 7200 && scrollPos <= 7300)) {
    gsap.set("#canvasWeb", {
      y: "-100vh"
    })
  } */
  if (scrollPos > 3100 && scrollPos <= 7200) { 
    escena.add(cortina);
    escena.add(modelo);
  } else {
    escena.remove(cortina);
    escena.remove(modelo);
    
  }
  if (scrollPos > 7300 && scrollPos <= 9000) { // Revisar cuando actualice el maquetado
    zonaModeloCorrientes = true;
  } else {
    zonaModeloCorrientes = false;
  }
});


//  Cargar primer modelo
loader.load(
  "../modelos/ps1_lowpoly_retro_person.glb",
  (gltf) => {
    modeloInicio = gltf.scene;
    posicionamientoModelos = [2, -2, -18];
    obtenerEscala();
    modeloInicio.scale.set(escalaModelos, escalaModelos, escalaModelos);
    modeloInicio.position.z = posicionamientoModelos[2];
    modeloInicio.position.y = posicionamientoModelos[1];
    modeloInicio.position.x = posicionamientoModelos[0];
    modeloInicio.rotation.z = 0.2;
    //  Cambiar color del modelo
    modeloInicio.traverse((child) => {
        if (child.isMesh && child.name === 'Civ001__0') {
            child.material.color.set(cssToThree(color1)); 
        }
    });
    //  Usando el medidor de antes
    if (zonaModeloInicio) escena.add(modeloInicio);    
  },
  (xhr) => console.log((xhr.loaded / xhr.total * 100) + "% cargado del inicial"),
  (err) => console.error("Error cargando modelo inicial", err)
);

//  Configuraciones primera seccion
gsap.set("#hero .span-color", { color: color1 });
gsap.set(".letterbox", { backgroundColor: color1 });
gsap.set(".navbar", { background: "linear-gradient(to bottom, " + color1 + " 0%, transparent 100%)"});

//  Configuraciones segunda sección
gsap.set(".barra-xp", { backgroundColor: color2 });
gsap.set(".cuadro-xp", { borderColor: color2 });

//  Configuraciones tercera sección
/* gsap.set(".div-cristal", { borderColor: color3 }) */
gsap.set(".titulo-entrada .span-color", { color: color3 });

//  Configuraciones cuarta sección
gsap.set("#decodificar", { color: color4 });
/* gsap.set("#corrientes .div-cristal", { borderColor: color4 }) */
gsap.set("#corrientes .deco-corrientes", { color: color4 })
gsap.set(".overlay", { backgroundColor: color4 });



//  Primer Wipe
gsap.set(".wipe.horizontal", { xPercent: 150 });
const wipe1tl = gsap.timeline();

wipe1tl.set("#hero .titulo", { zIndex: 40 })
.to(".wipe.horizontal", {
  xPercent: -200,
  ease: "none",
  scrollTrigger: {
    trigger: "#hero",
    start: "30px top",
    end: "40% top",
    scrub: 1,
    markers: true, 
    pin: "#hero",
    onUpdate: (self) => {
      //  Mientras está activo
      console.log("lo intento")
      if (self.progress < 1) {
        if (modeloInicio) {
          escena.add(modeloInicio);
        }
        gsap.to(".letterbox", {backgroundColor: color1});
        gsap.set(".navbar", { autoAlpha: 1, duration: 1 });
        gsap.set("#hero", { autoAlpha: 1, duration: 0 });
        gsap.to(".wipe.horizontal", { autoAlpha: 1, duration: 0 });
        /* escena.add(grid) */
      }
      //  Al terminar
      if (self.progress === 1) {
        escena.remove(modeloInicio);
        gsap.to(".letterbox", {backgroundColor: "var(--negro)"})
        gsap.set(".navbar", { autoAlpha: 0, duration: 0 });
        gsap.set("#hero", { autoAlpha: 0, duration: 0 });
        gsap.to(".wipe.horizontal", { autoAlpha: 0, duration: 0.2 });
        /* escena.remove(grid); */
      }
    }
  }
})
//  COnfiguraciones de la grida
/* .to(grid.rotation, {
  x: "-=1",
  y: "+=0.5",
  scrollTrigger: {
    trigger: "#hero",
    start: "top top",
    end: "top bottom",
    markers: true,
    scrub: 3,
  }
}, "<") */
.to("#hero .titulo", {
  y: "-=400",
  scrollTrigger: {
    trigger: "#hero",
    start: "top top",
    end: "40% top",
    scrub: 2,
  }
}, "<");

// PARALLAX DE LAS LÍNEAS VHS
gsap.to(".vhs-container", {
  y: "-=200vh",
  ease: "none",
  scrollTrigger: {
    trigger: "#nacimiento",
    start: "-80% top",
    end: "250% bottom",
    /* markers: true, */
    scrub: 3
  }
});



function entrarZonaNacimiento() {
  loader.load(
    "../modelos/ctr_tv_psxps1_style.glb",
    (gltf) => {
      modeloEntrada = gltf.scene;
      modeloEntrada.position.set(0, -2 ,-12);
      obtenerEscala();
      modeloEntrada.scale.set(escalaModelos, escalaModelos, escalaModelos);
      modeloEntrada.position.set(posicionamientoModelos[0], posicionamientoModelos[1], posicionamientoModelos[2]);
      modeloEntrada.rotation.y = 4.7
      modeloEntrada.traverse((child) => {

        if (child.isMesh && child.name === 'Screen_Material002_0') {
            const loader = new THREE.TextureLoader();
            const texture = loader.load(opcionesImagenes[Math.floor(Math.random() * 6)], () => {
              // Opcional: ajustar si la textura se ve invertida
              /* texture.flipY = false; */
              texture.colorSpace = THREE.SRGBColorSpace;
              texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping; 
              child.material.map = texture;
              child.material.needsUpdate = true;

              // Opcional para materiales PBR
              child.material.metalness = 0;
              child.material.roughness = 1;
            });
          }
      });
      escenaTele.add(modeloEntrada);
      gsap.timeline({
        scrollTrigger: {
          trigger: "#nacimiento",
          start: "top 40%",
          end: "bottom top",
          scrub: 1,
          onUpdate: (self) => {
            let p = self.progress;
            modeloEntrada.position.y = (-2) + (p * 7);
          }
        }
      });
    },
    (xhr) => console.log((xhr.loaded / xhr.total * 100) + "% cargado de entrada"),
    (err) => console.error("Error cargando modelo de entrada", err)
  );
}
function salirZonaNacimiento() {
  escenaTele.remove(modeloEntrada);
 /*  gsap.set("#canvasWeb", { zIndex: 10 }) */
}

//  Cambio de texto Glitch
ScrollTrigger.create({
  trigger: "#nacimiento",
  start: "top 40%",
  end: "+=1000",      
  scrub: true,
 /*  markers: true,  */
  pin: ".div-xp",
  onUpdate: (self) => {
    let p = self.progress;  // 0 → 1
    // GLITCH 
        const glitchIntensity = Math.pow(
            Math.sin(p * Math.PI),  //  Recorrido senoidal aprovehcando el rango 0-1
            3                       //  Intensidad de la potencia   
        );  

        // RGB
        textoGlitch.style.textShadow = `
        ${glitchIntensity * 15}px 0   rgba(255,0,0,0.8),
        ${glitchIntensity * -10}px 0  rgba(0,255,0,0.8),
        ${glitchIntensity * 5}px 0  rgba(0,0,255,0.8),`;

        // BLUR 
        textoGlitch.style.filter = `blur(${glitchIntensity*2}px)`;

        // Temblor
        textoGlitch.style.transform = `
        translate(${Math.sin(p * 50) * glitchIntensity * 5}px,
                    ${Math.cos(p * 70) * glitchIntensity * 5}px)
        rotate(${Math.sin(p * 30) * glitchIntensity * 3}deg)
        `;

        // Opacidad hacia 0 antes del cambio
        textoGlitch.style.opacity = 1 - glitchIntensity * 1.2;
        if (p > 0.5 && progresoPrevio <= 0.5) {
            textoGlitch.innerText = "As brands ventured online, websites became spaces of exploration and bold improvisation. Banner ads, rudimentary animations, and unconventional layouts invited designers and marketers to rethink identity and communication in ways that felt uncertain but exciting. Seen in retrospect, this era wasn’t simply the beginning of digital design—it was the first rotation of a cycle that would shape how creativity evolves, returns, and reinvents itself across generations.";
        } else if (p <= 0.5 && progresoPrevio > 0.5) {
            textoGlitch.innerText = "In the early 1990s, marketing and design found themselves positioned between the fading glow of the analog world and the first flickers of the digital era. Studios were still ruled by physical mockups, hand-drawn typography, and print layouts, yet personal computers quietly entered the scene, offering new tools that felt experimental and full of possibility. Early versions of Photoshop, vector software, and dial-up connections introduced a new creative playground where pixelated textures, compressed images, primitive gradients, and low-poly forms weren’t stylistic choices but natural outcomes of a young digital medium learning its language.";
        }
        progresoPrevio = p;
    }
}
);

//  Movimiento independiente del canvas
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: "#entrada",
    start: "top top",
    end: "bottom top",
    scrub: true,
    /* markers: true */
  }
});

tl.fromTo("#canvasWeb",
  { y: "100vh"
   },      // empieza fuera por abajo
  { y: "0vh", duration: 1 } // llega al centro
);
tl.to("#canvasWeb",
  { y: "0vh", duration: 1 } // no cambia nada → pausa controlada por scroll
);
tl.to("#canvasWeb",
  { y: "-100vh", duration: 1 }
);
gsap.set("#canvasWeb", { zIndex: 300, y: 0 })


//  Carga del modelo 3D del movil
loader.load(
  "../modelos/low_poly_mobile_phone.glb",
  (gltf) => {
    modelo = gltf.scene;
    modelo.position.z = -16;
    modelo.traverse((child) => {
        if (child.isMesh && child.name === 'Phone_Case_PhoneCase_Mat_0') {
            // Cambiar color de la carcasa
            child.material.color.set(cssToThree(color3)); 
        }
    });
    aparicionEntrada();
  },
  (xhr) => console.log((xhr.loaded / xhr.total * 100) + "% cargado"),
  (err) => console.error("Error cargando modelo", err)
);

function aparicionEntrada() {
  /* gsap.set("#canvasWeb", {
    y: "0"
  }) */
  gsap.timeline({
    scrollTrigger: {
      trigger: "#entrada",
      start: "top 40%", 
      end: "bottom top",
     /*  markers:true, */
      scrub: 1
    }
  })
  .to(modelo.position, {
    z: -12,
    ease: "none"
  }, 0.2)
  .to(modelo.rotation, {
    y: Math.PI / 4,
    ease: "none"
  }, 0)
  .to(modelo.position, {
    z: -18,
    ease: "none"
  }, 0.6)
}

//  Efecto decodificar
let decodificacionCompleta = false;
const textoFinal  = "New\nstyle\nawakens\nstrong";
const textoOculto = "The\nstory\nrepeats\nitself";

const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789#%&<>!?$*@";
const ciclos = 10; 
const velocidad = 0.01; 

const textoDecodificado = document.getElementById("decodificar");

let textoPreparado = Array(textoFinal.length).fill(" ");
let textoConfirmado = Array(textoFinal.length).fill(false);


function iniciarDecodificacion() {
  for (let i = 0; i < textoFinal.length; i++) {
    if (textoFinal[i] === " ") {
      textoPreparado[i] = " ";
      continue;
    }
    const caracter = letras[Math.floor(Math.random() * letras.length)];
    const caracterFantasma = textoOculto[i];
    textoPreparado[i] = Math.random() < 0.5 ? caracter : caracterFantasma;
  }
  textoDecodificado.textContent = textoPreparado.join("");
}


function iniciarDecodificacionGeneral() {
    setInterval(() => {
        for (let i = 0; i < textoFinal.length; i++) {
            if (textoConfirmado[i] || textoFinal[i] === " ") continue;

            const caracter = letras[Math.floor(Math.random() * letras.length)];
            const caracterFantasma = textoOculto[i];

            textoPreparado[i] = Math.random() < 0.3 ? caracter : caracterFantasma;
        }
        textoDecodificado.textContent = textoPreparado.join("");
    }, velocidad * 1000);
}


function confirmarLetra(i) {
        return new Promise(resolve => {
            let ciclo = 0;
            const intervalo = setInterval(() => {
                if (ciclo < ciclos) {
                    ciclo++;
                } else {
                    textoPreparado[i] = textoFinal[i];
                    textoConfirmado[i] = true;
                    textoDecodificado.textContent = textoPreparado.join("");
                    clearInterval(intervalo);
                    resolve();
                }
            }, velocidad * 1000);
        });
    }

async function decodificar() {
  if (!decodificacionCompleta) {
    iniciarDecodificacion();
    iniciarDecodificacionGeneral();
    for (let i = 0; i < textoFinal.length; i++) {
        if (textoFinal[i] !== " ") {
            await confirmarLetra(i);
        }
    }
    decodificacionCompleta = true;
  }
}

let entrarCorrientes = false;
loader.load(
  "../modelos/computer_monitor_lowpoly_model.glb",
  (gltf) => {
    modeloCorrientes = gltf.scene;
    modeloCorrientes.scale.set(0.5,0.5,0.5);
    modeloCorrientes.position.set(0,10,-18);
    modeloCorrientes.traverse((child) => {
        if (child.isMesh && child.name === 'Object_5') {
            child.material.color.set(cssToThree(color4)); 
        }
        if (child.isMesh && child.name === 'Object_9') {
            child.material.color.set(cssToThree(color4)); 
        }
    });
    gsap.timeline({
      scrollTrigger: {
        trigger: "#corrientes",
        start: "top bottom", 
        end: "60% bottom",
        /* markers: true, */
        scrub: 1,
        onEnter: () => escenaCorrientes.add(modeloCorrientes),
        onEnterBack: () => escenaCorrientes.add(modeloCorrientes),
        /* onLeave: () => setTimeout(escenaCorrientes.remove(modeloCorrientes), 2000),
        onLeaveBack: () => setTimeout(escenaCorrientes.remove(modeloCorrientes), 2000), */
      }
      })
      .fromTo(modeloCorrientes.position,{ 
        y: 30
      },{ 
        y: -1,
        duration: 1.5
      })
      .to(modeloCorrientes.rotation, {
        z:  calcRotacion,
        duration: 1
      }, "<")
      .to(modeloCorrientes.position, {
        z: -10,
        duration: 1.5
      }, "-=0.3")
      /* .add( () => {
        escenaCorrientes.remove(modeloCorrientes);
      }, ">")   */
    },
  (xhr) => console.log((xhr.loaded / xhr.total * 100) + "% cargado del de corrientes"),
  (err) => console.error("Error cargando modelo de corrientes", err)
);
function calcRotacion() {
  return Math.random() * 0.6 - 0.3;
}
gsap.timeline({
    scrollTrigger: {  
  /*  ScrollTrigger.create({ */
      trigger: "#textoCorrientes", 
      start: "top bottom",    
      end: "bottom 30%", 
      scrub: 1,
     /*  markers: true, */
      onEnter: () => {
        console.log("Entro")
        decodificar()
      },
      onLeaveBack: () => {
        /* escenaCorrientes.remove(modeloCorrientes); */
        console.log("salgo")
      },
      /* onUpdate: () => {
        console.log(modeloCorrientes);
      } */
    }
  }) 
// Fondo canvas
/* var c = document.getElementById("canvas2d"),
    $ = c.getContext('2d'),
    w = c.width = window.innerWidth,
    h = c.height = window.innerHeight,
    p = {
      x: w / 2,
      y: h / 2
    };


function init() {
  stage();
  loop();
}

function stage() {
  w = c.width = window.innerWidth;
  h = c.height = window.innerHeight;
  $.fillStyle = '#ffffff';
  $.fillRect(0, 0, w, h);
}

function step() {
  var s = Math.random() * 50,
      a = ~~(Math.random() * 360);
  $.beginPath();
  $.moveTo(p.x, p.y);
  $.lineWidth = 1;
  $.lineJoin = 'round';
  $.lineCap = 'round';
  $.strokeStyle = color2;
  p.x += s * Math.sin(a);
  p.y += s * Math.cos(a);
  return p;
}

function stepStage() {
  $.fillStyle = 'rgba(0, 255, 255, 0.5)';
  $.fillRect(0, 0, w, h);
}

function draw() {
  stepStage();
  var n = step();
  $.lineTo(n.x, n.y);
  if (n.x < 0 || n.x > w) n.x = Math.random() * w;
  if (n.y < 0 || n.y > h) n.y = Math.random() * h;
  $.stroke();
}

function loop() {
  requestAnimationFrame(loop);
  draw();
}
init();
 */
//  Canvas transicion moderna
const cajaDer = document.getElementsByClassName('der');
const cajaIzq = document.getElementsByClassName('izq');

cajaDer[0].addEventListener('mouseenter', () => {
    gsap.to(".der .overlay", {
      autoAlpha: 0,
      duration: 0.5
    })
});
cajaDer[0].addEventListener('mouseleave', () => {
    gsap.to(".der .overlay", {
      autoAlpha: 1,
      duration: 0.5
    })
});

cajaIzq[1].addEventListener('mouseenter', () => {
    gsap.to(".izq .overlay", {
      autoAlpha: 0,
      duration: 0.5
    })
});
cajaIzq[1].addEventListener('mouseleave', () => {
    gsap.to(".izq .overlay", {
      autoAlpha: 1,
      duration: 0.5
    })
});





gsap.set(".deco-corrientes.der", {
  backgroundImage: "url(" +  opcionesImagenes[Math.floor(Math.random() * 6)] + ")"
})
gsap.set(".deco-corrientes.izq", {
  backgroundImage: "url(" +  opcionesImagenes[Math.floor(Math.random() * 6)] + ")"
})
const tlImagenModernaDer = gsap.timeline({
  scrollTrigger: {
    trigger: "#textoCorrientes",
    start: "30% top",
    end: "bottom top",
    scrub: 2,
    /* markers: true */
  }
});
tlImagenModernaDer.fromTo(".deco-corrientes.der", 
  {
    y: "110vh"
  },{
    y: "-60vh"
  }
)
tlImagenModernaDer.fromTo(".deco-corrientes.izq", 
  {
    y: "110vh"
  },{
    y: "-50vh"
  }, "<=0.2"
)
document.querySelectorAll('*').forEach(el => {
  if (el.scrollHeight > (window.innerHeight * 1.2)) {
    console.log("Elemento sospechoso:", el, "Altura:", el.scrollHeight);
  }
});
gsap.set(".contenedor-lineas", {
  y: "90vh"
})
const tlFooter = gsap.timeline({
  scrollTrigger: {
    trigger: "#footer",
    start: "-50% 50%",
    end: "top 50%",
    scrub: 2,
    /* markers: true */
  }
});
tlFooter.fromTo(".contenedor-lineas", 
  {
    y: "90vh"
  },{
    y: "20vh"
  }
)

function animar() {
  render.render(escena, camara);
  renderGrida.render(escenaGrida, camaraGrida); 
  renderTele.render(escenaTele, camaraTele); 
  renderCorrientes.render(escenaCorrientes, camaraCorrientes); 
  requestAnimationFrame(animar);
  if(gridaRaton){
    // Normalizamos
    let n = (raton.y + 1) / 2;   
    rotDeseada = minRot + (maxRot - minRot) * n;
    grid.rotation.x += (rotDeseada - grid.rotation.x) * 0.1;
    grid.rotation.z += (raton.x * 0.05 - grid.rotation.z) * 0.05;
    grid.position.needsUpdate = true;
  } else {
    grid.rotation.y -= 0.002;
  }
  
  if (modeloInicio) {
    modeloInicio.rotateOnAxis(ejeModeloInicio, 0.01);      
    //  Preparar efecto de seguimiento del ratón con overlays que decoren el Hero
    /* const offset = 0.9;
    modeloInicio.position.x = posicionamientoModelos[0] + raton.x * offset;
    modeloInicio.position.y = posicionamientoModelos[1] + raton.y * offset;   */
  }
  if (modelo) {
      const t = clock.getElapsedTime();
      modelo.rotation.z = modelo.rotation.z + Math.sin(t * -0.2) * 0.01;
      modelo.rotation.x = modelo.rotation.x + Math.sin(t * 0.2) * 0.01;
      modelo.rotation.y = modelo.rotation.y + Math.sin(t * 0.1) * 0.01; 
  }
  if (modeloEntrada) {
      t += 0.05;
      modeloEntrada.rotation.x =  Math.sin(t) * 0.05;
      modeloEntrada.rotation.z =  Math.cos(t) * 0.12;
  }
}
animar();

window.addEventListener("resize", () => {
  camara.aspect = window.innerWidth / window.innerHeight;
  camara.updateProjectionMatrix();
  render.setSize(window.innerWidth, window.innerHeight);
  camaraGrida.aspect = window.innerWidth / window.innerHeight;
  camaraGrida.updateProjectionMatrix();
  renderGrida.setSize(window.innerWidth, window.innerHeight);
  camaraTele.aspect = window.innerWidth / window.innerHeight;
  camaraTele.updateProjectionMatrix();
  renderTele.setSize(window.innerWidth, window.innerHeight);
  camaraCorrientes.aspect = window.innerWidth / window.innerHeight;
  camaraCorrientes.updateProjectionMatrix();
  renderCorrientes.setSize(window.innerWidth, window.innerHeight);
  setFullHeight();
  /* stage(); */
});

})
