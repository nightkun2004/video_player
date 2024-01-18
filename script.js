

document.addEventListener('DOMContentLoaded', function () {
    const video = document.querySelector('video');
    const controls = document.querySelector(".controls")
    const playButton = document.querySelector('.fa-play');
    const progressArea = document.querySelector('.progress-area');
    const bufferedBar = document.querySelector('.bufferedBar');
    const progress_Bar = document.querySelector('.progress-bar');
    const durationDisplay = document.querySelector('.duration');
    const currentDisplay = document.querySelector('.current');
    const fast_forward = document.querySelector('.bi-fast-forward');
    const seting = document.querySelector('.fa-gear');
    const setingbtn = document.querySelector('.setingbtn');
    const volumebtn = document.querySelector('.fa-volume-high');
    const volume = document.querySelector('.volumecart');
    const speedOptions = document.querySelectorAll('.setting.playback ul li');
    const fullscreen = document.querySelector(".fa-expand");
    const volumeContainer = document.querySelector(".volume_container");
    const volumeBar = document.querySelector(".volume_bar");
    const volumePercentage = document.querySelector(".volume_percentage");
    // const openFullScreen = document.querySelector('.openFullScreen')

    const tracks = video.textTracks;

    playButton.addEventListener('click', function () {
        if (video.paused) {
            video.play();
            playButton.classList.remove('fa-play');
            playButton.classList.add('fa-pause');
        } else {
            video.pause();
            playButton.classList.remove('fa-pause');
            playButton.classList.add('fa-play');
        }
    });

    video.addEventListener('ended', () => {
        playButton.classList.remove('fa-pause');
        playButton.classList.add('fa-play');
    })

    video.addEventListener('timeupdate', function () {
        const currentMinutes = Math.floor(video.currentTime / 60);
        const currentSeconds = Math.floor(video.currentTime % 60);
        const durationMinutes = Math.floor(video.duration / 60);
        const durationSeconds = Math.floor(video.duration % 60);

        currentDisplay.textContent = `${currentMinutes}:${currentSeconds}`;
        durationDisplay.textContent = `${durationMinutes}:${durationSeconds}`;
    });

    progressArea.addEventListener("pointerdown", (e) => {
        progressArea.setPointerCapture(e.pointerId);
        setTimelinePosition(e);
        progressArea.addEventListener("pointermove", setTimelinePosition);
        progressArea.addEventListener("pointerup", () => {
            progressArea.removeEventListener("pointermove", setTimelinePosition);
        })
    });

    function setTimelinePosition(e) {
        let progressWidthval = progressArea.clientWidth + 2;
        let clickOffsetX = e.offsetX;
        video.currentTime = (clickOffsetX / progressWidthval) * video.duration;

        let progressWidth = (video.currentTime / video.duration) * 100 + 0.5;
        progress_Bar.style.width = `${progressWidth}%`;

        let currentVideoTime = video.currentTime;
        let currentMin = Math.floor(currentVideoTime / 60);
        let currentSec = Math.floor(currentVideoTime % 60);
        currentSec = currentSec < 10 ? "0" + currentSec : currentSec;
        currentDisplay.innerHTML = `${currentMin}:${currentSec}`;
    }


    function drawProgress(canvas, buffered, duration) {
        let context = canvas.getContext('2d', { antialias: false });
        context.fillStyle = "#ffffffe6";

        let height = canvas.height;
        let width = canvas.width;
        if (!height || !width) throw "Canva's width or height or not set.";
        context.clearRect(0, 0, width, height);
        for (let i = 0; i < buffered.length; i++) {
            let leadingEdge = buffered.start(i) / duration * width;
            let trailingEdge = buffered.end(i) / duration * width;
            context.fillRect(leadingEdge, 0, trailingEdge - leadingEdge, height)
        }
    }

    fast_forward.addEventListener("click", () => {
        video.currentTime += 10;
    });

    video.addEventListener("timeupdate", (e) => {
        let currentVideoTime = e.target.currentTime;
        let currentMin = Math.floor(currentVideoTime / 60);
        let currentSec = Math.floor(currentVideoTime % 60);
        currentSec = currentSec < 10 ? "0" + currentSec : currentSec;
        currentDisplay.innerHTML = `${currentMin}:${currentSec}`;


        let videoDuration = e.target.duration;
        let progressWidth = (currentVideoTime / videoDuration) * 100 + 0.5;
        progress_Bar.style.width = `${progressWidth}%`;
    });

    video.addEventListener('progress', () => {
        drawProgress(bufferedBar, video.buffered, video.duration);
    })

    seting.addEventListener("click", () => {
        setingbtn.style.display = (setingbtn.style.display === 'none') ? 'block' : 'none';
    });

    volumebtn.addEventListener("click", () => {
        volume.style.display = (volume.style.display === 'none') ? 'block' : 'none';
    });

    // seting.addEventListener("mouseenter", () => {
    //     setingbtn.style.display = 'block';
    // });

    // volumebtn.addEventListener("mouseenter", () => {
    //     volume.style.display = 'block';
    // });

    fullscreen.addEventListener("click", () => {
        if (!video.classList.contains("openFullScreen")) {
            video.classList.add("openFullScreen");
            fullscreen.classList.remove("fa-expand");
            fullscreen.classList.add("fa-compress");
        } else {
            video.classList.remove("openFullScreen");
            fullscreen.classList.remove("fa-compress");
            fullscreen.classList.add("fa-expand");
            document.exitFullscreen();
        }
    });

    let timer;

    const hideControls = () => {
        if (video.paused) return;
        timer = setTimeout(() => {
            if (setingbtn.classList.contains("active") || captionsBtn.classList.contains("active")) {
                controls.classList.add("active");
            } else {
                controls.classList.remove("active");
                if (tracks.length != 0) {
                    caption_text.classList.add("active");
                }
            }
        }, 3000);
    }

    video.addEventListener("mousemove", () => {
        controls.classList.add("active");
        if (tracks.length != 0) {
            caption_text.classList.remove("active");
        }
        clearTimeout(timer);
        hideControls();
    });

    function muteVolume() {
        if (volume_range.value == 0) {
            volume_range.value = 80;
            video.volume = 0.8;
            volumebtn.classList.add("");
        } else {
            volume_range.value = 0;
            mainVideo.volume = 0;
            volumebtn.classList.add("");
        }
    }

    volumeBar.addEventListener("click", adjustVolume);

    function adjustVolume(event) {
        const volumeBarRect = volumeBar.getBoundingClientRect();
        const clickY = event.clientY - volumeBarRect.top;
        const percentage = (1 - clickY / volumeBarRect.height) * 100;

        const adjustedPercentage = Math.max(0, Math.min(percentage, 100));
        volumeBar.querySelector("span").style.height = `${adjustedPercentage}%`;

        video.volume = adjustedPercentage / 100;
        volumePercentage.textContent = `${Math.round(adjustedPercentage)}%`;
    }

    let mainVideoSources = video.querySelectorAll("source");
    for (let i = 0; i < mainVideoSources.length; i++) {
        let videoUrl = mainVideoSources[i].src;
        blobUrl(mainVideoSources[i], videoUrl);
    }
    function blobUrl(video, videoUrl) {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", videoUrl);
        xhr.responseType = "arraybuffer";
        xhr.onload = (e) => {
            let blob = new Blob([xhr.response]);
            let url = URL.createObjectURL(blob);
            video.src = url;
        };
        xhr.send();
    }

    video.addEventListener("contextmenu", (e) => {
        e.preventDefault();
    });

    speedOptions.forEach(option => {
        option.addEventListener('click', function () {
            const speed = parseFloat(this.getAttribute('data-speed'));
            video.playbackRate = speed;

            // เพิ่ม/ลบคลาส 'active' เพื่อแสดงว่าความเร็วไหนที่ถูกเลือก
            speedOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
        });
    });
});