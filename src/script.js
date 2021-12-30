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
 *  ground
 */

 const geometry = new THREE.PlaneGeometry( 16, 22.2, 20, 20 );
 const material = new THREE.MeshBasicMaterial( {color: 'black', side: THREE.DoubleSide} );
 const ground = new THREE.Mesh( geometry, material );
 material.wireframe = true;
 ground.rotation.x = Math.PI / 2
 ground.position.y = 2.65
 ground.position.x = -1
 ground.material.visible = false
 scene.add(ground); 


/**
 * Raycaster
 */

const raycaster = new THREE.Raycaster()
console.log(raycaster)


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

window.addEventListener('dblclick', (event) => {
    detectGround();
})

var mylatesttap;
window.addEventListener('touchstart', (event) => {
    var now = new Date().getTime();
    var timesince = now - mylatesttap;
    if((timesince < 300) && (timesince > 0)){

    console.log('DOUBLE TAP')
     // double tap 
     detectGround();  
 
    }else{
             // too much time to be a doubletap
             console.log('not double tap')
          }
 
    mylatesttap = new Date().getTime();    
   
})


/**
 * ScrollY
 */
// let scrollY = window.scrollY

//  window.addEventListener('scroll', () =>
//  {
//      scrollY = window.scrollY
//      console.log(scrollY)
//  })


/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(70, sizes.width / sizes.height, 0.1, 100)
camera.position.x = -5
camera.position.y = 5.0
camera.position.z = -7.5

camera.rotation.y = -Math.PI / 2
scene.add(camera)

// // Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
// controls.maxPolarAngle = Math.PI / 2.4
controls.target.set(-4,5,-7.5)
// controls.target.set(0,0,0)
controls.enablePan = true
controls.enableZoom = true

/*
* Move camera function 
*/

const cameraStates = {
    oldX: camera.position.x,
    oldZ: camera.position.z
}

const moveCamera = (xPosition,yPosition,zPosition) => {

    // camera.position.set(xPositon,y,z)
    // controls.target(x+0.1, y+0.1, z+0.1)
    console.log(`new camera states${cameraStates.oldX}, ${cameraStates.oldZ}`)

    var deltaX = 0;
    var deltaZ = 0;

    if(cameraStates.oldZ < zPosition){
        deltaZ = 0.05
    } else {
        deltaZ = -0.05
    }
    if(cameraStates.oldX < xPosition){
        deltaX = 0.05
    } else {
        deltaX = -0.05
    }

    gsap.to(camera.position, { duration: 1.4, x:xPosition, y:yPosition-1, z:zPosition})
    gsap.to(controls.target, { duration: 1.4, x:xPosition+deltaX, y:yPosition-1, z:zPosition+deltaZ})

  
  
    // controls.target.set(-4,5,-4)

    cameraStates.oldX = xPosition;
    cameraStates.oldZ = zPosition;
    console.log(`new new camera states${cameraStates.oldX}, ${cameraStates.oldZ}`)

}


const detectGround = () => {
    raycaster.setFromCamera(mouse, camera)
    if(raycaster.intersectObject(ground) === true){
        console.log('intersect')
    }

    const objectsToTest = [ground]
    const intersects = raycaster.intersectObjects(objectsToTest)
    for(const intersect of intersects)
    {
        console.log('intersect')
        console.log(intersect.point)
        console.log(camera.position)
        console.log(cameraStates)
        moveCamera(intersect.point.x,5.5,intersect.point.z);
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

    // Update controls
    controls.update()
    
    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)


}

tick()