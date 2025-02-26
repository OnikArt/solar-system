import * as THREE from 'three';

import init from './init';

import './style.css';

import GUI from 'lil-gui';

import Stats from 'stats.js'

const {sizes, scene, camera, canvas, controls, renderer} = init();

camera.position.z = 30;

const textureLoader = new THREE.TextureLoader();

const planetList = [
	{name: 'Earth', position: 35, material: 'textures/earth.jpg', size: 3},
	{name: 'Jupiter', position: 55, material: 'textures/jupiter.jpg', size: 7},
	{name: 'Mars', position: 45, material: 'textures/mars.jpg', size: 1.5},
	{name: 'Mercury', position: 15, material: 'textures/mercury.jpg', size: 1},
	{name: 'Moon', position: 105, material: 'textures/moon.jpg', size: 0.4},
	{name: 'Neptune', position: 112, material: 'textures/neptune.jpg', size: 4},
	{name: 'Saturn', position: 75, material: 'textures/saturn.jpg', size: 6},
	{name: 'SaturnRing', position: 125, material: 'textures/saturn.jpg', size: 6},
	{name: 'Sun', position: 0, material: 'textures/sun.jpg', size: 10},
	{name: 'Uranus', position: 95, material: 'textures/uranus.jpg', size: 5},
	{name: 'Venus', position: 25, material: 'textures/venus.jpg', size: 2},
];

const allPlanets = new THREE.Group();

const gui = new GUI();

planetList.forEach(planet => {
	const geometry = new THREE.SphereGeometry(planet.size, 256, 256);
	const material = new THREE.MeshBasicMaterial({
		map: textureLoader.load(planet.material),
	});
	
	const mesh = new THREE.Mesh(geometry, material);
	mesh.position.x = planet.position;
	mesh.name = planet.name;
	allPlanets.add(mesh);
});;

scene.add(allPlanets);

gui.add(camera.position, 'y').min(0).max(150).name("Camera distance Y:");
gui.add(camera.position, 'x').min(-150).max(150).name("Camera distance X:");
gui.add(camera.position, 'z').min(30).max(150).name("Camera distance Z:");

window.addEventListener('dblclick', () => {
	if(!document.fullscreenElement){
		canvas.requestFullscreen()
	} else{
		document.exitFullscreen()
	}
});

window.addEventListener('resize', () => {
	sizes.width = window.innerWidth;
	sizes.height = window.innerHeight;

	renderer.setSize(sizes.width, sizes.height);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio));
	renderer.render(scene, camera);
})

const stats = new Stats();
stats.showPanel(0)
document.body.appendChild(stats.dom)


const clock = new THREE.Clock();
allPlanets.children.forEach( child => {
	console.log(child)
});
const animate = () => {
	stats.begin();
	const delta = clock.getDelta();
	controls.update();

	allPlanets.children.forEach(child => {
		child.rotation.y += Math.sin(delta) * 0.25;
	})

	renderer.render(scene, camera);
	

	requestAnimationFrame(animate);
	stats.end();
};
animate();