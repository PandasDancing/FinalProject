
/*
Game 0: Group 29
This is a ThreeJS program which implements a simple game
The user moves a dog (protector) around the board trying to knock sheeps into the safety house
User also can use key "4" to drag the scene to see the setting of our game (skybox)
*/


	// First we declare the variables that hold the objects we need
	// in the animation code
	var scene, renderer;  // all threejs programs need these
	var camera, avatarCam, camera3;  // we have two cameras in the main scene
	var avatar;
	var enemy;
	var camerax;
	var cerca;
	// here are some mesh objects ...
	var tick = 0, clock = new THREE.Clock(),container
	//, gui = new dat.GUI( { width: 350 } ),
	var	options, spawnerOptions, particleSystem, stats, control;

	//var cone;
	var box;

	var rabbit;
	var numSheep;
	var sheepArr = [];  ///*******


	var endScene, endCamera, endText;
	var lostScene, lostText;
  var npc, cube;

	var startScene, startCam, startText;

	var  dragcamera,dragcontrols;


	var controls =
	     {fwd:false, bwd:false, left:false, right:false,
				speed:20, fly:false, reset:false,
		    camera:camera}

	var gameState =
	     {score:0, health:10, scene: 'start', camera:'none' }
			 //scene: 'start',


	// Here is the main game control
  init(); //
	initControls();
	console.log("Final Project!");
	animate();  // start the animation loop!


	/**
	  To initialize the scene, we initialize each of its components
	*/
	function init(){
      initPhysijs();
			scene = initScene();
			createEndScene();
			createLoseScene();
			initRenderer();
			createStartScene();
			createMainScene();
	}

	function createStartScene(){
		startScene = initScene();
		startText =createSkyBox2('start_game.jpg', 1); // essentially one side of a box
		//createSkyBox
		startScene.add(startText);
		var light = createPointLight();
		light.position.set(0,200,20);
		startScene.add(light);
		//gameState.scene='start';
		startCamera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 1000 );
		startCamera.position.set(0,50,1);
		startCamera.lookAt(0,0,0);
	}


		function createEndScene(){
			endScene = initScene();
			endText = createSkyBox2('youwon.png',1);
			//endText.rotateX(Math.PI);
			endScene.add(endText);
			var light1 = createPointLight();
			light1.position.set(0,200,20);
			endScene.add(light1);
			endCamera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 1000 );
			endCamera.position.set(0,50,1);
			endCamera.lookAt(0,0,0);

		}

		function createLoseScene(){
			loseScene = initScene();
			loseText = createSkyBox2('youlose.jpeg',1);
			//endText.rotateX(Math.PI);
			loseScene.add(loseText);
			var light1 = createPointLight();
			light1.position.set(0,200,20);
			loseScene.add(light1);
			endCamera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 1000 );
			endCamera.position.set(0,50,1);
			endCamera.lookAt(0,0,0);

		}


	function createMainScene(){
      // setup lighting
			var light1 = createPointLight();
			light1.position.set(0,200,20);
			scene.add(light1);
			var light0 = new THREE.AmbientLight( 0xffffff,0.25);
			scene.add(light0);

			// create main camera
			camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 1000 );
			camera.position.set(0,50,0);
			camera.lookAt(0,0,0);
			camera.updateProjectionMatrix();

			particleSystem = new THREE.GPUParticleSystem( {
				maxParticles: 250000
			} );
			scene.add( particleSystem );
			console.log("added particle")
			initSprown();


			camera3 = new THREE.PerspectiveCamera( 120, window.innerWidth / window.innerHeight, 0.1, 1000 );
			camera3.position.set(20,20,30);

			dragcamera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );

			dragcontrols = new THREE.OrbitControls( dragcamera, renderer.domElement  );
			dragcamera.position.set( 0, 520, 100 );
			dragcontrols.update();

			//create the ground and the skybox
			var ground = createGround();
			//ground.translateZ(5000);
			 scene.add(ground);

			var skybox = createSkyBox();
			skybox.translateY(500);
			scene.add(skybox);

			var ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.8);// better light
			scene.add(ambientLight);

			// create the avatar
			avatarCam = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 1000 );
			avatar = createAvatar();

			avatar.rotateY(3);
			avatar.position.set(20,2,15);
			avatarCam.translateY(2);
			avatarCam.translateZ(5);

			//avatarCam.lookAt(avatar.position);
			//bug: change back to avatar cam
			scene.add(avatar);
			gameState.camera = avatarCam;
			addSheep();

			//cone = createConeMesh(4,6);
			box = createBoxMesh(10,8);
			box.position.set(60,0,20);
			//box.rotateX(Math.PI/2);
			scene.add(box);

			var cerca1 = createCerca();
			cerca1.position.set(75,0,22);
			scene.add(cerca1);

			var cerca2 = createCerca();
			cerca2.position.set(75,0,27);
			scene.add(cerca2);

			var cerca3 = createCerca();
			cerca3.position.set(75,0,32);
			scene.add(cerca3);

			var cerca4 = createCerca();
			cerca4.position.set(74,0,33);
			cerca4.rotateY(Math.PI/2);
			scene.add(cerca4);

			var cerca5 = createCerca();
			cerca5.position.set(69,0,33);
			cerca5.rotateY(Math.PI/2);
			scene.add(cerca5);


			addRabbits();


			cube = createEnemy();
			//cube.position.set(20,0,-20);
			cube.position.set(randN(30)+10,0.5,randN(20)+10);
			cube.addEventListener('collision',function(other_object){

			      if (other_object==avatar){
									//updates the health if avatar obj is touch by the NPC obj
									gameState.health --;
									soundEffect('foxbark.wav');
									 if (gameState.health==0) {
										console.log("Way to lose 3333"); // when fox hits avatar too many times
									 	gameState.scene='youlose'; //3rd way to lose
									 }
								 }

							 })

			scene.add(cube);

			playGameMusic();

	}

  function initSprown() {
		console.log("init sprown")
		options = {
				position: new THREE.Vector3(),
				positionRandomness: .3,
				velocity: new THREE.Vector3(),
				velocityRandomness: .5,
				color: 0xaa88ff,
				colorRandomness: .2,
				turbulence: .5,
				lifetime: 2,
				size: 5,
				sizeRandomness: 1
			};
			spawnerOptions = {
				spawnRate: 15000,
				horizontalSpeed: 1.5,
				verticalSpeed: 1.33,
				timeScale: 1
			};

			stats = new Stats();
			control = new THREE.TrackballControls( camera, renderer.domElement );
			control.rotateSpeed = 5.0;
			control.zoomSpeed = 2.2;
			control.panSpeed = 1;
			control.dynamicDampingFactor = 0.3;

			window.addEventListener( 'resize', onWindowResize, false );
	}

	function onWindowResize() {

		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();

		renderer.setSize( window.innerWidth, window.innerHeight );

	}

	function randN(n){
		return Math.random()*n;
	}

