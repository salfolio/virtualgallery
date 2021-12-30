import './style.css'
import * as dat from 'lil-gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js' 
import { MeshBasicMaterial, MeshStandardMaterial, Vector3 } from 'three'
const TWEEN = require('@tweenjs/tween.js')
import gsap from 'gsap' 
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
        // gltf.scene.scale.set(0.25, 0.25, 0.25)
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
        // gltf.scene.scale.set(0.25, 0.25, 0.25)
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
        // gltf.scene.scale.set(0.25, 0.25, 0.25)
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
        // gltf.scene.scale.set(0.25, 0.25, 0.25)
        scene.add(gltf.scene)
        console.log(gltf)
    }
)


/**
 *  Objects
 */

const object1 = new THREE.Mesh(
    new THREE.SphereBufferGeometry(0.2),
    new THREE.MeshBasicMaterial({color:'red'})
    )
object1.position.set(-4,0,7.3)
object1.scale.set(0.5,0.5,0.5)
scene.add(object1)

const object2 = new THREE.Mesh(
    new THREE.SphereBufferGeometry(0.2),
    new THREE.MeshBasicMaterial({color:'red'})
    )
object2.position.set(0,0,0)
object2.scale.set(0.5,0.5,0.5)
scene.add(object2)

const object3 = new THREE.Mesh(
    new THREE.SphereBufferGeometry(0.2),
    new THREE.MeshBasicMaterial({color:'red'})
    )
object3.position.set(3,0,7.3)
object3.scale.set(0.5,0.5,0.5)
scene.add(object3)



/**
 * Raycaster
 */

const raycaster = new THREE.Raycaster()


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
 * cursor
 */

const mouse = new THREE.Vector2()

window.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX / sizes.width * 2 - 1
    mouse.y = -event.clientY / sizes.height * 2 + 1
    // console.log(mouse)
})


/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(70, sizes.width / sizes.height, 0.1, 100)
camera.position.x = -5
camera.position.y = 5.0
camera.position.z = -5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
// controls.maxPolarAngle = Math.PI / 2.4
controls.target.set(-4,5,-4)
controls.enablePan = true
controls.enableZoom = true

/*
* Move camera function 
*/
const moveCamera = (xPosition,yPosition,zPosition,number) => {
    // camera.position.set(xPositon,y,z)
    // controls.target(x+0.1, y+0.1, z+0.1)
    gsap.to(camera.position, { duration: 2, x:xPosition, y:yPosition-1, z:zPosition})
    gsap.to(controls.target, { duration: 2, x:xPosition, y:yPosition-1, z:zPosition+(number)})
    // controls.target.set(-4,5,-4)
}

const detectObjects = () => {
     //raycaster
     raycaster.setFromCamera(mouse, camera)

     const objectsToTest = [object1, object2, object3]
     const intersects = raycaster.intersectObjects(objectsToTest)
     for(const object of objectsToTest)
     {
         object.material.color.set('green')
     }
 
     for(const intersect of intersects)
     {
         intersect.object.material.color.set('red')
         console.log('intersect')
         console.log(intersect.object.position)
         // moveCamera(intersect.object.position.x, intersect.object.position.y, intersect.object.position.z)
         // camera.position.x = (intersect.object.position.x)
         // camera.position.y = (intersect.object.position.y)
         // camera.position.z = (intersect.object.position.z)
         const xPosition = intersect.object.position.x
         const yPosition = intersect.object.position.y
         const zPosition = intersect.object.position.z
        
        var number = 0;
        if(intersect.object === object1){
            number = +1;
        }else if(intersect.object === object2){
            number = -1;
        }
         moveCamera(xPosition,yPosition,zPosition,number);
         number = 0;
         console.log(number)
     } 
}


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

    //Animate moving beacons
    object1.position.y = (Math.sin(elapsedTime) * 0.1) + 5.5
    object2.position.y = (Math.cos(elapsedTime) * 0.1) + 5.5
    object3.position.y = (Math.cos(elapsedTime) * 0.1) + 5.5

    
    //Raycaster
    detectObjects();

    // Update controls
    controls.update()
    
    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)


}

tick()