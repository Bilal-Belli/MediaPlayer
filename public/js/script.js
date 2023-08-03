let src;

// After that loading, we use auto change
setInterval( () =>{let videoList = document.querySelectorAll('.video-list-container .list');

videoList.forEach(vid =>{
   vid.onclick = () =>{
      videoList.forEach(remove =>{remove.classList.remove('active')});
      vid.classList.add('active');
      src = vid.querySelector('.list-video').src;
      let title = vid.querySelector('.list-title').innerHTML;
      if (vid.querySelector('.list-video').tagName == "IMG"){
         document.getElementById('mediaElementBox').remove();
         const imageRender = document.createElement('img');
         imageRender.src = src;
         imageRender.id = 'mediaElementBox';
         imageRender.controls = true; 
         imageRender.height= 412;
         imageRender.classList.add('main-video');
         const box = document.getElementById('box');
         box.appendChild(imageRender);

         let http = new XMLHttpRequest();
         http.open('get', '/public/data.json', true);
         http.send();
         http.onload = function(){
            if(this.readyState == 4 && this.status == 200){
               let mediaS = JSON.parse(this.responseText);
               for(let item of mediaS){
                  if (src.replace(/^.*[\\\/]/, '') === item.mediaSource.replace(/^.*[\\\/]/, '')){
                     document.getElementById("titleEntry").value = item.mediaTitle;
                     document.getElementById("orderEntry").value = item.order;
                     document.getElementById("timeEntry").value = item.playtime;
                     break;
                  }
               }}}
      }
      else {
         document.getElementById('mediaElementBox').remove();
         const videoRender = document.createElement('video');
         videoRender.src = src;
         videoRender.id = 'mediaElementBox';
         videoRender.controls = true; 
         videoRender.height= 412;
         videoRender.classList.add('main-video');
         const box = document.getElementById('box');
         box.appendChild(videoRender);

         let http = new XMLHttpRequest();
         http.open('get', '/public/data.json', true);
         http.send();
         http.onload = function(){
            if(this.readyState == 4 && this.status == 200){
               let mediaS = JSON.parse(this.responseText);
               for(let item of mediaS){
                  if (src.replace(/^.*[\\\/]/, '') === item.mediaSource.replace(/^.*[\\\/]/, '')){
                     document.getElementById("titleEntry").value = item.mediaTitle;
                     document.getElementById("orderEntry").value = item.order;
                     document.getElementById("timeEntry").value = item.playtime;
                     break;
                  }
               }
            }
         }
      }
      document.querySelector('.main-video-container .main-vid-title').innerHTML = title;
      // document.querySelector('.main-video-container .main-video').play();
   };
})}, 1);

/* Responsive class to topnav clicks on the icon */
function displayResponsiveNavBarMobile() {
   var x = document.getElementById("myTopnav");
   if (x.className === "topnav") {x.className += " responsive";} 
   else {x.className = "topnav";}
}

/* Function to open fullscreen mode one element */
let timeForMediaElement = Number(1000);
let vidDur = Number();
let finish = true;
let indicatorForFull = false;
let mainDivElementForFullScreen = document.getElementById("mediaMainDiv");

setInterval( () =>{
   // refrech if the main element is changed or order has been changed
   mainDivElementForFullScreen = document.getElementById("mediaMainDiv");}, 1000);

function getDuration(){
   let videoName = document.getElementById("mediaElementBox");
   videoName.onloadedmetadata = function() {
   vidDur = Math.floor(videoName.duration) + 2;
   }
   return vidDur;
}

async function PlayFullScreen() {
   if (mainDivElementForFullScreen.requestFullscreen) {
      mainDivElementForFullScreen.requestFullscreen();
   } else if (mainDivElementForFullScreen.webkitRequestFullscreen) { /* Safari browser*/
      mainDivElementForFullScreen.webkitRequestFullscreen();
   } else if (mainDivElementForFullScreen.msRequestFullscreen) { /* IE11 browser*/
      mainDivElementForFullScreen.msRequestFullscreen();
   };
   if(indicatorForFull == false){
      indicatorForFull = true;
   }
   let http = new XMLHttpRequest();
   http.open('get', '/public/data.json', true);
   http.send();
   http.onload = async function () {
      if (this.readyState == 4 && this.status == 200) {
         let mediaS = JSON.parse(this.responseText);

         mediaS.sort((a, b) => parseInt(a.order) - parseInt(b.order));
         // Loop through the elements and play each with the correct duration
         for (let indexForCall = 0; indexForCall < mediaS.length; indexForCall++) {
         if (indicatorForFull === false) {
            break; // Stop the loop if indicatorForFull is false
         }

         let mediaElement = mediaS[indexForCall];
         let isImageMedia = isImage(getExtension(mediaElement.mediaSource));
         let timeForMediaElement = mediaElement.playtime * 1000; // Convert playtime to milliseconds

         callL(mediaElement, isImageMedia, timeForMediaElement);
         await sleep(timeForMediaElement);
         }
      }
   };
}

