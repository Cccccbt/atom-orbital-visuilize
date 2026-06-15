import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const elements = [
  ["H", "Hydrogen"], ["He", "Helium"], ["Li", "Lithium"], ["Be", "Beryllium"],
  ["B", "Boron"], ["C", "Carbon"], ["N", "Nitrogen"], ["O", "Oxygen"],
  ["F", "Fluorine"], ["Ne", "Neon"], ["Na", "Sodium"], ["Mg", "Magnesium"],
  ["Al", "Aluminium"], ["Si", "Silicon"], ["P", "Phosphorus"], ["S", "Sulfur"],
  ["Cl", "Chlorine"], ["Ar", "Argon"], ["K", "Potassium"], ["Ca", "Calcium"],
  ["Sc", "Scandium"], ["Ti", "Titanium"], ["V", "Vanadium"], ["Cr", "Chromium"],
  ["Mn", "Manganese"], ["Fe", "Iron"], ["Co", "Cobalt"], ["Ni", "Nickel"],
  ["Cu", "Copper"], ["Zn", "Zinc"], ["Ga", "Gallium"], ["Ge", "Germanium"],
  ["As", "Arsenic"], ["Se", "Selenium"], ["Br", "Bromine"], ["Kr", "Krypton"],
  ["Rb", "Rubidium"], ["Sr", "Strontium"], ["Y", "Yttrium"], ["Zr", "Zirconium"],
  ["Nb", "Niobium"], ["Mo", "Molybdenum"], ["Tc", "Technetium"], ["Ru", "Ruthenium"],
  ["Rh", "Rhodium"], ["Pd", "Palladium"], ["Ag", "Silver"], ["Cd", "Cadmium"],
  ["In", "Indium"], ["Sn", "Tin"], ["Sb", "Antimony"], ["Te", "Tellurium"],
  ["I", "Iodine"], ["Xe", "Xenon"], ["Cs", "Caesium"], ["Ba", "Barium"],
  ["La", "Lanthanum"], ["Ce", "Cerium"], ["Pr", "Praseodymium"], ["Nd", "Neodymium"],
  ["Pm", "Promethium"], ["Sm", "Samarium"], ["Eu", "Europium"], ["Gd", "Gadolinium"],
  ["Tb", "Terbium"], ["Dy", "Dysprosium"], ["Ho", "Holmium"], ["Er", "Erbium"],
  ["Tm", "Thulium"], ["Yb", "Ytterbium"], ["Lu", "Lutetium"], ["Hf", "Hafnium"],
  ["Ta", "Tantalum"], ["W", "Tungsten"], ["Re", "Rhenium"], ["Os", "Osmium"],
  ["Ir", "Iridium"], ["Pt", "Platinum"], ["Au", "Gold"], ["Hg", "Mercury"],
  ["Tl", "Thallium"], ["Pb", "Lead"], ["Bi", "Bismuth"], ["Po", "Polonium"],
  ["At", "Astatine"], ["Rn", "Radon"], ["Fr", "Francium"], ["Ra", "Radium"],
  ["Ac", "Actinium"], ["Th", "Thorium"], ["Pa", "Protactinium"], ["U", "Uranium"],
  ["Np", "Neptunium"], ["Pu", "Plutonium"], ["Am", "Americium"], ["Cm", "Curium"],
  ["Bk", "Berkelium"], ["Cf", "Californium"], ["Es", "Einsteinium"], ["Fm", "Fermium"],
  ["Md", "Mendelevium"], ["No", "Nobelium"], ["Lr", "Lawrencium"], ["Rf", "Rutherfordium"],
  ["Db", "Dubnium"], ["Sg", "Seaborgium"], ["Bh", "Bohrium"], ["Hs", "Hassium"],
  ["Mt", "Meitnerium"], ["Ds", "Darmstadtium"], ["Rg", "Roentgenium"], ["Cn", "Copernicium"],
  ["Nh", "Nihonium"], ["Fl", "Flerovium"], ["Mc", "Moscovium"], ["Lv", "Livermorium"],
  ["Ts", "Tennessine"], ["Og", "Oganesson"],
];

