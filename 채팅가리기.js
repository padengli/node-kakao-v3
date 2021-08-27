let hideArray = {};
client.on("message", chat => {
    let roomId = String(chat.channel.dataStruct.channelId);
    if (!hideArray[roomId]) hideArray[roomId]  = [];
    hideArray[roomId].push(chat.logId);
    if (chat.Text.startsWith("!가리기 ")){ // !가리기 (숫자)
        if (isNaN(chat.Text.slice(5)) || chat.Text.slice(5).includes(".") || Number(chat.Text.slice(5))<1) return chat.replyText("자연수만 입력하세요.");
        client.ChatManager.getChatListFrom(chat.channel.id, chat.attachmentList[0].SourceLogId).then((r) => {
            if(!r.result) return replyText("error");
            let logmap = r.result.map(s=>s.logId).reverse();
            for (i=0; i<Number(chat.Text.slice(5)); i++){
                client.OpenLinkManager.hideChat(chat.channel,logmap[i]);
            }
        });
    }
});
