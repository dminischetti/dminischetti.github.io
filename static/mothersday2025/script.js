// Scene management
let currentScene = 0;
const scenes = document.querySelectorAll(".scene");

function nextScene() {
    if (scenes[currentScene]) scenes[currentScene].classList.remove("active");
    currentScene++;
    if (scenes[currentScene]) {
        scenes[currentScene].classList.add("active");
        animateScene(currentScene);
        setBackgroundFromScene(scenes[currentScene]);
    }
}

// GSAP scene entrance
function animateScene(index) {
    const scene = scenes[index];
    gsap.fromTo(scene, { opacity: 0, y: 40 }, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out"
    });

    // If decoder scene, animate lines
    if (scene.id === "scene-5") {
        const lines = scene.querySelectorAll("li");
        gsap.fromTo(lines, { opacity: 0, x: -20 }, {
            opacity: 1,
            x: 0,
            duration: 0.6,
            stagger: 0.5,
            ease: "power2.out"
        });
    }
}

// Floating hearts logic
let heartClicks = 0;
function createFloatingHeart() {
    const heart = document.createElement("span");
    heart.classList.add("heart");
    heart.innerText = "💗";
    heart.style.left = `${Math.random() * 90 + 5}vw`;
    heart.style.bottom = "-20px";
    document.getElementById("hearts-container").appendChild(heart);

    heart.addEventListener("click", () => {
        heart.remove();
        heartClicks++;
        if (heartClicks >= 3) {
            document.getElementById("heart-counter").classList.remove("hidden");
        }
    });

    setTimeout(() => {
        heart.remove();
    }, 5000);
}
function heartBurst() {
    if (!document.hasFocus()) return;
    let delay = 0;
    for (let i = 0; i < 3; i++) {
        setTimeout(() => {
            createFloatingHeart();
        }, delay);
        delay += 800; // ogni cuore parte 0.8s dopo il precedente
    }
}

setInterval(heartBurst, 9000);

// Easter egg click
function revealEasterEgg() {
    const msg = document.getElementById("easter-msg");
    msg.classList.remove("hidden");
}

// Dynamic particles background
function setBackgroundFromScene(scene) {
    const bg = scene.getAttribute("data-bg");
    let configFile = "";

    switch (bg) {
        case "stars":
            configFile = "assets/particles-stars.json";
            break;
        case "petals":
            configFile = "assets/particles-petals.json";
            break;
        case "glow":
            configFile = "assets/particles-goldglow.json";
            break;
        default:
            configFile = ""; // remove particles
            break;
    }

    if (configFile) {
        tsParticles.loadJSON("tsparticles", configFile)
            .catch(error => {
                console.error("Error loading particles:", error);
            });
    } else {
        const particles = tsParticles.domItem(0);
        if (particles) particles.destroy();
    }
}

// Initial load
window.onload = () => {
    const preloader = document.getElementById("preloader");
    setTimeout(() => {
      preloader.classList.add("loaded");
    }, 1200);    

    animateScene(currentScene);
    setBackgroundFromScene(scenes[currentScene]);
    
    // Fix: Properly add event listeners to all envelopes
    document.querySelectorAll(".envelope").forEach(envelope => {
        envelope.addEventListener("click", function() {
            const msg = this.querySelector(".msg");
            if (msg) {
                msg.classList.toggle("hidden");
                msg.classList.add("revealed");
                this.classList.add("clicked");
                setTimeout(() => this.classList.remove("clicked"), 800);
            }
        });
    });
};