const subshells = [
  [1, "s", 2], [2, "s", 2], [2, "p", 6], [3, "s", 2], [3, "p", 6], [4, "s", 2],
  [3, "d", 10], [4, "p", 6], [5, "s", 2], [4, "d", 10], [5, "p", 6], [6, "s", 2],
  [4, "f", 14], [5, "d", 10], [6, "p", 6], [7, "s", 2], [5, "f", 14], [6, "d", 10], [7, "p", 6],
];

const orbitalVariants = {
  s: ["s"],
  p: ["px", "py", "pz"],
  d: ["dz2", "dxz", "dyz", "dx2y2", "dxy"],
  f: ["fz3", "fxz2", "fyz2", "fxyz", "fzx2y2", "fx3", "fy3"],
};

const superscript = {
  0: "\u2070",
  1: "\u00b9",
  2: "\u00b2",
  3: "\u00b3",
  4: "\u2074",
  5: "\u2075",
  6: "\u2076",
  7: "\u2077",
  8: "\u2078",
  9: "\u2079",
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const canvas = document.querySelector("#orbitalCanvas");
const atomicInput = document.querySelector("#atomicNumber");
const densityInput = document.querySelector("#density");
const lobeSizeInput = document.querySelector("#lobeSize");
const lobeLengthInput = document.querySelector("#lobeLength");
const cloudButton = document.querySelector("#cloudMode");
const lobeButton = document.querySelector("#lobeMode");
const orbitalList = document.querySelector("#orbitalList");
const selectAllButton = document.querySelector("#selectAll");
const selectLastButton = document.querySelector("#selectLast");
const zhButton = document.querySelector("#zhMode");
const enButton = document.querySelector("#enMode");

const labels = {
  symbol: document.querySelector("#elementSymbol"),
  name: document.querySelector("#elementName"),
  badge: document.querySelector("#orbitalBadge"),
  configuration: document.querySelector("#configuration"),
  shown: document.querySelector("#shownOrbital"),
};

const translations = {
  zh: {
    title: "3D Atom Orbital",
    intro: "\u8f93\u5165 atomic number\uff0c\u7136\u540e\u52fe\u9009\u8981\u663e\u793a\u7684 orbital\u3002",
    atomicNumber: "Atomic number",
    cloudMode: "\u7535\u5b50\u4e91",
    lobeMode: "\u8f68\u9053\u74e3",
    density: "\u7535\u5b50\u4e91\u5bc6\u5ea6",
    lobeWidth: "\u8f68\u9053\u74e3\u6a2a\u5411\u534a\u5f84",
    lobeLength: "\u8f68\u9053\u74e3\u7eb5\u5411\u534a\u5f84",
    orbitals: "Orbitals",
    all: "\u5168\u9009",
    last: "\u6700\u540e\u8f68\u9053",
    configurationLabel: "Electron configuration",
    shownOrbitalLabel: "\u5f53\u524d\u663e\u793a",
    interactionLabel: "\u64cd\u4f5c",
    interactionText: "\u62d6\u52a8\u65cb\u8f6c\uff0c\u6eda\u8f6e\u7f29\u653e",
    orbitalsCount: (count) => `${count} \u4e2a orbital`,
    noOrbital: "\u672a\u9009\u62e9 orbital",
    colorLabel: (orbital) => `${orbital} \u989c\u8272`,
  },
  en: {
    title: "3D Atom Orbital",
    intro: "Enter an atomic number, then check the orbitals you want to display.",
    atomicNumber: "Atomic number",
    cloudMode: "Electron cloud",
    lobeMode: "Orbital lobes",
    density: "Cloud density",
    lobeWidth: "Lobe lateral radius",
    lobeLength: "Lobe longitudinal radius",
    orbitals: "Orbitals",
    all: "All",
    last: "Last",
    configurationLabel: "Electron configuration",
    shownOrbitalLabel: "Shown orbital",
    interactionLabel: "Interaction",
    interactionText: "Drag to rotate, scroll to zoom",
    orbitalsCount: (count) => `${count} orbitals`,
    noOrbital: "No orbital selected",
    colorLabel: (orbital) => `${orbital} color`,
  },
};

let mode = "cloud";
let language = "zh";
let selectedKeys = new Set();
let orbitalColors = new Map();
let currentOrbitals = [];
let activeAtomicNumber;
let orbitalGroup;
let nucleus;

const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x0f1214, 8, 18);

