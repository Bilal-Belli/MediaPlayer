   // check file type image or video
   function isFileImage(file) {
      return file && file['type']. split('/')[0] === 'image';
      }
   function getExtension(filename) {
         var parts = filename.split('.');
         return parts[parts.length - 1];
      }
   function isImage(filename) {
         var ext = getExtension(filename);
         switch (ext.toLowerCase()) {
            case 'jpg':
            case 'gif':
            case 'bmp':
            case 'png':
            return true;
         }
         return false;
      }
   // call and fetch json file
   let http = new XMLHttpRequest();
   http.open('get', '/public/data.json', true);
   http.send();
   http.onload = function(){
      if(this.readyState == 4 && this.status == 200){
         let mediaS = JSON.parse(this.responseText);
         let outputList = "";
         let outputMain = "";
         let i=0;
         for(let item of mediaS){
            i++;
            if (isImage(getExtension(item.mediaSource))){ //is an image
               outputList += `
               <div class="list ">
                  <img src="${item.mediaSource}" class="list-video">
                  <h3 class="list-title">${item.mediaTitle}</h3>
               </div>
               `;
               if (i==1){
                  outputMain += `
                     <div id="box"> 
                        <img src="${item.mediaSource}" loop controls id="mediaElementBox" height="412" class="main-video"> 
                     </div>
                     <div id="mainTitleDivId">
                        <h3 class="main-vid-title">${item.mediaTitle}</h3>
                     </div>
                     `;
                  document.getElementById("titleEntry").value = item.mediaTitle;
                  document.getElementById("orderEntry").value = item.order;
                  document.getElementById("timeEntry").value = item.playtime;
               }
            } else { //is a video
               outputList += `
               <div class="list ">
                  <video src="${item.mediaSource}" class="list-video"></video>
                  <h3 class="list-title">${item.mediaTitle}</h3>
               </div>
               `;
               if (i==1){
                  outputMain += `
                  <div id="box"> 
                     <video src="${item.mediaSource}" loop controls id="mediaElementBox" height="412" class="main-video"></video> 
                  </div>
                  <div id="mainTitleDivId">
                     <h3 class="main-vid-title">${item.mediaTitle}</h3>
                  </div>
                     `;
                  document.getElementById("titleEntry").value = item.mediaTitle;
                  document.getElementById("orderEntry").value = item.order;
                  document.getElementById("timeEntry").value = item.playtime;
               }
            }
         }
         document.querySelector(".video-list-container").innerHTML = outputList;
         document.querySelector('.main-video-container').innerHTML = outputMain;
      }
   }