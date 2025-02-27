import * as THREE from 'three'

import init from './init'

import './style.css'

import GUI from 'lil-gui'

import Stats from 'stats.js'

import { PLANETS } from './global.js'

const { sizes, scene, camera, canvas, controls, renderer, sunLight } = init()
camera.position.set(50, 70, 200)

const gui = new GUI({
	closeFolders: true,
})

const orbits = new THREE.Object3D()
const textureLoader = new THREE.TextureLoader()

const sunGlowGeometry = new THREE.SphereGeometry(5, 64, 64)
const sunGlowMaterial = new THREE.MeshBasicMaterial({
	color: 0xffff00,
	transparent: true,
	opacity: 1,
})

const sunGlow = new THREE.Mesh(sunGlowGeometry, sunGlowMaterial)
scene.add(sunGlow)

PLANETS.forEach(planet => {
	const geometry = new THREE.SphereGeometry(planet.size, 256, 256)
	let material

	if (planet.name === 'Sun') {
		material = new THREE.MeshBasicMaterial({
			map: textureLoader.load(planet.material),
		})
	} else {
		material = new THREE.MeshPhongMaterial({
			map: textureLoader.load(planet.material),
		})
	}

	const mesh = new THREE.Mesh(geometry, material)
	mesh.position.x = planet.position
	mesh.name = planet.name
	mesh.distance = planet.position
	mesh.orbitTime = planet.orbitTime
	mesh.sunAxleTime = planet.sunAxleTime
	

	if (planet.name === 'Saturn') {
		const ringGeometry = new THREE.RingGeometry(
			planet.size * 1.25,
			planet.size * 2,
			64
		)
		const ringMaterial = new THREE.MeshBasicMaterial({
			color: 0xFFCC66,
			side: THREE.DoubleSide,
			transparent: true,
			opacity: 0.4,
		})
		const ring = new THREE.Mesh(ringGeometry, ringMaterial)
		ring.rotation.x = Math.PI / 2
		mesh.add(ring)
	}

	orbits.add(mesh)
})
scene.add(orbits)
sunLight.target = orbits.children[0];


const planetSpeeds = {};
const speedTime = gui.addFolder('Planets Speed');
PLANETS.forEach(planet => {
    if (planet.name !== 'Sun') {
        planetSpeeds[planet.name] = planet.sunAxleTime; // Изначальная скорость
        speedTime.add(planetSpeeds, planet.name).min(0.1).max(2).step(0.1).name(`${planet.name} Speed`);
				planet.castShadow = true;
				planet.receiveShadow = true;
    }
});
const cameraPos = gui.addFolder('Camera Position');
cameraPos.add(camera.position, 'x').min(50).max(150).step(10).name('Camera PositionX:');
cameraPos.add(camera.position, 'y').min(70).max(150).step(10).name('Camera PositionY:');
cameraPos.add(camera.position, 'z').min(200).max(400).step(10).name('Camera PositionZ:');

window.addEventListener('dblclick', () => {
	if (!document.fullscreenElement) {
		canvas.requestFullscreen()
	} else {
		document.exitFullscreen()
	}
})

window.addEventListener('resize', () => {
	sizes.width = window.innerWidth
	sizes.height = window.innerHeight

	camera.aspect = sizes.width / sizes.height
	camera.updateProjectionMatrix()
	renderer.setSize(sizes.width, sizes.height)
	renderer.render(scene, camera)
})

const stats = new Stats()
stats.showPanel(0)
document.body.appendChild(stats.dom)

let angle = 0

const clock = new THREE.Clock()

orbits.children.forEach(child => {
	const orbitGeometry = new THREE.RingGeometry(
		child.distance - 0.1,
		child.distance + 0.1,
		512
	)
	const orbitMaterial = new THREE.MeshBasicMaterial({
		color: 0xffffff,
		side: THREE.DoubleSide,
	})
	const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial)
	orbit.rotation.x = Math.PI / 2
	scene.add(orbit)
})

const animate = () => {
	stats.begin()
	const delta = clock.getDelta()
	controls.update()
	angle += 0.01

	orbits.children.forEach(child => {
		child.rotation.y += Math.cos(delta) * child.orbitTime
		if (child.name !== 'Sun') {
			child.position.set(Math.cos(angle * planetSpeeds[child.name]) * child.distance, 0, Math.sin(angle * planetSpeeds[child.name]) * child.distance)
		} else if (child.name === 'Saturn') {
			child.children[0].rotation.z += 0.01
		}
	})

	renderer.render(scene, camera)

	requestAnimationFrame(animate)
	stats.end()
}
animate()