//the Cube in this function is the FOX
	function addSheep(){
		numSheep = 15;
		for(i=0;i<numSheep;i++){
			sheepArr = createSheep();
			sheepArr.position.set(randN(80),1,randN(-60));
			scene.add(sheepArr);
			console.log(sheepArr.length);

			sheepArr.addEventListener( 'collision',
				function( other_object, relative_velocity, relative_rotation, contact_normal ) {
					if (other_object==cube){ //when fox hits sheep
						console.log("sheep "+i+" hit the box");
						console.log("FOXSHEEP 222");
						soundEffect('sheep-bleat.wav');
						gameState.score -= 1;  // when fox eats sheep minus one to the score
						if (gameState.score == -5) {
							console.log("Way to lose 11111");
							gameState.scene='youlose'; //1st way of losing: fox eats too many sheep
						}
						scene.remove(this);
						// make the ball drop below the scene ..
						// threejs doesn't let us remove it from the schene...

						// this.position.y = this.position.y - 100;
						// this.__dirtyPosition = true;
					}
				}
			)

			//Sheeps hitting the house
				sheepArr.addEventListener( 'collision',
				function( other_object, relative_velocity, relative_rotation, contact_normal ) {
					if (other_object==box){
						console.log("sheep "+i+" hit the box");
						console.log("FOXSHEEP 11111");
						soundEffect('sheep-bleat.wav');
						gameState.score += 1;
						if (gameState.score==10) {
							gameState.scene='youwon'; //only way to win is to push 10 sheeps in
						}
						scene.remove(this);
					}
				}
			)
		}
	}



	function playGameMusic(){
		// create an AudioListener and add it to the camera
		var listener = new THREE.AudioListener();
		camera.add( listener );

		// create a global audio source
		var sound = new THREE.Audio( listener );

		// load a sound and set it as the Audio object's buffer
		var audioLoader = new THREE.AudioLoader();
		audioLoader.load( '/sounds/loop.mp3', function( buffer ) {
			sound.setBuffer( buffer );
			sound.setLoop( true );
			sound.setVolume( 0.05 );
			sound.play();
		});
	}

	function soundEffect(file){
		// create an AudioListener and add it to the camera
		var listener = new THREE.AudioListener();
		camera.add( listener );

		// create a global audio source
		var sound = new THREE.Audio( listener );

		// load a sound and set it as the Audio object's buffer
		var audioLoader = new THREE.AudioLoader();
		audioLoader.load( '/sounds/'+file, function( buffer ) {
			sound.setBuffer( buffer );
			sound.setLoop( false );
			sound.setVolume( 0.5 );
			sound.play();
		});
	}

	/* We don't do much here, but we could do more!
	*/
	function initScene(){
		//scene = new THREE.Scene();
    var scene = new Physijs.Scene();
		return scene;
	}

  function initPhysijs(){
    Physijs.scripts.worker = '/js/physijs_worker.js';
    Physijs.scripts.ammo = '/js/ammo.js';
  }
	/*
		The renderer needs a size and the actual canvas we draw on
		needs to be added to the body of the webpage. We also specify
		that the renderer will be computing soft shadows
	*/
	function initRenderer(){
		renderer = new THREE.WebGLRenderer();
		renderer.setSize( window.innerWidth, window.innerHeight-50 );
		document.body.appendChild( renderer.domElement );
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		renderer.setPixelRatio( window.devicePixelRatio );
	}


	function createPointLight(){
		var light;
		light = new THREE.PointLight( 0xffffff);
		light.castShadow = true;
		//Set up shadow properties for the light
		light.shadow.mapSize.width = 2048;  // default
		light.shadow.mapSize.height = 2048; // default
		light.shadow.camera.near = 0.5;       // default
		light.shadow.camera.far = 500      // default
		return light;
	}

	function createBoxMesh(color){
		var geometry = new THREE.BoxGeometry( 1, 1, 1);
		var material = new THREE.MeshLambertMaterial( { color: color} );
		mesh = new Physijs.BoxMesh( geometry, material );
    //mesh = new Physijs.BoxMesh( geometry, material,0 );
		mesh.castShadow = true;
		return mesh;
	}

	function createGround(){
		// creating a textured plane which receives shadows
		 var geometry = new THREE.PlaneGeometry( 1000, 1000, 1000 );
		// var texture = new THREE.TextureLoader().load( '../images/'+image );
		// texture.wrapS = THREE.RepeatWrapping;
		// texture.wrapT = THREE.RepeatWrapping;
		// texture.repeat.set( 15, 15 );
		//
		// var material = new THREE.MeshLambertMaterial( { color: 0xffffff,  map: texture ,side:THREE.DoubleSide} );
		var material = new THREE.MeshLambertMaterial( { color: 0xffffff} );
		material.transparent = true;

		var pmaterial = new Physijs.createMaterial(material,0.9,1);
		//var mesh = new THREE.Mesh( geometry, material );
		var mesh = new Physijs.BoxMesh( geometry, pmaterial, 0 );
		mesh.receiveShadow = true;
		mesh.rotateX(Math.PI/2);

		//treetop
		var particleMaterial = new THREE.MeshLambertMaterial();
		particleMaterial.map = THREE.ImageUtils.loadTexture('models/pink.jpg');
		particleMaterial.side = THREE.DoubleSide;
		var jsonLoader = new THREE.JSONLoader();
		jsonLoader.load( "models/treetop.js", function (geometry2) {
			var s = new THREE.Mesh(geometry2, particleMaterial);
			s.rotateX(Math.PI/2*3);
			s.scale.set( 0.4, 0.4, 0.4 );
			s.position.set(25,-25,-15);
			mesh.add(s);

			var y = new THREE.Mesh(geometry2, particleMaterial);
			y.rotateX(Math.PI/2*3);
			y.scale.set( 0.4, 0.4, 0.4 );
			y.position.set(105,10,-15);
			mesh.add(y);
		}
		);

		//tree trunk
		var particleMaterial2 = new THREE.MeshBasicMaterial();
		particleMaterial2.map = THREE.ImageUtils.loadTexture('models/brown.jpg');
		particleMaterial2.side = THREE.DoubleSide;
		var jsonLoader = new THREE.JSONLoader();
		jsonLoader.load( "models/treebody.js", function (geometry2) {
			var s = new THREE.Mesh(geometry2, particleMaterial2);
			s.rotateX(Math.PI/2*3);
			s.scale.set( 0.1, 0.1, 0.1 );
			s.position.set(25,-25,0);
			mesh.add(s);

			var y = new THREE.Mesh(geometry2, particleMaterial2);
			y.rotateX(Math.PI/2*3);
			y.scale.set( 0.1, 0.1, 0.1 );
			y.position.set(105,10,0);
			mesh.add(y);
		}
		);
		trunk=createInvisibleBox(5,10,5);
		trunk.translateX(24);
		trunk.translateZ(-25);
		scene.add(trunk);

		trunkTwo = createInvisibleBox(5,10,5);
		trunkTwo.translateX(105);
		trunkTwo.translateZ(10);
		scene.add(trunkTwo);

		//mountains
		var particleMaterial3 = new THREE.MeshBasicMaterial();
		particleMaterial3.map = THREE.ImageUtils.loadTexture('models/Ground_D2.png');
		particleMaterial3.side = THREE.DoubleSide;
		jsonLoader.load( "models/mountain.js", function (geometry2) {
			var s = new THREE.Mesh(geometry2, particleMaterial3);
			var s2 = new THREE.Mesh(geometry2, particleMaterial3);
			s.rotateX(Math.PI/2*3);
			s.scale.set( 2, 2, 2 );
			s.position.set(30,30,0);
			s2.rotateX(Math.PI/2*3);
			s2.scale.set( 2, 2, 2 );
			s2.position.set(40,90,0);
			mesh.add(s);
			mesh.add(s2);
		}
		);
		//treeside big long box
		mt=createInvisibleBox(45,40,70);
		mt.translateX(-25);
		mt.translateZ(-15);
		mt.rotateY(-0.2);
		scene.add(mt);
		//houseside big long box
		mt2=createInvisibleBox(45,40,70);
		mt2.translateX(-25);
		mt2.translateZ(40);
		mt2.rotateY(-0.2);
		scene.add(mt2);

		return mesh;
		// we need to rotate the mesh 90 degrees to make it horizontal not vertical
	}


	function createSkyBox(){
		// creating a textured plane which receives shadows
		var geometry = new THREE.CubeGeometry( 1000, 1000, 1000 );
		//var texture = new THREE.TextureLoader().load( '../images/right.jpg');
		var texture = [
			new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("images/front.jpg"), side: THREE.DoubleSide}),
			new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("images/back.jpg"), side: THREE.DoubleSide}),
			new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("images/up.jpg"), side: THREE.DoubleSide}),
			new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("images/down.jpg"), side: THREE.DoubleSide}),
			new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("images/right.jpg"), side: THREE.DoubleSide}),
			new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("images/left.jpg"), side: THREE.DoubleSide})
		]
		// texture.wrapS = THREE.RepeatWrapping;
		// texture.wrapT = THREE.RepeatWrapping;
		// texture.repeat.set( 1, 1 );
		// var material = new THREE.MeshLambertMaterial( { color: 0xffffff,  map: texture ,side:THREE.DoubleSide} );
		// //var pmaterial = new Physijs.createMaterial(material,0.9,0.5);
		// //var mesh = new THREE.Mesh( geometry, material );
		// var mesh = new THREE.Mesh( geometry, material);

		var mesh = new THREE.Mesh(geometry, texture);

		return mesh;
	}

	function createSkyBox2(image,k){
		// creating a textured plane which receives shadows
		var geometry = new THREE.BoxGeometry( 90, 50, 50 );
		var texture = new THREE.TextureLoader().load( '../images/'+image );
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		texture.repeat.set( k, k );
		var material = new THREE.MeshLambertMaterial( { color: 0xffffff,  map: texture ,side:THREE.DoubleSide} );
		//var pmaterial = new Physijs.createMaterial(material,0.9,0.5);
		//var mesh = new THREE.Mesh( geometry, material );
		var mesh = new THREE.Mesh( geometry, material, 0 );
		mesh.receiveShadow = false;
		return mesh;
		// we need to rotate the mesh 90 degrees to make it horizontal not vertical
	}

	function createBoxMesh2(color,w,h,d){
		var geometry = new THREE.BoxGeometry( w, h, d);
		var material = new THREE.MeshLambertMaterial( { color: color} );
		mesh = new Physijs.BoxMesh( geometry, material);
		//mesh = new Physijs.BoxMesh( geometry, material,0 );
		mesh.castShadow = true;
		return mesh;
	}

	//to stuff the tree trunk and mountains
	function createInvisibleBox(w,h,d){
		var geometry = new THREE.BoxGeometry( w, h, d);
		//geometry.translate();
		var material = new THREE.MeshLambertMaterial( { color: 0xffff00} );
		var pmaterial = new Physijs.createMaterial(material,0,0);
		pmaterial.visible = false;
		var mesh = new Physijs.BoxMesh( geometry, pmaterial, 0);
		mesh.setDamping(0.1,0);
		mesh.castShadow = true;
		return mesh;
	}

	function createAvatar(){
					var geometry = new THREE.BoxGeometry( 4, 4, 7);
					geometry.translate( 0.2, 0, 2);
					var material = new THREE.MeshLambertMaterial( { color: 0xffff00} );
					var pmaterial = new Physijs.createMaterial(material,0.9,0.01);
					pmaterial.visible = false;
					var mesh = new Physijs.BoxMesh( geometry, pmaterial );

					mesh.setDamping(0.1,0.1);
					mesh.castShadow = true;

					avatarCam.position.set(0,2,0);
					avatarCam.lookAt(0,2,10);
					mesh.add(avatarCam);


					var particleMaterial = new THREE.MeshBasicMaterial();
					particleMaterial.map = THREE.ImageUtils.loadTexture('models/dog.jpg');
					particleMaterial.side = THREE.DoubleSide;
					var jsonLoader = new THREE.JSONLoader();
					jsonLoader.load( "models/dog.js", function (geometry2) {
					var dog = new THREE.Mesh(geometry2, particleMaterial);
					mesh.add(dog);
					}
				  );
					// var scoop = createBoxMesh2(0xff0000,5,1,0.1);
					// scoop.position.set(0,-1,2);
					// mesh.add(scoop);
		       //mesh.position.set(20,10,40);
					return mesh;
	}


	function createCerca(){
					var geometry = new THREE.BoxGeometry( 2, 2, 1);
					//geometry.translate( 0, 0, 2);
					var material = new THREE.MeshLambertMaterial( { color: 0xffff00} );
					var pmaterial = new Physijs.createMaterial(material,0.9,0.01);
					pmaterial.visible = false;
					var mesh = new Physijs.BoxMesh( geometry, pmaterial, 0 );
					mesh.setDamping(0.1,0.1);
					mesh.castShadow = true;

					var particleMaterial = new THREE.MeshBasicMaterial();
					particleMaterial.map = THREE.ImageUtils.loadTexture('../models/TreeMat.jpg');
					particleMaterial.side = THREE.DoubleSide;
					var jsonLoader = new THREE.JSONLoader();
					jsonLoader.load( "../models/cerca.js", function (geometry2) {
					var cerca = new THREE.Mesh(geometry2, particleMaterial);
					cerca.scale.set(1,1,1);
					mesh.add(cerca);
					}
				  );
		      //mesh.position.set(-40,5,10);
					return mesh;
	}

	function createEnemy(){
					var geometry = new THREE.BoxGeometry( 4, 4, 6,);
					geometry.translate( 0, 0, 4);
					var material = new THREE.MeshLambertMaterial( { color: 0xffff00} );
					var pmaterial = new Physijs.createMaterial(material,0.9,0.05);

					pmaterial.visible = false;
					var mesh = new Physijs.BoxMesh( geometry, pmaterial );
					//mesh.setDamping(0.1,0.1);
					mesh.castShadow = true;
					//var center = geometry.getCenter();
					//mesh.__dirtyPosition = ;
					//center.translateX(10);
										//mesh.position.set(0,2,0);
					// avatarCam.position.set(0,8,0);
					// avatarCam.lookAt(0,7,10);
					// mesh.add(avatarCam);

					var particleMaterial = new THREE.MeshBasicMaterial();
					particleMaterial.map = THREE.ImageUtils.loadTexture('models/FoxColors.png');
					particleMaterial.side = THREE.DoubleSide;
					var jsonLoader = new THREE.JSONLoader();
					jsonLoader.load( "models/fox.js", function (geometry2) {
					var fox = new THREE.Mesh(geometry2, particleMaterial);
					//fox.scale.set(30,30,30);
					mesh.add(fox);
					}
				  );
					return mesh;
	}

		//safety house
		function createBoxMesh(r,h){

		var geometry = new THREE.BoxGeometry( r, h, 26);
		geometry.translate(0,0,3);
		var material = new THREE.MeshLambertMaterial( { color: 0xffff00} );
		var pmaterial = new Physijs.createMaterial(material,0.9,0.05);
		pmaterial.visible = false;
		var mesh = new Physijs.BoxMesh( geometry, pmaterial, 0);
		mesh.setDamping(0.1,0.1);
		mesh.castShadow = true;

		//center box
		var particleMaterial = new THREE.MeshBasicMaterial();
		particleMaterial.map = THREE.ImageUtils.loadTexture('models/Farmhouse.jpg');
		particleMaterial.side = THREE.DoubleSide;
		var jsonLoader = new THREE.JSONLoader();
		jsonLoader.load( "../models/Farmhouse.js", function (geometry2) {
		var box = new THREE.Mesh(geometry2, particleMaterial);
			box.__dirtyPosition = true;
		//box.scale.set(50,50,50);
		box.scale.set(.5,.5,.5);
		mesh.add(box);
		}
		);

		return mesh;
	}

	function createSheep(){

	var geometry = new THREE.BoxGeometry( 4, 3, 4);
	geometry.translate(0,1,0);
	var material = new THREE.MeshLambertMaterial( { color: 0xffff00} );
	var pmaterial = new Physijs.createMaterial(material,.8,0.05);
	pmaterial.visible = false;
	var mesh = new Physijs.BoxMesh( geometry, pmaterial );
	mesh.setDamping(0.1,0.1);
	mesh.castShadow = true;


	var particleMaterial = new THREE.MeshBasicMaterial();
	particleMaterial.map = THREE.ImageUtils.loadTexture('../models/SHEEPnew.jpg');
	particleMaterial.side = THREE.DoubleSide;
	var jsonLoader = new THREE.JSONLoader();
	jsonLoader.load( "models/sheepNew.js", function (geometry2) {
		sheep = new THREE.Mesh(geometry2, particleMaterial);
		sheep.scale.set(3,3,3);
		mesh.add(sheep);
	}
	);
	return mesh;

}

		function createRabbits(){
		var geometry = new THREE.BoxGeometry( 2, 2, 6);
		var material = new THREE.MeshLambertMaterial( { color: 0xffff00} );
		var pmaterial = new Physijs.createMaterial(material,0.9,0.05);
		pmaterial.visible = false;
		var mesh = new Physijs.BoxMesh( geometry, pmaterial );
		mesh.setDamping(0.1,0.1);
		mesh.castShadow = true;

		var particleMaterial = new THREE.MeshBasicMaterial();
		particleMaterial.map = THREE.ImageUtils.loadTexture('../models/Rabbit_D.jpg');
		particleMaterial.side = THREE.DoubleSide;
		var jsonLoader = new THREE.JSONLoader();
		jsonLoader.load( "models/rabbit.js", function (geometry2) {
		var rabbit = new THREE.Mesh(geometry2, particleMaterial);
		rabbit.scale.set(2,2,2);
		mesh.add(rabbit);
		}
		);
		return mesh;
	}

	function addRabbits(){
		var rabbits = 5;
		for(i=0;i<rabbits;i++){
			var rabbit = createRabbits();
			rabbit.position.set(randN(90)+10,1,randN(40)+10);
			scene.add(rabbit);
		}
	}



	var clock;

	function initControls(){
		// here is where we create the eventListeners to respond to operations

		  //create a clock for the time-based animation ...
			clock = new THREE.Clock();
			clock.start();

			window.addEventListener( 'keydown', keydown);
			window.addEventListener( 'keyup',   keyup );
  }

	function keydown(event){
		console.log("Keydown:"+event.key);
		// console.dir(event);
		// first we handle the "play again" key in the "youwon" scene
		if ((gameState.scene == 'youwon'||gameState.scene == 'lose')&& event.key=='r') {
				gameState.scene = 'start';
				gameState.score = 0;
				gameState.health = 10;
				return;
			}

			if(event.key=='p'){
				gameState.scene = 'main';
				gameState.score = 0;
				gameState.health = 10;
			}

		if (gameState.scene == 'youlose' && event.key=='r') {
			gameState.scene = 'main';
			gameState.score = 0;
			addSheep();
			return;
		}

		// this is the regular scene
		switch (event.key){
			// change the way the avatar is moving
			case "w": controls.fwd = true;  break;
			case "s": controls.bwd = true; break;
			case "a": controls.left = true; break;
			case "d": controls.right = true; break;
			case "r": controls.up = true; break;
			case "f": controls.down = true; break;
			case "m": controls.speed = 30; break;
      case " ": controls.fly = true; break;
      case "h": controls.reset = true; break;
			case "x": avatar.rotation.set(0,0,0);
								avatar.__dirtyRotation = true;
								console.dir(avatar.rotation); break;

			//dog barks, repels fox to save some time to push the sheep
			case "b": soundEffect('dogBarking.wav');
								//fox.setLinearVelocity(0); break;
								//fox.__dirtyPosition = true; break;
								if (cube.position.distanceTo(avatar.position) < 30){
									repelFox();
								}
								//console.log("Fox Repeled");
								break;


			// switch cameras
			case "1": gameState.camera = camera; break;
			case "2": gameState.camera = avatarCam; break;
			case "3": gameState.camera = camera3; break;
			case "4": gameState.camera = dragcamera; break;

			// move the camera around, relative to the avatar
			case "ArrowLeft": avatarCam.translateY(1);break;
			case "ArrowRight": avatarCam.translateY(-1);break;
			case "ArrowUp": avatarCam.translateZ(-1);break;
			case "ArrowDown": avatarCam.translateZ(1);break;
			case "q": avatarCam.rotateY(.15);break;
			case "e": avatarCam.rotateY(-.15);break;
		}

	}

	function keyup(event){
		//console.log("Keydown:"+event.key);
		//console.dir(event);
		switch (event.key){
			case "w": controls.fwd   = false;  break;
			case "s": controls.bwd   = false; break;
			case "a": controls.left  = false; break;
			case "d": controls.right = false; break;
			case "r": controls.up    = false; break;
			case "f": controls.down  = false; break;
			case "m": controls.speed = 20; break;
      case " ": controls.fly = false; break;
      case "h": controls.reset = false; break;
		}
	}
	function updateNPC(){
		npc.lookAt(avatar.position);
		  //npc.__dirtyPosition = true;
		npc.setLinearVelocity(npc.getWorldDirection().multiplyScalar(0.8));
	}
	// function updateSheep(){
	// 	//	sheep.lookAt(avatar.position);
	// 	sheep.setLinearVelocity(10,0,0);
	// }


	function updateCube(){
		cube.lookAt(avatar.position);
		  //npc.__dirtyPosition = true;
		cube.setLinearVelocity(cube.getWorldDirection().multiplyScalar(2.0));
	}

	//repels the fox
	function repelFox(){
		cube.lookAt(avatar.position);
		//npc.__dirtyPosition = true;
		//cube.setLinearVelocity(cube.getWorldDirection().multiplyScalar(0));
		cube.translateZ(-5);
		cube.__dirtyPosition = true;
		//console.log("Fox Speed adjust");
	}

  function updateAvatar(){
		"change the avatar's linear or angular velocity based on controls state (set by WSAD key presses)"

		var forward = avatar.getWorldDirection();

		if (controls.fwd){
			avatar.setLinearVelocity(forward.multiplyScalar(controls.speed));
		} else if (controls.bwd){
			avatar.setLinearVelocity(forward.multiplyScalar(-controls.speed));
		} else {
			var velocity = avatar.getLinearVelocity();
			velocity.x=velocity.z=0;
			avatar.setLinearVelocity(velocity); //stop the xz motion
		}

    if (controls.fly){
      avatar.setLinearVelocity(new THREE.Vector3(0,controls.speed,0));
    }

		if (controls.left){
			avatar.rotateY(0.02);
			avatar.__dirtyRotation = true;
		} else if (controls.right){
			avatar.rotateY(-0.02);
			avatar.__dirtyRotation = true;
			//avatar.setAngularVelocity(new THREE.Vector3(0,1,0));
		}

    if (controls.reset){
      avatar.__dirtyPosition = true;
      avatar.position.set(40,10,40);
    }

	}


