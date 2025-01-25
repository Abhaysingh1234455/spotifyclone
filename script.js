function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}


let currentsong = new Audio();
let songs;
let currFolder;

async function getsongs(folder){
    currFolder = folder;
    let a = await fetch(`http://127.0.0.1:3000/project%202%20spotify%20clone/${currFolder}/`)
    let response = await a.text();
    // console.log(response)
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    songs=[]
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3")){
           songs.push(element.href.split(`/${currFolder}/`)[1])
        }
    }
    
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""
        for (const song of songs) {
            songUL.innerHTML = songUL.innerHTML + 
            `<li> <img src="img/music.svg" alt="">
                    <div class="info">
                         <div>${song.replaceAll("%20"," ")}</div> 
                    </div>
                 <div class="playnow"> <span>play now </span><img src="img/play.svg" alt="">
            </div>                  
        </li>`;
}

// attach an event listner to each song 
Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
    e.addEventListener("click", element=>{
        console.log(e.querySelector(".info").firstElementChild.innerHTML)
        playMusic(e.querySelector(".info").firstElementChild.innerHTML)
    })
})
}

const playMusic = (track,pause=false)=>{
    // let audio = new Audio("/project%202%20spotify%20clone/songs/" + track)
    currentsong.src= `/project%202%20spotify%20clone/${currFolder}/` + track
    if(!pause){
        currentsong.play()
        play.src = "img/pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00/00:00"
}


// async function displayAlbums() {
//     console.log("displaying albums")
//     let a = await fetch(`/project%202%20spotify%20clone/songs/`)
//     let response = await a.text();
//     let div = document.createElement("div")
//     div.innerHTML = response;
//     let anchors = div.getElementsByTagName("a")
//     let cardContainer = document.querySelector(".cardContainer")
//     let array = Array.from(anchors)
//     for (let index = 0; index < array.length; index++) {
//         const e = array[index]; 
//         if (e.href.includes("/project%202%20spotify%20clone/songs/") && !e.href.includes(".htaccess")) {
//             let folder = e.href.split("/").slice(-2)[0]
//             // Get the metadata of the folder
//             let a = await fetch(`/project%202%20spotify%20clone/songs/${folder}/info.json`);
//             let response = await a.json(); 
//             cardContainer.innerHTML = cardContainer.innerHTML + ` <div data-folder="${folder}" class="card">
//             <div class="play">
//                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
//                     xmlns="http://www.w3.org/2000/svg">
//                     <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" fill="#000" stroke-width="1.5"
//                         stroke-linejoin="round" />
//                 </svg>
//             </div>

//             <img src="/project%202%20spotify%20clone/songs/${folder}/cover.jpg" alt="">
//             <h2>${response.title}</h2>
//             <p>${response.discription}</p>
//         </div>`
//         }
//     }}

 

async function main(){
 await getsongs("songs/Bollywood");
playMusic(songs[0],true)
console.log(songs)

 // Display all the albums on the page
//  await displayAlbums()

//attach event listner to play,prev,next
play.addEventListener("click" , ()=>{
    if(currentsong.paused){
        currentsong.play();
        play.src = "img/pause.svg";
    }
    else{
        currentsong.pause();
        play.src = "img/play.svg";
        }
})

// set duration and current time of the song
currentsong.addEventListener("timeupdate", () => {
// console.log(currentsong.currentTime , currentsong.duration);
document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentsong.currentTime)}/${secondsToMinutesSeconds(currentsong.duration)}`
document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) *100 + "%";
})

//add event listner to seekbar for seeking
document.querySelector(".seekbar").addEventListener("click", e => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentsong.currentTime = ((currentsong.duration) * percent) / 100
})

//add event listner for next song
next.addEventListener("click" , ()=>{
    console.log("next clicked")
    index = songs.indexOf(currentsong.src.split("/").slice(-1) [0])
    if((index+1)<songs.length ){
        playMusic(songs[index+1])
    }
})

//add event listner for previous song
previous.addEventListener("click" , ()=>{
    console.log("previous clicked")
    index = songs.indexOf(currentsong.src.split("/").slice(-1) [0])
    if((index-1)>=0){
        playMusic(songs[index-1])
    }
})


//add event listner for hamburger
document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0"
})

// Add an event listener for close button
document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%"
})
// Add an event to volume
document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
    // console.log("Setting volume to", e.target.value, "/ 100")
    currentsong.volume = parseInt(e.target.value) / 100
    if (currentsong.volume >0){
        document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("mute.svg", "volume.svg")
    }
})

// Load the playlist whenever card is clicked
Array.from(document.getElementsByClassName("card")).forEach(e => { 
    e.addEventListener("click", async item => {
        console.log("Fetching Songs")
         await getsongs(`songs/${item.currentTarget.dataset.folder}`) ;
        playMusic(songs[0]);
    })
})
}


const refreshlogo = document.querySelector(".logo");

// Add a click event listener to the text element to reload the site
refreshlogo.addEventListener('click', function() {
    // Reload the page
    location.reload();
});
//{start
// Select the elements
const showSearchText = document.getElementById('show-search');
const searchContainer = document.getElementById('search-container');
const closeSearchButton = document.getElementById('close-search');

// Function to show the search bar
function showSearchBar() {
    searchContainer.classList.remove('hidden');
}

// Function to hide the search bar
function hideSearchBar() {
    searchContainer.classList.add('hidden');
}

// Add event listeners
showSearchText.addEventListener('click', showSearchBar);
closeSearchButton.addEventListener('click', hideSearchBar);
// end}

//pause the song by using spacebar key
document.addEventListener('keydown', e=> {
    // Check if the spacebar key (keyCode 32) is pressed
    if (e.code === 'Space') {
        e.preventDefault(); // Prevent the default spacebar scrolling behavior

        // Toggle play/pause
        if (currentsong.paused) {
            currentsong.play();
            play.src = "img/pause.svg"
        } else {
            currentsong.pause();
            play.src = "img/play.svg"
        }
    }
});

main();