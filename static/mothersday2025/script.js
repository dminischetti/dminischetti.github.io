const startTime = Date.now();

let currentScene = 0;
const scenes = document.querySelectorAll(".scene");
let isAnimating = false;

function throttle(callback, limit) {
    let waiting = false;
    return function () {
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

    // heartBurst();
    // if (currentScene % 2 === 0) heartBurst();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
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

        const nextButton = scene.querySelector(".btn-next");
        if (nextButton) {
            nextButton.classList.remove("visible");
            setTimeout(() => {
                nextButton.classList.add("visible");
                isAnimating = false;
            }, 1000);
        } else {
            isAnimating = false;
        }
    } else {
        isAnimating = false;
    }
}

function animateScene(index) {
    const scene = scenes[index];
    if (!scene) return;

    const isLowPerformance = navigator.hardwareConcurrency <= 4 || window.innerWidth <= 768;

    gsap.fromTo(scene, { opacity: 0, y: isLowPerformance ? 10 : 20 }, {
        opacity: 1,
        y: 0,
        duration: isLowPerformance ? 0.5 : 0.8,
        ease: "power2.out"
    });

    if (scene.id === "scene-1") {
        typeWriter(
            "Protocol B engaged…\nAccess granted:\nWonder Mamma confirmed.",
            "typewriter",
            {
                speed: isLowPerformance ? 80 : 100,
                jitter: isLowPerformance ? 0.2 : 0.4
            }
        );
    }

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

    if (scene.id === "scene-9") {
        const button = scene.querySelector(".btn-next");
        if (button) {
            gsap.set(button, { zIndex: 100 });
        }
    }

    if (scene.id === "scene-10") {

        setTimeout(() => {
            scene.classList.add("night-mode");

            const refreshBtn = document.getElementById("refresh-btn");
            if (refreshBtn) {
                setTimeout(() => {
                    refreshBtn.classList.remove("hidden");
                }, 500);
            }
        }, isLowPerformance ? 4000 : 6000);
    }
}

let heartClicks = 0;
let activeHearts = 0;
const hearts = [];

function getMaxHeartsForDevice() {
    if (window.innerWidth <= 480) return 4;
    if (window.innerWidth <= 768) return 7;
    return 8;
}

function createFloatingHeart() {
    if (activeHearts >= getMaxHeartsForDevice()) return;
    
    const heart = document.createElement("div");
    heart.innerHTML = '❤️';
    heart.style.position = 'fixed';
    heart.style.fontSize = '32px';
    heart.style.cursor = 'pointer';
    
    const startX = gsap.utils.random(20, 80);
    const startY = gsap.utils.random(50, 80);
    
    heart.style.left = `${startX}%`;
    heart.style.top = `${startY}%`;
    
    document.getElementById("hearts-container").appendChild(heart);
    activeHearts++;
    const velocityX = gsap.utils.random(-2, 2);
    let velocityY = gsap.utils.random(-8, -12);
    const gravity = 0.5;
    let rotation = gsap.utils.random(-15, 15);

    gsap.to(heart, {
        duration: 3,
        ease: "power1.out",
        onUpdate: () => {
            velocityY += gravity;
            rotation += velocityX * 0.5;
            gsap.set(heart, {
                x: `+=${velocityX}`,
                y: `+=${velocityY}`,
                rotation: rotation,
                scale: 1 - (gsap.getProperty(heart, "progress") * 0.5)
            });
        },
        onComplete: () => {
            heart.remove();
            activeHearts--;
        }
    });
   heart.addEventListener('click', () => {
        gsap.to(heart, {
            scale: 2,
            opacity: 0,
            duration: 0.3,
            onComplete: () => heart.remove()
        });
        heartClicks++;
        if (heartClicks >= 3) {
            document.getElementById("heart-counter").classList.remove("hidden");
        }
    });
}

function heartBurst() {
    if (!document.hasFocus() || document.hidden) return;

    // Create 2-3 hearts per click with slight variation
    const burstCount = window.innerWidth <= 768 ? 2 : 3; 
    const baseDelay = 100; // Milliseconds between hearts
    
    for (let i = 0; i < burstCount; i++) {
        setTimeout(() => {
            createFloatingHeart();
        }, i * baseDelay);
    }
}

// function getHeartIntervalForDevice() {
//     if (window.innerWidth <= 480) return 15000;
//     if (window.innerWidth <= 768) return 12000;
//     return 9000;
// }

