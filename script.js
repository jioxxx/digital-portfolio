// Princess Jhanna Dagpin Portfolio - Bulletproof Interactive Logic
document.addEventListener('DOMContentLoaded', () => {
    console.log("Portfolio Logic Initializing...");

    // Helper: Create a glowing circular texture for space particles
    const createParticleTexture = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');
        const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)');
        gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 128, 128);
        const texture = new THREE.CanvasTexture(canvas);
        return texture;
    };
    const spaceTexture = createParticleTexture();
    const initIntro = () => {
        const introContainer = document.getElementById('intro-3d');
        if (!introContainer) return;

        if (typeof THREE === 'undefined') {
            console.error("Three.js not loaded! Skipping intro.");
            hideLoader();
            return;
        }

        console.log("Initializing 3D Intro Container...");
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        introContainer.appendChild(renderer.domElement);
        console.log("Renderer appended to DOM.");

        // Particle System - Immersive Vortex
        const particlesCount = 8000;
        const posArray = new Float32Array(particlesCount * 3);
        const velocities = new Float32Array(particlesCount * 3);

        for (let i = 0; i < particlesCount; i++) {
            const theta = Math.random() * Math.PI * 2;
            const radius = 5 + Math.random() * 25;
            posArray[i * 3] = Math.cos(theta) * radius;
            posArray[i * 3 + 1] = Math.sin(theta) * radius;
            posArray[i * 3 + 2] = (Math.random() - 0.5) * 100;
        }

        const particlesGeo = new THREE.BufferGeometry();
        particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

        const particlesMat = new THREE.PointsMaterial({
            size: 0.25,
            color: 0x5eead4,
            map: spaceTexture,
            transparent: true,
            opacity: 0.9,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });

        const particlesMesh = new THREE.Points(particlesGeo, particlesMat);
        scene.add(particlesMesh);
        console.log("Vortex Particles added to scene.");

        camera.position.z = 25;

        // Interaction Logic for Intro - COLLAPSE Physics
        const raycaster = new THREE.Raycaster();
        const pMouse = new THREE.Vector2(-100, -100);

        const collapseParticles = (x, y) => {
            pMouse.x = (x / window.innerWidth) * 2 - 1;
            pMouse.y = -(y / window.innerHeight) * 2 + 1;
            raycaster.setFromCamera(pMouse, camera);
            const ray = raycaster.ray;

            const posAttr = particlesGeo.attributes.position;
            for (let i = 0; i < particlesCount; i++) {
                const pVec = new THREE.Vector3(posAttr.getX(i), posAttr.getY(i), posAttr.getZ(i));
                const dist = ray.distanceToPoint(pVec);

                if (dist < 5.0) {
                    const dir = ray.origin.clone().sub(pVec).normalize(); // Pull TOWARD mouse
                    velocities[i * 3] += dir.x * 2.5;
                    velocities[i * 3 + 1] += dir.y * 2.5;
                    velocities[i * 3 + 2] += dir.z * 2.5;
                }
            }
        };

        window.addEventListener('mousedown', (e) => collapseParticles(e.clientX, e.clientY));
        window.addEventListener('touchstart', (e) => collapseParticles(e.touches[0].clientX, e.touches[0].clientY));

        let speed = 0.8;
        let frameCount = 0;
        const animateIntro = () => {
            const req = requestAnimationFrame(animateIntro);
            if (frameCount % 60 === 0) console.log("Intro rendering frame:", frameCount);
            frameCount++;

            particlesMesh.rotation.z += 0.002;
            particlesMesh.position.z += speed;

            const posAttr = particlesGeo.attributes.position;
            for (let i = 0; i < particlesCount; i++) {
                // Apply velocities
                posAttr.setX(i, posAttr.getX(i) + velocities[i * 3]);
                posAttr.setY(i, posAttr.getY(i) + velocities[i * 3 + 1]);
                posAttr.setZ(i, posAttr.getZ(i) + velocities[i * 3 + 2]);

                // Friction
                velocities[i * 3] *= 0.92;
                velocities[i * 3 + 1] *= 0.92;
                velocities[i * 3 + 2] *= 0.92;
            }
            posAttr.needsUpdate = true;

            if (particlesMesh.position.z > 50) {
                particlesMesh.position.z = 0;
            }

            renderer.render(scene, camera);
            introContainer.dataset.reqId = req;
        };
        animateIntro();

        window.addEventListener('resize', () => {
            if (renderer && camera) {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
                console.log("Renderer resized.");
            }
        });
    };

    // --- 1. Loader Logic (Always executes first) ---
    const hideLoader = () => {
        const loader = document.getElementById('loader');
        const spinner = document.querySelector('.loader-circle');
        const loaderUI = document.querySelector('.loader-ui');
        const audio = document.getElementById('intro-audio');

        if (loader) {
            console.log("3D Loaded. Animating UI...");

            if (typeof gsap !== 'undefined') {
                const tl = gsap.timeline();
                if (spinner) {
                    tl.to(spinner, { opacity: 0, duration: 0.8, onComplete: () => spinner.style.display = 'none' });
                }
                if (loaderUI) {
                    tl.to(loaderUI, { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" }, "-=0.3");
                }
            } else {
                if (spinner) spinner.classList.add('hide');
                if (loaderUI) loaderUI.classList.add('visible');
            }

            // The reveal now only happens on BUTTON CLICK
            const launchBtn = document.getElementById('launch-btn');
            launchBtn?.addEventListener('click', () => {
                console.log("Launching Experience...");

                // Play Audio (User interaction allows this)
                if (audio) {
                    audio.play().catch(e => console.log("Audio play blocked:", e));
                }

                // Cinematic Fade
                if (typeof gsap !== 'undefined') {
                    gsap.to(loader, {
                        opacity: 0,
                        duration: 2,
                        ease: "power2.inOut",
                        onComplete: () => {
                            loader.style.display = 'none';
                            // Stop intro animation
                            const intro3d = document.getElementById('intro-3d');
                            if (intro3d && intro3d.dataset.reqId) {
                                cancelAnimationFrame(parseInt(intro3d.dataset.reqId));
                            }
                        }
                    });
                } else {
                    loader.style.opacity = '0';
                    setTimeout(() => { loader.style.display = 'none'; }, 1000);
                }
            });
        }
    };


    // --- Theme & Menu Logic ---
    const themeBtn = document.getElementById('theme-toggle');
    const initTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', initTheme);

    themeBtn?.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const newTheme = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // --- Audio Control Logic ---
    const audioBtn = document.getElementById('audio-toggle');
    const audio = document.getElementById('intro-audio');
    const clickSound = document.getElementById('click-sound');
    const unmutedIcon = audioBtn?.querySelector('.unmuted');
    const mutedIcon = audioBtn?.querySelector('.muted');

    const playClick = () => {
        if (clickSound) {
            clickSound.currentTime = 0;
            clickSound.play().catch(() => { });
        }
    };

    // Attempt Autoplay/Resume on first interaction
    const startAudio = () => {
        if (audio) {
            audio.play().then(() => {
                console.log("Audio started successfully");
                document.removeEventListener('click', startAudio);
                document.removeEventListener('touchstart', startAudio);
            }).catch(e => {
                console.log("Initial audio block, waiting for next interaction...", e);
            });
        }
    };
    document.addEventListener('click', startAudio);
    document.addEventListener('touchstart', startAudio);

    // Global Click Sound for Interactive Elements
    const setupClickSounds = () => {
        document.querySelectorAll('a, button, .control-btn, .contact-item-card, .work-card, #intro-3d, #canvas-container').forEach(el => {
            el.addEventListener('mousedown', playClick);
            el.addEventListener('touchstart', playClick);
        });
    };
    setupClickSounds();

    audioBtn?.addEventListener('click', () => {
        if (audio) {
            audio.muted = !audio.muted;
            unmutedIcon?.classList.toggle('hide');
            mutedIcon?.classList.toggle('hide');
        }
    });

    const menuToggle = document.getElementById('menu-toggle');
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (menuToggle) menuToggle.checked = false;
        });
    });

    // --- 3. Custom Cursor (Desktop Only) ---
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;

    if (!isMobile) {
        const cursor = document.querySelector('.cursor');
        const follower = document.querySelector('.cursor-follower');
        if (cursor && follower) {
            let mX = 0, mY = 0, fX = 0, fY = 0;
            document.addEventListener('mousemove', (e) => {
                mX = e.clientX; mY = e.clientY;
                gsap.to(cursor, { x: mX - 4, y: mY - 4, duration: 0.1 });
            });
            const moveFollower = () => {
                fX += (mX - fX) * 0.1;
                fY += (mY - fY) * 0.1;
                gsap.set(follower, { x: fX - 20, y: fY - 20 });
                requestAnimationFrame(moveFollower);
            };
            moveFollower();
        }
    }

    // --- 4. Three.js Background (Main Section) ---
    const initBackground = () => {
        const container = document.getElementById('canvas-container');
        if (!container) return;

        try {
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            container.appendChild(renderer.domElement);

            const sphere = new THREE.Mesh(
                new THREE.IcosahedronGeometry(1.5, 0),
                new THREE.MeshStandardMaterial({ color: 0x5eead4, wireframe: true, metalness: 0.8 })
            );
            scene.add(sphere);

            // Breakable Background Star Particles
            const starsCount = 2000;
            const starsGeo = new THREE.BufferGeometry();
            const positions = new Float32Array(starsCount * 3);
            const velocities = new Float32Array(starsCount * 3);
            const originalPos = new Float32Array(starsCount * 3);

            for (let i = 0; i < starsCount * 3; i++) {
                const val = (Math.random() - 0.5) * 20;
                positions[i] = val;
                originalPos[i] = val;
                velocities[i] = 0;
            }

            starsGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            const starsMat = new THREE.PointsMaterial({
                color: 0x2dd4bf,
                size: 0.2,
                map: spaceTexture,
                transparent: true,
                opacity: 0.8,
                depthWrite: false,
                blending: THREE.AdditiveBlending
            });
            const stars = new THREE.Points(starsGeo, starsMat);
            scene.add(stars);

            scene.add(new THREE.AmbientLight(0xffffff, 1));
            camera.position.z = 5;

            // Interaction Logic - COLLAPSE Physics
            let mouse = new THREE.Vector2(-100, -100);
            const raycaster = new THREE.Raycaster();

            const onInteraction = (x, y) => {
                mouse.x = (x / window.innerWidth) * 2 - 1;
                mouse.y = -(y / window.innerHeight) * 2 + 1;

                raycaster.setFromCamera(mouse, camera);
                const intersects = raycaster.ray;

                const posAttr = starsGeo.attributes.position;
                for (let i = 0; i < starsCount; i++) {
                    const pVec = new THREE.Vector3(posAttr.getX(i), posAttr.getY(i), posAttr.getZ(i));
                    const dist = intersects.distanceToPoint(pVec);

                    if (dist < 2.0) {
                        const dir = intersects.origin.clone().sub(pVec).normalize(); // Pull TOWARD touch
                        velocities[i * 3] += dir.x * 0.8;
                        velocities[i * 3 + 1] += dir.y * 0.8;
                        velocities[i * 3 + 2] += dir.z * 0.8;
                    }
                }
            };

            window.addEventListener('mousedown', (e) => onInteraction(e.clientX, e.clientY));
            window.addEventListener('touchstart', (e) => onInteraction(e.touches[0].clientX, e.touches[0].clientY));

            const animate = () => {
                sphere.rotation.y += 0.005;
                sphere.rotation.x += 0.002;

                const posAttr = starsGeo.attributes.position;
                for (let i = 0; i < starsCount; i++) {
                    let vx = velocities[i * 3];
                    let vy = velocities[i * 3 + 1];
                    let vz = velocities[i * 3 + 2];

                    // Move particles
                    posAttr.setX(i, posAttr.getX(i) + vx);
                    posAttr.setY(i, posAttr.getY(i) + vy);
                    posAttr.setZ(i, posAttr.getZ(i) + vz);

                    // Friction & Return force
                    velocities[i * 3] *= 0.95;
                    velocities[i * 3 + 1] *= 0.95;
                    velocities[i * 3 + 2] *= 0.95;

                    const ox = originalPos[i * 3];
                    const oy = originalPos[i * 3 + 1];
                    const oz = originalPos[i * 3 + 2];

                    posAttr.setX(i, posAttr.getX(i) + (ox - posAttr.getX(i)) * 0.01);
                    posAttr.setY(i, posAttr.getY(i) + (oy - posAttr.getY(i)) * 0.01);
                    posAttr.setZ(i, posAttr.getZ(i) + (oz - posAttr.getZ(i)) * 0.01);
                }
                posAttr.needsUpdate = true;

                renderer.render(scene, camera);
                requestAnimationFrame(animate);
            };
            animate();

            window.addEventListener('resize', () => {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            });
        } catch (e) {
            console.error("Background 3D failed:", e);
        }
    };

    // --- 5. HYPER-IMMERSIVE 3D OBJECT (Works Page) ---
    const initGallery = () => {
        const gall = document.getElementById('gallery-container');
        if (!gall) return;

        console.log("Initializing 3D Gallery Object...");

        try {
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(60, gall.clientWidth / (gall.clientHeight || 500), 0.1, 1000);
            const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

            // Ensure container has height
            if (gall.clientHeight === 0) gall.style.height = "600px";

            renderer.setSize(gall.clientWidth, gall.clientHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            gall.appendChild(renderer.domElement);

            // Reflective Base
            const grid = new THREE.GridHelper(40, 40, 0x2dd4bf, 0x0f172a);
            grid.position.y = -6;
            grid.material.opacity = 0.2;
            grid.material.transparent = true;
            scene.add(grid);

            // THE REAL 3D OBJECT: The "Wireframe Core"
            const coreGroup = new THREE.Group();

            // Inner Core (Icosahedron)
            const innerGeo = new THREE.IcosahedronGeometry(5, 1);
            const innerMat = new THREE.MeshStandardMaterial({
                color: 0x5eead4,
                wireframe: true,
                transparent: true,
                opacity: 0.8,
                emissive: 0x2dd4bf,
                emissiveIntensity: 0.5
            });
            const innerCore = new THREE.Mesh(innerGeo, innerMat);
            coreGroup.add(innerCore);

            // Outer Shell (Rotating Torus Knot)
            const outerGeo = new THREE.TorusKnotGeometry(7, 2, 100, 16);
            const outerMat = new THREE.MeshStandardMaterial({
                color: 0x0f766e,
                wireframe: true,
                transparent: true,
                opacity: 0.3,
                emissive: 0x5eead4,
                emissiveIntensity: 0.2
            });
            const outerShell = new THREE.Mesh(outerGeo, outerMat);
            coreGroup.add(outerShell);

            scene.add(coreGroup);

            // Orbiting Points (Stars inside the core)
            const pointsGeo = new THREE.BufferGeometry();
            const pointsPos = new Float32Array(200 * 3);
            for (let i = 0; i < 200 * 3; i++) pointsPos[i] = (Math.random() - 0.5) * 8;
            pointsGeo.setAttribute('position', new THREE.BufferAttribute(pointsPos, 3));
            const pointsMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1 });
            const points = new THREE.Points(pointsGeo, pointsMat);
            coreGroup.add(points);

            // Orbiting Ring
            const ringGeo = new THREE.TorusGeometry(12, 0.05, 16, 100);
            const ringMat = new THREE.MeshBasicMaterial({ color: 0x2dd4bf, transparent: true, opacity: 0.4 });
            const ring = new THREE.Mesh(ringGeo, ringMat);
            ring.rotation.x = Math.PI / 2;
            scene.add(ring);

            // Lighting
            const pLight = new THREE.PointLight(0xffffff, 2.5, 50);
            pLight.position.set(10, 10, 10);
            scene.add(pLight);
            scene.add(new THREE.AmbientLight(0xffffff, 0.6));

            camera.position.set(0, 2, 25);

            let drag = false, px = 0, py = 0, targetX = 0, targetY = 0, currentX = 0, currentY = 0;
            let zoom = 25, targetZoom = 25;

            gall.addEventListener('mousedown', (e) => { drag = true; px = e.clientX; py = e.clientY; });
            window.addEventListener('mouseup', () => drag = false);
            window.addEventListener('mousemove', (e) => {
                if (drag) {
                    targetX += (e.clientX - px) * 0.005;
                    targetY += (e.clientY - py) * 0.005;
                    px = e.clientX; py = e.clientY;
                }
            });

            // Touch Support
            gall.addEventListener('touchstart', (e) => {
                drag = true;
                px = e.touches[0].clientX;
                py = e.touches[0].clientY;
            }, { passive: false });
            window.addEventListener('touchend', () => drag = false);
            window.addEventListener('touchmove', (e) => {
                if (drag) {
                    e.preventDefault();
                    targetX += (e.touches[0].clientX - px) * 0.008;
                    targetY += (e.touches[0].clientY - py) * 0.008;
                    px = e.touches[0].clientX;
                    py = e.touches[0].clientY;
                }
            }, { passive: false });

            gall.addEventListener('wheel', (e) => {
                e.preventDefault();
                targetZoom = Math.max(15, Math.min(45, targetZoom + e.deltaY * 0.02));
            }, { passive: false });

            const animateG = () => {
                const time = Date.now() * 0.001;

                if (!drag) {
                    targetX += 0.003;
                    targetY += 0.001;
                }

                currentX += (targetX - currentX) * 0.05;
                currentY += (targetY - currentY) * 0.05;
                coreGroup.rotation.y = currentX;
                coreGroup.rotation.x = currentY;

                innerCore.rotation.y -= 0.01;
                outerShell.rotation.z += 0.005;
                ring.rotation.z += 0.01;

                coreGroup.position.y = Math.sin(time) * 0.5;

                zoom += (targetZoom - zoom) * 0.1;
                camera.position.z = zoom;
                camera.lookAt(0, 0, 0);

                renderer.render(scene, camera);
                requestAnimationFrame(animateG);
            };
            animateG();
        } catch (e) {
            console.error("Gallery 3D failed:", e);
        }
    };

    // --- 6. Execution & Final Reveal ---
    // Start the 3D Scenes
    initIntro();
    initBackground();
    initGallery();

    // Cinematic Reveal after a short delay (Allows intro to play)
    setTimeout(hideLoader, 1500);

    // Reveal on Scroll Observer
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal, .reveal-on-scroll, .glass, .work-card, .value-card, .tool-item').forEach(el => {
        if (!el.classList.contains('reveal-on-scroll')) {
            el.classList.add('reveal-on-scroll');
        }
        obs.observe(el);
    });
});
