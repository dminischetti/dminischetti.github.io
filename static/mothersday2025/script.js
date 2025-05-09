// Capture script start time for preloader logic
const startTime = Date.now();

// Scene management
let currentScene = 0;
const scenes = document.querySelectorAll(".scene");
let isAnimating = false; // Flag to prevent multiple rapid transitions

// Throttle function to limit function calls
function throttle(callback, limit) {
  let waiting = false;
  return function() {
    if (!waiting) {
      callback.apply(this, arguments);
      waiting = true;
      setTimeout(() => {
        waiting = false;
      }, limit);
    }
  };
}

function nextScene() {
if (isAnimating || currentScene >= scenes.length - 1) return;

    isAnimating = true;
    
    // Scroll to top before changing scenes
    window.scrollTo({
        top: 0,
        behavior: "smooth" // Use smooth scrolling for better UX
    });
    
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

    // Detect low-power mode or low-performance devices
    const isLowPerformance = navigator.hardwareConcurrency <= 4 || window.innerWidth <= 768;
    
    // Use simpler animation for better mobile performance
    gsap.fromTo(scene, { opacity: 0, y: isLowPerformance ? 10 : 20 }, {
        opacity: 1,
        y: 0,
        duration: isLowPerformance ? 0.5 : 0.8,
        ease: "power2.out"
    });

    // Type writer effect for scene 1
    if (scene.id === "scene-1") {
        typeWriter(
            "Protocol B engaged…\nAccess granted:\nWonder Mamma confirmed.",
            "typewriter",
            {
                speed: isLowPerformance ? 80 : 100, // Slightly faster on mobile
                jitter: isLowPerformance ? 0.2 : 0.4
            }
        );
    }

    // If decoder scene, animate lines with slight performance improvements
    if (scene.id === "scene-5") {
        const lines = scene.querySelectorAll("li");
        gsap.fromTo(lines, 
            { opacity: 0, x: isLowPerformance ? -5 : -10 }, 
            {
                opacity: 1,
                x: 0,
                duration: isLowPerformance ? 0.3 : 0.5,
                stagger: isLowPerformance ? 0.3 : 0.4,
                ease: "power2.out"
            }
        );
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
        }, isLowPerformance ? 4000 : 6000); // Shorter delay on mobile
    }
}

// Optimized floating hearts logic
let heartClicks = 0;
let activeHearts = 0;
const hearts = [];

// Adjust max hearts based on device capability
function getMaxHeartsForDevice() {
    if (window.innerWidth <= 480) return 4; // Small phones
    if (window.innerWidth <= 768) return 7; // Tablets
    return 8; // Desktop
}

function createFloatingHeart() {
  const heart = document.createElement("span");
  heart.classList.add("heart");
  heart.innerText = "💗";

  // Position heart randomly across screen width
  heart.style.left = `${Math.random() * 90 + 5}vw`; // from 5vw to 95vw
  heart.style.bottom = "-40px"; // start off-screen below

  // Optional: size variation
  const scale = Math.random() * 0.4 + 0.8; // random scale between 0.8 and 1.2
  heart.style.transform = `scale(${scale})`;

  // Append to container
  document.getElementById("hearts-container").appendChild(heart);

  // Add click handler
  heart.addEventListener("click", () => {
    heart.remove();
    heartClicks++;
    if (heartClicks >= 3) {
      document.getElementById("heart-counter").classList.remove("hidden");
    }
  });

  // Remove heart after animation ends (5s)
  setTimeout(() => {
    heart.remove();
  }, 5000);
}


// More efficient heart burst function
function heartBurst() {
    if (!document.hasFocus() || document.hidden) return; // Only create hearts if tab is active and visible
    
    // Create fewer hearts on mobile
    const isMobile = window.innerWidth <= 768;
    const burstCount = isMobile ? 2 : 3; 
    const delayBetweenHearts = isMobile ? 1000 : 800;
    
    for (let i = 0; i < burstCount; i++) {
        setTimeout(() => {
            if (document.hasFocus() && !document.hidden) {
                createFloatingHeart();
            }
        }, i * delayBetweenHearts);
    }
}

// Adjust heart burst frequency based on device capability
function getHeartIntervalForDevice() {
    if (window.innerWidth <= 480) return 15000; // Small phones
    if (window.innerWidth <= 768) return 12000; // Tablets
    return 9000; // Desktop
}

