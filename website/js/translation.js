var HTMLtranslation = document.getElementById('form21');

function add_translation(text){
	//text = "hello";
	let formData = new FormData();
	var url = 'http://lst-demo.univ-lemans.fr:8083/translate?q=%22+encodeURIComponent('+ text +')+%22&source=en&target=fr&key=bla';
	var translated = "";
	if(text != "" && text != undefined){
		axios.get(url, formData, {
			})
			.then(function (response) {
				// Save file id and process id
				var list = response['data']['data']['translations'];
				var string = list[0]['translatedTextRaw'];
				var tab = string.split('"');
				translated = tab[(tab.length-1)].replace(/&|nbsp|;|!|"|[{()}]/g,"") + " ";
				while(translated.charAt(0) == " "){
					translated = translated.substring(1);
				}
				HTMLtranslation.value = HTMLtranslation.value + translated;
			  })
			  .catch(function (error) {
			    console.log(error);
			  });
	}
	//console.log(translated);
	//return translated;
}

// Retourne la difference entre deux string
function string_difference(oldString, newString){
	var same = ""
	var difference = ""

	var oldChar = oldString.split(" ");
	var newChar = newString.split(" ");

	var i = 0;
	var index = 0;

	while((oldChar[i] == newChar[i]) && i < oldChar.length && oldChar[i] != undefined && newChar[i] != undefined){
		same = same + oldChar[i] + " ";
		index = index + oldChar[i].length + 1;
		i = i + 1;
	}

	for (var j = i; j < newChar.length; j++) {
		difference = difference + newChar[j] + " ";
	}

	return [same, difference, index];
}