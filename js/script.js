// after that loading, we use auto change
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
// 
/* Toggle between adding and removing the "responsive" class to topnav when the user clicks on the icon */
function displayResponsiveNavBarMobile() {
   var x = document.getElementById("myTopnav");
   if (x.className === "topnav") {x.className += " responsive";} 
   else {x.className = "topnav";}
}
/* Function to open fullscreen mode one element */

   let mainDivElementForFullScreen = document.getElementById("mediaElementBox");
   setInterval( () =>{
      mainDivElementForFullScreen = document.getElementById("mediaElementBox");
      // console.log(mainDivElementForFullScreen);
   }, 1000);
   function PlayFullScreen() {
      if (mainDivElementForFullScreen.requestFullscreen) {
         mainDivElementForFullScreen.requestFullscreen();
      } else if (mainDivElementForFullScreen.webkitRequestFullscreen) { /* Safari browser*/
      mainDivElementForFullScreen.webkitRequestFullscreen();
      } else if (mainDivElementForFullScreen.msRequestFullscreen) { /* IE11 browser*/
      mainDivElementForFullScreen.msRequestFullscreen();
      }
   }
let timeForMediaElement = 1000; //get it from json file later
   setInterval( () =>{}, timeForMediaElement);