// Less frequent heart bursts for mobile
const heartInterval = setInterval(heartBurst, getHeartIntervalForDevice());

// Better touch handling for Easter egg
function revealEasterEgg() {
    const msg = document.getElementById("easter-msg");
    const refreshBtn = document.getElementById("refresh-btn");
    
    if (msg) {
        msg.classList.remove("hidden");
        // Use GSAP for smoother animation
        gsap.fromTo(msg, 
            { opacity: 0, y: 10 }, 
            { opacity: 1, y: 0, duration: 0.5 }
        );
        
        // Add the revealed class for color transition
        setTimeout(() => {
            msg.classList.add("revealed");
        }, 300);
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

    // Cache to avoid unnecessary reloads
    const particlesCache = window.particlesCache || {};
    window.particlesCache = particlesCache;

    // Determine if we should use lightweight config
    const isLowPerformance = navigator.hardwareConcurrency <= 4 || 
                             window.innerWidth <= 768 || 
                             navigator.connection?.saveData || 
                             navigator.connection?.effectiveType === 'slow-2g' ||
                             navigator.connection?.effectiveType === '2g';

    switch (bg) {
        case "stars":
            configFile = isLowPerformance ? "assets/particles-stars-light.json" : "assets/particles-stars.json";
            break;
        case "petals":
            configFile = isLowPerformance ? "assets/particles-petals-light.json" : "assets/particles-petals.json";
            break;
        case "glow":
            configFile = isLowPerformance ? "assets/particles-goldglow-light.json" : "assets/particles-goldglow.json";
            break;
        default:
            configFile = ""; // No specific particle config
            break;
    }

    if (typeof tsParticles !== 'undefined') { // Check if tsParticles is loaded
        if (configFile) {
            try {
                // For lightweight config on low-performance devices
                if (isLowPerformance) {
                    // Use lightweight config
// In the setBackgroundFromScene function, modify the light config:
const config = {
    particles: {
        number: { 
            value: bg === "stars" ? 30 : 15,
            density: {
                enable: true,
                value_area: 800
            }
        },
        size: { 
            value: 3,
            random: true 
        },
        opacity: {
            value: 0.8,
            animation: {
                enable: true,
                minimumValue: 0.3,
                speed: 1
            }
        },
        move: {
            enable: true,
            speed: 0.3,
            direction: "none",
            random: true,
            straight: false,
            outMode: "bounce", // Changed from "out"
            bounce: true
        }
    },
    interactivity: {
        detect_on: "canvas",
        events: {
            onhover: {
                enable: true,
                mode: "repulse"
            }
        }
    }
};
                    
                    // Load the lightweight config
                    if (bg === "stars") {
                        tsParticles.load("tsparticles", {
                            ...config,
                            preset: "stars"
                        });
                    } else {
                        tsParticles.load("tsparticles", config);
                    }
                } else {
                    // Use cached config if available
                    if (particlesCache[configFile]) {
                        tsParticles.load("tsparticles", particlesCache[configFile]);
                    } else {
                        // Fetch and cache the config
                        fetch(configFile)
                            .then(response => response.json())
                            .then(config => {
                                particlesCache[configFile] = config;
                                tsParticles.load("tsparticles", config);
                            })
                            .catch(error => {
                                console.error("Error loading particles:", error);
                            });
                    }
                }
            } catch (error) {
                console.error("Error with particles:", error);
            }
        } else {
            const particlesInstance = tsParticles.domItem(0);
            if (particlesInstance) {
                particlesInstance.destroy();
            }
        }
    }
}

// Improved preloader with animation progress
function handlePreloader(callback) {
    const preloader = document.getElementById("preloader");
    setTimeout(() => {
    preloader.classList.add("loaded");
    }, 1200);
    
    const timeAssetsLoaded = Date.now();
    const elapsedTimeSinceScriptStart = timeAssetsLoaded - startTime;
    const minPreloaderDisplayDuration = 1200;

    let delayBeforeFadeStart = 0;
    if (elapsedTimeSinceScriptStart < minPreloaderDisplayDuration) {
        delayBeforeFadeStart = minPreloaderDisplayDuration - elapsedTimeSinceScriptStart;
    }

    // Animate preloader progress if element exists
    const progressBar = document.getElementById("preloader-progress");
    if (progressBar) {
        gsap.to(progressBar, {
            width: "100%",
            duration: delayBeforeFadeStart / 1000,
            ease: "power1.inOut",
            onComplete: () => {
                preloader.classList.add("loaded");
                setTimeout(() => {
                    preloader.style.display = 'none';
                    if (callback) callback();
                }, 1100);
            }
        });
    } else {
        setTimeout(() => {
            preloader.classList.add("loaded");
            setTimeout(() => {
                preloader.style.display = 'none';
                if (callback) callback();
            }, 1100);
        }, delayBeforeFadeStart);
    }
}

// Enhanced lazy loading of images
function lazyLoadImages() {
    const lazyImages = document.querySelectorAll("img[data-src]");
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute("data-src");
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for older browsers
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute("data-src");
        });
    }
}

