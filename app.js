// Import Three.js FontLoader for 3D text
let fontLoader = new THREE.FontLoader();
let font;
fontLoader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function (loadedFont) {
    font = loadedFont;
});   

// Create a Three.js Scene
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
let renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Basic Lighting
let ambientLight = new THREE.AmbientLight(0x404040); // Soft white light
scene.add(ambientLight);

let light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(10, 10, 10);
scene.add(light);

// Define a 9x9 Sudoku grid (0 means empty cell)
let sudokuGrid = [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9]
];

// Levels content arrays
let aboutMe =["samreen"] ;
let skills = ["JavaScript", "Three.js","html","css"];
let hobbies = ["Reading", "Traveling"];

// Initialize level tracking
let currentLevel = 1;

// Create the 3D grid
let grid = [];
const cellSize = 1.2;
const cellHeight = 0.5;
for (let i = 0; i < 9; i++) {
    grid[i] = [];
    for (let j = 0; j < 9; j++) {
        let geometry = new THREE.BoxGeometry(cellSize, cellHeight, cellSize);
        let material = new THREE.MeshPhongMaterial({ 
            color: sudokuGrid[i][j] !== 0 ? 0xaaaaaa : 0xffffff, 
            flatShading: true 
        });
        let cell = new THREE.Mesh(geometry, material);
        cell.position.set(i * 1.2 - 5.4, cellHeight / 2, j * 1.2 - 5.4);
        cell.userData = { row: i, col: j, textMesh: null }; // Add textMesh to userData for tracking
        scene.add(cell);
        grid[i][j] = cell;

        // Add border
        let borderMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
        let borderGeometry = new THREE.EdgesGeometry(geometry);
        let border = new THREE.LineSegments(borderGeometry, borderMaterial);
        cell.add(border);
    }
}

// Camera position
camera.position.set(0, 5, 10);
camera.lookAt(0, 0, 0);

// Render the scene
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();

// Raycaster for detecting cell clicks
let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();

// Handle cell selection on mouse click
window.addEventListener('click', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    let intersects = raycaster.intersectObjects(scene.children);

    if (intersects.length > 0) {
        let cell = intersects[0].object;
        showInfo(cell);
        currentLevel = (currentLevel % 3) + 1; // Cycle through levels 1, 2, 3
    }
});

// Function to add level info to the cell
function showInfo(cell) {
    if (font) {
        // Remove previous text if it exists
        if (cell.userData.textMesh) {
            scene.remove(cell.userData.textMesh);
        }

        // Define text based on current level
        let text;
        if (currentLevel === 1) {
            text = `Samreen'\n${aboutMe}`;
        } else if (currentLevel === 2) {
            text = `javascript 'three.js' 'html' 'css'\n${skills[(currentLevel - 1) % skills.length]}`;
        } else {
            text = `reading' 'painting'\n${hobbies[(currentLevel - 1) % hobbies.length]}`;
        }

        // Create 3D text using TextGeometry
        let textGeometry = new THREE.TextGeometry(text, {
            font: font,
            size: 0.4,
            height: 0.1,
            curveSegments: 15,
            bevelEnabled: false,
        });
        let textMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
        let textMesh = new THREE.Mesh(textGeometry, textMaterial);

        // Position the text
        textMesh.position.set(cell.position.x - 0.5, cell.position.y + 0.4, cell.position.z - 0.5);
        scene.add(textMesh);

        // Store the text mesh to remove it later if needed
        cell.userData.textMesh = textMesh;
    }
}
