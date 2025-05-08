// Capture script start time for preloader logic
const startTime = Date.now();

// Scene management
let currentScene = 0;
const scenes = document.querySelectorAll(".scene");
function nextScene() {
    if (scenes[currentScene]) scenes[currentScene].classList.remove("active");
    currentScene++;
    const scene = scenes[currentScene]; // ✅ questo mancava
  
    if (scene) {
      scene.classList.add("active");
      animateScene(currentScene);
      setBackgroundFromScene(scene);
  
      // ✅ Fade-in del bottone dopo 2 secondi
      const nextButton = scene.querySelector(".btn-next");
      if (nextButton) {
        nextButton.classList.remove("visible");
        setTimeout(() => {
          nextButton.classList.add("visible");
        }, 1000);
      }
    }
  }
  

// GSAP scene entrance
function animateScene(index) {
    const scene = scenes[index];
    if (!scene) return; // Guard clause if scene doesn't exist

    gsap.fromTo(scene, { opacity: 0, y: 40 }, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out"
    });

    if (scene.id === "scene-1") {
        typeWriter(
          "Protocol B engaged…\nAccess granted: Silent Hero confirmed.",
          "typewriter"
        );
      }      

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
    
    // Special handling for the credits scene button z-index
    if (scene.id === "scene-9") {
        const button = scene.querySelector(".btn-next");
        if (button) {
            gsap.set(button, { zIndex: 100 }); // Ensure button is above credits animation
        }
    }

    if (scene.id === "scene-10") {
        // Delay night mode activation by 6 seconds
        setTimeout(() => {
          scene.classList.add("night-mode");
        }, 6000);
      }      
     
}

// Floating hearts logic
let heartClicks = 0;
function createFloatingHeart() {
    const heart = document.createElement("span");
    heart.classList.add("heart");
    heart.innerText = "💗"; // You can keep this or use an image/svg
    heart.style.left = `${Math.random() * 90 + 5}vw`;
    heart.style.bottom = "-20px"; // Start from below the viewport
    
    const heartsContainer = document.getElementById("hearts-container");
    if (heartsContainer) {
        heartsContainer.appendChild(heart);
    } else {
        console.error("Hearts container not found!");
        return; // Exit if container is not found
    }


    heart.addEventListener("click", () => {
        heart.remove();
        heartClicks++;
        const heartCounterMsg = document.getElementById("heart-counter");
        if (heartClicks >= 3 && heartCounterMsg) {
            heartCounterMsg.classList.remove("hidden");
        }
    });

    setTimeout(() => {
        heart.remove();
    }, 5000); // Remove heart after 5 seconds if not clicked
}

function heartBurst() {
    if (!document.hasFocus()) return; // Only create hearts if the tab is active
    let delay = 0;
    for (let i = 0; i < 3; i++) {
        setTimeout(() => {
            createFloatingHeart();
        }, delay);
        delay += 800; 
    }
}

// Periodically create bursts of hearts
setInterval(heartBurst, 9000);

// Easter egg click
function revealEasterEgg() {
    const msg = document.getElementById("easter-msg");
    const refreshBtn = document.getElementById("refresh-btn");
    if (msg) msg.classList.remove("hidden");
    if (refreshBtn) refreshBtn.classList.remove("hidden");
  }
  
// Dynamic particles background
function setBackgroundFromScene(scene) {
    if (!scene) return;
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
            configFile = ""; // No specific particle config, effectively removes particles
            break;
    }

    if (typeof tsParticles !== 'undefined') { // Check if tsParticles is loaded
        if (configFile) {
            tsParticles.loadJSON("tsparticles", configFile)
                .catch(error => {
                    console.error("Error loading particles:", error);
                });
        } else {
            const particlesInstance = tsParticles.domItem(0);
            if (particlesInstance) {
                particlesInstance.destroy();
            }
        }
    } else {
        console.warn("tsParticles library not loaded.");
    }
}

// Initial load
window.onload = () => {
    const preloader = document.getElementById("preloader");
    if (preloader) {
        const timeAssetsLoaded = Date.now();
        const elapsedTimeSinceScriptStart = timeAssetsLoaded - startTime;
        const minPreloaderDisplayDuration = 1200; // Minimum time preloader animation is visible

        let delayBeforeFadeStart = 0;
        if (elapsedTimeSinceScriptStart < minPreloaderDisplayDuration) {
            delayBeforeFadeStart = minPreloaderDisplayDuration - elapsedTimeSinceScriptStart;
        }

        setTimeout(() => {
            preloader.classList.add("loaded");
        }, delayBeforeFadeStart);
    }   

    if (scenes.length > 0 && scenes[currentScene]) {
        scenes[currentScene].classList.add("active"); // Ensure the first scene is active
        animateScene(currentScene);
        setBackgroundFromScene(scenes[currentScene]);
    } else {
        console.error("No scenes found or initial scene is missing.");
    }
    
    // Handle envelopes click events
    document.querySelectorAll(".envelope").forEach(envelope => {
        envelope.addEventListener("click", function() {
            const msg = this.querySelector(".msg");
            if (msg) {
                const isRevealed = msg.classList.contains("revealed");

                // Close all other messages first
                document.querySelectorAll('.envelope .msg.revealed').forEach(otherMsg => {
                    if (otherMsg !== msg) {
                        otherMsg.classList.remove("revealed");
                        otherMsg.classList.add("hidden");
                        // Also remove 'clicked' from other envelopes
                        otherMsg.closest('.envelope')?.classList.remove('clicked');
                    }
                });

                // Toggle current message
                if (isRevealed) {
                    msg.classList.remove("revealed");
                    msg.classList.add("hidden");
                    this.classList.remove("clicked");
                } else {
                    msg.classList.remove("hidden");
                    msg.classList.add("revealed");
                    this.classList.add("clicked");
                    // Optional: Remove 'clicked' state after animation
                    // setTimeout(() => this.classList.remove("clicked"), 800); 
                    // The above line is not strictly necessary if click toggles reveal.
                    // If you want the click animation every time, even when closing, adjust logic.
                }
            }
        });
    });
    
    // Close envelope messages when clicking elsewhere (outside an envelope)
    document.addEventListener('click', function(event) {
        const clickedElement = event.target;
        // If the click is not on an envelope or its descendant message
        if (!clickedElement.closest('.envelope')) {
            document.querySelectorAll('.envelope .msg.revealed').forEach(msg => {
                msg.classList.remove("revealed");
                msg.classList.add("hidden");
                msg.closest('.envelope')?.classList.remove('clicked');
            });
        }
    });
};

function typeWriter(text, elementId, speed = 50, callback) {
    let i = 0;
    const element = document.getElementById(elementId);
    if (!element) return;
  
    function type() {
      if (i < text.length) {
        element.innerHTML += text.charAt(i);
        i++;
        setTimeout(type, speed);
      } else if (callback) {
        callback();
      }
    }
  
    element.innerHTML = ""; // clear any previous text
    type();
  }
  
  function restartExperience() {
    currentScene = -1;
    document.querySelectorAll(".scene").forEach(scene => scene.classList.remove("active", "blur-background"));
    nextScene();
  }
  