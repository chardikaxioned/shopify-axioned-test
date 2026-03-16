 var videos =  document.querySelectorAll(".play-video")
 var closevideos =  document.querySelectorAll(".close-video")

 
closevideos.forEach(function(btn){
  btn.addEventListener("click",function(e){
    
  btn.closest(".video-ratio").style.display = "none" 
var src =  btn.closest(".video-ratio").lastElementChild.getAttribute("src");
  btn.closest(".video-ratio").lastElementChild.setAttribute("src",src)
    
  })

})


 
 
videos.forEach(function(btn){
  btn.addEventListener("click",function(e){
    
  btn.closest(".video--parent").nextElementSibling.style.display = "block"  
  })

})