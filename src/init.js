import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';

const init = () => {
	const sizes = {
		width: window.innerWidth,
		height: window.innerHeight,
	};

	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
	const canvas = document.querySelector('.canvas');
	scene.add(camera);

	const controls = new OrbitControls(camera, canvas);
	controls.enableDamping = true;
	
	const renderer = new THREE.WebGLRenderer( {canvas} );
	renderer.setSize(sizes.width, sizes.height);
	renderer.render(scene, camera);

	return {sizes, scene, camera, canvas, controls, renderer}
}

export default init