const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 80);
camera.position.set(4.8, 3.5, 6.2);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.autoRotate = false;
controls.autoRotateSpeed = 0.35;
controls.minDistance = 3.2;
controls.maxDistance = 14;

scene.add(new THREE.AmbientLight(0xffffff, 0.56));
const keyLight = new THREE.DirectionalLight(0xffffff, 1.35);
keyLight.position.set(3, 4, 6);
scene.add(keyLight);
const rimLight = new THREE.DirectionalLight(0x58d6c5, 0.9);
rimLight.position.set(-5, -1, -3);
scene.add(rimLight);

const grid = new THREE.GridHelper(10, 20, 0x314047, 0x20282c);
grid.position.y = -3;
scene.add(grid);

function toSuperscript(number) {
  return String(number).split("").map((digit) => superscript[digit]).join("");
}

function t(key, ...args) {
  const value = translations[language][key];
  return typeof value === "function" ? value(...args) : value;
}

function applyLanguage() {
  document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });
  zhButton.classList.toggle("active", language === "zh");
  enButton.classList.toggle("active", language === "en");
  renderOrbitalSelector(currentOrbitals);
  updateShownLabels();
}

function setLanguage(nextLanguage) {
  language = nextLanguage;
  applyLanguage();
}

function getConfiguration(atomicNumber) {
  let remaining = atomicNumber;
  const filled = [];

  for (const [n, type, capacity] of subshells) {
    if (remaining <= 0) break;
    const electrons = Math.min(capacity, remaining);
    filled.push({ n, type, electrons });
    remaining -= electrons;
  }

  const exceptions = {
    24: [{ n: 4, type: "s", electrons: 1 }, { n: 3, type: "d", electrons: 5 }],
    29: [{ n: 4, type: "s", electrons: 1 }, { n: 3, type: "d", electrons: 10 }],
    42: [{ n: 5, type: "s", electrons: 1 }, { n: 4, type: "d", electrons: 5 }],
    47: [{ n: 5, type: "s", electrons: 1 }, { n: 4, type: "d", electrons: 10 }],
    79: [{ n: 6, type: "s", electrons: 1 }, { n: 5, type: "d", electrons: 10 }],
  };

  if (exceptions[atomicNumber]) {
    for (const patch of exceptions[atomicNumber]) {
      const target = filled.find((item) => item.n === patch.n && item.type === patch.type);
      if (target) target.electrons = patch.electrons;
    }
  }

  return filled.filter((item) => item.electrons > 0);
}

function orbitalLabel(orbital) {
  if (orbital.variant === "s") return `${orbital.n}s`;
  return `${orbital.n}${orbital.variant}`;
}

function defaultColorForOrbital(orbital) {
  const colors = {
    s: "#f1b35d",
    px: "#58d6c5",
    py: "#66a6ff",
    pz: "#8bd86f",
    dz2: "#d6c85f",
    dxz: "#7ed6a7",
    dyz: "#76a9ff",
    dx2y2: "#d67aa8",
    dxy: "#f08c69",
    fz3: "#b991ff",
    fxz2: "#68d6d0",
    fyz2: "#9bd66f",
    fxyz: "#f1b35d",
    fzx2y2: "#d67aa8",
    fx3: "#76a9ff",
    fy3: "#ff716d",
  };
  return colors[orbital.variant] ?? colors[orbital.type] ?? "#58d6c5";
}

function colorForPhase(orbital, positive) {
  const base = new THREE.Color(orbitalColors.get(orbital.key) ?? defaultColorForOrbital(orbital));
  if (positive) return base;
  return base.clone().multiplyScalar(0.48).lerp(new THREE.Color(0xffffff), 0.08);
}

