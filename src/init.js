import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const init = () => {
	const sizes = {
		width: window.innerWidth,
		height: window.innerHeight,
	}

	const scene = new THREE.Scene()
	const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
	const canvas = document.querySelector('.canvas')
	scene.add(camera)

	const hemisphereLight = new THREE.HemisphereLight(0xaaccff, 0x001122, 0.1)
	scene.add(hemisphereLight)

	const sunLight = new THREE.PointLight(0xfff5d9, 100)
	sunLight.intensity = 5000 
	sunLight.position.set(0, 14, 0)
	sunLight.castShadow = true
	sunLight.shadow.mapSize.width = 2048
	sunLight.shadow.mapSize.height = 2048
	sunLight.shadow.camera.near = 0.5
	sunLight.shadow.camera.far = 500

	sunLight.position.x = -1
	scene.add(sunLight)

	const controls = new OrbitControls(camera, canvas)
	controls.enableDamping = true

	const renderer = new THREE.WebGLRenderer({ canvas })
	renderer.shadowMap.enabled = true
	renderer.shadowMap.type = THREE.PCFSoftShadowMap
	renderer.setSize(sizes.width, sizes.height)
	renderer.render(scene, camera)

	return { sizes, scene, camera, canvas, controls, renderer, sunLight }
}

export default init
