var file;
var fileURL;
var id_file;
var id_process;
var xml;
var token = 'WyIxOSIsImRjODIxMDExZDBkYjY0YmNiZjZjNmIzZDQzODZhOTQwIl0.EJs66g.5qnm6VETk7EqY3ubO3SMgW-4gmQ';

//Change in accordance with the HTML code
var HTMLtranscription = document.getElementById('trans');
var HTMLtranslation = document.getElementById('form21');
var audio = document.getElementById('audio');
var browser = document.getElementById('inputGroupFile01');
var inputType = document.getElementById('ChoixEntree');

browser.addEventListener('change', add_file);
HTMLtranscription.style.overflow = "auto";

function add_file() {

	file = browser.files[0];
	if(validFileType(file)){

		//Set the audio into the HTML player
		var blob = window.URL || window.webkitURL;
			if (!blob) {
					console.log('Your browser does not support Blob URLs :(');
					return;
			}
			fileURL = blob.createObjectURL(file);
		audio.src = fileURL;
		audio.load();
		if(inputType.options[inputType.selectedIndex].text == "Streaming"){
			audio.onloadeddata = function() {
				dictate.cancel();
				dictate.init();
				document.getElementById('buttonToggleListening').disabled=false;
			}
		}
	if(inputType.options[inputType.selectedIndex].text == "Fichier"){

			//Sent the curl command to start the transcription
			let formData = new FormData()
			formData.append('file', file)
			formData.append('content', '{"start": true, "asr_model_name": "french.studio.fr_FR"}')

			axios.post('http://lst-demo.univ-lemans.fr:8000/api/v1.1/files', formData, {
			  headers: {
			    'Authentication-Token' : token,
			  }
			})
			.then(function (response) {
				// Save file id and process id
			    console.log(response);
			    id_file = response["data"]["processes"]["0"]["file_id"];
			    console.log(id_file);
			    id_process = response["data"]["processes"]["0"]["id"];
			    console.log(id_process);
			    getProcess();
			  })
			  .catch(function (error) {
			    console.log(error);
			  });
		}
	}
}

//Return true if the file type is an audio file
function validFileType(file) {
  if(file.type.includes("audio/")) {
      return true;
  }
  return false;
}

// Get the process and get the xml once finished
function getProcess(){
	//id_process = 3959;
	var url = 'http://lst-demo.univ-lemans.fr:8000/api/v1.1/processes/'+id_process;
	var progress;
	axios({
		    url: url,
		    headers: {'Authentication-Token' : token }
			})
			.then(function (reponse) {
			    //On traite la suite une fois la réponse obtenue
			    console.log(reponse);
			    if(reponse["data"]["status"] != "Finished"){
			    	progress = reponse["data"]["progress"];
					HTMLtranscription.innerHTML = progress+"%";
					setTimeout(getProcess, 5000)
				} else {
					HTMLtranscription.innerHTML = "100%";
					getXML();
				}
			})
			.catch(function (erreur) {
			    //On traite ici les erreurs éventuellement survenues
			    console.log(erreur);
			});
}

// Get the XML with the id file
function getXML(){
	//id_process = 3959;
	//id_file = 3974;
	var url = 'http://lst-demo.univ-lemans.fr:8000/api/v1.1/files/'+id_file+'/transcription?format=xml';
	axios({
		    url: url,
		    headers: {'Authentication-Token' : token}
			})
			.then(function (reponse) {
			    //On traite la suite une fois la réponse obtenue
			    console.log(reponse);
			    var parser = new DOMParser();
			    xml = parser.parseFromString(reponse["data"],"text/xml");

			    displayTranscription();
			    //displayAllTranscription();

			    // Add event listener to the audio element (show dynamically the text)
			    audio.addEventListener('timeupdate', displayTranscription, false);
			    //audio.addEventListener('timeupdate', focusTranscription, false);
			    audio.addEventListener('loadedmetadata', removeAllListenerAudio, false);
			})
			.catch(function (erreur) {
			    // On traite ici les erreurs éventuellement survenues
			    console.log(erreur);
			});
}


// Get the String text in the XML with a time
function XMLtoString_CurrentTime(time){
	var text = "";
	var i = 0;
	var xmlTime = parseFloat(xml.getElementsByTagName("Word")[i].getAttribute("stime"));
	while(xmlTime <= time){
		text = text + xml.getElementsByTagName("Word")[i].childNodes[0].nodeValue.replace(/ /g,"") + " ";
		i = i + 1;
		xmlTime = parseFloat(xml.getElementsByTagName("Word")[i].getAttribute("stime"));
	}
	return text;
}

function displayTranscription(){
	if(xml != null){
		var duration = audio.currentTime;
		//var result = string_difference(HTMLtranscription.value, XMLtoString_CurrentTime(duration));
		//console.log(result[1]);
		//add_translation(result[1]);

		HTMLtranscription.innerHTML = XMLtoString_CurrentTime(duration);
		HTMLtranscription.scrollTop = HTMLtranscription.scrollHeight;
	}
}

function focusTranscription(){
	if(xml != null){
		var duration = audio.currentTime;
		highlight(duration);
	}
}

function highlight(time) {
	displayAllTranscription();
	var i = 0;
	var index = 0;
	var xmlTime = parseFloat(xml.getElementsByTagName("Word")[i].getAttribute("stime"));
	while(xmlTime < time){
		index = index + (xml.getElementsByTagName("Word")[i].childNodes[0].nodeValue.replace(/ /g,"") + " ").length;
		i = i + 1;
		xmlTime = parseFloat(xml.getElementsByTagName("Word")[i].getAttribute("stime"));
	}
	var text = xml.getElementsByTagName("Word")[i].childNodes[0].nodeValue.replace(/ /g,"") + " ";
	var innerHTML = HTMLtranscription.innerHTML;
    if (index >= 0) {
    	innerHTML = innerHTML.substring(0,index) + "<mark>" + innerHTML.substring(index,index+text.length) + "</mark>" + innerHTML.substring(index + text.length);
    	HTMLtranscription.innerHTML = innerHTML;
    }
}

function displayAllTranscription(){
	if(xml != null){
		var text = "";
		for (var i = 0; i < xml.getElementsByTagName("Word").length; i++) {
			text = text + xml.getElementsByTagName("Word")[i].childNodes[0].nodeValue.replace(/ /g,"") + " ";
		}
		HTMLtranscription.innerHTML = text;
	}
}

function removeAllListenerAudio(){
	HTMLtranscription.innerHTML = "";
	audio.removeEventListener("timeupdate", displayTranscription, false);
	//audio.addEventListener('timeupdate', focusTranscription, false);
	audio.removeEventListener("loadedmetadata", removeAllListenerAudio, false);
	var url = 'http://lst-demo.univ-lemans.fr:8000/api/v1.1/files/'+id_file;
	axios.delete({
		    url: url,
		    headers: {'Authentication-Token' : token}
			})
			.then(function (reponse) {
			    //On traite la suite une fois la réponse obtenue
			    console.log(reponse);
			})
			.catch(function (erreur) {
			    // On traite ici les erreurs éventuellement survenues
			    console.log(erreur);
			});
}
