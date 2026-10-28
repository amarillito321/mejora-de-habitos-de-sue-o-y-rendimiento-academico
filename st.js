/* SLEEP TIME AND STUDY 🌙 */

// Obtener la fecha actual
function fechaHoy() {
    const fecha = new Date();

    return fecha.getFullYear() + "-" +
        String(fecha.getMonth() + 1).padStart(2, "0") + "-" +
        String(fecha.getDate()).padStart(2, "0");
}

// Cargar los datos guardados
function leerDatos() {
    try {
        return JSON.parse(localStorage.getItem("sleepStudy")) || {
            horario: {
                dormir: "21:00",
                despertar: "06:00"
            },
            rutinas: {},
            registros: {}
        };
    } catch {
        return {
            horario: {
                dormir: "21:00",
                despertar: "06:00"
            },
            rutinas: {},
            registros: {}
        };
    }
}

let datos = leerDatos();

// Guardar información en el navegador
function guardarDatos() {
    localStorage.setItem("sleepStudy", JSON.stringify(datos));
}

// RELOJ DE DESCANSO
function guardarHorario() {
    const dormir = document.getElementById("horaDormir").value;
    const despertar = document.getElementById("horaDespertar").value;

    if (!dormir || !despertar) {
        alert("Selecciona la hora para dormir y despertar.");
        return;
    }

    datos.horario = {
        dormir: dormir,
        despertar: despertar
    };

    guardarDatos();

    document.getElementById("mensajeHorario").textContent =
        "¡Horario guardado! Dormirás a las " + dormir +
        " y despertarás a las " + despertar + ".";
}

function activarDescanso() {
    const hora = document.getElementById("horaDormir").value;

    if (!hora) {
        alert("Primero selecciona tu hora para dormir.");
        return;
    }

    document.getElementById("horaPantalla").textContent = hora;

    document.getElementById("pantallaDescanso")
        .classList.add("activa");
}

function desactivarDescanso() {
    document.getElementById("pantallaDescanso")
        .classList.remove("activa");
}

// RUTINA NOCTURNA Y PUNTOS
function guardarRutina() {
    const fecha = fechaHoy();

    const habitos = [
        ...document.querySelectorAll(".habito")
    ];

    const completados = habitos
        .filter(habito => habito.checked)
        .map(habito => habito.value);

    // Actualizar la rutina del día, sin duplicar puntos
    datos.rutinas[fecha] = completados;

    guardarDatos();
    mostrarPuntos();

    document.getElementById("mensajeRutina").textContent =
        "Completaste " + completados.length +
        " de 4 actividades. ¡Sigue así! 🌸";
}

function mostrarPuntos() {
    let total = 0;

    Object.values(datos.rutinas).forEach(rutina => {
        total += rutina.length * 10;
    });

    const puntos = document.getElementById("puntos");

    if (puntos) {
        puntos.textContent = total;
    }

    const resumen = document.getElementById("resumenHabitos");

    if (resumen) {
        const hoy = datos.rutinas[fechaHoy()] || [];

        resumen.textContent =
            "Hoy llevas " + hoy.length +
            " de 4 hábitos completados.";
    }
}

// REGISTRO DEL SUEÑO
function guardarRegistro() {
    const fecha = document.getElementById("fecha").value;
    const horas = document.getElementById("horas").value;
    const energia = document.getElementById("energia").value;
    const concentracion =
        document.getElementById("concentracion").value;

    if (!fecha || !horas || !energia || !concentracion) {
        document.getElementById("mensajeRegistro").textContent =
            "Completa todos los campos antes de guardar.";
        return;
    }

    datos.registros[fecha] = {
        horas: Number(horas),
        energia: energia,
        concentracion: concentracion
    };

    guardarDatos();

    document.getElementById("mensajeRegistro").textContent =
        "¡Tu registro se guardó correctamente! 💗";

    mostrarGrafico();
    mostrarRegistros();
}

// GRÁFICO DE LOS ÚLTIMOS SIETE DÍAS
function mostrarGrafico() {
    const contenedor = document.getElementById("grafico");

    if (!contenedor) return;

    contenedor.innerHTML = "";

    let hayDatos = false;

    const dias = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

    for (let i = 6; i >= 0; i--) {
        const fecha = new Date();
        fecha.setDate(fecha.getDate() - i);

        const clave =
            fecha.getFullYear() + "-" +
            String(fecha.getMonth() + 1).padStart(2, "0") + "-" +
            String(fecha.getDate()).padStart(2, "0");

        const registro = datos.registros[clave];
        const horas = registro ? registro.horas : 0;

        if (registro) hayDatos = true;

        const fila = document.createElement("div");
        fila.className = "barra-fila";

        const nombre = document.createElement("span");
        nombre.textContent = dias[fecha.getDay()];

        const barra = document.createElement("div");
        barra.className = "barra";

        const relleno = document.createElement("span");
        relleno.style.width =
            Math.min(horas / 12 * 100, 100) + "%";

        barra.appendChild(relleno);

        const cantidad = document.createElement("span");
        cantidad.textContent = registro ? horas + " h" : "—";

        fila.append(nombre, barra, cantidad);
        contenedor.appendChild(fila);
    }

    if (!hayDatos) {
        contenedor.textContent =
            "Guarda tu primer registro para ver el gráfico.";
    }
}

