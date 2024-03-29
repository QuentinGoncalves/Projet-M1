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
		server : $("#servers").val().split('|')[0],
		serverStatus : $("#servers").val().split('|')[1],
		recorderWorkerPath : 'lib/recorderWorker.js',
		onReadyForSpeech : function() {
			isConnected = true;
			__message("READY FOR SPEECH");
			$("#buttonToggleListening").prop("value", 'Stop');
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
			$("#buttonToggleListening").prop("value",'Stopping...');
			$("#buttonToggleListening").prop("disabled", true);
		},
		onEndOfSession : function() {
			isConnected = false;
			__message("END OF SESSION");
			$("#buttonToggleListening").prop("value",'Start');
			$("#buttonToggleListening").removeClass('highlight');
			$("#buttonToggleListening").prop("disabled", false);
			$("#buttonCancel").prop("disabled", true);
		},
		onServerStatus : function(json) {
			__serverStatus(json.num_workers_available);
			// If there are no workers and we are currently not connected
			// then disable the Start/Stop button.
      if ($('Confirm').disabled == true && $('ChoixEntree') != "Fichier"){
  			if (json.num_workers_available == 0 && ! isConnected) {
  			} else {
  				$("#buttonToggleListening").prop("disabled", false);
  			}
        $("#buttonToggleListening").prop("disabled", true);
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
      add_translation(hypText.toLowerCase());
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
	// console.log("msg: " + code + ": " + (data || '') + "\n");
}

function __error(code, data) {
		console.log("ERR: " + code + ": " + (data || '') + "\n");
}

function __serverStatus(msg) {
	// console.log(msg);
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

function confirm() {
	document.getElementById("ChoixEntree").disabled=true;
	document.getElementById("ChoixSortie").disabled=true;
	document.getElementById("servers").disabled=true;
	document.getElementById("Confirm").disabled=true;
  document.getElementById("Reset").disabled=false;

  var menu_in = document.getElementById("ChoixEntree");
	var val_in = menu_in.options[menu_in.selectedIndex].text;
	var menu_out = document.getElementById("ChoixSortie");
	var val_out = menu_out.options[menu_out.selectedIndex].text;
	removeAllListenerAudio();
	delete_translation();
	document.getElementById("audio").pause();

  if(val_in=="Fichier"){
    document.getElementById("inputGroupFile01").disabled=false;
    document.getElementById("serverView").style.pointerEvents = "auto";
    document.getElementById("serverView").style.opacity = "1";
  }
  else if(val_in=="Streaming"){
    document.getElementById("buttonToggleListening").disabled=false;
    document.getElementById("inputGroupFile01").disabled=false;
    document.getElementById("btnStream").style.display="block";
    document.getElementById("hautGauchePlayer").style.display="block";
    dictate.init();
  }
  else{
    document.getElementById("buttonToggleListening").disabled=false;
    document.getElementById("inputGroupFile01").disabled=true;
    document.getElementById("btnStream").style.display="block";
    document.getElementById("hautGauchePlayer").style.display="none";
    dictate.init();
  }



}

function reset() {
	document.getElementById("ChoixEntree").disabled=false;
	document.getElementById("ChoixSortie").disabled=false;
	document.getElementById("servers").disabled=false;
	document.getElementById("Confirm").disabled=false;
  document.getElementById("Reset").disabled=true;
	document.getElementById("serverView").style.pointerEvents = "none";
    	document.getElementById("serverView").style.opacity = "0.5";

  var menu_in = document.getElementById("ChoixEntree");
  var val_in = menu_in.options[menu_in.selectedIndex].text;
  var menu_out = document.getElementById("ChoixSortie");
  var val_out = menu_out.options[menu_out.selectedIndex].text;

  if(val_in=="Fichier"){
    document.getElementById("buttonToggleListening").disabled=true;
    document.getElementById("inputGroupFile01").disabled=true;
    document.getElementById("btnStream").style.display="none";
  }else{
    document.getElementById("inputGroupFile01").disabled=true;
    document.getElementById("buttonToggleListening").disabled=true;
    document.getElementById("hautGauchePlayer").style.display="block";
    document.getElementById("btnStream").style.display="none";
  }
  dictate.cancel();
}

$(document).ready(function() {
	$("#servers").change(function() {
		dictate.cancel();
		dictate.setServer($("#servers").val().split('|')[0]);
		dictate.setServerStatus($("#servers").val().split('|')[1]);
	});

});
