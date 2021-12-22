import './style.css'
import * as dat from 'lil-gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

/**
 * Base
 */
// Debug
// const gui = new dat.GUI({
//     width: 400
// })

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Loaders
 */
// Texture loader
const textureLoader = new THREE.TextureLoader()

// Draco loader
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('draco/')

// GLTF loader
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)


/**
 * Textures
 */

const bakedTextures = textureLoader.load('./textures/v5/jpgs/baked-mainbody-texture-v5.3.jpg')
bakedTextures.flipY = false
bakedTextures.encoding = THREE.sRGBEncoding

const bakedTexturesSeating = textureLoader.load('./textures/v5/jpgs/baked-seating-v5.1.jpg')
bakedTexturesSeating.flipY = false
bakedTexturesSeating.encoding = THREE.sRGBEncoding

const bakedTexturesFrames = textureLoader.load('./textures/v5/jpgs/baked-frames-v3.1.jpg')
bakedTexturesFrames.flipY = false
bakedTexturesFrames.encoding = THREE.sRGBEncoding

const bakedTexturePainting = textureLoader.load('./textures/v5/jpgs/baked-painitng-v5.3.jpg')
bakedTexturePainting.flipY = false
bakedTexturePainting.encoding = THREE.sRGBEncoding



/**
 * Materials
 */

//Baked Materials

const bakedMaterial = new THREE.MeshBasicMaterial({map: bakedTextures})
const bakedSeatingMaterial = new THREE.MeshBasicMaterial({map: bakedTexturesSeating})
const bakedFramesMaterial = new THREE.MeshBasicMaterial({map: bakedTexturesFrames})
const bakedPaintingMaterialTest = new THREE.MeshBasicMaterial({map: bakedTexturePainting})



gltfLoader.load(
    './models/v5/mainbody-v5.1.glb',
    (gltf) => 
    {
        gltf.scene.traverse((child) => {
            child.material = bakedMaterial
        })
        gltf.scene.scale.set(0.25, 0.25, 0.25)
        scene.add(gltf.scene)
       
    }
)

gltfLoader.load(
    './models/v5/seating-v5.1.glb',
    (gltf) => 
    {
        gltf.scene.traverse((child) => {
            child.material = bakedSeatingMaterial
        })
        gltf.scene.scale.set(0.25, 0.25, 0.25)
        scene.add(gltf.scene)
       
    }
)


gltfLoader.load(
    './models/v5/frames-v5.1.glb',
    (gltf) => 
    {
        gltf.scene.traverse((child) => {
            child.material = bakedFramesMaterial
        })
        gltf.scene.scale.set(0.25, 0.25, 0.25)
        scene.add(gltf.scene)
       
    }
)


gltfLoader.load(
    './models/v5/paintings-v5.3.glb',
    (gltf) => 
    {
        gltf.scene.traverse((child) => {
            child.material = bakedPaintingMaterialTest
        })
        gltf.scene.scale.set(0.25, 0.25, 0.25)
        scene.add(gltf.scene)
        console.log(gltf)
    }
)



/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

const ambientlight = new THREE.AmbientLight( 0x404040, 5 ); // soft white light
scene.add( ambientlight );
/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(50, sizes.width / sizes.height, 0.1, 100)
camera.position.x = -1.7
camera.position.y = 1.25
camera.position.z = -1.7
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
// controls.maxPolarAngle = Math.PI / 2.4
controls.target.set(0,1,0)
// controls.enablePan = false
// controls.enableZoom = false

// controls.keys = {
// 	LEFT: 'ArrowLeft', //left arrow
// 	UP: 'ArrowUp', // up arrow
// 	RIGHT: 'ArrowRight', // right arrow
// 	BOTTOM: 'ArrowDown' // down arrow
// }


/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor( 0xffffff );
renderer.outputEncoding = THREE.sRGBEncoding

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()