// Improved envelope interaction handler with touch support
function setupEnvelopeInteractions() {
    const envelopes = document.querySelectorAll(".envelope");
    
    envelopes.forEach(envelope => {
        // Add better visual indicator for tappable items
        envelope.style.transition = "transform 0.3s ease";
        
        // Add touch feedback
        envelope.addEventListener("touchstart", function() {
            this.style.transform = "scale(1.05)";
        }, { passive: true });
        
        envelope.addEventListener("touchend", function() {
            this.style.transform = "";
        }, { passive: true });
        
        // Mouse feedback for desktop
        envelope.addEventListener("mouseenter", function() {
            this.style.transform = "scale(1.05)";
        });
        
        envelope.addEventListener("mouseleave", function() {
            this.style.transform = "";
        });
        
        // Click/tap handler
        envelope.addEventListener("click", function(e) {
            e.stopPropagation(); // Prevent event bubbling
            
            const msg = this.querySelector(".msg");
            if (msg) {
                const isRevealed = msg.classList.contains("revealed");
        
                // Close all other messages first
                document.querySelectorAll('.envelope .msg.revealed').forEach(otherMsg => {
                    if (otherMsg !== msg) {
                        otherMsg.classList.remove("revealed");
                        otherMsg.parentElement.classList.remove('clicked');
                    }
                });
        
                // Toggle current message with animation
                if (isRevealed) {
                    gsap.to(msg, {
                        opacity: 0,
                        y: -10,
                        duration: 0.3,
                        onComplete: () => {
                            msg.classList.remove("revealed");
                            this.classList.remove("clicked");
                        }
                    });
                } else {
                    msg.classList.add("revealed");
                    this.classList.add("clicked");
                    gsap.fromTo(msg, 
                        { opacity: 0, y: 10 },
                        { opacity: 1, y: 0, duration: 0.3 }
                    );
                }
            }
        });
    });
    
    // Close envelope messages when tapping elsewhere
    document.addEventListener('click', function(event) {
        const clickedElement = event.target;
        if (!clickedElement.closest('.envelope')) {
            document.querySelectorAll('.envelope .msg.revealed').forEach(msg => {
                gsap.to(msg, {
                    opacity: 0,
                    y: -10,
                    duration: 0.3,
                    onComplete: () => {
                        msg.classList.remove("revealed");
                        msg.closest('.envelope')?.classList.remove('clicked');
                    }
                });
            });
        }
    });
}

// Event handling with passive event listeners
function setupEventListeners() {
    // Add passive touch listeners to improve scroll performance
    document.addEventListener('touchstart', function() {}, {passive: true});
    document.addEventListener('touchmove', function() {}, {passive: true});
    
    // Handle back button for better UX
    window.addEventListener('popstate', function(event) {
        if (currentScene > 0) {
            event.preventDefault();
            goToPreviousScene();
            return false;
        }
    });
    
    // Throttled resize handler
    window.addEventListener('resize', throttle(function() {
        // Adjust UI elements based on new screen size
        // adjustUIForScreenSize();
    }, 250), { passive: true });
    
    // Visibility change - pause animations when tab not visible
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            // Pause animations to save battery
            gsap.pauseAll();
        } else {
            // Resume animations
            gsap.resumeAll();
        }
    });

        // Add resize observer for particles
    const resizeObserver = new ResizeObserver(entries => {
        const particles = tsParticles.domItem(0);
        if (particles) particles.refresh();
    });
    
    if (document.getElementById('tsparticles')) {
        resizeObserver.observe(document.getElementById('tsparticles'));
    }
}

