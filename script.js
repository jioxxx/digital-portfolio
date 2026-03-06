// Princess Jhanna Dagpin Portfolio - Bulletproof Interactive Logic
document.addEventListener('DOMContentLoaded', () => {
    console.log("Portfolio Logic Initializing...");

    // --- 1. Loader Logic (Always executes first) ---
    const hideLoader = () => {
        const loader = document.getElementById('loader');
        if (loader) {
            console.log("Hiding loader...");
            loader.style.transition = 'opacity 0.8s ease';
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 800);
        }
    };

    // Fail-safe for loader: hide after 5 seconds no matter what
    setTimeout(hideLoader, 5000);

    // --- 2. Theme Management ---
    const themeBtn = document.getElementById('theme-toggle');
    const initTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', initTheme);

    themeBtn?.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const newTheme = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        console.log("Theme switched to:", newTheme);
    });

    // Mobile Menu Auto-close
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

            scene.add(new THREE.AmbientLight(0xffffff, 1));
            camera.position.z = 5;

            const animate = () => {
                sphere.rotation.y += 0.005;
                sphere.rotation.x += 0.002;
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

    // --- 6. Execution ---
    initBackground();
    initGallery();

    // Final check to hide loader
    setTimeout(hideLoader, 1500);

    // Intersection Observer for other elements
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal-on-scroll, .glass, .work-card, .value-card, .tool-item').forEach(el => {
        el.classList.add('reveal-on-scroll');
        obs.observe(el);
    });
});
