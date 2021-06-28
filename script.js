import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js'
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/controls/OrbitControls.js'
import VoxelWorld from './VoxelWorld.js'

function setupCamera() {
	
}

function main() {
	const canvas = document.querySelector('#c')
	const renderer = new THREE.WebGLRenderer({canvas})

	const cellSize = 32

	const fov = 90
	const aspect = 2  // the canvas default
	const near = 0.1
	const far = 1000
	const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
	camera.position.set(-cellSize * .3, cellSize * .8, -cellSize * .3)

	const controls = new OrbitControls(camera, canvas)
	controls.target.set(cellSize / 2, cellSize / 3, cellSize / 2)
	controls.update()

	const scene = new THREE.Scene()
	scene.background = new THREE.Color('lightblue')

	function addLight(x, y, z) {
		const color = 0xFFFFFF
		const intensity = 1
		const light = new THREE.DirectionalLight(color, intensity)
		light.position.set(x, y, z)
		scene.add(light)
	}
	addLight(-1,  2,  4)
	addLight( 1, -1, -2)

	const world = new VoxelWorld(cellSize)

	for (let y = 0; y < cellSize; ++y) {
		for (let z = 0; z < cellSize; ++z) {
		for (let x = 0; x < cellSize; ++x) {
			const height = (Math.sin(x / cellSize * Math.PI * 2) + Math.sin(z / cellSize * Math.PI * 3)) * (cellSize / 6) + (cellSize / 2)
			if (y < height) {
			world.setVoxel(x, y, z, 1)
			}
		}
		}
	}

	const {positions, normals, indices} = world.generateGeometryDataForCell(0, 0, 0)
	const geometry = new THREE.BufferGeometry()
	const material = new THREE.MeshLambertMaterial({color: 'green'})

	const positionNumComponents = 3
	const normalNumComponents = 3
	geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), positionNumComponents))

	geometry.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(normals), normalNumComponents))

	geometry.setIndex(indices)

	const mesh = new THREE.Mesh(geometry, material)
	scene.add(mesh)

	function resizeRendererToDisplaySize(renderer) {
		const canvas = renderer.domElement
		const width = window.innerWidth
		const height = window.innerHeight
		const needResize = canvas.width !== width || canvas.height !== height
		if (needResize) {
			renderer.setSize(width, height, false)
		}
		return needResize
	}

	let renderRequested = false

	function render() {
		renderRequested = undefined

		if (resizeRendererToDisplaySize(renderer)) {
		const canvas = renderer.domElement
		camera.aspect = canvas.clientWidth / canvas.clientHeight
		camera.updateProjectionMatrix()
		}

		controls.update()
		renderer.render(scene, camera)
	}
	render()

	function requestRenderIfNotRequested() {
		if (!renderRequested) {
		renderRequested = true
		requestAnimationFrame(render)
		}
	}

	controls.addEventListener('change', requestRenderIfNotRequested)
	window.addEventListener('resize', requestRenderIfNotRequested)
}

main()
