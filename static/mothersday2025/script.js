// Capture script start time for preloader logic
const startTime = Date.now();

// Scene management
let currentScene = 0;
const scenes = document.querySelectorAll(".scene");
let isAnimating = false; // Flag to prevent multiple rapid transitions

function nextScene() {
    if (isAnimating) return; // Prevent rapid multi-clicks
    isAnimating = true;
    
    // Scroll to top before changing scenes
    window.scrollTo(0, 0);
    
    if (scenes[currentScene]) {
        scenes[currentScene].classList.remove("active");
    }
    
    currentScene++;
    const scene = scenes[currentScene];
  
    if (scene) {
        scene.classList.add("active");
        animateScene(currentScene);
        setBackgroundFromScene(scene);
  
        // Fade-in of the button after animation completes
        const nextButton = scene.querySelector(".btn-next");
        if (nextButton) {
            nextButton.classList.remove("visible");
            setTimeout(() => {
                nextButton.classList.add("visible");
                isAnimating = false; // Re-enable transitions
            }, 1000);
        } else {
            isAnimating = false; // Re-enable transitions if no button
        }
    } else {
        isAnimating = false; // Re-enable transitions if no scene
    }
}

// GSAP scene entrance with improved mobile performance
function animateScene(index) {
    const scene = scenes[index];
    if (!scene) return; // Guard clause if scene doesn't exist

    // Use simpler animation for better mobile performance
    gsap.fromTo(scene, { opacity: 0, y: 20 }, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out"
    });

    // Type writer effect for scene 1
    if (scene.id === "scene-1") {
        typeWriter(
            "Protocol B engaged…\nAccess granted: Silent Hero confirmed.",
            "typewriter"
        );
    }

    // If decoder scene, animate lines with slight performance improvements
    if (scene.id === "scene-5") {
        const lines = scene.querySelectorAll("li");
        gsap.fromTo(lines, { opacity: 0, x: -10 }, {
            opacity: 1,
            x: 0,
            duration: 0.5,
            stagger: 0.4, // Slightly faster for mobile
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

    // Night mode for the final scene
    if (scene.id === "scene-10") {
        // Delay night mode activation by 6 seconds
        setTimeout(() => {
            scene.classList.add("night-mode");
            // Make refresh button visible after night mode kicks in
            const refreshBtn = document.getElementById("refresh-btn");
            if (refreshBtn) {
                setTimeout(() => {
                    refreshBtn.classList.remove("hidden");
                }, 500);
            }
        }, 6000);
    }
}

// Optimized floating hearts logic
let heartClicks = 0;
const maxHeartsOnScreen = 5; // Limit concurrent hearts for better performance
let activeHearts = 0;

function createFloatingHeart() {
    // Limit maximum concurrent hearts for performance
    if (activeHearts >= maxHeartsOnScreen) return;
    activeHearts++;
    
    const heart = document.createElement("span");
    heart.classList.add("heart");
    heart.innerText = "💗"; 
    
    // Randomize position but keep hearts more centered on mobile
    heart.style.left = `${20 + Math.random() * 60}vw`; // Keep within 20-80% of viewport
    heart.style.bottom = "-20px"; // Start from below the viewport
    
    const heartsContainer = document.getElementById("hearts-container");
    if (heartsContainer) {
        heartsContainer.appendChild(heart);
    } else {
        console.error("Hearts container not found!");
        activeHearts--;
        return;
    }

    // Make hearts larger touch targets for mobile
    heart.style.fontSize = "1.8rem";
    heart.style.padding = "10px";

    // Handle heart touch
    heart.addEventListener("click", () => {
        heart.remove();
        activeHearts--;
        heartClicks++;
        const heartCounterMsg = document.getElementById("heart-counter");
        if (heartClicks >= 3 && heartCounterMsg) {
            heartCounterMsg.classList.remove("hidden");
        }
    });

    // Auto-remove hearts to prevent performance issues
    setTimeout(() => {
        if (document.body.contains(heart)) {
            heart.remove();
            activeHearts--;
        }
    }, 5000);
}

// More efficient heart burst function
function heartBurst() {
    if (!document.hasFocus() || document.hidden) return; // Only create hearts if tab is active and visible
    
    // Create fewer hearts on mobile
    const burstCount = 2; // Reduced from 3 for better performance
    let delay = 0;
    
    for (let i = 0; i < burstCount; i++) {
        setTimeout(() => {
            createFloatingHeart();
        }, delay);
        delay += 1000; // Slightly longer delay for better performance
    }
}

// Less frequent heart bursts for mobile
const heartInterval = setInterval(heartBurst, 12000); // Increased from 9000 for performance

// Better touch handling for Easter egg
function revealEasterEgg() {
    const msg = document.getElementById("easter-msg");
    const refreshBtn = document.getElementById("refresh-btn");
    
    if (msg) {
        msg.classList.remove("hidden");
        // Add subtle animation
        gsap.fromTo(msg, 
            { opacity: 0, y: 10 }, 
            { opacity: 1, y: 0, duration: 0.5 }
        );
    }
    
    if (refreshBtn) {
        setTimeout(() => {
            refreshBtn.classList.remove("hidden");
            gsap.fromTo(refreshBtn, 
                { opacity: 0, y: 10 }, 
                { opacity: 1, y: 0, duration: 0.5 }
            );
        }, 300);
    }
}

// Optimized particles background
function setBackgroundFromScene(scene) {
    if (!scene) return;
    const bg = scene.getAttribute("data-bg");
    let configFile = "";

    // For mobile, we'll use lighter particle configurations
    switch (bg) {
        case "stars":
            configFile = "assets/particles-stars.json";
            // Reduce particle count for mobile
            if (window.innerWidth <= 768) {
                if (typeof tsParticles !== 'undefined') {
                    tsParticles.load("tsparticles", {
                        preset: "stars",
                        particles: {
                            number: {
                                value: 30 // Reduced from default
                            },
                            move: {
                                speed: 0.3 // Slower for better performance
                            }
                        }
                    });
                    return;
                }
            }
            break;
        case "petals":
            configFile = "assets/particles-petals.json";
            break;
        case "glow":
            configFile = "assets/particles-goldglow.json";
            break;
        default:
            configFile = ""; // No specific particle config
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

// Initial load with improved mobile handling
window.onload = () => {
    // Detect iOS Safari
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    
    if (isIOS && isSafari) {
        // iOS Safari-specific fixes
        document.documentElement.style.height = '100%';
        document.body.style.height = '100%';
        document.body.style.webkitOverflowScrolling = 'touch';
    }

    // Handle preloader
    const preloader = document.getElementById("preloader");
    if (preloader) {
        const timeAssetsLoaded = Date.now();
        const elapsedTimeSinceScriptStart = timeAssetsLoaded - startTime;
        const minPreloaderDisplayDuration = 1200;

        let delayBeforeFadeStart = 0;
        if (elapsedTimeSinceScriptStart < minPreloaderDisplayDuration) {
            delayBeforeFadeStart = minPreloaderDisplayDuration - elapsedTimeSinceScriptStart;
        }

        setTimeout(() => {
            preloader.classList.add("loaded");
            setTimeout(() => {
                // Remove preloader from DOM after animation completes for better performance
                preloader.style.display = 'none';
            }, 1100);
        }, delayBeforeFadeStart);
    }   

    // Initialize first scene
    if (scenes.length > 0 && scenes[currentScene]) {
        scenes[currentScene].classList.add("active");
        animateScene(currentScene);
        setBackgroundFromScene(scenes[currentScene]);
    } else {
        console.error("No scenes found or initial scene is missing.");
    }
    
    // Enhanced envelope interaction for mobile
    const envelopes = document.querySelectorAll(".envelope");
    
    envelopes.forEach(envelope => {
        // Add better visual indicator for tappable items
        envelope.style.transition = "transform 0.3s ease";
        
        // Add touch handlers with improved experience
        envelope.addEventListener("touchstart", function() {
            this.style.transform = "scale(1.05)";
        }, { passive: true });
        
        envelope.addEventListener("touchend", function() {
            this.style.transform = "";
        }, { passive: true });
        
        envelope.addEventListener("click", function(e) {
            e.stopPropagation(); // Prevent event bubbling
            
            const msg = this.querySelector(".msg");
            if (msg) {
                const isRevealed = msg.classList.contains("revealed");

                // Close all other messages first
                document.querySelectorAll('.envelope .msg.revealed').forEach(otherMsg => {
                    if (otherMsg !== msg) {
                        otherMsg.classList.remove("revealed");
                        otherMsg.classList.add("hidden");
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
                }
            }
        });
    });
    
    // Close envelope messages when tapping elsewhere (outside an envelope)
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

    // Add passive touch listeners to improve scroll performance
    document.addEventListener('touchstart', function() {}, {passive: true});
    document.addEventListener('touchmove', function() {}, {passive: true});
};

// Optimized typewriter function
function typeWriter(text, elementId, speed = 40, callback) {
    let i = 0;
    const element = document.getElementById(elementId);
    if (!element) return;
  
    // Pre-calculate total duration for performance optimization
    const totalDuration = text.length * speed;
    
    // For very short texts or low-end devices, make it faster
    const actualSpeed = (totalDuration > 3000 || window.innerWidth < 400) ? speed * 0.8 : speed;
  
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, actualSpeed);
        } else if (callback) {
            callback();
        }
    }
  
    element.innerHTML = ""; // clear any previous text
    type();
}
  
// Enhanced restart function
function restartExperience() {
    // Reset heart counter
    heartClicks = 0;
    
    // Show preloader briefly for transition
    const preloader = document.getElementById("preloader");
    if (preloader) {
        preloader.style.display = 'flex';
        preloader.classList.remove("loaded");
        
        setTimeout(() => {
            // Reset scene state
            currentScene = -1;
            document.querySelectorAll(".scene").forEach(scene => {
                scene.classList.remove("active", "night-mode");
                
                // Reset any scene-specific states
                if (scene.id === "scene-10") {
                    const easterMsg = document.getElementById("easter-msg");
                    const heartCounter = document.getElementById("heart-counter");
                    const refreshBtn = document.getElementById("refresh-btn");
                    
                    if (easterMsg) easterMsg.classList.add("hidden");
                    if (heartCounter) heartCounter.classList.add("hidden");
                    if (refreshBtn) refreshBtn.classList.add("hidden");
                }
            });
            
            // Hide preloader
            preloader.classList.add("loaded");
            
            // Start from first scene
            setTimeout(() => {
                nextScene();
            }, 300);
        }, 500);
    } else {
        // Fallback if no preloader
        currentScene = -1;
        document.querySelectorAll(".scene").forEach(scene => 
            scene.classList.remove("active", "night-mode"));
        nextScene();
    }
}