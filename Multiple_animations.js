var renderer = null, 
scene = null, 
root = null,
group = null;

var timeLimit = 60;
var mesh = null;
var objLoader = null;
var tree = null;
var spaceShip = null;
var bullet = null;

var duration = 20000; // ms
var currentTime = Date.now();
var currentTimeSpawn = Date.now(); 

var bullets = [];
var spaceShips = [];
var trees = [];
var trees_animations = [];
var speeds = [];
var score = 0;
var names = 0;

var camera;
var game = false;
var gameStarted;
var gameMinutes = 0;

var spaceShipMax=8;
var treesMax=10;

var spaceShipSpawned = 0;
var lastSpaceShipTime = 0;
var nextSpaceShipSpawnTime = 1000;
var lifePoints = 100;

var animator = null;
var spaceShipSize = null;

var treesSpawned = 0;
var highScore = 0;
var lastTreeTime = 0;
var nextSpawnTime = 1000;
var shipCreated = true;
var enemiesDamage = 10;
var treeDamage = 10;

var xRClicked = false;
var xRMove = 0;
var xLClicked = false;
var xLMove = 0;

var yRClicked = false;
var yRMove = 0;
var yLClicked = false;
var yLMove = 0;

function getRandomInt(min, max) 
{
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function controlXR(location)
{
    if(game)
    {
        xRClicked = true;
        xRMove = location;
    }
    
}

function controlXL(location)
{
    if(game)
    {
        xLClicked = true;
        xLMove = location;
    }
    
}

function controlYR(location)
{
    if(game)
    {
        yRClicked = true;
        yRMove = location;
    }
    
}
function controlYL(location)
{
    if(game)
    {
        yLClicked = true;
        yLMove = location;
    }
    
}
function xRRelease()
{
    xRClicked = false;
}
function xLRelease()
{
    xLClicked = false;
}
function yRRelease()
{
    yRClicked = false;
}
function yLRelease()
{
    yLClicked = false;
}


function fire()
{
    if(game)
    {
        var position = new THREE.Vector3();
        position.setFromMatrixPosition( spaceShip.matrixWorld );

        var newBullet = cloneFbx(bullet);
        newBullet.position.set(position.x,position.y,90); 
        scene.add(newBullet);
        bullets.push(newBullet);
    }
}


function startGame()
{
    
    if(trees.length>0)
    {
        for(var actual = 0; actual<trees.length;actual++)
        {
            scene.remove(trees[actual]);
        }

        for(var actual = 0; actual<spaceShips.length;actual++)
        {
            scene.remove(spaceShips[actual]);
        }

        for(var actual = 0; actual<bullets.length;actual++)
        {
            scene.remove(bullets[actual]);
        }
        trees = [];
        robot_mixers = [];
        speeds = [];
        if(highScore<score)
        {
            highScore = score;
        }
        
        document.getElementById("highScore").innerHTML = "best score: " +highScore;
    }
    gameMinutes = 0
    lastTreeTime = Date.now();
    gameStarted = Date.now();
    score = 0;
    names = 0;
    treesSpawned = 0;
    lifePoints = 100;
    document.getElementById("time").innerHTML = 60;
    document.getElementById("score").innerHTML = "score: " +score;
    document.getElementById("startButton").value = "Restart game";
    document.getElementById("startButton").disabled = true;
    document.getElementById("life").innerHTML = "life: " + lifePoints;
    

    game = true;
    
}

function animate() {
    KF.update();
    var now = Date.now();
    var deltat = now - currentTime;
    var deltat2 = now - lastTreeTime;
    var deltat3 = now - gameStarted;
    var deltat4 = now - lastSpaceShipTime;

    currentTime = now;

    //spwanTrees
    if (treesSpawned < treesMax)
    {
        if(deltat2>nextSpawnTime)
        {
            nextSpawnTime = getRandomInt(100, 700)
            lastTreeTime = now;
            treesSpawned++;
            currentTimeSpawn = now
            var x = getRandomInt(-72,72);
            
            var newTree = cloneFbx(tree);
            newTree.position.set(x,2,-100); 
            newTree.scale.set(3,4,3);
            scene.add(newTree);

            newTree.name = names;
            newTree.move = 0;
            newTree.point = 1;
            newTree.status = 1;

            trees.push(newTree);
            speeds.push(0.1);
            
            if(names==0)
            {
                scene.remove(trees.shift());
                treesSpawned--;
                
            }
            names+=1;
        }

    }

    //Spawn spaceships
    
    if (spaceShipSpawned < spaceShipMax)
    {
        if(deltat4 > nextSpaceShipSpawnTime)
        {
            nextSpaceShipSpawnTime = getRandomInt(100, 1200)

            lastSpaceShipTime = now;
            spaceShipSpawned++;
            currentTimeSpawn = now
            var x = getRandomInt(-72,72);
            var y = getRandomInt(2,40);
            
            var newSpaceShip = cloneFbx(spaceShip);
            newSpaceShip.position.set(x,y,-150); 
            newSpaceShip.scale.set(2,2,2);
            newSpaceShip.rotation.y += Math.PI; 
            newSpaceShip.status = 1;

            scene.add(newSpaceShip);
            
            spaceShips.push(newSpaceShip);

            if(shipCreated)
            {
                scene.remove(spaceShips[0]);
                spaceShipSpawned--;
                spaceShips.shift()
                shipCreated = false;
            }

        }

    }

    



    if (xRClicked)
    {
        
        var c = Math.tan(22.5)*40;
        var aspect = window.innerWidth / window.innerHeight;
        co = aspect*c;
        
        if(spaceShip.position.x <= co-(spaceShipSize.x) && spaceShip.position.x >= (co-(spaceShipSize.x))*-1)
        {
            spaceShip.position.x += xRMove*deltat;
            if(spaceShip.position.x < (co-(spaceShipSize.x))*-1)
            {
                spaceShip.position.x = (co-(spaceShipSize.x))*-1;
            }
            else if(spaceShip.position.x > co-(spaceShipSize.x))
            {
                spaceShip.position.x = co-(spaceShipSize.x);
            }
        }
        
    }

    if (xLClicked)
    {
        
        var c = Math.tan(22.5)*40;
        var aspect = window.innerWidth / window.innerHeight;
        co = aspect*c;
        
        if(spaceShip.position.x <= co-(spaceShipSize.x) && spaceShip.position.x >= (co-(spaceShipSize.x))*-1)
        {
            spaceShip.position.x += xLMove*deltat;
            if(spaceShip.position.x < (co-(spaceShipSize.x))*-1)
            {
                spaceShip.position.x = (co-(spaceShipSize.x))*-1;
            }
            else if(spaceShip.position.x > co-(spaceShipSize.x))
            {
                spaceShip.position.x = co-(spaceShipSize.x);
            }
        }
    }

    if (yRClicked)
    {
        var co = Math.tan(22.5)*40;
        if(spaceShip.position.y <= co && spaceShip.position.y >= 0)
        {

                spaceShip.position.y += yRMove*deltat;
                if(spaceShip.position.y < 0)
                {
                    spaceShip.position.y = 0;
                }
                else if(spaceShip.position.y > co)
                {
                    spaceShip.position.y = co;
                }

        }
    }

    if (yLClicked)
    {
        var co = Math.tan(22.5)*40;
        if(spaceShip.position.y <= co && spaceShip.position.y >= 0)
        {

                spaceShip.position.y += yLMove*deltat;
                if(spaceShip.position.y < 0)
                {
                    spaceShip.position.y = 0;
                }
                else if(spaceShip.position.y > co)
                {
                    spaceShip.position.y = co;
                }

        }
    }

    if(deltat3>1000)
    {
        gameStarted = now;
        gameMinutes+=1;
        document.getElementById("time").innerHTML = 60-gameMinutes;
        if(gameMinutes>=60)
        {
            document.getElementById("startButton").disabled = false;
            game=false;
        }
    }

    if(lifePoints<=0)
    {

        document.getElementById("startButton").disabled = false;
        game=false;
    }

    if (trees.length>0)
    {
        firstBB = new THREE.Box3().setFromObject(spaceShip);
        for(var actual = 0; actual<trees.length;actual++)
        {
            secondBB = new THREE.Box3().setFromObject(trees[actual]);

            trees[actual].position.z += speeds[actual] * deltat;
            var collision = firstBB.intersectsBox(secondBB);


            if(trees[actual].position.z > 120 || collision)
            {   
                treesSpawned--;
                scene.remove(trees.shift());
                
            }

            if(collision)
            {
                lifePoints -= treeDamage;
                document.getElementById("life").innerHTML = "life: " + lifePoints;
            }
                  
        }
    }

    if (spaceShips.length>0)
    {
        firstBB = new THREE.Box3().setFromObject(spaceShip);
        for(var actual = 0; actual<spaceShips.length;actual++)
        {

            spaceShips[actual].position.z += 0.2 * deltat;

            
            secondBB = new THREE.Box3().setFromObject(spaceShips[actual]);
            var collision = firstBB.intersectsBox(secondBB);
            
            if(spaceShips[actual].position.z > 120 || collision)
            {   
                spaceShipSpawned--;
                scene.remove(spaceShips[actual]);
                spaceShips.shift()
            }

            if(collision)
            {
                lifePoints -= enemiesDamage;
                document.getElementById("life").innerHTML = "life: " + lifePoints;
            }
                  
        }
    }

    if (bullets.length>0)
    {
        for(var actual = 0; actual<bullets.length;actual++)
        {
            
            bullets[actual].position.z -= 0.1 * deltat;

            if(bullets[actual].position.z < 0 )
            {   
                scene.remove(bullets[actual]);
                bullets.shift()
            }
            else
            {
                firstBB = new THREE.Box3().setFromObject(bullets[actual]);
                for(var actual2 = 0; actual2<spaceShips.length;actual2++)
                {
                    secondBB = new THREE.Box3().setFromObject(spaceShips[actual2]);
                    var collision = firstBB.intersectsBox(secondBB);
                    if(collision && spaceShips[actual2].status == 1 )
                    {
                        spaceShips[actual2].status = 0;
                        score += 10;
                        document.getElementById("score").innerHTML = "score: " +score;
                        scene.remove(spaceShips[actual2]);
                    }
                }
                
            }   
        }
    }





}

function playAnimations()
{    
    animator = new KF.KeyFrameAnimator;
    animator.init({ 
        interps:
            [
                { 
                    keys:[0, 1], 
                    values:[
                            { x : 0, y : 0 },
                            { x : 0, y : 1 },
                            ],
                    target:mesh.material.map.offset
                },
            ],
        loop: true,
        duration: 1*1000,
    });
        animator.start();
            
}

function onWindowResize() 
{
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function run() {
    requestAnimationFrame(function() { run(); });
    
    // Render the scene
    renderer.render(scene, camera);

    // Spin the cube for next frame
    if(game)
    {
        animate();
        
    }
    
}

function setLightColor(light, r, g, b)
{
    r /= 255;
    g /= 255;
    b /= 255;
    
    light.color.setRGB(r, g, b);
}

var directionalLight = null;
var spotLight = null;
var ambientLight = null;
var mapUrl = "./images/GrassTexture.jpg";

var SHADOW_MAP_WIDTH = 2048, SHADOW_MAP_HEIGHT = 2048;

function loadObj()
{

    objLoader = new THREE.GLTFLoader();
    objLoader.load('./models/Tree/lowpolytree.glb', function (gltf) 
    {
    var object = gltf.scene;
    object.traverse( function ( child ) 
    {
        if ( child instanceof THREE.Mesh ) 
        {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });
    tree = object;
    tree.scale.set(3,3,3);
    });

    objLoader = new THREE.GLTFLoader();
    objLoader.load('./models/SpaceShip/SpaceShip.glb', function (gltf) 
    {
    var object = gltf.scene;
    object.traverse( function ( child ) 
    {
        if ( child instanceof THREE.Mesh ) 
        {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });
    spaceShip = object;
    spaceShip.position.set(0,0,90); 
    spaceShip.scale.set(1,1,1);
    object.rotation.y += Math.PI; 
    scene.add(spaceShip);
    var box = new THREE.Box3().setFromObject(spaceShip);
    spaceShipSize = box.getSize();
    console.log( spaceShipSize );
    });

    
    var geometry = new THREE.SphereGeometry( 0.3, 32, 32 );
    var material = new THREE.MeshBasicMaterial( {color: 0xff0000} );
    bullet = new THREE.Mesh( geometry, material );
    //scene.add( bullet );
}
function createScene(canvas) {
    
    // Create the Three.js renderer and attach it to our canvas
    renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );

    // Set the viewport size
    renderer.setSize(window.innerWidth, window.innerHeight);
    // Turn on shadows
    renderer.shadowMap.enabled = true;
    // Options are THREE.BasicShadowMap, THREE.PCFShadowMap, PCFSoftShadowMap
    renderer.shadowMap.type = THREE.PCFShadowMap;
    
    // Create a new Three.js scene
    scene = new THREE.Scene();

    // Add  a camera so we can view the scene
    camera = new THREE.PerspectiveCamera( 45, canvas.width / canvas.height, 1, 4000 );
    camera.position.set(0, 10,130);
    //camera.rotation.set(-45,0,0);
    camera.lookAt(new THREE.Vector3(0,0,0));

        
    // Create a group to hold all the objects
    root = new THREE.Object3D;
    
    spotLight = new THREE.SpotLight (0xffffff);
    spotLight.position.set(0, 70, 0);
    spotLight.target.position.set(0, 0, 0);
    //root.add(spotLight);

    // Add a directional light to show off the object
    directionalLight = new THREE.DirectionalLight( 0xffffff, 2);

    // Create and add all the lights
    directionalLight.position.set(0, 1, 2);
    root.add(directionalLight);

    spotLight.castShadow = true;

    spotLight.shadow.camera.near = 1;
    spotLight.shadow.camera.far = 200;
    spotLight.shadow.camera.fov = 45;
    
    spotLight.shadow.mapSize.width = SHADOW_MAP_WIDTH;
    spotLight.shadow.mapSize.height = SHADOW_MAP_HEIGHT;


    // Point light
    var pointLight = new THREE.PointLight (0xffffff, 1, 1000);
    pointLight.shadow.camera.far = 4000;
    pointLight.shadow.mapSize.width = SHADOW_MAP_WIDTH;
    pointLight.shadow.mapSize.height = SHADOW_MAP_HEIGHT;

    pointLight.position.set(0, 500, 300);
    pointLight.castShadow = true;
    
    scene.add(pointLight);

    //ambientLight = new THREE.AmbientLight ( 0x888888 );
    //root.add(ambientLight);

    // Create the objects
    loadObj();
    
    
    // Create a group to hold the objects
    group = new THREE.Object3D;
    root.add(group);

    // Create a texture map
    var map = new THREE.TextureLoader().load(mapUrl);
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(8, 8);

    var color = 0xffffff;
    
    // Put in a ground plane to show off the lighting
    geometry = new THREE.PlaneGeometry(300, 300, 50, 50);
    mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color:color, map:map, side:THREE.DoubleSide}));

    mesh.rotation.x = -Math.PI / 2;
    mesh.position.y = -4.02;
    
    // Add the mesh to our group
    group.add( mesh );
    mesh.castShadow = false;
    mesh.receiveShadow = true;
    raycaster = new THREE.Raycaster();
    // Now add the group to our scene
    scene.add( root );
    window.addEventListener( 'resize', onWindowResize);

}