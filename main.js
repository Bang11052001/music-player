const $ = document.querySelector.bind(document);
const $$ =  document.querySelectorAll.bind(document);
const playList = $('.playlist');
const cdThumb = $('.cd-thumb');
const cd = $('.cd');
const playBtn = $(".btn-toggle-play");
const audio = $('#audio');
const h2 = $('h2');
const progress = $('#progress');
const next = $('.btn-next');
const prev = $('.btn-prev');
const randomBtn = $('.btn-random');
const randomSongIndexArr = [];
const btnRepeat = $('.btn-repeat');
const PLAYER_STORAGE_KEY = 'Me';

const app ={
    currentIndex: 0,
    isRandom : false,
    isRepeat : false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
          name: "Click Pow Get Down",
          singer: "Raftaar x Fortnite",
          path: "http://api.mp3.zing.vn/api/streaming/audio/ZWBIF86E/320",
          image: "https://i.ytimg.com/vi/jTLhQf5KJSc/maxresdefault.jpg"
        },
        {
          name: "Tu Phir Se Aana",
          singer: "Raftaar x Salim Merchant x Karma",
          path: "http://api.mp3.zing.vn/api/streaming/audio/ZWBIF86E/212",
          image:
            "https://1.bp.blogspot.com/-kX21dGUuTdM/X85ij1SBeEI/AAAAAAAAKK4/feboCtDKkls19cZw3glZWRdJ6J8alCm-gCNcBGAsYHQ/s16000/Tu%2BAana%2BPhir%2BSe%2BRap%2BSong%2BLyrics%2BBy%2BRaftaar.jpg"
        },
        {
          name: "Naachne Ka Shaunq",
          singer: "Raftaar x Brobha V",
          path:
            "http://api.mp3.zing.vn/api/streaming/audio/ZWBIF86E/318",
          image: "https://i.ytimg.com/vi/QvswgfLDuPg/maxresdefault.jpg"
        },
        {
          name: "Mantoiyat",
          singer: "Raftaar x Nawazuddin Siddiqui",
          path: "http://api.mp3.zing.vn/api/streaming/audio/ZWBIF86E/317",
          image:
            "https://a10.gaanacdn.com/images/song/39/24225939/crop_480x480_1536749130.jpg"
        },
        {
          name: "Aage Chal",
          singer: "Raftaar",
          path: "http://api.mp3.zing.vn/api/streaming/audio/ZWBIF86E/315",
          image:
            "https://a10.gaanacdn.com/images/albums/72/3019572/crop_480x480_3019572.jpg"
        },
        {
          name: "Damn",
          singer: "Raftaar x kr$na",
          path:
            "http://api.mp3.zing.vn/api/streaming/audio/ZWBIF86E/314",
          image:
            ""
        },
        {
          name: "Feeling You",
          singer: "Raftaar x Harjas",
          path: "http://api.mp3.zing.vn/api/streaming/audio/ZWBIF86E/313",
          image:
            "https://a10.gaanacdn.com/gn_img/albums/YoEWlabzXB/oEWlj5gYKz/size_xxl_1586752323.webp"
        }
      ],
    
      nextfunc: function(){
        next.onclick = function() {
          app.currentIndex++;
          if(app.currentIndex > app.songs.length -1 )
          {
            app.currentIndex =0;
          }
        }
        return app.currentIndex;
      },
      
      defineProperties: function () {
        Object.defineProperty(this, "currentSong", {
          get: function () {
            return this.songs[this.currentIndex];
          }
        });
      },

      render: function() {
        var html = app.songs.map(function(curr,index){
            return `
            <div class="song ${index === app.currentIndex ? 'active' : ''}" data-index ="${index}">
                <div class="thumb" style="background-image: url(${curr.image})">
                </div>
                <div class="body">
                    <h3 class="title">${curr.name}</h3>
                    <p class="author">${curr.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>`
        }).join('');
        playList.innerHTML = html;
      },

    handleEvent() {
        const cdWidth = cd.offsetWidth;
        const cdThumbAnimate = cdThumb.animate([{transform : 'rotate(360deg)'}],
        {
            duration: 15000,
            iterations: Infinity
          }
        );
        cdThumbAnimate.pause();

        window.addEventListener('scroll',function() {
            const scrollTop = window.scrollY || this.document.body.scrollTop || this.document.documentElement.scrollTop;
            
            const cdNewWidth = cdWidth - scrollTop;
            cd.style.width = cdNewWidth< 0 ? 0 : cdNewWidth + 'px';
            cd.style.opacity = cdNewWidth / cdWidth;
        })

        playBtn.addEventListener('click',function() {
            if(!playBtn.classList.contains('playing')){
                playBtn.classList.add('playing');
                audio.play();
                cdThumbAnimate.play();
            }
            else{
                playBtn.classList.remove('playing');
                audio.pause();
                cdThumbAnimate.pause();
            }
        })

        progress.oninput = function() {
          const seekTime = audio.duration / 100 * progress.value;
          audio.currentTime = seekTime;
        }
        
        audio.ontimeupdate = function(){
          const duration = audio.duration;
          if(duration){
            progress.value = Math.floor((audio.currentTime / duration) *100);
          }
         
        }

        next.onclick = function() {
          app.currentIndex++;
          if(randomBtn.classList.contains('active')){
            app.playRandomSong();
            // app.currentIndex = 6;
          }
          if(app.currentIndex > app.songs.length -1 )
          {
            app.currentIndex =0;
          }
          cdThumbAnimate.play();
          app.loadCurrentSong();                
          playBtn.classList.add('playing');
          audio.play();
          app.render();
          app.scrollToView();
        }

        prev.onclick = function() {
          app.currentIndex--;
          if(randomBtn.classList.contains('active')){
            app.playRandomSong();
            // app.currentIndex = 6;
          }
          if(app.currentIndex <0 )
          {
            app.currentIndex = app.songs.length-1;
          }
          app.loadCurrentSong();
          playBtn.classList.add('playing');
          audio.play();
          app.render();
          app.scrollToView();
        }

        randomBtn.onclick = function() {
          if(!app.isRandom){
            randomBtn.classList.add('active');
            localStorage.setItem("isRandom",'true');
            app.isRandom = true;
          }
          else{ 
            randomBtn.classList.remove('active');
            localStorage.setItem("isRandom",'false');
            app.isRandom = false;
          }
        }

        btnRepeat.onclick = function(){
          if(!app.isRepeat){
            btnRepeat.classList.add('active');
            localStorage.setItem("isRepeat",'true');
            app.isRepeat = true;
          }
          else{
            btnRepeat.classList.remove('active');
            localStorage.setItem("isRepeat",'false');
            app.isRepeat =false;
          }
        }

        audio.onended = function(){
          if(btnRepeat.classList.contains('active')){
            audio.play();
          }
          else{
            app.currentIndex++;
            if(app.currentIndex > app.songs.length -1 )
            {
            app.currentIndex =0;
            }
            app.loadCurrentSong();
            audio.play();
          }
          app.render();
        }

        playList.onclick = function(e) {
          const song = e.target.closest('.song:not(.active)');
          if(song || e.target.closest('.option')){
            if(song){
              if(!song.classList.contains('active'))
              {
                document.querySelector('.song.active').classList.remove('active');
                song.classList.add('active');
              }
              app.currentIndex = song.getAttribute('data-index');
              app.loadCurrentSong();
              playBtn.classList.add('playing');
              audio.play();
            }
            if( e.target.closest('.option')){
              console.log(1);
            }
          }
        }
    },
    loadConfig: function() {

      // console.log(app.isRandom);
      app.isRandom = localStorage.getItem("isRandom");
      app.isRepeat =localStorage.getItem("isRepeat")
      console.log(app.isRepeat)
   
    },

    playRandomSong: function() {
      do{
        var randomSongIndex = (Math.floor(Math.random() * (app.songs.length - 0)));
      }while(randomSongIndex === app.currentIndex);
      // console.log(randomSongIndex);
      app.currentIndex = randomSongIndex;
      app.loadCurrentSong();
    },

    loadCurrentSong: function() {
        h2.innerText = `${this.currentSong.name}`;
        cdThumb.style.backgroundImage =`url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },  

    start: function() {
        this.nextfunc();
        this.defineProperties();
        this.loadCurrentSong();
        this.render();
        this.handleEvent();
        this.loadConfig();
        
        this.scrollToView();
        console.log(app.isRandom);

        if(app.isRandom == 'true'){
          randomBtn.classList.add('active');
        }
        else{
          randomBtn.classList.remove('active');
        }

        if(app.isRepeat == 'true'){
          btnRepeat.classList.add('active');
        }
        else{
          btnRepeat.classList.remove('active');
        }
    },

    scrollToView: function() {
      const song = $('.song.active');
      if(song){
        song.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
      }
    }

    
}

app.start();