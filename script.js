// code by Kurt Grüng

const MathUtils = {
  normalize: (value, min, max) => (value - min) / (max - min),
  interpolate: (normValue, min, max) => min + (max - min) * normValue,
  map: (value, min1, max1, min2, max2) => {
    value = Math.min(Math.max(value, min1), max1);
    return MathUtils.interpolate(
      MathUtils.normalize(value, min1, max1),
      min2,
      max2
    );
  }
};

let w = window.innerWidth;
let h = window.innerHeight;

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("canvas"),
  antialias: true,
  shadowMapEnabled: true,
  shadowMapType: THREE.PCFSoftShadowMap
});
renderer.setSize(w, h);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(45, w / h, 0.001, 200);
let cameraRotationProxyX = Math.PI;
let cameraRotationProxyY = 0;
camera.rotation.y = cameraRotationProxyX;
camera.rotation.z = cameraRotationProxyY;

const cameraGroup = new THREE.Group();
cameraGroup.position.z = 400;
cameraGroup.add(camera);
scene.add(cameraGroup);

const generatePathPoints = (count = 10, spacing = 25) => {
  const points = [];
  for (let i = 0; i < count; i++) {
    const x = i * spacing;
    const y = Math.sin(i * 0.5 + Math.random()) * 100 + 50;
    const z = Math.cos(i * 0.3 + Math.random()) * 100 + 50;
    points.push(new THREE.Vector3(x, z, y));
  }
  return points;
};

const points = generatePathPoints(10);
const path = new THREE.CatmullRomCurve3(points);
path.closed = true;
path.tension = 1;

const ringCount = 600;
const ringRadius = 3;
const ringSegments = 32;

const geometry = new THREE.TubeGeometry(
  path,
  ringCount,
  ringRadius,
  ringSegments,
  true
);
const wireframe = new THREE.LineSegments(
  new THREE.EdgesGeometry(geometry),
  new THREE.LineBasicMaterial({ linewidth: 0.1, opacity: 0.1 })
);
scene.add(wireframe);

const ringMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });

const ringMaterial1 = new THREE.LineBasicMaterial({
  color: 0xffffff,
  transparent: true,
  opacity: 0.8,
  depthWrite: false
});

const frenetFrames = path.computeFrenetFrames(ringCount, true);

for (let i = 0; i <= ringCount; i++) {
  const t = i / ringCount;
  const pos = path.getPointAt(t);
  const normal = frenetFrames.normals[i];
  const binormal = frenetFrames.binormals[i];

  const ringPoints = [];
  for (let j = 0; j <= ringSegments; j++) {
    const theta = (j / ringSegments) * Math.PI * 2;
    const x = Math.cos(theta) * ringRadius;
    const y = Math.sin(theta) * ringRadius;

    const point = new THREE.Vector3().addVectors(
      pos,
      new THREE.Vector3()
        .addScaledVector(normal, x)
        .addScaledVector(binormal, y)
    );

    ringPoints.push(point);
  }

  const ringGeometry = new THREE.BufferGeometry().setFromPoints(ringPoints);
  const ringMesh = new THREE.LineLoop(ringGeometry, ringMaterial);
  scene.add(ringMesh);
}

const light = new THREE.PointLight(0xffffff, 0.1, 4, 0);
light.castShadow = true;
scene.add(light);

const renderScene = new THREE.RenderPass(scene, camera);
const bloomPass = new THREE.UnrealBloomPass(
  new THREE.Vector2(w, h),
  1.5,
  0.4,
  0.5
);
bloomPass.renderToScreen = true;

const composer = new THREE.EffectComposer(renderer);
composer.setSize(w, h);
composer.addPass(renderScene);
composer.addPass(bloomPass);

let cameraTargetPercentage = 0;
let currentCameraPercentage = 0;

function updateCameraPercentage(percentage) {
  const p1 = path.getPointAt(percentage % 1);
  const p2 = path.getPointAt((percentage + 0.01) % 1);

  cameraGroup.position.set(p1.x, p1.y, p1.z);
  cameraGroup.lookAt(p2);
  light.position.set(p2.x, p2.y, p2.z);
}

const tubePerc = { percent: 0 };

function render() {
  cameraTargetPercentage = (cameraTargetPercentage + 0.001) % 1;

  camera.rotation.y += (cameraRotationProxyX - camera.rotation.y) / 15;
  camera.rotation.x += (cameraRotationProxyY - camera.rotation.x) / 15;
  updateCameraPercentage(cameraTargetPercentage);
  composer.render();
  requestAnimationFrame(render);
  console.log(cameraTargetPercentage);
}

requestAnimationFrame(render);

window.addEventListener("resize", () => {
  w = window.innerWidth;
  h = window.innerHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
  composer.setSize(w, h);
});
