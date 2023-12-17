import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

let scene,
camera,
renderer,
cloudParticles = [],
rainParticles = [],
flash,
rain,
rainGeo,
rainCount = 15000;

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    1,
    1000
  )
  camera.position.z = 1;
  camera.rotation.x = 1.16;
  camera.rotation.y = -0.12;
  camera.rotation.z = 0.27;


  const ambient =new THREE.AmbientLight(0x555555);
  scene.add(ambient);

  const directionalLight = new THREE.DirectionalLight(0xffeedd);
  directionalLight.position.set(0,0,1);
  scene.add(directionalLight);

  flash = new THREE.PointLight(0x062d89,30,500,1.7);
  flash.position.set(200,300,100);
  scene.add(flash);

  renderer = new THREE.WebGLRenderer();

  scene.fog = new THREE.FogExp2(0x11111f, 0.002);
  renderer.setClearColor(scene.fog.color);

  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  

  let group = new THREE.Group()
  const gltfLoader = new GLTFLoader();
  // gltfLoader.load('./thors_hammer/scene.gltf')
    gltfLoader.load(
      './thors_hammer/scene.gltf',
      (gltf) => {

        for(const child of gltf.scene.children)
        {
          child.scale.set(0.035, 0.035, 0.035)
          child.position.set(1.28, 3, -1.45)
          child.rotation.set(-0.34, -0.56, 2.02)

          scene.add(child)
          animate();
        }
      },
      (progress) =>
      {
          
      },
      (error) =>
      {
          console.log(error)
      }
    )

  



  let positions = [];
  let sizes = [];
  rainGeo = new THREE.BufferGeometry();
  for(let i = 0; i < rainCount; i++){
    const rainDrop = new THREE.Vector3(
      Math.random() * 400 - 200,
      Math.random() * 500 - 250,
      Math.random() * 400 - 200,
    )
    positions.push(Math.random() * 400 - 200);
    positions.push(Math.random() * 500 - 250);
    positions.push(Math.random() * 400 - 200);
    sizes.push(30);
  }
  rainGeo.setAttribute(
    "position",
    new THREE.BufferAttribute(new Float32Array(positions), 3)
  )
  rainGeo.setAttribute(
    "size",
    new THREE.BufferAttribute(new Float32Array(sizes), 1)
  )
  const rainMaterial = new THREE.PointsMaterial({
    color: 0xaaaaaa,
    size: 0.1,
    transparent: true
  })
  
  rain = new THREE.Points(rainGeo, rainMaterial)
  scene.add(rain)
  
  let loader = new THREE.TextureLoader();
  const image = document.querySelector('.image img')
  const load = loader.load(
    image.src,
    
    function(texture) {
      const cloudGeo = new THREE.PlaneBufferGeometry(500,500);
      const cloudMaterial = new THREE.MeshLambertMaterial({
        map: texture,
        transparent: true
      });
      for(let p = 0; p < 40; p++){
        let cloud = new THREE.Mesh(
          cloudGeo,
          cloudMaterial
        )
        cloud.position.set(
          Math.random() * 800 - 400,
          400,
          Math.random() * 800 - 450,
        )

        cloud.rotation.x = 1.18;
        cloud.rotation.y = -0.12;
        cloud.rotation.z = Math.random() * 360;
        cloud.material.opacity = 0.2;
        cloudParticles.push(cloud);
        scene.add(cloud);
      }
     
      window.addEventListener("resize",onWindowResize);
      
    }
  )
}
init();






function animate(){
    cloudParticles.forEach((p) => {
      p.rotation.z -= 0.002;
    })
    // const time = Date.new() * 0.05;
    rainGeo.verticesNeedUpdate = true;
    rain.position.z -= 0.222;

    if( rain.position.z <- 200){
      rain.position.z = 0;
    }
    if(Math.random() > 0.95 || flash.power > 100){
      if(flash.power > 100)
      flash.position.set(Math.random() *400, 300, Math.random() * 200, 100)
      flash.power = 50 + Math.random() * 500;
    }
    renderer.render(scene, camera);
    requestAnimationFrame(animate)
}

function onWindowResize(){
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight)
}