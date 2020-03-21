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
var workers = document.getElementById("workersStatut");

browser.addEventListener('change', add_file);
//browser.addEventListener('change', save_file);
HTMLtranscription.style.overflow = "auto";
//HTMLtranscription.style.height = "auto";

update_playlist();
update_workers();

function save_file(id_file){
	file = browser.files[0];
	let formData = new FormData();
	formData.append('file', file);
	formData.append('name', id_file);

	axios.post('save.php', formData, {
	})
	.then(function (response) {
		console.log(response);
	})
	.catch(function (error) {
		console.log(error);
	});	
}

function delete_file(id_file){
	let formData = new FormData();
	formData.append('id', id_file);

	axios.post('delete.php', formData, {
	})
	.then(function (response) {
		console.log(response);
	})
	.catch(function (error) {
		console.log(error);
	});	
}

function add_file() {

	file = browser.files[0];
	if(validFileType(file)){

		if(inputType.options[inputType.selectedIndex].text == "Streaming"){

			var blob = window.URL || window.webkitURL;
			if (!blob) {
					console.log('Your browser does not support Blob URLs :(');
					return;
			}
			fileURL = blob.createObjectURL(file);
			audio.src = fileURL;
			audio.load();

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
			    save_file(id_file);
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

function deleteFileAPI(id_file){
	var url = 'http://lst-demo.univ-lemans.fr:8000/api/v1.1/files/'+id_file;
	axios.delete(url, {
		    headers: {'Authentication-Token' : token}
			})
			.then(function (reponse) {
			    //On traite la suite une fois la réponse obtenue
			    //console.log(reponse);
			    update_playlist();
			    delete_file(id_file);
			    removeAllListenerAudio();
			    audio.src="";
			})
			.catch(function (erreur) {
			    // On traite ici les erreurs éventuellement survenues
			    console.log(erreur);
			});
}

// Get the XML with the id file
function getXML(id_file){
	var url = 'http://lst-demo.univ-lemans.fr:8000/api/v1.1/files/'+id_file+'/transcription?format=xml';
	axios({
		    url: url,
		    headers: {'Authentication-Token' : token}
			})
			.then(function (reponse) {
			    //On traite la suite une fois la réponse obtenue
			    removeAllListenerAudio();

			    var parser = new DOMParser();
			    xml = parser.parseFromString(reponse["data"],"text/xml");
		
			    audio.src = "audio/" + id_file + ".mp3";
			    audio.load();

			    displayTranscription();
			    //displayAllTranscription();

			    audio.addEventListener('timeupdate', displayTranscription, false);
				//audio.addEventListener('timeupdate', focusTranscription, false);
				sleep(300).then(() => {audio.addEventListener('loadedmetadata', removeAllListenerAudio, false); });
			    
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
	audio.removeEventListener("timeupdate", displayTranscription, false);
	//audio.removeEventListener('timeupdate', focusTranscription, false);
	audio.removeEventListener("loadedmetadata", removeAllListenerAudio, false);
}

function add_playlist(text, date, id_file, id_process, progress){
	var li = document.createElement("LI");
	var acronym = document.createElement("acronym");
	var br = document.createElement("br");
	var hr = document.createElement("hr");
	var font = document.createElement("font");
	var font_delete = document.createElement("font");
	var a = document.createElement("a");
	var a_delete = document.createElement("a");
	var text_delete = document.createTextNode("x");

	hr.setAttribute('class', 'sidebar-divider');

	acronym.setAttribute('title', text);
	acronym.style.textDecoration = "none";

	li.setAttribute("id_file", id_file);
	li.setAttribute("id_process", id_process);
	li.setAttribute("class", "active sidebar-heading");

	font.setAttribute("color", "white");
	font_delete.setAttribute("color", "red");

	a.setAttribute('href', '#');
	a.setAttribute('onClick', 'getXML('+id_file+')');

	a_delete.setAttribute('href', '#');
	a_delete.setAttribute('onClick', 'deleteFileAPI('+id_file+')');
	a_delete.setAttribute('id', 'delete'+id_file);
	a_delete.style.float = "right";
	a_delete.style.display = "none";
	a_delete.style.textDecoration = "none";

	font_delete.appendChild(text_delete);
	a_delete.appendChild(font_delete);

	text = text.split(".")[0];
	if(text.length > 15){
		text = text.substring(0,15) + "...";
	}

	var textnode = document.createTextNode(text);

	if(progress < 100){
		li.style.pointerEvents = "none";
    	li.style.opacity = "0.5";
		textnode = document.createTextNode(text+"..."+progress+"%");
	} else {
		li.appendChild(a_delete);
		li.setAttribute('onmouseover', "document.getElementById('delete"+id_file+"').style.display = 'block';");
		li.setAttribute('onmouseout', "document.getElementById('delete"+id_file+"').style.display = 'none';");
	}

	var date = document.createTextNode(date);
	acronym.appendChild(textnode);
	font.appendChild(acronym);
	font.appendChild(br);
	a.appendChild(font);
	li.appendChild(a);
	li.appendChild(br);
	li.appendChild(date);

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
			    console.log(dataList);
			    for(var i=0; i<dataList.length; i++){
			    	if(dataList[i]["processes"]["0"] != undefined){
				    	if(dataList[i]["processes"]["0"]["status"] == "Finished"){
				    		add_playlist(dataList[i]["filename"],dataList[i]["created_at"] ,dataList[i]["processes"]["0"]["file_id"], dataList[i]["processes"]["0"]["id"], 100);
				    	} else {
				    		add_playlist(dataList[i]["filename"],dataList[i]["created_at"] ,dataList[i]["processes"]["0"]["file_id"], dataList[i]["processes"]["0"]["id"], dataList[i]["processes"]["0"]["progress"]);
				    		all_finished = false;
				    	}
			    	}
			    }
			    if(!all_finished) setTimeout(update_playlist(), 50000);
			})
			.catch(function (erreur) {
			    //On traite ici les erreurs éventuellement survenues
			    console.log(erreur);
			});
}

function update_workers(){
	var frTrans = new WebSocket(document.getElementById('servers').options[0].value.split('|')[1]);
	frTrans.onmessage = function (event) {
  		document.getElementById("WSTransFR").innerHTML = event.data.split(",")[0].split(":")[1].replace(/ /g,"");
	}
	var enTrans = new WebSocket(document.getElementById('servers').options[1].value.split('|')[1]);
	enTrans.onmessage = function (event) {
  		document.getElementById("WSTransEN").innerHTML = event.data.split(",")[0].split(":")[1].replace(/ /g,"");
	}
	var frSynth = new WebSocket(document.getElementById('ChoixSortie').options[0].value.split('|')[1]);
	frSynth.onmessage = function (event) {
  		document.getElementById("WSSynthFR").innerHTML = event.data.split(",")[0].split(":")[1].replace(/ /g,"");
	}
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
