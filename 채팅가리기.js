let hideArray = {};
client.on("message", chat => {
    let roomId = String(chat.channel.dataStruct.channelId);
    if (!hideArray[roomId]) hideArray[roomId]  = [];
    hideArray[roomId].push(chat.logId);
    if (chat.Text.startsWith("!가리기 ")){ // !가리기 (숫자)
        let LO = hideArray[roomId].reverse()[Number(chat.Text.slice(5))];
        if (!LO || isNaN(chat.Text.slice(5)) || chat.Text.slice(5).includes(".") || Number(chat.Text.slice(5))<1) return chat.replyText("로그가 부족하거나 숫자가 정확하지 않아요");
        client.ChatManager.getChatListFrom(chat.channel.id, LO).then(r=>{
            if(!r.result) return replyText("error");
            let logmap = r.result.map(s=>s.logId).reverse();
            for (i=0; i<Number(chat.Text.slice(5)); i++){
                client.OpenLinkManager.hideChat(chat.channel,logmap[i]);
            }
        });
    }
});
