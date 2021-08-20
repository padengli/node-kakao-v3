const type_e = Object.keys(node_kakao.ChatType).slice(37, 72);
const type_n = Object.keys(node_kakao.ChatType).slice(0, 35);
client.on("message", chat => {
    let userInfo = chat.Channel.getUserInfo(chat.Sender);
    if (!userInfo) return;
    let id = String(chat.sender.id);
    let roomId = String(chat.channel.dataStruct.channelId);
    if (chat.Text.startsWith("!밑") && chat.Text.endsWith("메") && chat.Type == 26) {
        let leng = chat.Text.slice(2, chat.Text.length-1);
        if (leng.split("밑").join("").length > 0) return chat.replyText("!밑밑...밑밑메 형식으로 입력해주세요.");
        if (leng>50) return chat.replyText("이상한거 하지 마세요.");
        client.ChatManager.getChatListFrom(chat.channel.id, chat.attachmentList[0].SourceLogId).then((r) => {
            if (!r.result) return chat.replyText("error");
            let log = r.result.map(v=>{
                let u = v.channel.getUserInfo(v.sender).memberStruct;
                return {"보낸 사람":[u.nickname, Number(u.userId)],"프로필":u.originalProfileURL,"채팅":v.Text,"보낸 시간":v.sendTime,"이전 로그ID":Number(v.prevLogId),"로그ID":Number(v.logId),"메시지ID":v.messageId,"채팅 타입":String(v.Type)+" "+type_e[type_n.indexOf(String(v.Type))],"어태치":v.rawAttachment}
            });
            if (log.length<=leng.length) return chat.replyText("밑메가 부족해요.");
            sendWhole(chat.Text.slice(1), JSON.stringify(log[leng.length], null, 4));
        });
    }
    function sendWhole(txt1, txt2) {
        return client.ChatManager.mediaManager.sendMedia({ "Id": chat.channel.id }, { type: node_kakao.ChatType.Text, data: Buffer.from(txt1+"\u200b".repeat(500)+"\n\n"+txt2) });
    }
});