async function repeatedLoop(mediaElement, isImageMedia, timeForMediaElement) {
   let outputMain = "";
   if (isImageMedia) {
      outputMain += `
         <div id="box" class="media-container"> 
            <img src="${mediaElement.mediaSource}" loop controls id="mediaElementBox" class="main-media main-image"> 
         </div>
         <div id="mainTitleDivId">
            <h3 class="main-vid-title">${mediaElement.mediaTitle}</h3>
         </div>
      `;
   } else {
      outputMain += `
         <div id="box" class="media-container"> 
            <video src="${mediaElement.mediaSource}" loop autoplay controls id="mediaElementBox" class="main-media main-video"></video> 
         </div>
         <div id="mainTitleDivId">
            <h3 class="main-vid-title">${mediaElement.mediaTitle}</h3>
         </div>
      `;
   }
   document.querySelector('.main-video-container').innerHTML = outputMain;
   timeForMediaElement = mediaElement.playtime * 1000;
   // console.log(timeForMediaElement);
}


async function callL(mediaElement, isImageMedia, timeForMediaElement){
   if (indicatorForFull == true && finish == true) {
      finish = false;
      repeatedLoop(mediaElement, isImageMedia, timeForMediaElement);
      finish = true;
   }
}

function sleep(ms) {
   return new Promise(resolve => setTimeout(resolve, ms));
}

document.addEventListener('fullscreenchange', (e) => {
   if (!document.fullscreenElement && indicatorForFull === true) {
      indicatorForFull = false;
      console.log("indicatorForFull returned to false");
      window.location.reload(); // Reload the page after changes are saved.
   }
});

function saveChangesOnJSON(){
   let http = new XMLHttpRequest();
   http.open('get', '/public/data.json', true);
   http.send();
   http.onload = function(){
      if(this.readyState == 4 && this.status == 200){
         let mediaS = JSON.parse(this.responseText);
         for(let item of mediaS){
            if (src.replace(/^.*[\\\/]/, '') === item.mediaSource.replace(/^.*[\\\/]/, '')){
               item.mediaTitle = document.getElementById("titleEntry").value;
               item.order = document.getElementById("orderEntry").value ;
               item.playtime = document.getElementById("timeEntry").value;
               break;
            }
         }
         // Send the modified data back to the server for writing.
         let updatedJSON = JSON.stringify(mediaS);
         let httpPost = new XMLHttpRequest();
         httpPost.open('POST', '/saveData', true); // Route to handle the saving of data in Node.js.
         httpPost.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
         httpPost.send(updatedJSON);
         httpPost.onload = function() {
            if (this.readyState == 4 && this.status == 200) {
               console.log('Changes saved successfully.');
               window.location.reload(); // Reload the page after changes are saved.
            } else {
               console.error('Error saving changes:', this.status);
            }
         };
      }
   }
}

function uploadMedia() {
   document.getElementById("file-input").click();
   let fileInput = document.getElementById("file-input");
   fileInput.addEventListener("change", function () {
      let selectedFiles = this.files;
      if (selectedFiles.length > 0) {
         for (let i = 0; i < selectedFiles.length; i++) {
               let selectedFile = selectedFiles[i];
               let mediaSource = `/public/media/${selectedFile.name}`;
               let mediaTitle = selectedFile.name.split(".")[0];
               let order = "10";
               let playtime = "5";
               let jsonObject = {
                  mediaSource: mediaSource,
                  mediaTitle: mediaTitle,
                  order: order,
                  playtime: playtime
               };
               const httpPost = new XMLHttpRequest();
               httpPost.open("POST", "/saveNewData", true);
               httpPost.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
               httpPost.onload = function () {
                  if (this.readyState === 4 && this.status === 200) {
                     console.log("Changes saved successfully.");
                     copyFile(selectedFile);
                  } else {
                     console.error("Error saving changes:", this.status);
                  }
               };
               httpPost.send(JSON.stringify(jsonObject));
         }
      }
   });
}

function copyFile(file) {
   const formData = new FormData();
   formData.append("file", file);
   const xhr = new XMLHttpRequest();
   xhr.open("POST", "/copyFile", true);
   xhr.onload = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
         console.log("File copied successfully.");
         window.location.reload();
      } else {
         console.error("Error copying file:", xhr.status);
      }
   };
   xhr.send(formData);
}