function orbitalsFromConfiguration(config) {
  const orbitals = [];

  for (const item of config) {
    const variants = orbitalVariants[item.type];
    const counts = variants.map(() => 0);

    for (let i = 0; i < item.electrons; i += 1) {
      const index = i < variants.length ? i : i - variants.length;
      counts[index] += 1;
    }

    variants.forEach((variant, index) => {
      if (counts[index] === 0) return;
      orbitals.push({
        key: `${item.n}-${variant}`,
        n: item.n,
        type: item.type,
        variant,
        electrons: counts[index],
      });
    });
  }

  return orbitals;
}

function angularValue(variant, x, y, z) {
  switch (variant) {
    case "s": return 0.72;
    case "px": return x;
    case "py": return y;
    case "pz": return z;
    case "dz2": return 2 * z * z - x * x - y * y;
    case "dxz": return x * z * 2.1;
    case "dyz": return y * z * 2.1;
    case "dx2y2": return x * x - y * y;
    case "dxy": return x * y * 2.1;
    case "fz3": return z * (5 * z * z - 3);
    case "fxz2": return x * (5 * z * z - 1);
    case "fyz2": return y * (5 * z * z - 1);
    case "fxyz": return x * y * z * 5.5;
    case "fzx2y2": return z * (x * x - y * y) * 3.8;
    case "fx3": return x * (x * x - 3 * y * y) * 2.2;
    case "fy3": return y * (3 * x * x - y * y) * 2.2;
    default: return z;
  }
}

function directionFromAngles(theta, phi) {
  return {
    x: Math.sin(theta) * Math.cos(phi),
    y: Math.cos(theta),
    z: Math.sin(theta) * Math.sin(phi),
  };
}

function disposeObject(object) {
  if (!object) return;
  scene.remove(object);
  object.traverse?.((child) => {
    child.geometry?.dispose();
    if (Array.isArray(child.material)) {
      child.material.forEach((material) => material.dispose());
    } else {
      child.material?.dispose();
    }
  });
}

function removeOrbitalObjects() {
  disposeObject(orbitalGroup);
  disposeObject(nucleus);
}

function createNucleus(element) {
  const group = new THREE.Group();
  const core = new THREE.Mesh(
    new THREE.SphereGeometry(0.17, 32, 20),
    new THREE.MeshStandardMaterial({ color: 0xf1b35d, emissive: 0x6b3208, roughness: 0.36 }),
  );
  group.add(core);

  const halo = new THREE.Mesh(
    new THREE.SphereGeometry(0.28, 32, 20),
    new THREE.MeshBasicMaterial({ color: 0xf1b35d, transparent: true, opacity: 0.16 }),
  );
  group.add(halo);
  group.userData.element = element;
  return group;
}

function colorForOrbital(orbital, positive) {
  return colorForPhase(orbital, positive);
}

function scaleForOrbital(orbital) {
  return 0.58 + orbital.n * 0.16;
}

