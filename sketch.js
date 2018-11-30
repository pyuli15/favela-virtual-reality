var world;
var sky;
var flower;
var raindrops = [];
var colors = ["blue","orange","green","purple","yellow"];
var music;
var click;


function preload()
{
	music = loadSound("sounds/cozy_digs.mp3");
	click = loadSound("sounds/conga.mp3");

}

function setup()
{
	noCanvas();
	console.log("before creating the world");

	world = new World("VRScene");

	console.log("after the world");
	music.loop();

	// sky = new Sky({material:{asset:"sky"}});
	// world.add(sky);

	var floor = new Plane({
		rotationX:-90,
		width:100,
		height:100,
		asset:"dirtfloor",
		repeatX:100,
		repeatY:100
	});

	world.add(floor);

	// torusKnot primitive
	var tok = new TorusKnot({
		x: 2 , y:1, z:0,
		radius:0.5,
		radiusTubular: 0.05,
		red:random(255), green:random(255), blue:random(255),
	});
	world.add(tok);

	// cylinder primitive
	var cl = new Cylinder({
		x:-5, 
		y:0.5, 
		z:0,
		height:0.5,
		radius: 0.25,
		red:random(255), green:random(255), blue:random(255),
	});
	world.add(cl);

	// ring primitive
	var r = new Ring({
		x:10,
		y:8, 
		z:5,
		radiusInner:1.5,
		radiusOuter: 2,
		side: 'double',
		red:random(255), green:random(255), blue:random(255),
	});
	world.add(r);

	// sphere primitive
	var s = new Sphere({
		x:10, y:8, z:5,
		radius: 1.5,
		red:random(255), green:random(255), blue:random(255)
	});
	world.add(s);

	// create a "container" object
	// this is an object that has no geometry (i.e. it is totally invisible)
	// it can be used to hold other objects and move them around as a group
	container = new Container3D({x:0, y:1, z:-5});

	// add the container to the world
	world.add(container);

	// now we can add objects into the container - note that when we do so we are using
	// a different coordinate system.  0,0,0 is not the origin of our world now - it is the
	// center of the container object
	var b1 = new Box({
		x:-5, y:0, z:0,
		asset:"blue"
	});

	// add the box to the container
	container.addChild(b1);

	// create a second box
	var b2 = new Box({
		x:-5,
		y:1, 
		z:0,
		asset:"orange"
	});

	// add the box to the container
	container.addChild(b2);

	flower = new OBJ({
		asset: 'flower_obj',
		mtl: 'flower_mtl',
		x: -3,
		y: 0.2,
		z: 0,
		rotationX:0,
		rotationY:90,
		scaleX:0.01,
		scaleY:0.01,
		scaleZ:0.01,
	});
	world.add(flower);

	for (var i = 0; i < 100; i++) 
	{
		raindrops.push( new Rain(random(-50,50),random(200,400),random(-50,50)));
	}

	// what textures can we choose from?
	var textures = ['iron', 'gold', 'stone'];

	// create lots of boxes
	for (var i = 0; i < 150; i++) {
		// pick a location
		var x = random(-50, 50);
		var z = random(-50, 50);

		var temp = new Container3D();
		var height = int(random(5,15));
		for(var j = 0; j < height; j++)
		{
			var t = colors[ int(random(colors.length)) ];
			var house = new Box({
				x: 0,
				z: 0,
				y: 0.5 + j,
				asset: t,
				//e is the object
				clickFunction: function(e) {
					e.setAsset(colors[ int(random(colors.length))]);
					click.play();
				}
			});

			temp.addChild(house);
		}

		world.add(temp);
		temp.setX(x);
		temp.setZ(z);

		// pick a random texture
		// var t = colors[ int(random(colors.length)) ];

		// // create a box here
		// var b = new Box({
		// 	x:x,
		// 	y:0.5,
		// 	z:z,
		// 	asset:t,
		// 	// clickFunction: function(theBox) 
		// 	// {		

				
		// 	// }
		// });

		// // add the box to the world
		// world.add(b);
	}

}




function draw()
{
	if (mouseIsPressed) 
	{
		world.moveUserForward(0.05);
	}

	for (var i = 0; i < raindrops.length; i++) 
	{
		raindrops[i].move();
	}
}

class Rain 
{

	constructor(x,y,z) 
	{
		// every particle needs its own asset
		this.raindrop = new Sphere({
			x: x,
			y: y,
			z: z,
			scaleX: 0.3,
			scaleY: 0.3,
			scaleZ: 0.3,
			//height: 0.01,
			red: 0,
			blue: 255,
			green: 0,
					
		});

		this.belowplane = -5;

		world.add(this.raindrop);

		// every box is going to wander around, so it needs a Perlin noise offset
		
	}

	// every box should be able to move
	move() 
	{
		this.raindrop.nudge(0,-1,0);

		if (this.raindrop.getY() <= this.belowplane ) 
		{
			//setting the y value to a certain number
			this.raindrop.setY(random(200,400))
		}
	}
}