define(["sugar-web/activity/activity", "sugar-web/env", "webL10n"], function (activity, env, webL10n) {

	// Manipulate the DOM only when it is ready.
	requirejs(['domReady!'], function (doc) {

		// Initialize the activity.
		activity.setup();

		// Welcome user
		var currentenv;

        env.getEnvironment(function(err, environment) {
            currentenv = environment;

            // Set current language to Sugarizer
			var defaultLanguage = (typeof chrome != 'undefined' && chrome.app && chrome.app.runtime) ? chrome.i18n.getUILanguage() : navigator.language;
			var language = environment.user ? environment.user.language : defaultLanguage;
			webL10n.language.code = language;

            // Process localize event
            window.addEventListener("localized", function() {
	            document.getElementById("welcome").innerHTML = "<h3>"+webL10n.get("Hello", {name:currentenv.user.name})+"<br>"+webL10n.get("Hope", )+webL10n.get("you")+webL10n.get("are")+webL10n.get("prepared")+webL10n.get("to")+webL10n.get("learn")+webL10n.get("some")+webL10n.get("colors")+ webL10n.get("today")+  ":)"+"</h3>";
               
                //init
			    initialize = function() {
			    	var btn = document.querySelector(".btn-info").innerHTML = webL10n.get("Display")+webL10n.get("Color");
			    	var hexName = document.querySelector(".hex-sec").innerHTML = "<h5>Hex " + "" +webL10n.get("Name") + '<br>' + '<br>' + "</h5>";
			    	var colorName = document.querySelector(".name-sec").innerHTML = "<h5>"+webL10n.get("Color")+webL10n.get("Name") + '<br>' + "</h5>";
			    	var colorHead = document.querySelector("#color-head").innerHTML = "<h5>"+webL10n.get("Color")+webL10n.get("Display")+ "</h5>";
			    }
			    initialize();

			    // Load from datatore
				if (!environment.objectId) {
					console.log("New instance");
				} else {
					activity.getDatastoreObject().loadAsText(function(error, metadata, data) {
						if (error==null && data!=null) {
							hexColor = JSON.parse(data);
							document.getElementById("getColorName").value = hexColor["color"];
							console.log("Existing");
							getColorName();
						}
					});
				} 
			});	 

			var hexColor = {
				color: "null"
			};
			var testvar = "hi";
	        // Get the color and display it
	        var colors = {
			    "aliceblue":"#f0f8ff",
			    "antiquewhite":"#faebd7",
			    "aqua":"#00ffff",
			    "aquamarine":"#7fffd4",
			    "azure":"#f0ffff",
			    "beige":"#f5f5dc",
			    "bisque":"#ffe4c4",
			    "black":"#000000",
			    "blanchedalmond":"#ffebcd",
			    "blue":"#0000ff",
			    "blueviolet":"#8a2be2",
			    "brown":"#a52a2a",
			    "burlywood":"#deb887",
			    "cadetblue":"#5f9ea0",
			    "chartreuse":"#7fff00",
			    "chocolate":"#d2691e",
			    "coral":"#ff7f50",
			    "cornflowerblue":"#6495ed",
			    "cornsilk":"#fff8dc",
			    "crimson":"#dc143c",
			    "cyan":"#00ffff",
			    "darkblue":"#00008b",
			    "darkcyan":"#008b8b",
			    "darkgoldenrod":"#b8860b",
			    "darkgray":"#a9a9a9",
			    "darkgreen":"#006400",
			    "darkkhaki":"#bdb76b",
			    "darkmagenta":"#8b008b",
			    "darkolivegreen":"#556b2f",
			    "darkorange":"#ff8c00",
			    "darkorchid":"#9932cc",
			    "darkred":"#8b0000",
			    "darksalmon":"#e9967a",
			    "darkseagreen":"#8fbc8f",
			    "darkslateblue":"#483d8b",
			    "darkslategray":"#2f4f4f",
			    "darkturquoise":"#00ced1",
			    "darkviolet":"#9400d3",
			    "deeppink":"#ff1493",
			    "deepskyblue":"#00bfff",
			    "dimgray":"#696969",
			    "dodgerblue":"#1e90ff",
			    "firebrick":"#b22222",
			    "floralwhite":"#fffaf0",
			    "forestgreen":"#228b22",
			    "fuchsia":"#ff00ff",
			    "gainsboro":"#dcdcdc",
			    "ghostwhite":"#f8f8ff",
			    "gold":"#ffd700",
			    "goldenrod":"#daa520",
			    "gray":"#808080",
			    "green":"#008000",
			    "greenyellow":"#adff2f",
			    "honeydew":"#f0fff0",
			    "hotpink":"#ff69b4",
			    "indianred ":"#cd5c5c",
			    "indigo":"#4b0082",
			    "ivory":"#fffff0",
			    "khaki":"#f0e68c",
			    "lavender":"#e6e6fa",
			    "lavenderblush":"#fff0f5",
			    "lawngreen":"#7cfc00",
			    "lemonchiffon":"#fffacd",
			    "lightblue":"#add8e6",
			    "lightcoral":"#f08080",
			    "lightcyan":"#e0ffff",
			    "lightgoldenrodyellow":"#fafad2",
			    "lightgrey":"#d3d3d3",
			    "lightgreen":"#90ee90",
			    "lightpink":"#ffb6c1",
			    "lightsalmon":"#ffa07a",
			    "lightseagreen":"#20b2aa",
			    "lightskyblue":"#87cefa",
			    "lightslategray":"#778899",
			    "lightsteelblue":"#b0c4de",
			    "lightyellow":"#ffffe0",
			    "lime":"#00ff00",
			    "limegreen":"#32cd32",
			    "linen":"#faf0e6",
			    "magenta":"#ff00ff",
			    "maroon":"#800000",
			    "mediumaquamarine":"#66cdaa",
			    "mediumblue":"#0000cd",
			    "mediumorchid":"#ba55d3",
			    "mediumpurple":"#9370d8",
			    "mediumseagreen":"#3cb371",
			    "mediumslateblue":"#7b68ee",
			    "mediumspringgreen":"#00fa9a",
			    "mediumturquoise":"#48d1cc",
			    "mediumvioletred":"#c71585",
			    "midnightblue":"#191970",
			    "mintcream":"#f5fffa",
			    "mistyrose":"#ffe4e1",
			    "moccasin":"#ffe4b5",
			    "navajowhite":"#ffdead",
			    "navy":"#000080",
			    "oldlace":"#fdf5e6",
			    "olive":"#808000",
			    "olivedrab":"#6b8e23",
			    "orange":"#ffa500",
			    "orangered":"#ff4500",
			    "orchid":"#da70d6",
			    "palegoldenrod":"#eee8aa",
			    "palegreen":"#98fb98",
			    "paleturquoise":"#afeeee",
			    "palevioletred":"#d87093",
			    "papayawhip":"#ffefd5",
			    "peachpuff":"#ffdab9",
			    "peru":"#cd853f",
			    "pink":"#ffc0cb",
			    "plum":"#dda0dd",
			    "powderblue":"#b0e0e6",
			    "purple":"#800080",
			    "rebeccapurple":"#663399",
			    "red":"#ff0000",
			    "rosybrown":"#bc8f8f",
			    "royalblue":"#4169e1",
			    "saddlebrown":"#8b4513",
			    "salmon":"#fa8072",
			    "sandybrown":"#f4a460",
			    "seagreen":"#2e8b57",
			    "seashell":"#fff5ee",
			    "sienna":"#a0522d",
			    "silver":"#c0c0c0",
			    "skyblue":"#87ceeb",
			    "slateblue":"#6a5acd",
			    "slategray":"#708090",
			    "snow":"#fffafa",
			    "springgreen":"#00ff7f",
			    "steelblue":"#4682b4",
			    "tan":"#d2b48c",
			    "teal":"#008080",
			    "thistle":"#d8bfd8",
			    "tomato":"#ff6347",
			    "turquoise":"#40e0d0",
			    "violet":"#ee82ee",
			    "wheat":"#f5deb3",
			    "white":"#ffffff",
			    "whitesmoke":"#f5f5f5",
			    "yellow":"#ffff00",
			    "yellowgreen":"#9acd32",
			    "favcolor":"#2196f3",
			    "grayishnavy":"#333555",
			    "gray97":"f7f7f7"
	        };

	        changeColors = function() {
	        	var letters = '0123456789ABCDEF';
				var color1 = '#';
				var color2 = '#';
				var color3 = '#';
				var color4 = '#';
				var color5 = '#';
				    for (var i = 0; i < 6; i++) {
				        color1 += letters[Math.floor(Math.random() * 16)];
				    }
				    for (var i = 0; i < 6; i++) {
				        color2 += letters[Math.floor(Math.random() * 16)];
				    }
				    for (var i = 0; i < 6; i++) {
				        color3 += letters[Math.floor(Math.random() * 16)];
				    }
				    for (var i = 0; i < 6; i++) {
				        color4 += letters[Math.floor(Math.random() * 16)];
				    }
				    for (var i = 0; i < 6; i++) {
				        color5 += letters[Math.floor(Math.random() * 16)];
				    }

				//console.log(color);
	        	var box1 = document.querySelector(".box1").style.background = color1;
	        	var box2 = document.querySelector(".box2").style.background = color2;
	        	var box3 = document.querySelector(".box3").style.background = color3;
	        	var box4 = document.querySelector(".box4").style.background = color4;
	        	var box5 = document.querySelector(".box5").style.background = color5;

	        	document.querySelector(".box1").innerHTML = "Click again!";
	        }

	        

	        var key;
	        var value;
	        getColorName = function() {	
	                	
				var x = document.getElementById("getColorName").value;
					for (key in colors) {
					    value = colors[key];  
						if (x.toLowerCase() == key || x.toLowerCase() == value) {
						    var hex = document.querySelector(".hex-sec").innerHTML = document.querySelector(".hex-sec").innerHTML = "<h5> Hex "+ webL10n.get("Name") + "<br>"+ "<br>" + "<span id='cid'>"+value.toUpperCase()+"</span>" + "</h5>";
						    document.querySelector(".hex-sec").style.color = key;
						    var name = document.querySelector(".name-sec").innerHTML = document.querySelector(".name-sec").innerHTML = "<h5>"+webL10n.get("Color")+ webL10n.get("Name") + "<br>"+ "<br>"+ key.toUpperCase() + "</h5>";
						    document.querySelector(".name-sec").style.color = key;
						    document.querySelector(".color-display").style.background = value;
			                //var y = document.querySelector(".color-display");	
				        }
				    }
		    };

		    
		    storeColors = function() {
				hexColor = {
					"color": document.getElementById("getColorName").value
				}
		    }

			// Save in Journal on Stop
			document.getElementById("stop-button").addEventListener('click', function (event) {
				console.log("writing...");
				var jsonData = JSON.stringify(hexColor);
				console.log(hexColor)
				console.log(jsonData);
				activity.getDatastoreObject().setDataAsText(jsonData);
				activity.getDatastoreObject().save(function (error) {
					if (error === null) {
						console.log("write done.");
					} else {
						console.log("write failed.");
					}
				});
			});

	        //Click event
		    document.getElementById("display-btn").addEventListener('click', function(event) {
				storeColors();
				getColorName();
		        //colors.push(currentenv.user.colorvalue);
				
                var get = document.getElementById("getColorName").value = ""; 
            });

            document.addEventListener('keypress', function(event) {
	            if (event.keyCode === 13 || event.which === 13) {
					storeColors();
		            getColorName();
		            var get = document.getElementById("getColorName").value = "";
	            }
	        });
        });
	});
});