// MOSTRAR REGISTROS GUARDADOS
function mostrarRegistros() {
    const contenedor = document.getElementById("registros");

    if (!contenedor) return;

    contenedor.innerHTML = "";

    const registros = Object.entries(datos.registros)
        .sort((a, b) => b[0].localeCompare(a[0]))
        .slice(0, 7);

    if (registros.length === 0) {
        contenedor.textContent =
            "Todavía no tienes registros guardados.";
        return;
    }

    registros.forEach(([fecha, registro]) => {
        const tarjeta = document.createElement("div");
        tarjeta.className = "registro";

        tarjeta.textContent =
            fecha + " | Sueño: " + registro.horas +
            " horas | Energía: " + registro.energia +
            " | Concentración: " + registro.concentracion;

        contenedor.appendChild(tarjeta);
    });
}

// BORRAR TODOS LOS DATOS
function borrarDatos() {
    if (!confirm("¿Deseas borrar todos tus datos guardados?")) {
        return;
    }

    localStorage.removeItem("sleepStudy");

    datos = {
        horario: {
            dormir: "21:00",
            despertar: "06:00"
        },
        rutinas: {},
        registros: {}
    };

    location.reload();
}

// INICIALIZAR LA PÁGINA ACTUAL
function iniciarAplicacion() {
    const dormir = document.getElementById("horaDormir");
    const despertar = document.getElementById("horaDespertar");
    const fecha = document.getElementById("fecha");

    if (dormir) dormir.value = datos.horario.dormir;
    if (despertar) despertar.value = datos.horario.despertar;
    if (fecha) fecha.value = fechaHoy();

    const habitos = document.querySelectorAll(".habito");
    const rutinaHoy = datos.rutinas[fechaHoy()] || [];

    habitos.forEach(habito => {
        habito.checked = rutinaHoy.includes(habito.value);
    });

    mostrarPuntos();
    mostrarGrafico();
    mostrarRegistros();
}

iniciarAplicacion();
function agregarActividad() {
    const campo = document.getElementById("nuevaActividad");
    const mensaje = document.getElementById("mensajeActividad");
    const nombre = campo.value.trim();

    if (!nombre) {
        mensaje.textContent = "Escribe una actividad antes de agregarla.";
        return;
    }

    const lista = document.getElementById("listaRutina");
    const existe = [...lista.querySelectorAll(".habito")]
        .some(c => c.value.toLowerCase() === nombre.toLowerCase());

    if (existe) {
        mensaje.textContent = "Esa actividad ya está en tu rutina.";
        return;
    }

    const etiqueta = document.createElement("label");
    etiqueta.className = "actividad";

    const casilla = document.createElement("input");
    casilla.type = "checkbox";
    casilla.className = "habito";
    casilla.value = nombre;

    etiqueta.appendChild(casilla);
    etiqueta.appendChild(document.createTextNode(" " + nombre));

    lista.appendChild(etiqueta);

    campo.value = "";
    mensaje.textContent = "Actividad agregada. ¡No olvides guardar tu rutina!";
}

function guardarRutina() {
    if (typeof datos === "undefined" || !datos) {
        document.getElementById("mensajeRutina").textContent =
            "Inicia sesión para guardar tu rutina.";
        return;
    }

    const actividades = [
        ...document.querySelectorAll("#listaRutina .habito")
    ];

    const seleccionadas = actividades
        .filter(c => c.checked)
        .map(c => c.value);

    const personalizadas = actividades
        .filter(c => ![
            "Preparar el uniforme y la maleta",
            "Terminar las tareas",
            "Dejar el celular",
            "Relajarme antes de dormir",
            "Cepillarme los dientes"
        ].includes(c.value))
        .map(c => c.value);

    if (!datos.rutinas) datos.rutinas = {};
    if (!datos.actividadesPersonalizadas) {
        datos.actividadesPersonalizadas = [];
    }

    const hoy = new Date().toLocaleDateString("en-CA");

    datos.rutinas[hoy] = seleccionadas;
    datos.actividadesPersonalizadas = [
        ...new Set([
            ...datos.actividadesPersonalizadas,
            ...personalizadas
        ])
    ];

    if (typeof guardarDatos === "function") {
        guardarDatos();
    }

    const mensaje = document.getElementById("mensajeRutina");
    mensaje.textContent = "¡Tu rutina de hoy se guardó correctamente! 🌙";

    if (typeof mostrarPuntos === "function") mostrarPuntos();

    document.getElementById("resumenHabitos").textContent =
        `Hoy marcaste ${seleccionadas.length} de ${actividades.length} actividades.`;
}