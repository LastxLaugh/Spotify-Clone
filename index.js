console.log("Hello");

let currentSong = new Audio();
let songs;
let currentFolder = "Songs/NCS";


function formatTime(seconds) {
  if (isNaN(seconds)) return "00:00";

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
}


// CHANGED: get songs from songs.json
async function getSongs(folder) {
  let response = await fetch("/songs.json");
  let playlists = await response.json();

  return playlists[folder] || [];
}


const playMusic = (track, pause = false) => {
  currentSong.src = `/${currentFolder}/` + track;

  if (!pause) {
    currentSong.play();
    play.src = "pause.svg";
  }

  document.querySelector(".songinfo").innerHTML = track;
  document.querySelector(".songtime").innerHTML = "00:00/00:00";
};


async function main() {

  // Get songs from current folder
  songs = await getSongs(currentFolder);

  console.log(songs);

  if (songs.length > 0) {
    playMusic(songs[0], true);
  }


  let songul = document
    .querySelector(".songlist")
    .getElementsByTagName("ul")[0];

  songul.innerHTML = "";

  for (const song of songs) {

    songul.innerHTML =
      songul.innerHTML +
      `<li> 
        <img class="invert" src="music.svg" alt="">
        <div class="info">
          <div>${song}</div>
          <div>Abhishek</div>
        </div>
        <div class="playNow">
          <span>Play Now</span>
          <img src="play.svg" alt="">
        </div>
      </li>`;
  }


  // Attach event listener to each song
  Array.from(
    document.querySelector(".songlist").getElementsByTagName("li"),
  ).forEach((e) => {

    e.addEventListener("click", () => {

      console.log(
        e.querySelector(".info").firstElementChild.innerHTML
      );

      playMusic(
        e.querySelector(".info").firstElementChild.innerHTML
      );

    });

  });


  // Play button
  play.addEventListener("click", () => {

    if (currentSong.paused) {

      currentSong.play();
      play.src = "pause.svg";

    } else {

      currentSong.pause();
      play.src = "play.svg";

    }

  });


  // Listen for time update
  currentSong.addEventListener("timeupdate", () => {

    console.log(
      currentSong.currentTime,
      currentSong.duration
    );

    document.querySelector(".songtime").innerHTML =
      `${formatTime(currentSong.currentTime)} / ${formatTime(currentSong.duration)}`;

    document.querySelector(".circle").style.left =
      `${(currentSong.currentTime / currentSong.duration) * 100}%`;

  });


  // Seekbar
  document.querySelector(".seekbar").addEventListener("click", e => {

    let percent =
      (e.offsetX / e.target.getBoundingClientRect().width) * 100;

    document.querySelector(".circle").style.left =
      `${percent}%`;

    currentSong.currentTime =
      (currentSong.duration * percent) / 100;

  });


  // Hamburger
  document.querySelector(".hamburger").addEventListener("click", () => {

    document.querySelector(".left").style.left = "0";

  });


  // Cancel
  document.querySelector(".cancel").addEventListener("click", () => {

    document.querySelector(".left").style.left = "-120%";

  });


  // Previous
  previous.addEventListener("click", () => {

    console.log("Previous clicked");

    let currentSongName = decodeURIComponent(
      currentSong.src.split("/").pop()
    );

    let index = songs.indexOf(currentSongName);

    console.log("Current song:", currentSongName);
    console.log("Index:", index);

    if (index > 0) {
      playMusic(songs[index - 1]);
    }

  });


  // Next
  next.addEventListener("click", () => {

    console.log("Next clicked");

    let currentSongName = decodeURIComponent(
      currentSong.src.split("/").pop()
    );

    let index = songs.indexOf(currentSongName);

    console.log("Current song:", currentSongName);
    console.log("Index:", index);

    if (index < songs.length - 1) {
      playMusic(songs[index + 1]);
    }

  });


  // Volume
  let volume = document.querySelector(".volume");

  volume.addEventListener("input", (e) => {

    currentSong.volume = e.target.value / 100;

  });


  // Load playlist when we click on card
  Array.from(document.getElementsByClassName("card")).forEach(e => {

    e.addEventListener("click", async () => {

      currentFolder = e.dataset.folder;

      songs = await getSongs(currentFolder);

      // Play first song of selected playlist
      if (songs.length > 0) {
        playMusic(songs[0]);
      }


      let songul = document
        .querySelector(".songlist")
        .getElementsByTagName("ul")[0];

      songul.innerHTML = "";


      for (const song of songs) {

        songul.innerHTML +=
          `<li> 
            <img class="invert" src="music.svg" alt="">
            <div class="info">
              <div>${song}</div>
              <div>Abhishek</div>
            </div>
            <div class="playNow">
              <span>Play Now</span>
              <img src="play.svg" alt="">
            </div>
          </li>`;

      }


      // Add click event to new songs
      Array.from(
        document.querySelector(".songlist").getElementsByTagName("li")
      ).forEach(e => {

        e.addEventListener("click", () => {

          playMusic(
            e.querySelector(".info").firstElementChild.innerHTML
          );

        });

      });

    });

  });

}

main();