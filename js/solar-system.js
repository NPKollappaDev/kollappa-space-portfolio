
import * as THREE from "three";

const container = document.getElementById("solar-system");

if (container) {
  // =========================================
  // 1. SCENE, CAMERA AND RENDERER
  // =========================================

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    50,
    Math.max(container.clientWidth, 1) /
      Math.max(container.clientHeight, 1),
    0.1,
    2000
  );

  camera.position.set(0, 105, 155);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(
    Math.max(container.clientWidth, 1),
    Math.max(container.clientHeight, 1)
  );
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  container.appendChild(renderer.domElement);
  renderer.domElement.style.display = "block";
  renderer.domElement.style.width = "100%";
  renderer.domElement.style.height = "100%";

  // =========================================
  // 2. LIGHTING
  // =========================================

  scene.add(new THREE.AmbientLight(0xffffff, 1.8));

  const sunLight = new THREE.PointLight(0xffffff, 1800, 500);
  sunLight.position.set(0, 0, 0);
  scene.add(sunLight);

  // =========================================
  // 3. SUN
  // =========================================

  const sun = new THREE.Mesh(
    new THREE.SphereGeometry(5, 48, 48),
    new THREE.MeshBasicMaterial({ color: 0xffa52f })
  );

  scene.add(sun);

  const sunGlow = new THREE.Mesh(
    new THREE.SphereGeometry(6.5, 32, 32),
    new THREE.MeshBasicMaterial({
      color: 0xff6b12,
      transparent: true,
      opacity: 0.16,
      depthWrite: false
    })
  );

  scene.add(sunGlow);

  // =========================================
  // 4. PLANET DATA
  // =========================================

  const planetData = [
    {
      name: "Mercury",
      color: 0xaaa9ad,
      size: 0.8,
      orbit: 10,
      speed: 1.6,
      description: "The smallest planet, closest to the Sun."
    },
    {
      name: "Venus",
      color: 0xe4b17b,
      size: 1.3,
      orbit: 15,
      speed: 1.15,
      description: "A hot world with a thick atmosphere."
    },
    {
      name: "Earth",
      color: 0x3489ff,
      size: 1.5,
      orbit: 21,
      speed: 0.85,
      description: "Our home planet, rich in liquid water."
    },
    {
      name: "Mars",
      color: 0xd95b42,
      size: 1.1,
      orbit: 27,
      speed: 0.68,
      description: "The Red Planet, with enormous volcanoes."
    },
    {
      name: "Jupiter",
      color: 0xd6ad83,
      size: 3.2,
      orbit: 36,
      speed: 0.42,
      description: "The largest planet in our solar system."
    },
    {
      name: "Saturn",
      color: 0xe6d09a,
      size: 2.7,
      orbit: 46,
      speed: 0.3,
      description: "A gas giant famous for its beautiful rings."
    },
    {
      name: "Uranus",
      color: 0x78dce8,
      size: 1.9,
      orbit: 56,
      speed: 0.22,
      description: "An ice giant that rotates on its side."
    },
    {
      name: "Neptune",
      color: 0x4169e1,
      size: 1.9,
      orbit: 65,
      speed: 0.17,
      description: "A distant, deep-blue ice giant."
    }
  ];

  const planets = [];

  // =========================================
  // 5. ORBITS AND PLANETS
  // =========================================

  planetData.forEach((data) => {
    const orbitGeometry = new THREE.RingGeometry(
      data.orbit - 0.035,
      data.orbit + 0.035,
      180
    );

    const orbit = new THREE.Mesh(
      orbitGeometry,
      new THREE.MeshBasicMaterial({
        color: 0x8d9dff,
        transparent: true,
        opacity: 0.28,
        side: THREE.DoubleSide,
        depthWrite: false
      })
    );

    orbit.rotation.x = -Math.PI / 2;
    scene.add(orbit);

    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(data.size, 40, 40),
      new THREE.MeshStandardMaterial({
        color: data.color,
        roughness: 0.8,
        metalness: 0.05
      })
    );

    scene.add(mesh);

    // Saturn's rings
    if (data.name === "Saturn") {
      const saturnRing = new THREE.Mesh(
        new THREE.RingGeometry(
          data.size * 1.35,
          data.size * 2.1,
          80
        ),
        new THREE.MeshStandardMaterial({
          color: 0xcab78c,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.85,
          roughness: 0.9
        })
      );

      saturnRing.rotation.x = -Math.PI / 2.5;
      mesh.add(saturnRing);
    }

    planets.push({
      mesh,
      data,
      angle: Math.random() * Math.PI * 2
    });
  });

  // =========================================
  // 6. BIG ANIMATED BACKGROUND STARS
  // =========================================

  // Layer 1: thousands of background stars
  const starCount = 2200;
  const starPositions = new Float32Array(starCount * 3);

  for (let i = 0; i < starCount; i++) {
    starPositions[i * 3] =
      (Math.random() - 0.5) * 1000;

    starPositions[i * 3 + 1] =
      (Math.random() - 0.5) * 700;

    starPositions[i * 3 + 2] =
      (Math.random() - 0.5) * 1000;
  }

  const starGeometry = new THREE.BufferGeometry();

  starGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(starPositions, 3)
  );

  const starMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 2.8,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.95,
    depthWrite: false
  });

  const starField = new THREE.Points(
    starGeometry,
    starMaterial
  );

  scene.add(starField);

  // Layer 2: large cyan stars
  const bigStarCount = 250;
  const bigStarPositions = new Float32Array(
    bigStarCount * 3
  );

  for (let i = 0; i < bigStarCount; i++) {
    bigStarPositions[i * 3] =
      (Math.random() - 0.5) * 900;

    bigStarPositions[i * 3 + 1] =
      (Math.random() - 0.5) * 650;

    bigStarPositions[i * 3 + 2] =
      (Math.random() - 0.5) * 900;
  }

  const bigStarGeometry = new THREE.BufferGeometry();

  bigStarGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(bigStarPositions, 3)
  );

  const bigStarMaterial = new THREE.PointsMaterial({
    color: 0x69e8ff,
    size: 7,
    sizeAttenuation: true,
    transparent: true,
    opacity: 1,
    depthWrite: false
  });

  const bigStarField = new THREE.Points(
    bigStarGeometry,
    bigStarMaterial
  );

  scene.add(bigStarField);

  // Layer 3: extra-large, bright white stars
  const brightStarCount = 70;
  const brightStarPositions = new Float32Array(
    brightStarCount * 3
  );

  for (let i = 0; i < brightStarCount; i++) {
    brightStarPositions[i * 3] =
      (Math.random() - 0.5) * 850;

    brightStarPositions[i * 3 + 1] =
      (Math.random() - 0.5) * 600;

    brightStarPositions[i * 3 + 2] =
      (Math.random() - 0.5) * 850;
  }

  const brightStarGeometry = new THREE.BufferGeometry();

  brightStarGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(brightStarPositions, 3)
  );

  const brightStarMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 10,
    sizeAttenuation: true,
    transparent: true,
    opacity: 1,
    depthWrite: false
  });

  const brightStarField = new THREE.Points(
    brightStarGeometry,
    brightStarMaterial
  );

  scene.add(brightStarField);

  // =========================================
  // 7. PLANET INFORMATION
  // =========================================

  const info = document.getElementById("planet-info");

  function selectPlanet(event) {
    const rect = renderer.domElement.getBoundingClientRect();

    const mouse = new THREE.Vector2(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    scene.updateMatrixWorld(true);

    const hits = raycaster.intersectObjects(
      planets.map((planet) => planet.mesh),
      false
    );

    if (hits.length > 0 && info) {
      const selected = planets.find(
        (planet) => planet.mesh === hits[0].object
      );

      if (selected) {
        info.textContent =
          selected.data.name +
          " — " +
          selected.data.description +
          " Orbital radius: " +
          selected.data.orbit +
          " units.";
      }
    }
  }

  // =========================================
  // 8. DRAG TO ROTATE
  // =========================================

  let dragging = false;
  let moved = false;

  let startX = 0;
  let startY = 0;
  let previousX = 0;
  let previousY = 0;

  let rotationX = 0;
  let rotationY = 0;

  const dragThreshold = 5;

  renderer.domElement.style.cursor = "grab";

  renderer.domElement.addEventListener(
    "pointerdown",
    (event) => {
      dragging = true;
      moved = false;

      startX = previousX = event.clientX;
      startY = previousY = event.clientY;

      renderer.domElement.style.cursor = "grabbing";
      renderer.domElement.setPointerCapture(event.pointerId);
    }
  );

  renderer.domElement.addEventListener(
    "pointermove",
    (event) => {
      if (!dragging) return;

      const totalX = event.clientX - startX;
      const totalY = event.clientY - startY;

      if (
        Math.abs(totalX) > dragThreshold ||
        Math.abs(totalY) > dragThreshold
      ) {
        moved = true;
      }

      if (moved) {
        rotationY +=
          (event.clientX - previousX) * 0.005;

        rotationX +=
          (event.clientY - previousY) * 0.003;

        rotationX = Math.max(
          -0.8,
          Math.min(0.8, rotationX)
        );
      }

      previousX = event.clientX;
      previousY = event.clientY;
    }
  );

  renderer.domElement.addEventListener(
    "pointerup",
    (event) => {
      if (!dragging) return;

      dragging = false;
      renderer.domElement.style.cursor = "grab";

      if (!moved) {
        selectPlanet(event);
      }

      if (
        renderer.domElement.hasPointerCapture(event.pointerId)
      ) {
        renderer.domElement.releasePointerCapture(
          event.pointerId
        );
      }
    }
  );

  renderer.domElement.addEventListener(
    "pointercancel",
    () => {
      dragging = false;
      renderer.domElement.style.cursor = "grab";
    }
  );

  renderer.domElement.addEventListener(
    "lostpointercapture",
    () => {
      dragging = false;
      renderer.domElement.style.cursor = "grab";
    }
  );

  // =========================================
  // 9. ANIMATION
  // =========================================

  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const delta = Math.min(clock.getDelta(), 0.05);
    const elapsed = clock.elapsedTime;

    // Sun rotation
    sun.rotation.y += delta * 0.15;
    sunGlow.rotation.y -= delta * 0.08;

    // Moving star layers
    starField.rotation.y += delta * 0.008;
    bigStarField.rotation.y -= delta * 0.005;
    brightStarField.rotation.y += delta * 0.003;

    starField.rotation.x += delta * 0.001;
    bigStarField.rotation.x += delta * 0.002;

    // Twinkling stars
    starMaterial.opacity =
      0.65 + Math.sin(elapsed * 2.5) * 0.2;

    bigStarMaterial.opacity =
      0.7 + Math.sin(elapsed * 3.5) * 0.3;

    brightStarMaterial.opacity =
      0.65 + Math.sin(elapsed * 4.5) * 0.35;

    // Planets orbit the Sun
    planets.forEach((planet) => {
      planet.angle +=
        delta * planet.data.speed * 0.15;

      planet.mesh.position.x =
        Math.cos(planet.angle) * planet.data.orbit;

      planet.mesh.position.z =
        Math.sin(planet.angle) * planet.data.orbit;

      planet.mesh.position.y = 0;
      planet.mesh.rotation.y += delta * 0.4;
    });

    // Smooth mouse-controlled rotation
    scene.rotation.x +=
      (rotationX - scene.rotation.x) * 0.06;

    scene.rotation.y +=
      (rotationY - scene.rotation.y) * 0.06;

    renderer.render(scene, camera);
  }

  // =========================================
  // 10. RESPONSIVE RESIZING
  // =========================================

  function resizeScene() {
    const width = container.clientWidth;
    const height = container.clientHeight;

    if (!width || !height) return;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
  }

  const resizeObserver = new ResizeObserver(resizeScene);
  resizeObserver.observe(container);

  window.addEventListener("resize", resizeScene);

  resizeScene();
  animate();
}
