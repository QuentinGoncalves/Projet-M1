# Projet-M1
Tout automatique

# Google Drive
https://drive.google.com/drive/folders/1r1N7ISgXdYj7wDRFbvd1C8fN2qxj8MId?usp=sharing

# Token API
WyIxOSIsImRjODIxMDExZDBkYjY0YmNiZjZjNmIzZDQzODZhOTQwIl0.EJuXlQ.OklXCA0YMZTkQaza_ApdLZZ5itw

# Mail du prof
Ce qui serait bien, c'est d'avoir quelque chose de modulable et de paramétrable.

Pour la partie streaming en utilisant un microphone, vous pouvez vous inspirer de https://kaljurand.github.io/dictate.js/

L'adresse du serveur de transcription kaldi gstreamer est :
Anglais :
ws://lst-demo.univ-lemans.fr:8889

Francais :
ws://lst-demo.univ-lemans.fr:8888

Pour envoyer de l'audio en streaming autre que celui provenant du microphone, à vous de chercher comment faire ...

Le serveur de synthèse vocale fonctionne sur le même modèle que le serveur de transcription, sur le port 9999 :
ws://lst-demo.univ-lemans.fr:9999

Pour récupérer les status (nb workers) :
ws://lst-demo.univ-lemans.fr:8889/client/ws/status
ws://lst-demo.univ-lemans.fr:8888/client/ws/status
ws://lst-demo.univ-lemans.fr:9999/client/ws/status

URL pour envoyer de l'audio au système de transcription :
ws://lst-demo.univ-lemans.fr:8889/client/ws/speech
ws://lst-demo.univ-lemans.fr:8888/client/ws/speech
ws://lst-demo.univ-lemans.fr:9999/client/ws/synth


Pour la traduction anglais vers français:
http://lst-demo.univ-lemans.fr:8083/translate?q="+encodeURIComponent(texte)+"&source=en&target=fr&key=bla";


Pour envoyer des documents en transcription (pas streaming), je vous ai créé un compte sur le serveur :

Serveur : http://lst-demo.univ-lemans.fr:8000
Login : Quentin.Goncalves.Etu@univ-lemans.fr
mot de passe : projetM1

Votre [API Token] que vous pouvez retrouver sur votre compte :
WyIxOSIsImRjODIxMDExZDBkYjY0YmNiZjZjNmIzZDQzODZhOTQwIl0.EJs66g.5qnm6VETk7EqY3ubO3SMgW-4gmQ


Vous avez accès à l'API depuis la page d'accueil de votre compte.

Voici les commandes principales :

Lancer le décodage du fichier 7391_100634757021149753580.wav :

curl 'http://lst-demo.univ-lemans.fr:8000/api/v1.1/files' -i -X POST -F file=@7391_100634757021149753580.wav -F content='{"start": true, "asr_model_name": "french.studio.fr_FR"}' -H 'Authentication-Token: [API Token]'

En retour vous aurez :

{
 "created_at": "12-01-2018 15:35:02",
 "duration": 120,
 "filename": "7391_100634757021149753580.wav",
 "generated_filename": "7391_100634757021149753580_b3a3e4f2_9cb9_4af7_99f0_a4857741e472.wav",
 "id": 8,
 "processes": [
   {
     "api_version": "v1.1",
     "asr_model_name": "french.studio.fr_FR",
     "duration": null,
     "file_id": 8,
     "file_name": "7391_100634757021149753580_b3a3e4f2_9cb9_4af7_99f0_a4857741e472.wav",
     "id": 9,
     "progress": 0,
     "status": "Queued",
     "status_id": 1,
     "transcription_auto_name": null,
     "transcription_id": null,
     "transcription_ref_name": null,
     "type": "Transcription with custom model",
     "type_id": 5
   }
 ],
 "size": 10584044,
 "size_human": "10M",
 "status": 1,
 "timestamp": 1515771302,
 "user_id": 4
}

"id" : 8 correspond l'id du fichier envoyé
"id" : 9 correspond à l'id du process de décodage

Pour connaitre l'avancement du décodage :

curl 'http://lst-demo.univ-lemans.fr:8000/api/v1.1/processes/9' -H 'Authentication-Token:[API Token]'


{
 "api_version": "v1.1",
 "asr_model_name": "french.studio.fr_FR",
 "duration": null,
 "file_id": 8,
 "file_name": "7391_100634757021149753580_b3a3e4f2_9cb9_4af7_99f0_a4857741e472.wav",
 "id": 9,
 "progress": 97,
 "status": "Started",
 "status_id": 2,
 "transcription_auto_name": null,
 "transcription_id": null,
 "transcription_ref_name": null,
 "type": "Transcription with custom model",
 "type_id": 5
}

Là le décodage est fait à 97%.

{
 "api_version": "v1.1",
 "asr_model_name": "french.studio.fr_FR",
 "duration": 154,
 "file_id": 8,
 "file_name": "7391_100634757021149753580_b3a3e4f2_9cb9_4af7_99f0_a4857741e472.wav",
 "id": 9,
 "progress": 100,
 "status": "Finished",
 "status_id": 5,
 "transcription_auto_name": null,
 "transcription_id": null,
 "transcription_ref_name": null,
 "type": "Transcription with custom model",
 "type_id": 5
}

Puis terminé.

Pour récupérer la transcription, utiliser l'identifiant du fichier (8) :

curl 'http://lst-demo.univ-lemans.fr:8000/api/v1.1/files/8/transcription?format=xml'  -H 'Authentication-Token: [API Token]'

Vous récupérez la transcription au format xml en retour.

Supprimer un fichier (décodage) du serveur :

curl 'http://lst-demo.univ-lemans.fr:8000/api/v1.1/files/8' -X DELETE  -H 'Authentication-Token: [API Token]'

Supprimer un process qui n'a pas encore commencé :

curl 'http://lst-demo.univ-lemans.fr:8000/api/v1.1/processes/9' -X DELETE  -H 'Authentication-Token: [API Token]'

Avoir la liste des fichiers et de leur état sur le serveur :

curl 'http://lst-demo.univ-lemans.fr:8000/api/v1.1/files'  -H 'Authentication-Token: [API Token]'
