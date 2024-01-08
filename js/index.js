

let currentSong = new Audio();
let songs;
let currFolder;

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

async function getSongs(folder) {
  currFolder = folder;
  let a = await fetch(`/${folder}/`)
  let res = await a.text()
  let div = document.createElement("div")
  div.innerHTML = res;
  let as = div.getElementsByTagName("a")
  songs = []
  for (let i = 0; i < as.length; i++) {
    const element = as[i];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1]);
    }
  }
  // show all song in playlist
  let songUl = document.querySelector(".songList").getElementsByTagName("ul")[0];
  songUl.innerHTML = "";
  for (const song of songs) {
    songUl.innerHTML = songUl.innerHTML + `<li>
                <img class="invert" src="img/music.svg" alt="" />
                <div class="info">
                  <div>${song.replaceAll("%20", " ")}</div>
                  <div>Sandeep</div>
                </div>
                <div class="playNow">
                  <span>play Now</span>
                  <img class="invert" src="img/play.svg" alt="">
                </div>
              </li>`}

  // Attached event listener to each song
  Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
    e.addEventListener("click", element => {
      playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());

    })
  })
  return songs
}

let playMusic = (track, pause = false) => {

  currentSong.src = `/${currFolder}/` + track
  if (!pause) {

    currentSong.play()
    play.src = "img/pause.svg"

  }
  document.querySelector(".songInfo").innerHTML = decodeURI(track)
  document.querySelector(".songTime").innerHTML = "00:00 / 00:00"
}

async function displayAlbums() {
  let a = await fetch(`/songs/`)
  let res = await a.text()
  let div = document.createElement("div")
  div.innerHTML = res;
  let anchors = div.getElementsByTagName("a")
  let cardContainer = document.querySelector(".cardContainer")
  let array = Array.from(anchors)
  for (let i = 0; i < array.length; i++) {
    const e = array[i];

    if (e.href.includes("/songs/")) {
      let folder = e.href.split("/").splice(-1)[0];

      let a = await fetch(`/songs/${folder}/info.json`)
      let res = await a.json()
      cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}" class="card">
        <div class="play">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="#1fdf64">
            <circle cx="16" cy="16" r="15" />
            <polygon points="13,9 13,23 23,16" fill="#222" />
          </svg>
        </div>
        <img src="/songs/${folder}/cover.jpg" alt="" />
        <h3>${res.title}</h3>
        <p>${res.description}</p>
      </div>`
    }
  }

  // load the play list whenever card click
  Array.from(document.getElementsByClassName("card")).forEach(e => {
    e.addEventListener("click", async item => {
      songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
      playMusic(songs[0]);

    })
  })
}

async function main() {

  // get the list of all song 
  await getSongs("songs/animal");
  playMusic(songs[Math.floor(Math.random() * (songs.length))], true)

  // display all the album on the page
  displayAlbums();

  //  eventListener to next prev 
  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play()
      play.src = "img/pause.svg"
    }
    else {
      currentSong.pause()
      play.src = "img/play.svg"

    }
  })

  // timeupdate
  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".songTime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
    document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
  })


  document.querySelector(".seekbar").addEventListener("click", e => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = ((currentSong.duration) * percent) / 100;
  })

  // Add hamburger 

  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  })
  // Add event for close

  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%"
  })

  // add eventListener for prev and next

  previous.addEventListener("click", () => {
    currentSong.pause();

    let idx = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if ((idx - 1) >= 0) {
      playMusic(songs[idx - 1])
    }
  })

  next.addEventListener("click", () => {
    currentSong.pause();

    let idx = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if ((idx + 1) < songs.length) {
      playMusic(songs[idx + 1])
    }

  })

  // add event to volume  
  document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
    currentSong.volume = parseInt(e.target.value) / 100;

    if (currentSong.volume > 0) {
      document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("mute.svg", "volume.svg")
    }

  })

   // Add event listener to mute the track
   document.querySelector(".volume>img").addEventListener("click", e=>{ 
    if(e.target.src.includes("volume.svg")){
        e.target.src = e.target.src.replace("volume.svg", "mute.svg")
        currentSong.volume = 0;
        document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
    }
    else{
        e.target.src = e.target.src.replace("mute.svg", "volume.svg")
        currentSong.volume = .10;
        document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
    }

})



}

main();