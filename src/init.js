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

	// const hemisphereLight = new THREE.HemisphereLight(0xaaccff, 0x001122, 0.3)
	// scene.add(hemisphereLight)

	const sunLight = new THREE.DirectionalLight(0xffffff, 1.5);
	sunLight.castShadow = true;
	sunLight.position.x = -10;
	const helper = new THREE.DirectionalLightHelper( sunLight, 5 );
	scene.add( helper );
	scene.add(sunLight)

	const controls = new OrbitControls(camera, canvas)
	controls.enableDamping = true

	const renderer = new THREE.WebGLRenderer({ canvas })
	renderer.shadowMap.enabled = true;
	renderer.setSize(sizes.width, sizes.height)
	renderer.render(scene, camera)

	return { sizes, scene, camera, canvas, controls, renderer, sunLight}
}

export default init
