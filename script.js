let currentStage = "0";
let storyData = {};

const storyText = document.getElementById("story-text");
const choices = document.getElementById("choices");
const backgroundImage = document.getElementById("background-image");
const character1 = document.getElementById("character1");
const character2 = document.getElementById("character2");
const backgroundMusic = document.getElementById("background-music");
const soundToggle = document.getElementById("sound-toggle");

// Cargar la historia desde story.json
fetch("story.json")
    .then(response => {
        if (!response.ok) throw new Error("Error al cargar la historia");
        return response.json();
    })
    .then(data => {
        storyData = data;
        loadProgress(); // Cargar progreso guardado
        updateStory();
    })
    .catch(error => console.error("Error cargando la historia:", error));

function updateStory() {
    const stage = storyData[currentStage];
    if (!stage) return;

    // Actualizar el texto de la historia
    storyText.textContent = stage.text;

    // Actualizar la imagen de fondo
    if (stage.background) {
        backgroundImage.src = stage.background;
    }

    // Actualizar las imágenes de los personajes
    if (stage.characters) {
        if (stage.characters[0]) {
            character1.src = stage.characters[0];
            character1.style.opacity = 1; // Mostrar personaje
        } else {
            character1.style.opacity = 0; // Ocultar personaje
        }
        if (stage.characters[1]) {
            character2.src = stage.characters[1];
            character2.style.opacity = 1; // Mostrar personaje
        } else {
            character2.style.opacity = 0; // Ocultar personaje
        }
    }

    // Actualizar las opciones de elección
    choices.innerHTML = "";
    if (stage.options && stage.options.length > 0) {
        stage.options.forEach((option, index) => {
            const button = document.createElement("button");
            button.textContent = option.text;
            button.onclick = () => {
                currentStage = option.nextStage;
                saveProgress(); // Guardar progreso
                updateStory();
            };
            choices.appendChild(button);
        });
    } else if (stage.ending) {
        // Mostrar el final si no hay opciones
        storyText.textContent += `\n\n${stage.ending}`;
        showRestartButton(); // Mostrar botón de "Volver a jugar"
    }
}

// Mostrar botón de "Volver a jugar"
function showRestartButton() {
    const restartButton = document.createElement("button");
    restartButton.textContent = "Volver a jugar";
    restartButton.id = "restart-button";
    restartButton.onclick = () => {
        currentStage = "0"; // Reiniciar al inicio
        localStorage.removeItem("currentStage"); // Eliminar progreso guardado
        updateStory();
    };
    choices.appendChild(restartButton);
}

// Guardar progreso en localStorage
function saveProgress() {
    localStorage.setItem("currentStage", currentStage);
}

// Cargar progreso desde localStorage
function loadProgress() {
    const savedStage = localStorage.getItem("currentStage");
    if (savedStage) {
        currentStage = savedStage;
    }
}

// Manejo de teclado para seleccionar opciones
document.addEventListener("keydown", (event) => {
    const stage = storyData[currentStage];
    if (stage.options && stage.options.length > 0) {
        if (event.key === "1") {
            currentStage = stage.options[0].nextStage;
            saveProgress();
            updateStory();
        } else if (event.key === "2" && stage.options.length > 1) {
            currentStage = stage.options[1].nextStage;
            saveProgress();
            updateStory();
        }
    }
});

// Ajustar el volumen al cargar la página
window.addEventListener("load", () => {
    backgroundMusic.volume = 0.25; // Ajusta el volumen (0.0 a 1.0)
});

// Controlar la reproducción de la música al hacer clic en el botón
soundToggle.addEventListener("click", () => {
    if (backgroundMusic.paused) {
        backgroundMusic.play();
        soundToggle.textContent = "🔊 Desactivar Sonido";
    } else {
        backgroundMusic.pause();
        soundToggle.textContent = "🔇 Activar Sonido";
    }
});