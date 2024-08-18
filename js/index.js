document.trucker = {};
document.trucker.music = {
    manifest: [
        {id: "song01", src:"music/01.mp3"},
        {id: "song02", src:"music/02.mp3"},
        {id: "song03", src:"music/03.mp3"},
        {id: "song04", src:"music/04.mp3"},
        {id: "song05", src:"music/05.mp3"},
        {id: "song06", src:"music/06.mp3"},
        {id: "song07", src:"music/07.mp3"},
        {id: "song08", src:"music/08.mp3"},
        {id: "song09", src:"music/09.mp3"},
        {id: "song10", src:"music/10.mp3"}
    ],

    readySongs: [],
    buttonToSongMap: {},
    playInstance: null,
    currentButton: 0,
    readySongCount: 0,

    playSong: function(buttonId) {
        this.currentButton = buttonId;
        if (this.buttonToSongMap[buttonId] == null) {
            this.buttonToSongMap[buttonId] = this.readySongs.shift();
        }

        createjs.Sound.stop();
        this.playInstance = createjs.Sound.play(this.buttonToSongMap[buttonId]);
        this.playInstance.on("complete", this.onSongCompleted, this)
    },

    onSongCompleted: function() {
        if (document.trucker.music.readySongs.length > 1) {
            if (this.currentButton == 1) {
                document.trucker.music.playSong(this.currentButton + 1);
            } else {
                document.trucker.music.playSong(this.currentButton - 1);
            }
        }
    },

    stopSong: function() {
        this.playInstance.stop();
        this.playInstance = null;
    },

    getNextSongToLoad: function() {
        if (this.manifest.length > 0) {
            var rand = Math.random() * this.manifest.length - 1;
            var song = this.manifest.splice(rand.toFixed(), 1)[0];
            return song;
        } else {
            return null;
        }

    },

    getReadySongCount: function() {
        return this.readySongCount;
    },

    getCurrentButton: function() {
        return this.currentButton;
    }
}

var music = document.trucker.music;

var queue = new createjs.LoadQueue();
queue.installPlugin(createjs.Sound);
queue.on("complete", handleComplete, this);

var songId = '';

function loadNextSong() {
    var nextSong = music.getNextSongToLoad();
    if (nextSong != null) {
        songId = nextSong.id;
        queue.loadFile(nextSong);
    }
}

function handleComplete(e) {    
    music.readySongs.push(songId);
    music.readySongCount++;

    if (document.trucker.music.readySongs.length < 10) {
        loadNextSong();
    }
}

loadNextSong();