function createCloud(orbital, density, selectedCount) {
  const adjustedDensity = density / Math.sqrt(Math.max(1, selectedCount));
  const count = Math.round(650 + adjustedDensity * 34);
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const positiveColor = colorForOrbital(orbital, true);
  const negativeColor = colorForOrbital(orbital, false);
  let written = 0;
  let attempts = 0;

  while (written < count && attempts < count * 90) {
    attempts += 1;
    const u = Math.random() * 2 - 1;
    const phi = Math.random() * Math.PI * 2;
    const theta = Math.acos(u);
    const dir = directionFromAngles(theta, phi);
    const wave = angularValue(orbital.variant, dir.x, dir.y, dir.z);
    const probability = clamp(Math.abs(wave), 0.05, 1.5);
    if (Math.random() > probability * 0.68) continue;

    const radius = Math.pow(Math.random(), 0.43) * 2.85 * (0.74 + probability * 0.34);
    const jitter = (Math.random() - 0.5) * 0.17;
    positions[written * 3] = dir.x * radius + jitter;
    positions[written * 3 + 1] = dir.y * radius + jitter;
    positions[written * 3 + 2] = dir.z * radius + jitter;

    const color = wave >= 0 ? positiveColor.clone() : negativeColor.clone();
    color.lerp(new THREE.Color(0xffffff), Math.random() * 0.06);
    colors[written * 3] = color.r;
    colors[written * 3 + 1] = color.g;
    colors[written * 3 + 2] = color.b;
    written += 1;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  return new THREE.Points(
    geometry,
    new THREE.PointsMaterial({
      size: 0.035,
      transparent: true,
      opacity: clamp(0.16 + density / 210, 0.18, 0.62),
      vertexColors: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }),
  );
}

function lobeAxes(variant) {
  const v = (x, y, z) => new THREE.Vector3(x, y, z).normalize();
  switch (variant) {
    case "px": return [v(1, 0, 0), v(-1, 0, 0)];
    case "py": return [v(0, 1, 0), v(0, -1, 0)];
    case "pz": return [v(0, 0, 1), v(0, 0, -1)];
    case "dz2": return [v(0, 0, 1), v(0, 0, -1)];
    case "dxz": return [v(1, 0, 1), v(-1, 0, -1), v(1, 0, -1), v(-1, 0, 1)];
    case "dyz": return [v(0, 1, 1), v(0, -1, -1), v(0, 1, -1), v(0, -1, 1)];
    case "dx2y2": return [v(1, 0, 0), v(-1, 0, 0), v(0, 1, 0), v(0, -1, 0)];
    case "dxy": return [v(1, 1, 0), v(-1, -1, 0), v(1, -1, 0), v(-1, 1, 0)];
    case "fz3": return [v(0, 0, 1), v(0, 0, -1)];
    case "fxz2": return [v(1, 0, 1), v(-1, 0, -1), v(1, 0, -1), v(-1, 0, 1)];
    case "fyz2": return [v(0, 1, 1), v(0, -1, -1), v(0, 1, -1), v(0, -1, 1)];
    case "fxyz": return [v(1, 1, 1), v(-1, -1, -1), v(1, -1, 1), v(-1, 1, -1), v(-1, 1, 1), v(1, -1, -1), v(1, 1, -1), v(-1, -1, 1)];
    case "fzx2y2": return [v(1, 0, 1), v(-1, 0, -1), v(0, 1, 1), v(0, -1, -1), v(1, 0, -1), v(-1, 0, 1), v(0, 1, -1), v(0, -1, 1)];
    case "fx3": return [v(1, 0, 0), v(-1, 0, 0), v(0.5, 0.86, 0), v(-0.5, -0.86, 0), v(0.5, -0.86, 0), v(-0.5, 0.86, 0)];
    case "fy3": return [v(0, 1, 0), v(0, -1, 0), v(0.86, 0.5, 0), v(-0.86, -0.5, 0), v(-0.86, 0.5, 0), v(0.86, -0.5, 0)];
    default: return [];
  }
}

function shapeRelativeToLobeAxis(variant, x, y, z, widthScale, lengthScale) {
  if (variant === "s") return { x, y, z };
  const point = new THREE.Vector3(x, y, z);
  if (point.lengthSq() === 0) return { x, y, z };

  const direction = point.clone().normalize();
  const axes = lobeAxes(variant);
  let axis = axes[0];
  let bestAlignment = -Infinity;

  for (const candidate of axes) {
    const alignment = candidate.dot(direction);
    if (alignment > bestAlignment) {
      bestAlignment = alignment;
      axis = candidate;
    }
  }

  const parallelLength = point.dot(axis);
  const baseParallel = axis.clone().multiplyScalar(parallelLength);
  const parallel = baseParallel.clone().multiplyScalar(lengthScale);
  const perpendicular = point.sub(baseParallel).multiplyScalar(widthScale);
  const shaped = parallel.add(perpendicular);
  return { x: shaped.x, y: shaped.y, z: shaped.z };
}

function buildLobeGeometry(variant, positive, widthScale = 1, lengthScale = 1) {
  const radialSegments = 72;
  const heightSegments = 38;
  const vertices = [];
  const indices = [];

  for (let i = 0; i <= heightSegments; i += 1) {
    const theta = (i / heightSegments) * Math.PI;
    for (let j = 0; j <= radialSegments; j += 1) {
      const phi = (j / radialSegments) * Math.PI * 2;
      const dir = directionFromAngles(theta, phi);
      const wave = angularValue(variant, dir.x, dir.y, dir.z);
      const visible = positive ? wave > 0 : wave < 0;
      const amount = visible ? Math.pow(Math.abs(wave), 0.72) : 0.018;
      const radius = 0.22 + amount * 2.5;
      const point = shapeRelativeToLobeAxis(
        variant,
        dir.x * radius,
        dir.y * radius,
        dir.z * radius,
        widthScale,
        lengthScale,
      );
      vertices.push(point.x, point.y, point.z);
    }
  }

  for (let i = 0; i < heightSegments; i += 1) {
    for (let j = 0; j < radialSegments; j += 1) {
      const a = i * (radialSegments + 1) + j;
      const b = a + radialSegments + 1;
      indices.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function createLobes(orbital, selectedCount) {
  const group = new THREE.Group();
  const control = Number.parseInt(lobeSizeInput.value, 10);
  const lengthControl = Number.parseInt(lobeLengthInput.value, 10);
  const widthScale = control / 100;
  const lengthScale = lengthControl / 100;
  const opacity = selectedCount > 1 ? 0.46 : 0.72;
  const materials = [
    new THREE.MeshStandardMaterial({
      color: colorForOrbital(orbital, true),
      transparent: true,
      opacity,
      roughness: 0.42,
      metalness: 0.05,
    }),
    new THREE.MeshStandardMaterial({
      color: colorForOrbital(orbital, false),
      transparent: true,
      opacity: opacity * 0.94,
      roughness: 0.42,
      metalness: 0.05,
    }),
  ];

  group.add(new THREE.Mesh(buildLobeGeometry(orbital.variant, true, widthScale, lengthScale), materials[0]));
  group.add(new THREE.Mesh(buildLobeGeometry(orbital.variant, false, widthScale, lengthScale), materials[1]));
  return group;
}

function createOrbitalObject(orbital, density, selectedCount) {
  const group = new THREE.Group();
  const cloud = createCloud(orbital, density, selectedCount);
  const lobes = createLobes(orbital, selectedCount);
  const scale = scaleForOrbital(orbital);

  cloud.visible = mode === "cloud";
  lobes.visible = mode === "lobes";
  group.add(cloud, lobes);
  group.scale.setScalar(scale);
  return group;
}

function updateShownLabels() {
  const selectedOrbitals = currentOrbitals.filter((orbital) => selectedKeys.has(orbital.key));
  const shown = selectedOrbitals.map(orbitalLabel);
  labels.badge.textContent = shown.length === 1 ? shown[0] : t("orbitalsCount", shown.length);
  labels.shown.textContent = shown.length > 0 ? shown.join(", ") : t("noOrbital");
}

function renderOrbitalSelector(orbitals) {
  orbitalList.replaceChildren();
  const fragment = document.createDocumentFragment();

  orbitals.forEach((orbital) => {
    const label = document.createElement("label");
    label.className = "orbital-chip";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = selectedKeys.has(orbital.key);
    checkbox.dataset.key = orbital.key;

    const name = document.createElement("span");
    name.textContent = orbitalLabel(orbital);

    const electrons = document.createElement("small");
    electrons.textContent = `${orbital.electrons}e`;

    const color = document.createElement("input");
    color.type = "color";
    color.className = "orbital-color";
    color.value = orbitalColors.get(orbital.key) ?? defaultColorForOrbital(orbital);
    color.dataset.key = orbital.key;
    color.setAttribute("aria-label", t("colorLabel", orbitalLabel(orbital)));

    label.append(checkbox, name, electrons, color);
    fragment.append(label);
  });

  orbitalList.append(fragment);
}

function syncSelectedKeys(orbitals) {
  const validKeys = new Set(orbitals.map((orbital) => orbital.key));
  selectedKeys = new Set([...selectedKeys].filter((key) => validKeys.has(key)));
  for (const orbital of orbitals) {
    if (!orbitalColors.has(orbital.key)) orbitalColors.set(orbital.key, defaultColorForOrbital(orbital));
  }
  if (selectedKeys.size === 0 && orbitals.length > 0) {
    selectedKeys.add(orbitals.at(-1).key);
  }
}

function updateOrbitalObjects() {
  disposeObject(orbitalGroup);
  orbitalGroup = new THREE.Group();

  const selectedOrbitals = currentOrbitals.filter((orbital) => selectedKeys.has(orbital.key));
  const density = Number.parseInt(densityInput.value, 10);
  selectedOrbitals.forEach((orbital) => {
    orbitalGroup.add(createOrbitalObject(orbital, density, selectedOrbitals.length));
  });
  scene.add(orbitalGroup);

  updateShownLabels();
}

function updateAtom() {
  const atomicNumber = clamp(Number.parseInt(atomicInput.value, 10) || 1, 1, 118);
  atomicInput.value = atomicNumber;
  const atomicChanged = atomicNumber !== activeAtomicNumber;
  activeAtomicNumber = atomicNumber;
  const [symbol, name] = elements[atomicNumber - 1];
  const config = getConfiguration(atomicNumber);

  currentOrbitals = orbitalsFromConfiguration(config);
  if (atomicChanged) selectedKeys.clear();
  syncSelectedKeys(currentOrbitals);
  removeOrbitalObjects();
  nucleus = createNucleus(symbol);
  scene.add(nucleus);
  renderOrbitalSelector(currentOrbitals);
  updateOrbitalObjects();

  labels.symbol.textContent = symbol;
  labels.name.textContent = name;
  labels.configuration.textContent = config.map((item) => `${item.n}${item.type}${toSuperscript(item.electrons)}`).join(" ");
}

function setMode(nextMode) {
  mode = nextMode;
  cloudButton.classList.toggle("active", mode === "cloud");
  lobeButton.classList.toggle("active", mode === "lobes");

  orbitalGroup?.children.forEach((orbitalObject) => {
    const [cloud, lobes] = orbitalObject.children;
    cloud.visible = mode === "cloud";
    lobes.visible = mode === "lobes";
  });
}

function resize() {
  const rect = canvas.parentElement.getBoundingClientRect();
  renderer.setSize(rect.width, rect.height, false);
  camera.aspect = rect.width / Math.max(1, rect.height);
  camera.updateProjectionMatrix();
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  if (nucleus) nucleus.rotation.y += 0.01;
  renderer.render(scene, camera);
}

atomicInput.addEventListener("input", () => {
  if (atomicInput.value === "") return;
  updateAtom();
});
atomicInput.addEventListener("blur", () => {
  if (atomicInput.value === "") atomicInput.value = "1";
  updateAtom();
});
densityInput.addEventListener("input", updateOrbitalObjects);
lobeSizeInput.addEventListener("input", updateOrbitalObjects);
lobeLengthInput.addEventListener("input", updateOrbitalObjects);
cloudButton.addEventListener("click", () => setMode("cloud"));
lobeButton.addEventListener("click", () => setMode("lobes"));
zhButton.addEventListener("click", () => setLanguage("zh"));
enButton.addEventListener("click", () => setLanguage("en"));
selectAllButton.addEventListener("click", () => {
  selectedKeys = new Set(currentOrbitals.map((orbital) => orbital.key));
  renderOrbitalSelector(currentOrbitals);
  updateOrbitalObjects();
});
selectLastButton.addEventListener("click", () => {
  selectedKeys = new Set([currentOrbitals.at(-1)?.key].filter(Boolean));
  renderOrbitalSelector(currentOrbitals);
  updateOrbitalObjects();
});
orbitalList.addEventListener("change", (event) => {
  if (!(event.target instanceof HTMLInputElement)) return;
  if (event.target.type === "color") {
    orbitalColors.set(event.target.dataset.key, event.target.value);
    updateOrbitalObjects();
    return;
  }
  if (event.target.checked) {
    selectedKeys.add(event.target.dataset.key);
  } else {
    selectedKeys.delete(event.target.dataset.key);
  }
  updateOrbitalObjects();
});
window.addEventListener("resize", resize);

resize();
updateAtom();
applyLanguage();
animate();
