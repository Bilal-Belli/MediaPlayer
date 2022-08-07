// After that loading, we use auto change
setInterval( () =>{let videoList = document.querySelectorAll('.video-list-container .list');

videoList.forEach(vid =>{
   vid.onclick = () =>{
      videoList.forEach(remove =>{remove.classList.remove('active')});
      vid.classList.add('active');
      let src = vid.querySelector('.list-video').src;
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
let lastPlayOrder = 0;
let indicatorForFull = false;
let numberOfElementsToPlay = 5;//to change later
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
   for (indexForCall=0;indexForCall<numberOfElementsToPlay;indexForCall++){
      callL();
      await sleep(timeForMediaElement);
   }
}

async function repeatedLoop() {
      finish = false;
      let http = new XMLHttpRequest();
      http.open('get', 'data.json', true);
      http.send();
      http.onload = function(){
         if(this.readyState == 4 && this.status == 200){
            let mediaS = JSON.parse(this.responseText);
            let outputMain = "";
            for(let item of mediaS){
               if ((lastPlayOrder == item.order) && isImage(getExtension(item.mediaSource))){
                  outputMain += `
                  <div id="box"> 
                     <img src="${item.mediaSource}" loop controls id="mediaElementBox" class="main-video"> 
                  </div>
                  <div id="mainTitleDivId">
                     <h3 class="main-vid-title">${item.mediaTitle}</h3>
                  </div>
                  `;
                  break;
               } else { if ((lastPlayOrder == item.order)){
                  outputMain += `
                  <div id="box"> 
                     <video src="${item.mediaSource}" loop controls id="mediaElementBox" class="main-video"></video> 
                  </div>
                  <div id="mainTitleDivId">
                     <h3 class="main-vid-title">${item.mediaTitle}</h3>
                  </div>
                     `;
                  break;
               }
               }
            }
            document.querySelector('.main-video-container').innerHTML = outputMain;
            timeForMediaElement = getDuration() * 1000;
            // console.log(timeForMediaElement);
         }
      } 
}

async function callL(){
   if (indicatorForFull == true && finish==true){
      finish = false;
      repeatedLoop();
      lastPlayOrder++;
      finish = true;   
   }
}

function sleep(ms) {
   return new Promise(resolve => setTimeout(resolve, ms));
}

document.addEventListener('keyup', (e) => {
   if (e.code === "Escape" && indicatorForFull == true)  {indicatorForFull = false; console.log("indicatorForFull returned to false");}
 });