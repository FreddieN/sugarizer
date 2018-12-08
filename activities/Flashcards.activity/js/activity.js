define(["sugar-web/activity/activity", "sugar-web/env", "webL10n"], function (activity, env, webL10n) { 

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

		env.getEnvironment(function(err, environment) {
		currentenv = environment;
		username = currentenv.user.name;

		// Set current language to Sugarizer
		var defaultLanguage = (typeof chrome != 'undefined' && chrome.app && chrome.app.runtime) ? chrome.i18n.getUILanguage() : navigator.language;
		var language = environment.user ? environment.user.language : defaultLanguage;
		webL10n.language.code = language;

		// Load from datatore
		if (!currentenv.objectId) {
			console.log("New instance");
			createFlashcard();
		} else {
			console.log("Existing instance");
			activity.getDatastoreObject().loadAsText(function(error, metadata, data) {
				if (error==null && data!=null) {
					context_local = JSON.parse(data);
					cards = context_local["cards"];
					setname = context_local["setname"];
					console.log(context_local);
					document.getElementById("set-name").value = setname;
					refreshCards();
				}
			});
		}
		});
		
		window.addEventListener("localized", function() {
			document.getElementById("learn-button").innerHTML = (webL10n.get("LearnSet"));
			createdby = webL10n.get("CreatedBy");
			refreshCards();
		});

		document.getElementById("set-name").addEventListener("blur", function () {
			setname = document.getElementById("set-name").value;
			console.log(setname);
		});

		document.getElementById("add-card").addEventListener("click", createFlashcard);

		function createFlashcard() {
			console.log(username);
			cards.push({
				"owner": username,
				"answer": "",
				"question": ""
			});
			refreshCards();
		}
		function destroyFlashcard(n) {
			console.log(cards);
			newcards = []
			for (index = 0; index < cards.length; ++index) {
				if(index != n) {
					newcards.push(cards[index]);
				}
			};
			cards = newcards;
			refreshCards();
		}
		function refreshCards() {
			mhtml = "";
			for (index = 0; index < cards.length; ++index) {
				console.log("s"+cards[index]["answer"]);
				mhtml += '<div class="card"><div class="card-header"><span id="destroy-'+index+'" class="close">&times;</span><h2>#'+(index+1)+" "+createdby+" "+username+'</h2></div><textarea id="question-'+index+'" placeholder="Question" class="card-content">'+cards[index]["question"]+'</textarea><textarea id="answer-'+index+'" placeholder="Answer" class="card-content">'+cards[index]["answer"]+'</textarea></div>'
			};
			console.log(cards);
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
				});
				document.getElementById("question-"+index).addEventListener('blur', function (e) {
					e = e || window.event;
					var target = e.target || e.srcElement;
					cards[target.id.split("-")[1]]["question"] = e.target.value;
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
		modal.style.display = "block";
		document.getElementById("modal-text").innerHTML= (cards[learning]["question"]);
		}
		document.getElementById("flip").onclick = function() {
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
		document.getElementById("next").onclick = function() {
			if(learning+1 < cards.length) {
				learning += 1;
				document.getElementById("modal-text").innerHTML= (cards[learning]["question"]);
			} else {
				learning = 0;
				document.getElementById("modal-text").innerHTML= (cards[learning]["question"]);
			}
		}
		document.getElementById("prev").onclick = function() {
			console.log(learning-1);
			if(learning-1 > 0) {
				learning -= 1;
				document.getElementById("modal-text").innerHTML= (cards[learning]["question"]);
			} else {
				learning = cards.length-1;
				document.getElementById("modal-text").innerHTML= (cards[learning]["question"]);
			}
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
			console.log("writing...");
			context_local = {
				"cards": cards,
				"setname": setname
			}
            var jsonData = JSON.stringify(context_local);
            activity.getDatastoreObject().setDataAsText(jsonData);
            activity.getDatastoreObject().save(function (error) {
                if (error === null) {
                    console.log("write done.");
                } else {
                    console.log("write failed.");
                }
            });
        });
	});
	

});