// Go to previous scene functionality
function goToPreviousScene() {
    if (currentScene <= 0 || isAnimating) return;
    isAnimating = true;
    
    // Scroll to top
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
    
    if (scenes[currentScene]) {
        scenes[currentScene].classList.remove("active");
    }
    
    currentScene--;
    
    if (scenes[currentScene]) {
        scenes[currentScene].classList.add("active");
        animateScene(currentScene);
        setBackgroundFromScene(scenes[currentScene]);
        
        const nextButton = scenes[currentScene].querySelector(".btn-next");
        if (nextButton) {
            nextButton.classList.add("visible");
        }
        
        setTimeout(() => {
            isAnimating = false;
        }, 1000);
    } else {
        isAnimating = false;
    }
}

// Adjust UI based on screen size
function adjustUIForScreenSize() {
    const isMobile = window.innerWidth <= 768;
    const isSmallPhone = window.innerWidth <= 480;
    
    // Adjust text sizes
    document.querySelectorAll('.scene h1').forEach(heading => {
        heading.style.fontSize = isSmallPhone ? '1.5rem' : (isMobile ? '1.8rem' : '2.2rem');
    });
    
    document.querySelectorAll('.scene p').forEach(paragraph => {
        paragraph.style.fontSize = isSmallPhone ? '0.9rem' : (isMobile ? '1rem' : '1.2rem');
    });
    
    // Adjust button sizes
    document.querySelectorAll('.btn-next').forEach(button => {
        button.style.padding = isSmallPhone ? '8px 16px' : (isMobile ? '10px 20px' : '12px 24px');
    });
}

// Optimized typewriter effect
function typeWriter(text, elementId, options = {}, callback) {
    const {
        speed = 120,              // Base speed (ms per character)
        jitter = 0.3,             // Random speed variation (0-1)
        pauseOnPunctuation = true, // Longer pauses for punctuation
        cursorElement = null,     // Optional cursor element to control
        batchSize = 1             // Number of characters to add at once (for performance)
    } = options;

    let i = 0;
    const element = document.getElementById(elementId);
    if (!element) return;

    // Clear previous content
    element.innerHTML = "";
    
    // Check if we should use requestAnimationFrame for better performance
    const useRAF = window.innerWidth <= 768;
    let lastTimestamp = 0;
    let nextDelay = 0;

    // Show cursor if provided
    if (cursorElement) {
        cursorElement.style.display = 'inline-block';
        cursorElement.style.opacity = '1';
    }

    function calculateDelay(char) {
        let delay = speed;
        
        // Random variation
        delay *= 1 + (Math.random() * jitter - jitter/2);
        
        // Longer pauses for punctuation
        if (pauseOnPunctuation) {
            if (char === '.' || char === '!' || char === '?') delay *= 3;
            else if (char === ',' || char === ';') delay *= 2;
            else if (char === '\n') delay *= 4; // Extra pause for new lines
        }
        
        return Math.max(20, delay); // Minimum delay
    }

    function typeRAF(timestamp) {
        if (lastTimestamp === 0) {
            lastTimestamp = timestamp;
        }
        
        const elapsed = timestamp - lastTimestamp;
        
        if (elapsed >= nextDelay) {
            if (i < text.length) {
                // Process in small batches for better performance
                const batch = Math.min(batchSize, text.length - i);
                let batchText = '';
                
                for (let j = 0; j < batch; j++) {
                    batchText += text.charAt(i + j);
                }
                
                element.innerHTML += batchText;
                i += batch;
                
                // Calculate delay for next batch
                nextDelay = calculateDelay(text.charAt(i - 1));
                lastTimestamp = timestamp;
                
                requestAnimationFrame(typeRAF);
            } else if (callback) {
                // Hide cursor when done
                if (cursorElement) {
                    cursorElement.style.opacity = '0';
                    setTimeout(() => cursorElement.style.display = 'none', 500);
                }
                callback();
            }
        } else {
            requestAnimationFrame(typeRAF);
        }
    }

    function typeTimeout() {
        if (i < text.length) {
            const char = text.charAt(i);
            element.innerHTML += char;
            i++;
            
            setTimeout(typeTimeout, calculateDelay(char));
        } else if (callback) {
            // Hide cursor when done
            if (cursorElement) {
                cursorElement.style.opacity = '0';
                setTimeout(() => cursorElement.style.display = 'none', 500);
            }
            callback();
        }
    }

    // Use the appropriate method based on device capability
    if (useRAF) {
        requestAnimationFrame(typeRAF);
    } else {
        typeTimeout();
    }
}

