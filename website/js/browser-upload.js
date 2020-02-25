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
var playlist = document.getElementById("serverView");

browser.addEventListener('change', add_file);
//browser.addEventListener('change', test);
HTMLtranscription.style.overflow = "auto";
HTMLtranscription.style.height = "auto";

update_playlist();

/*
function test(){
	file = browser.files[0];
	let formData = new FormData()
	formData.append('file', file);

	axios.post('./php/save_audio.php', formData, {
	})
	.then(function (response) {
		console.log(response);
	})
	.catch(function (error) {
		console.log(error);
	});	
}
*/

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
		else if(inputType.options[inputType.selectedIndex].text == "Fichier"){

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
			    //console.log(response);
			    id_file = response["data"]["processes"]["0"]["file_id"];
			    id_process = response["data"]["processes"]["0"]["id"];
			    update_playlist();
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

/*
// Get the process and get the xml once finished
function getProcess(id_process){
	var url = 'http://lst-demo.univ-lemans.fr:8000/api/v1.1/processes/'+id_process;
	var progress;
	axios({
		    url: url,
		    headers: {'Authentication-Token' : token }
			})
			.then(function (reponse) {
			    //On traite la suite une fois la réponse obtenue
			    update_playlist();
			    if(reponse["data"]["status"] != "Finished"){
					setTimeout(getProcess(id_process), 5000)
				}
			})
			.catch(function (erreur) {
			    //On traite ici les erreurs éventuellement survenues
			    console.log(erreur);
			});
}*/

// Get the XML with the id file
function getXML(id_file){
	var url = 'http://lst-demo.univ-lemans.fr:8000/api/v1.1/files/'+id_file+'/transcription?format=xml';
	axios({
		    url: url,
		    headers: {'Authentication-Token' : token}
			})
			.then(function (reponse) {
			    //On traite la suite une fois la réponse obtenue
			    //console.log(reponse);
			    var parser = new DOMParser();
			    xml = parser.parseFromString(reponse["data"],"text/xml");

			    removeAllListenerAudio();

			    //displayTranscription();
			    displayAllTranscription();

			    // Add event listener to the audio element (show dynamically the text)
			    //audio.addEventListener('timeupdate', displayTranscription, false);
			    audio.addEventListener('timeupdate', focusTranscription, false);
			    audio.addEventListener('loadedmetadata', removeAllListenerAudio, false);
			})
			.catch(function (erreur) {
			    // On traite ici les erreurs éventuellement survenues
			    console.log(erreur);
			});
}

/*
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
}*/
/*
function displayTranscription(){
	if(xml != null){
		var duration = audio.currentTime;
		//var result = string_difference(HTMLtranscription.value, XMLtoString_CurrentTime(duration));
		//console.log(result[1]);
		//add_translation(result[1]);

		HTMLtranscription.innerHTML = XMLtoString_CurrentTime(duration);
		HTMLtranscription.scrollTop = HTMLtranscription.scrollHeight;
	}
}*/

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
    	innerHTML = innerHTML.substring(0,index) + "<mark>" + innerHTML.substring(index,index+text.length-1) + "</mark>" + innerHTML.substring(index + text.length-1);
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
	//audio.removeEventListener("timeupdate", displayTranscription, false);
	audio.removeEventListener('timeupdate', focusTranscription, false);
	audio.removeEventListener("loadedmetadata", removeAllListenerAudio, false);
}

function add_playlist(text, id_file, id_process, progress){
	var li = document.createElement("LI");
	var hr = document.createElement("hr");
	var font = document.createElement("font");

	hr.setAttribute('class', 'sidebar-divider');
	li.setAttribute("id_file", id_file);
	li.setAttribute("id_process", id_process);
	li.setAttribute("class", "active sidebar-heading");

	if(progress >= 100){
		var textnode = document.createTextNode(text);
		font.setAttribute("color", "white");
		var a = document.createElement("a");
		a.setAttribute('href', '#');
		a.setAttribute('onClick', 'getXML('+id_file+')');
		font.appendChild(textnode);
		a.appendChild(font);
		li.appendChild(a);
		//li.setAttribute("onclick", getXML(id_file));
	} else {
		var textnode = document.createTextNode(text+"..."+progress+"%");
		font.setAttribute("color", "gray");
		font.appendChild(textnode);
		li.appendChild(font);
	}

	playlist.appendChild(li);
	playlist.appendChild(hr);
}

function remove_all_playlist(){
	while (playlist.firstChild) {
    	playlist.removeChild(playlist.lastChild);
  	}
}

function update_playlist(){
	var url = 'http://lst-demo.univ-lemans.fr:8000/api/v1.1/files';
	axios({
		    url: url,
		    headers: {'Authentication-Token' : token }
			})
			.then(function (reponse) {
			    //On traite la suite une fois la réponse obtenue
			    playlist.innerHTML = "";
			    var dataList =reponse["data"];
			    var all_finished = true;
			    //console.log(dataList);
			    for(var i=0; i<dataList.length; i++){
			    	if(dataList[i]["processes"]["0"]["status"] == "Finished"){
			    		add_playlist(dataList[i]["filename"] ,dataList[i]["processes"]["0"]["file_id"], dataList[i]["processes"]["0"]["id"], 100);
			    	} else {
			    		add_playlist(dataList[i]["filename"] ,dataList[i]["processes"]["0"]["file_id"], dataList[i]["processes"]["0"]["id"], dataList[i]["processes"]["0"]["progress"]);
			    		all_finished = false;
			    	}
			    }
			    if(!all_finished) setTimeout(update_playlist(), 5000);
			})
			.catch(function (erreur) {
			    //On traite ici les erreurs éventuellement survenues
			    console.log(erreur);
			});
}
