function animate(){
    let footerContent = document.querySelector("footer > div");
    if (footerContent.classList.contains("hidden")){
        document.querySelector("main").style.minHeight = window.innerHeight - document.querySelector("header").offsetHeight + "px";
    }
    else {
        document.querySelector("main").style.minHeight = window.innerHeight - document.querySelector("header").offsetHeight + document.querySelector("footer").offsetHeight  + "px";
    }

    window.requestAnimationFrame(animate);
}
animate();