// Enhanced restart function
function restartExperience() {
    // Reset heart counter
    heartClicks = 0;
    
    // Clean up hearts
    hearts.forEach(heart => {
        if (document.body.contains(heart)) {
            heart.remove();
        }
    });
    hearts.length = 0;
    activeHearts = 0;
    
    // Show preloader briefly for transition
    const preloader = document.getElementById("preloader");
    if (preloader) {
        preloader.style.display = 'flex';
        preloader.classList.remove("loaded");
        
        // Clean up GSAP animations
        gsap.killTweensOf("*");
        
        setTimeout(() => {
            // Reset scene state
            currentScene = 0;
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
            
            // Reset any open envelopes
            document.querySelectorAll('.envelope .msg.revealed').forEach(msg => {
                msg.classList.remove("revealed");
                msg.closest('.envelope')?.classList.remove('clicked');
            });
            
            // Hide preloader
            preloader.classList.add("loaded");
            
            // Start from first scene
            setTimeout(() => {
currentScene = 0;
const firstScene = scenes[currentScene];
firstScene.classList.add("active");
animateScene(currentScene);
setBackgroundFromScene(firstScene);
            }, 300);
        }, 500);
    } else {
        // Fallback if no preloader
        currentScene = -1;
        document.querySelectorAll(".scene").forEach(scene => 
            scene.classList.remove("active", "night-mode"));
currentScene = 0;
const firstScene = scenes[currentScene];
firstScene.classList.add("active");
animateScene(currentScene);
setBackgroundFromScene(firstScene);

    }
}

// Main initialization
window.onload = () => {
    // Detect iOS Safari
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    
    if (isIOS && isSafari) {
        // iOS Safari-specific fixes
        document.documentElement.style.height = '100%';
        document.body.style.height = '100%';
        document.body.style.webkitOverflowScrolling = 'touch';
              
        // Fix for iOS Safari input focus issues
        document.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('focus', function() {
                setTimeout(() => {
                    window.scrollTo(0, 0);
                }, 50);
            });
        });
    }

    // Handle preloader
    handlePreloader(() => {
        // Initialize first scene
    if (scenes.length > 0 && scenes[currentScene]) {
        // First make scene active
        scenes[currentScene].classList.add("active");
        
        // Then initialize particles AFTER DOM update
        requestAnimationFrame(() => {
            setBackgroundFromScene(scenes[currentScene]);
            animateScene(currentScene);
        });
    }
        
        // Initialize envelope interactions
        setupEnvelopeInteractions();
        
        // Setup other event listeners
        setupEventListeners();
        
        // Begin lazy loading images
        lazyLoadImages();
        
        // Adjust UI based on screen size
        // adjustUIForScreenSize();
    });
    
    // Initialize terminal typewriter effect if present
    const typewriterElement = document.getElementById("typewriter");
    if (typewriterElement) {
        typeWriter(
            "SYSTEM TERMINAL\n\n" +
            "Port scanning detected...\n" +
            "Signal strength: High\n" +
            "Fragment secured.\n\n" +
            "Wonder Mamma confirmed.",
            "typewriter",
            {
                speed: window.innerWidth <= 768 ? 80 : 100,
                jitter: window.innerWidth <= 768 ? 0.2 : 0.4,
                pauseOnPunctuation: true,
                batchSize: window.innerWidth <= 480 ? 2 : 1 // Process characters in batches on mobile
            },
            () => {
                // Completion callback
                console.log("Terminal message complete");
                
                // Example GSAP animation (requires GSAP library)
                if (typeof gsap !== 'undefined') {
                    gsap.to(".confirmation-badge", {
                        opacity: 1,
                        scale: 1.2,
                        duration: 0.8,
                        ease: "back.out"
                    });
                }
            }
        );
    }
};