
var numWS;
var server;
var serverStatus;

server = $("#ChoixSortie").val().split('|')[0];
serverStatus = $("#ChoixSortie").val().split('|')[1];

console.log(serverStatus);

function worker(){
  var frSynth = new WebSocket(serverStatus);
  frSynth.onmessage = function (event) {
      numWS = event.data.split(",")[0].split(":")[1].replace(/ /g,"");
  }
}

worker();

var tabGain = [];

function synthese(texte){
     if(numWS>0){
       console.log("Worker syntheses ok ...");
       var contentType = "content-type=audio/x-raw, layout=(string)interleaved, rate=(int)%d, format=(string)S16LE, channels=(int)1";
       var url = server+"?"+contentType;
       wsSynth = new WebSocket(url);
       myconvstring="";

       wsSynth.onmessage = function(e) {
         var data = e.data;
         var res = JSON.parse(data);

         if(res.data){

           if(res.data == "EOS"){
             var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
             var source = audioCtx.createBufferSource();
             audioCtx.suspend();
             ctxs.push(audioCtx);
             var byteNumbers = new Array(myconvstring.length);
             for (var i = 0; i < myconvstring.length; i++) {
               byteNumbers[i] = myconvstring.charCodeAt(i);
             }
             mybuffer = new Uint8Array(byteNumbers).buffer;
             audioCtx.decodeAudioData(mybuffer, function(buffer) {
               source.buffer = buffer;
               totDuration = source.buffer.duration;
               var gainNode = audioCtx.createGain();
               gainNode.connect(audioCtx.destination);
               source.connect(gainNode);
               //source.connect(audioCtx.destination);
               tabGain.push(gainNode);
               tabSources.push(source);
               tabDuration.push(totDuration);
               console.log("Synthese prete :"+texte);

               //source.start(audioCtx.currentTime+offset,0,totDuration);
               //source.start();
             },

             function(e){ console.log("Error with decoding audio data" + e.err); });
             myconvstring="";
             audioCtx.onstatechange = function() {
               console.log("SATE CHANGED:"+audioCtx.state);
             }
           }
           else{
             data = atob(res.data);
             myconvstring += data;
           }

         }
         else{
           console.log(res);
         }

       }

       // Start recording only if the socket becomes open
       wsSynth.onopen = function(e) {
         // Start recording
         var msg = {
           type: "message",
           text: texte,
         };
         wsSynth.send(JSON.stringify(msg));
       };

       wsSynth.onclose = function(e) {
       };

       wsSynth.onerror = function(e) {
         var data = e.data;
         console.log(data);
       }
     }
     else{
       console.log("pas de worker synthese dispo ...");
     }
}
