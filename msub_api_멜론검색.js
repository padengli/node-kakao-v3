client.on("message", chat => {
    if (chat.Text.startsWith("!멜론 ")) {
        require("axios").get('https://api.music.msub.kr/?song='+encodeURI(chat.Text.slice(4))).then(function(body) {
            let {data} = body;
            if (data.lineup.length==0) return replyText("검색결과가 없어요.");
            let {name, artist, albumimg, date, melonlink, kakaomelonlink,  lyrics} = data.song[0];
            send_raw(name, 23, {"L": melonlink,"Q": "멜론 노래검색","V": "list","R": [{"D": date,"L": kakaomelonlink,"T": name  + " - " + artist,"I": albumimg}]});
            sendWhole("가사 - "+name, lyrics.replace(/<br>/g, "\n"));
        });
    }
});