//var step = 0;
	function animate() {

		requestAnimationFrame( animate );
		dragcontrols.update();
		renderer.render( scene, camera );

		switch(gameState.scene) {
			case "youwon":
				endText.rotateY(0.005);
				renderer.render( endScene, endCamera );
				break;

			case "youlose":
				loseText.rotateY(0.005);
				renderer.render( loseScene, endCamera );
				break;

			case "main":
				updateAvatar();
				updateCube();
				//updateSheep();

	    	scene.simulate();
				if (gameState.camera!= 'none'){
					renderer.render( scene, gameState.camera );
					camera3.lookAt(avatar.position);
				}

				if (npc.position.distanceTo(avatar.position) < 20){
					updateNPC();
				}



				///check the distance to a one sheep
				// if (cube.position.distanceTo(avatar.position) < 20){
				// 	updateCube();
				// }
				control.update();
				var delta = clock.getDelta() * spawnerOptions.timeScale;
					tick += delta;
					if ( tick < 0 ) tick = 0;
					if ( delta > 0 ) {
						options.position.x = Math.sin( tick * spawnerOptions.horizontalSpeed ) * 20;
						options.position.y = Math.sin( tick * spawnerOptions.verticalSpeed ) * 10;
						options.position.z = Math.sin( tick * spawnerOptions.horizontalSpeed + spawnerOptions.verticalSpeed ) * 5;
						for ( var x = 0; x < spawnerOptions.spawnRate * delta; x++ ) {
							// Yep, that's really it.	Spawning particles is super cheap, and once you spawn them, the rest of
							// their lifecycle is handled entirely on the GPU, driven by a time uniform updated below
							particleSystem.spawnParticle( options );
						}
					}
					particleSystem.update( tick );

					stats.update();
				break;

			case "start":
				// startText.rotateY(0.005);
				renderer.render( startScene, startCamera );
				break;

			default:
			  console.log("don't know the scene "+gameState.scene);

		}

		//draw heads up display ..
	   var info = document.getElementById("info");
info.innerHTML='<div style="font-size:24pt">Score: '+ gameState.score
    + "; health:"+gameState.health
    + '</div>';

	}
