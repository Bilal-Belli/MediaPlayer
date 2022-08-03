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
 http.open('get', 'data.json', true);
 http.send();
 http.onload = function(){
    if(this.readyState == 4 && this.status == 200){
       let mediaS = JSON.parse(this.responseText);
       let output = "";
       for(let item of mediaS){
          if (isImage(getExtension(item.mediaSource))){ //the is an image
             output += `
             <div class="list ">
                <img src="${item.mediaSource}" class="list-video">
                <h3 class="list-title">${item.mediaTitle}</h3>
             </div>
             `;
          } else {
             output += `
             <div class="list ">
                <video src="${item.mediaSource}" class="list-video"></video>
                <h3 class="list-title">${item.mediaTitle}</h3>
             </div>
             `;
          }
       }
       document.querySelector(".video-list-container").innerHTML = output;
    }
 }