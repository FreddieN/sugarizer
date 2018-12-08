define(["sugar-web/activity/activity", "sugar-web/env", "webL10n", "sugar-web/graphics/presencepalette"], function (activity, env, webL10n, presencepalette) { 

	// Manipulate the DOM only when it is ready.
	require(['domReady!'], function (doc) {
		
		
		// Initialize the activity.
		activity.setup();

		var currentenv;
		var username = "";
		var cards = [];
		var setname = "";
		var createdby = "";
		var learning = 0;
		var face = 0;
		var init = 1;
		var isHost = false;

		env.getEnvironment(function(err, environment) {
		currentenv = environment;
		username = currentenv.user.name;
		// Shared instances
		if (environment.sharedId) {
			presence = activity.getPresenceObject(function(error, network) {
				network.onDataReceived(onNetworkDataReceived);
				if(init == 1) {
					presence.sendMessage(presence.getSharedInfo().id, {
						user: presence.getUserInfo(),
						content: {
							"action":"init"
						}
					});
					init = 0;
				}
			});
			
		}
		// Set current language to Sugarizer
		var defaultLanguage = (typeof chrome != 'undefined' && chrome.app && chrome.app.runtime) ? chrome.i18n.getUILanguage() : navigator.language;
		var language = environment.user ? environment.user.language : defaultLanguage;
		webL10n.language.code = language;
		
		// Load from datatore
		if (!currentenv.objectId) {
			createFlashcard();
		} else {
			activity.getDatastoreObject().loadAsText(function(error, metadata, data) {
				if (error==null && data!=null) {
					context_local = JSON.parse(data);
					cards = context_local["cards"];
					setname = context_local["setname"];
					document.getElementById("set-name").value = setname;
					refreshCards();
				}
			});
		}
		});
		
		window.addEventListener("localized", function() {
			document.getElementById("learn-button").innerHTML = (webL10n.get("LearnSet"));
			document.getElementById("flip").innerHTML = webL10n.get("Flip");
			createdby = webL10n.get("CreatedBy");
			refreshCards();
		});

		document.getElementById("set-name").addEventListener("blur", function () {
			setname = document.getElementById("set-name").value;
					});

		document.getElementById("add-card").addEventListener("click", createFlashcard);

		function createFlashcard() {
			cards.push({
				"owner": username,
				"answer": "",
				"question": ""
			});
			refreshCards();
			if (presence) {
				presence.sendMessage(presence.getSharedInfo().id, {
					user: presence.getUserInfo(),
					content: {
						"action":"update",
						"cards":cards,
						"setname":setname
					}
				});
			}
		}
		function destroyFlashcard(n) {

			newcards = []
			for (index = 0; index < cards.length; ++index) {
				if(index != n) {
					newcards.push(cards[index]);
				}
			};
			cards = newcards;
			refreshCards();
			if (presence) {
				presence.sendMessage(presence.getSharedInfo().id, {
					user: presence.getUserInfo(),
					content: {
						"action":"update",
						"setname":setname,
						"cards":cards
					}
				});
			}
		}
		function refreshCards() {
			mhtml = "";
			for (index = 0; index < cards.length; ++index) {

				mhtml += '<div class="card"><div class="card-header"><span id="destroy-'+index+'" class="close">&times;</span><h2>#'+(index+1)+" "+createdby+" "+cards[index]["owner"]+'</h2></div><textarea id="question-'+index+'" placeholder="Question" class="card-content">'+cards[index]["question"]+'</textarea><textarea id="answer-'+index+'" placeholder="Answer" class="card-content">'+cards[index]["answer"]+'</textarea></div>'
			};

			document.getElementById("cards").innerHTML = mhtml;
			for (index = 0; index < cards.length; ++index) {
				document.getElementById("destroy-"+index).addEventListener('click', function(e) {
					e = e || window.event;
					var target = e.target || e.srcElement;
					destroyFlashcard(target.id.split("-")[1]);   
					
				}, false);
				document.getElementById("answer-"+index).addEventListener('blur', function (e) {
					e = e || window.event;
					var target = e.target || e.srcElement;
					cards[target.id.split("-")[1]]["answer"] = e.target.value;
					if (presence) {
						presence.sendMessage(presence.getSharedInfo().id, {
							user: presence.getUserInfo(),
							content: {
								"action":"update",
								"setname":setname,
								"cards":cards
							}
						});
					}
				});
				document.getElementById("question-"+index).addEventListener('blur', function (e) {
					e = e || window.event;
					var target = e.target || e.srcElement;
					cards[target.id.split("-")[1]]["question"] = e.target.value;
					if (presence) {
						presence.sendMessage(presence.getSharedInfo().id, {
							user: presence.getUserInfo(),
							content: {
								"action":"update",
								"setname":setname,
								"cards":cards
							}
						});
					}
				});
			};
		}
		//Modal
		// Get the modal
		var modal = document.getElementById('modal-card');

		// Get the button that opens the modal
		var btn = document.getElementById("learn-button");

		// Get the <span> element that closes the modal
		var span = document.getElementsByClassName("close")[0];

		// When the user clicks on the button, open the modal 
		btn.onclick = function() {
		learning = 0;
		face = 0;
		modal.style.display = "block";
		document.getElementById("modal-text").innerHTML= (cards[learning]["question"]);
		}
		document.getElementById("flip").onclick = function() {
			flip();
		}
		document.body.onkeyup = function(e){
			if(e.keyCode == 32){
				flip();
			}
			if(e.keyCode == 39){
				nextcard();
			}
			if(e.keyCode == 37){
				prevcard();
			}
		}
		var flip = function() {
			switch(face) {
				case 0:
					document.getElementById("modal-text").innerHTML= (cards[learning]["answer"]);
					face = 1;
					break;
				case 1:
					document.getElementById("modal-text").innerHTML= (cards[learning]["question"]);
					face = 0;
					break;
			}
		}
		var nextcard = function() {
			if(learning+1 < cards.length) {
				learning += 1;
				document.getElementById("modal-text").innerHTML= (cards[learning]["question"]);
			} else {
				learning = 0;
				document.getElementById("modal-text").innerHTML= (cards[learning]["question"]);
			}
		}
		var prevcard = function() {
			if(learning-1 > 0) {
				learning -= 1;
				document.getElementById("modal-text").innerHTML= (cards[learning]["question"]);
			} else {
				learning = cards.length-1;
				document.getElementById("modal-text").innerHTML= (cards[learning]["question"]);
			}
		}

		document.getElementById("next").onclick = function() {
			nextcard();
		}
		document.getElementById("prev").onclick = function() {
			prevcard();
		}
		// When the user clicks on <span> (x), close the modal
		span.onclick = function() {
		modal.style.display = "none";
		}

		// When the user clicks anywhere outside of the modal, close it
		window.onclick = function(event) {
		if (event.target == modal) {
			modal.style.display = "none";
		}
		}

		// Save in Journal on Stop
        document.getElementById("stop-button").addEventListener('click', function (event) {

			context_local = {
				"cards": cards,
				"setname": setname
			}
            var jsonData = JSON.stringify(context_local);
            activity.getDatastoreObject().setDataAsText(jsonData);
            activity.getDatastoreObject().save(function (error) {
                if (error === null) {

				} else {

				}
            });
		});
		// Link presence palette
		var palette = new presencepalette.PresencePalette(document.getElementById("network-button"), undefined);
		var presence = null;
		var palette = new presencepalette.PresencePalette(document.getElementById("network-button"), undefined);
		palette.addEventListener('shared', function() {
			palette.popDown();

			presence = activity.getPresenceObject(function(error, network) {
				if (error) {

					return;
				}
				network.createSharedActivity('org.sugarlabs.Flashcards', function(groupId) {

					isHost = true;
				});
				network.onDataReceived(onNetworkDataReceived);
				network.onSharedActivityUserChanged(onNetworkUserChanged);
			});
		});
		var onNetworkDataReceived = function(msg) {
			if (presence.getUserInfo().networkId === msg.user.networkId) {
				return;
			}
			switch(msg.content["action"]) {
				case "update":

				cards = msg.content["cards"];
				document.getElementById("set-name").value = msg.content["setname"];
				break;
				case "init":
				if (isHost) {

					presence.sendMessage(presence.getSharedInfo().id, {
					user: presence.getUserInfo(),
					content: {
						"action":"update",
						"cards":cards,
						"setname":setname
					}
				});
			}
				break;
			}
			
			refreshCards();
		}; 
		var onNetworkUserChanged = function(msg) {
				presence.sendMessage(presence.getSharedInfo().id, {
					user: presence.getUserInfo(),
					content: {
						"action":"update",
						"setname":setname,
						"cards":cards
					}
				});
		}
	});
	

});
