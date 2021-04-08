// This example uses MediaRecorder to record from a live audio stream,
// and uses the resulting blob as a source for an audio element.
//
// The relevant functions in use are:
//
// navigator.mediaDevices.getUserMedia -> to get audio stream from microphone
// MediaRecorder (constructor) -> create MediaRecorder instance for a stream
// MediaRecorder.ondataavailable -> event to listen to when the recording is ready
// MediaRecorder.start -> start recording
// MediaRecorder.stop -> stop recording (this will generate a blob of data)
// URL.createObjectURL -> to create a URL from a blob, which we can use as audio src

var recordButton, stopButton, recorder;

window.onload = function () {
  recordButton = document.getElementById('recordButton');
  stopButton = document.getElementById('stopButton');

  // get audio stream from user's mic
  navigator.mediaDevices.getUserMedia({
    audio: true
  })
  .then(function (stream) {
    recordButton.disabled = false;
    recordButton.addEventListener('click', startRecording);
    stopButton.addEventListener('click', stopRecording);
    recorder = new MediaRecorder(stream);

    // listen to dataavailable, which gets triggered whenever we have
    // an audio blob available
    recorder.addEventListener('dataavailable', onRecordingReady);
  });
};

function startRecording() {
  recordButton.disabled = true;
  stopButton.disabled = false;

  recorder.start();
}

function stopRecording() {
  recordButton.disabled = false;
  stopButton.disabled = true;

  // Stopping the recorder will eventually trigger the `dataavailable` event and we can complete the recording process
  recorder.stop();
}

function onRecordingReady(e) {
  var audio = document.getElementById('audio');
  // e.data contains a blob representing the recording
  audio.src = URL.createObjectURL(e.data);
  // audio.play();
  // update download and uplaod links

  var filename = new Date().toISOString();
	filename = filename.concat("_" + document.getElementById("bpmOutput").innerHTML + "BPM");

  var downLink = document.getElementById("downloadLink");
  var upLink = document.getElementById("uploadLink");

  // create download and upload links
  downLink.href = audio.src;
	downLink.download = filename+".mp3"; //download forces the browser to donwload the file using the  filename
	downLink.innerHTML = "Save to disk";

  upLink.href="#";
	upLink.innerHTML = "Upload";
	upLink.addEventListener("click", function(event){
		  var xhr=new XMLHttpRequest();
		  xhr.onload=function(e) {
		      if(this.readyState === 4) {
		          console.log("Server returned: ",e.target.responseText);
		      }
		  };
		  var fd=new FormData();
		  fd.append("audio_data", e.data, filename);
		  xhr.open("POST","upload.php",true);
		  xhr.send(fd);
	})
}