// const heartInterval = setInterval(heartBurst, getHeartIntervalForDevice());

function revealEasterEgg() {
    const msg = document.getElementById("easter-msg");
    const refreshBtn = document.getElementById("refresh-btn");

    if (msg) {
        msg.classList.remove("hidden");

        gsap.fromTo(msg,
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.5 }
        );

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

function setBackgroundFromScene(scene) {
    if (!scene) return;
    const bg = scene.getAttribute("data-bg");
    let configFile = "";

    const particlesCache = window.particlesCache || {};
    window.particlesCache = particlesCache;

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
            configFile = "";
            break;
    }

    if (typeof tsParticles !== 'undefined') {
        if (configFile) {
            try {

                if (isLowPerformance) {

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
                                outMode: "bounce",
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

                    if (bg === "stars") {
                        tsParticles.load("tsparticles", {
                            ...config,
                            preset: "stars"
                        });
                    } else {
                        tsParticles.load("tsparticles", config);
                    }
                } else {

                    if (particlesCache[configFile]) {
                        tsParticles.load("tsparticles", particlesCache[configFile]);
                    } else {

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

        lazyImages.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute("data-src");
        });
    }
}

function setupEnvelopeInteractions() {
    const envelopes = document.querySelectorAll(".envelope");

    envelopes.forEach(envelope => {

        envelope.style.transition = "transform 0.3s ease";

        envelope.addEventListener("touchstart", function () {
            this.style.transform = "scale(1.05)";
        }, { passive: true });

        envelope.addEventListener("touchend", function () {
            this.style.transform = "";
        }, { passive: true });

        envelope.addEventListener("mouseenter", function () {
            this.style.transform = "scale(1.05)";
        });

        envelope.addEventListener("mouseleave", function () {
            this.style.transform = "";
        });

        envelope.addEventListener("click", function (e) {
            e.stopPropagation();

            const msg = this.querySelector(".msg");
            if (msg) {
                const isRevealed = msg.classList.contains("revealed");

                document.querySelectorAll('.envelope .msg.revealed').forEach(otherMsg => {
                    if (otherMsg !== msg) {
                        otherMsg.classList.remove("revealed");
                        otherMsg.parentElement.classList.remove('clicked');
                    }
                });

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

    document.addEventListener('click', function (event) {
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

function setupEventListeners() {

    document.addEventListener('touchstart', function () { }, { passive: true });
    document.addEventListener('touchmove', function () { }, { passive: true });

    window.addEventListener('popstate', function (event) {
        if (currentScene > 0) {
            event.preventDefault();
            goToPreviousScene();
            return false;
        }
    });

    window.addEventListener('resize', throttle(function () {

    }, 250), { passive: true });

    document.addEventListener('visibilitychange', function () {
        if (document.hidden) {

            gsap.pauseAll();
        } else {

            gsap.resumeAll();
        }
    });

    const resizeObserver = new ResizeObserver(entries => {
        const particles = tsParticles.domItem(0);
        if (particles) particles.refresh();
    });

    if (document.getElementById('tsparticles')) {
        resizeObserver.observe(document.getElementById('tsparticles'));
    }

    document.addEventListener('click', function(e) {
        if(!e.target.closest('.envelope')) {
            heartBurst();
        }
    });
}

function goToPreviousScene() {
    if (currentScene <= 0 || isAnimating) return;
    isAnimating = true;

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

function adjustUIForScreenSize() {
    const isMobile = window.innerWidth <= 768;
    const isSmallPhone = window.innerWidth <= 480;

    document.querySelectorAll('.scene h1').forEach(heading => {
        heading.style.fontSize = isSmallPhone ? '1.5rem' : (isMobile ? '1.8rem' : '2.2rem');
    });

    document.querySelectorAll('.scene p').forEach(paragraph => {
        paragraph.style.fontSize = isSmallPhone ? '0.9rem' : (isMobile ? '1rem' : '1.2rem');
    });

    document.querySelectorAll('.btn-next').forEach(button => {
        button.style.padding = isSmallPhone ? '8px 16px' : (isMobile ? '10px 20px' : '12px 24px');
    });
}

function typeWriter(text, elementId, options = {}, callback) {
    const targetElement = document.getElementById(elementId);
    if (!targetElement) {
        console.error(`Element #${elementId} not found`);
        return;
    }

    targetElement.textContent = "";

    const fontCheck = setInterval(() => {
        if (document.fonts?.check('1rem Montserrat')) {
            clearInterval(fontCheck);
            startTypewriter();
        }
    }, 100);

    if (!document.fonts) setTimeout(startTypewriter, 1000);

    function startTypewriter() {

        if (!isElementVisible(targetElement)) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        observer.unobserve(targetElement);
                        startTyping();
                    }
                });
            });
            observer.observe(targetElement);
        } else {
            startTyping();
        }
    }

    function startTyping() {
        let i = 0;
        const { speed = 100, jitter = 0.3 } = options;
        const fragment = document.createDocumentFragment();
        const textNode = document.createTextNode("");
        fragment.appendChild(textNode);

        targetElement.appendChild(fragment);

        function type() {
            if (i < text.length) {
                textNode.nodeValue += text.charAt(i);
                i++;
                setTimeout(type, speed * (1 + Math.random() * jitter));
            } else if (callback) {
                callback();
            }
        }

        requestAnimationFrame(() => setTimeout(type, 100));
    }
}

function isElementVisible(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

function restartExperience() {

    heartClicks = 0;

    hearts.forEach(heart => {
        if (document.body.contains(heart)) {
            heart.remove();
        }
    });
    hearts.length = 0;
    activeHearts = 0;

    const preloader = document.getElementById("preloader");
    if (preloader) {
        preloader.style.display = 'flex';
        preloader.classList.remove("loaded");

        gsap.killTweensOf("*");

        setTimeout(() => {

            currentScene = 0;
            document.querySelectorAll(".scene").forEach(scene => {
                scene.classList.remove("active", "night-mode");

                if (scene.id === "scene-10") {
                    const easterMsg = document.getElementById("easter-msg");
                    const heartCounter = document.getElementById("heart-counter");
                    const refreshBtn = document.getElementById("refresh-btn");

                    if (easterMsg) easterMsg.classList.add("hidden");
                    if (heartCounter) heartCounter.classList.add("hidden");
                    if (refreshBtn) refreshBtn.classList.add("hidden");
                }
            });

            document.querySelectorAll('.envelope .msg.revealed').forEach(msg => {
                msg.classList.remove("revealed");
                msg.closest('.envelope')?.classList.remove('clicked');
            });

            preloader.classList.add("loaded");

            setTimeout(() => {
                currentScene = 0;
                const firstScene = scenes[currentScene];
                firstScene.classList.add("active");
                animateScene(currentScene);
                setBackgroundFromScene(firstScene);
            }, 300);
        }, 500);
    } else {

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

window.onload = () => {

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    if (isIOS && isSafari) {

        document.documentElement.style.height = '100%';
        document.body.style.height = '100%';
        document.body.style.webkitOverflowScrolling = 'touch';

        document.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('focus', function () {
                setTimeout(() => {
                    window.scrollTo(0, 0);
                }, 50);
            });
        });
    }

    handlePreloader(() => {

        if (scenes.length > 0 && scenes[currentScene]) {

            scenes[currentScene].classList.add("active");

            requestAnimationFrame(() => {
                setBackgroundFromScene(scenes[currentScene]);
                animateScene(currentScene);
            });
        }

        setupEnvelopeInteractions();

        setupEventListeners();

        lazyLoadImages();

    });

    const typewriterElement = document.getElementById("typewriter");

    if (typewriterElement) {

        typewriterElement.style.minHeight = `${typewriterElement.offsetHeight}px`;

        typeWriter(
            "SYSTEM TERMINAL\n\nPort scanning detected...\nSignal strength: High\nFragment secured.\n\nWonder Mamma confirmed.",
            "typewriter",
            {
                speed: window.innerWidth <= 768 ? 80 : 100,
                jitter: window.innerWidth <= 768 ? 0.2 : 0.4
            },
            () => {

            }
        );
    }
};

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

// Update the click listener to use throttle
document.addEventListener('click', throttle(function(e) {
    if(!e.target.closest('.envelope')) {
        heartBurst();
    }
}, 300)); // 300ms cooldown between bursts

// Add touch-specific listener
document.addEventListener('touchend', throttle(function(e) {
    if(!e.target.closest('.envelope')) {
        heartBurst();
    }
}, 300));