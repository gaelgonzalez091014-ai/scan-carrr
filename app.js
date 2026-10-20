
const autos = {
    "Nissan": ["Versa", "Sentra", "March", "Altima", "Kicks"],
    "Toyota": ["Corolla", "Camry", "Yaris", "RAV4", "Tacoma"],
    "Chevrolet": ["Aveo", "Onix", "Malibu", "Tracker", "Equinox"],
    "Ford": ["Fiesta", "Focus", "Mustang", "Escape", "Explorer"],
    "Volkswagen": ["Jetta", "Golf", "Polo", "Tiguan", "Passat"],
    "Honda": ["Civic", "Accord", "CR-V", "Fit", "HR-V"],
    "Mazda": ["Mazda 2", "Mazda 3", "Mazda 6", "CX-5", "CX-30"],
    "Kia": ["Rio", "Forte", "K3", "Sportage", "Sorento"],
    "Hyundai": ["Accent", "Elantra", "Tucson", "Creta", "Santa Fe"],
    "BMW": ["Serie 1", "Serie 3", "Serie 5", "X1", "X3"],
    "Audi": ["A3", "A4", "A6", "Q3", "Q5"],
    "Mercedes-Benz": ["Clase A", "Clase C", "Clase E", "GLA", "GLC"]
};

const marca = document.getElementById("marca");
const modelo = document.getElementById("modelo");
const anio = document.getElementById("anio");

// Cambiar modelos al seleccionar una marca
if (marca && modelo && anio) {
    marca.addEventListener("change", () => {
        modelo.innerHTML = '<option value="">Selecciona modelo</option>';
        anio.innerHTML = '<option value="">Selecciona año</option>';
        anio.disabled = true;

        (autos[marca.value] || []).forEach(nombre => {
            modelo.add(new Option(nombre, nombre));
        });

        modelo.disabled = !marca.value;
    });

    // Mostrar años al seleccionar un modelo
    modelo.addEventListener("change", () => {
        anio.innerHTML = '<option value="">Selecciona año</option>';

        // Años de ejemplo para el prototipo
        for (let year = 2022; year >= 2018; year--) {
            anio.add(new Option(year, year));
        }

        anio.disabled = !modelo.value;
    });
}

function guardarVehiculo() {
    const motor = document.getElementById("motor").value;

    if (!marca.value || !modelo.value || !anio.value) {
        document.getElementById("mensaje").textContent =
            "Selecciona la marca, el modelo y el año.";
        return;
    }

    localStorage.setItem("vehiculo", JSON.stringify({
        marca: marca.value,
        modelo: modelo.value,
        anio: anio.value,
        motor: motor
    }));

    window.location.href = "diagnostico.html";
}

// Cargar y reproducir el audio seleccionado
const audio = document.getElementById("audio");

if (audio) {
    audio.addEventListener("change", () => {
        const reproductor = document.getElementById("reproductor");

        if (audio.files[0]) {
            reproductor.src = URL.createObjectURL(audio.files[0]);
            reproductor.hidden = false;
        }
    });
}

// Generar diagnóstico demostrativo
function analizar() {
    const vehiculo = JSON.parse(
        localStorage.getItem("vehiculo") || "null"
    );
    const sonido = document.getElementById("sonido").value;
    const archivo = document.getElementById("audio");

    if (!vehiculo) {
        alert("Primero registra el vehículo.");
        location.href = "vehiculo.html";
        return;
    }

    if (!sonido) {
        alert("Selecciona un tipo de sonido.");
        return;
    }

    if (!archivo.files.length) {
        alert("Selecciona un archivo de audio.");
        return;
    }

    const datos = {
        normal: ["Sonido reportado como normal",
            "No se confirma una falla.",
            "Vigila cualquier cambio en el funcionamiento."],
        golpeteo: ["Golpeteo metálico",
            "Posible pieza floja o problema de lubricación.",
            "Solicita una inspección mecánica."],
        chillido: ["Chillido o silbido",
            "Posible problema de correa o polea.",
            "Solicita revisar los componentes."],
        vibracion: ["Vibración irregular",
            "Posible problema de soportes o funcionamiento del motor.",
            "Solicita una revisión profesional."],
        arranque: ["Dificultad de arranque",
            "Posible problema de batería o sistema de arranque.",
            "Solicita comprobar el sistema eléctrico."]
    };

    localStorage.setItem("diagnostico", JSON.stringify({
        vehiculo,
        sonido: datos[sonido]
    }));

    location.href = "resultado.html";
}

// Mostrar el informe
const titulo = document.getElementById("titulo");

if (titulo) {
    const informe = JSON.parse(
        localStorage.getItem("diagnostico") || "null"
    );

    if (informe) {
        const v = informe.vehiculo;
        const d = informe.sonido;

        titulo.textContent = d[0];
        document.getElementById("vehiculo").textContent =
            `Vehículo: ${v.marca} ${v.modelo} ${v.anio} | Motor: ${v.motor}`;
        document.getElementById("observacion").textContent =
            "Observación: " + d[0];
        document.getElementById("causas").textContent =
            "Posibles causas: " + d[1];
        document.getElementById("recomendacion").textContent =
            "Recomendación: " + d[2];
    }
}

