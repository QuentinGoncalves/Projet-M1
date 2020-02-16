// Global UI elements:
//  - log: event log
//  - trans: transcription window

// Global objects:
//  - isConnected: true iff we are connected to a worker
//  - tt: simple structure for managing the list of hypotheses
//  - dictate: dictate object with control methods 'init', 'startListening', ...
//       and event callbacks onResults, onError, ...
var isConnected = false;

var tt = new Transcription();

var startPosition = 0;
var endPosition = 0;
var doUpper = false;
var doPrependSpace = true;
var servers = "";
var dictate;

function capitaliseFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function prettyfyHyp(text, doCapFirst, doPrependSpace) {
	if (doCapFirst) {
		text = capitaliseFirstLetter(text);
	}
	tokens = text.split(" ");
	text = "";
	if (doPrependSpace) {
		text = " ";
	}
	doCapitalizeNext = false;
	tokens.map(function(token) {
		if (text.trim().length > 0) {
			text = text + " ";
		}
		if (doCapitalizeNext) {
			text = text + capitaliseFirstLetter(token);
		} else {
			text = text + token;
		}
		if (token == "." ||  /\n$/.test(token)) {
			doCapitalizeNext = true;
		} else {
			doCapitalizeNext = false;
		}
	});

	text = text.replace(/ ([,.!?:;])/g,  "\$1");
	text = text.replace(/ ?\n ?/g,  "\n");
	return text;
}


var dictate = new Dictate({
		server : servers[0],
		serverStatus : servers[1],
		recorderWorkerPath : 'lib/recorderWorker.js',
		onReadyForSpeech : function() {
			isConnected = true;
			__message("READY FOR SPEECH");
			$("#buttonToggleListening").html('Stop');
			$("#buttonToggleListening").addClass('highlight');
			$("#buttonToggleListening").prop("disabled", false);
			$("#buttonCancel").prop("disabled", false);
			startPosition = $("#trans").prop("selectionStart");
			endPosition = startPosition;
			var textBeforeCaret = $("#trans").val().slice(0, startPosition);
			if ((textBeforeCaret.length == 0) || /\. *$/.test(textBeforeCaret) ||  /\n *$/.test(textBeforeCaret)) {
				doUpper = true;
			} else {
				doUpper = false;
			}
			doPrependSpace = (textBeforeCaret.length > 0) && !(/\n *$/.test(textBeforeCaret));
		},
		onEndOfSpeech : function() {
			__message("END OF SPEECH");
			$("#buttonToggleListening").html('Stopping...');
			$("#buttonToggleListening").prop("disabled", true);
		},
		onEndOfSession : function() {
			isConnected = false;
			__message("END OF SESSION");
			$("#buttonToggleListening").html('Start');
			$("#buttonToggleListening").removeClass('highlight');
			$("#buttonToggleListening").prop("disabled", false);
			$("#buttonCancel").prop("disabled", true);
		},
		onServerStatus : function(json) {
			__serverStatus(json.num_workers_available);
			// If there are no workers and we are currently not connected
			// then disable the Start/Stop button.
			if (json.num_workers_available == 0 && ! isConnected) {
				$("#buttonToggleListening").prop("disabled", true);
			} else {
				$("#buttonToggleListening").prop("disabled", false);
			}
		},
		onPartialResults : function(hypos) {
			hypText = prettyfyHyp(hypos[0].transcript, doUpper, doPrependSpace);
			val = $("#trans").val();
			$("#trans").val(val.slice(0, startPosition) + hypText + val.slice(endPosition));
			endPosition = startPosition + hypText.length;
			$("#trans").prop("selectionStart", endPosition);
		},
		onResults : function(hypos) {
			hypText = prettyfyHyp(hypos[0].transcript, doUpper, doPrependSpace);
			val = $("#trans").val();
			$("#trans").val(val.slice(0, startPosition) + hypText + val.slice(endPosition));
			startPosition = startPosition + hypText.length;
			endPosition = startPosition;
			$("#trans").prop("selectionStart", endPosition);
			if (/\. *$/.test(hypText) ||  /\n *$/.test(hypText)) {
				doUpper = true;
			} else {
				doUpper = false;
			}
			doPrependSpace = (hypText.length > 0) && !(/\n *$/.test(hypText));
		},
		onError : function(code, data) {
			dictate.cancel();
			__error(code, data);
			// TODO: show error in the GUI
		},
		onEvent : function(code, data) {
			__message(code, data);
		}
	});

// Private methods (called from the callbacks)
function __message(code, data) {
	console.log("msg: " + code + ": " + (data || '') + "\n");
}

function __error(code, data) {
		console.log("ERR: " + code + ": " + (data || '') + "\n");
}

function __serverStatus(msg) {
	console.log(msg);
}

function __updateTranscript(text) {
	$("#trans").val(text);
}

// Public methods (called from the GUI)
function toggleListening() {
	if (isConnected) {
		dictate.stopListening();
	} else {
		dictate.startListening();
	}
}

function cancel() {
	dictate.cancel();
}

function clearTranscription() {
	$("#trans").val("");
	// needed, otherwise selectionStart will retain its old value
	$("#trans").prop("selectionStart", 0);
	$("#trans").prop("selectionEnd", 0);
}

function disable() {
	document.getElementById("ChoixEntree").disabled=true;
	document.getElementById("ChoixSortie").disabled=true;
	document.getElementById("servers").disabled=true;
	document.getElementById("Confirm").disabled=true;
  document.getElementById("buttonToggleListening").disabled=false;

  var menu_en = document.getElementById("ChoixEntree");
	var val_en = menu_en.options[menu_en.selectedIndex].text;
	var menu_so = document.getElementById("ChoixSortie");
	var val_so = menu_so.options[menu_so.selectedIndex].text;
	var menu_ty = document.getElementById("servers");
	var val_ty = menu_ty.options[menu_ty.selectedIndex].text;

  var val_serv =  document.getElementById("servers");
  var servers = val_serv.options[val_serv.selectedIndex].value;


  if(val_ty=="Fichier"){
    document.getElementById("inputGroupFile01").disabled=false;
  }
  if(val_en == "Anglais"){
    servers = servers.replace(/XXXX/g,"8889").split('|');       //pour transcription francais
    $("#trans").append(servers[0],servers[1]);
    dictate.setServer(servers[0]);
		dictate.setServerStatus(servers[1]);

  }else if (val_en == "Francais") {
    servers = servers.replace(/XXXX/g,"8888").split('|');       //pour transcription francais
    dictate.setServer(servers[0]);
		dictate.setServerStatus(servers[1]);
  }

}

function enable() {
	document.getElementById("ChoixEntree").disabled=false;
	document.getElementById("ChoixSortie").disabled=false;
	document.getElementById("servers").disabled=false;
	document.getElementById("Confirm").disabled=false;
  document.getElementById("buttonToggleListening").disabled=true;
  document.getElementById("inputGroupFile01").disabled=true;
}

$(document).ready(function() {
	dictate.init();
	$("#servers").change(function() {
		dictate.cancel();
		dictate.setServer(servers[0]);
		dictate.setServerStatus(servers[1]);
	});

});
