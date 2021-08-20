const __path = "JSON 파일 경로 설정";
const type_e = Object.keys(node_kakao.ChatType).slice(37, 72), type_n = Object.keys(node_kakao.ChatType).slice(0, 35);
let chatLog = JSON.parse(require('fs').readFileSync(__path, "utf8"));
client.on("message", chat => {
    let userInfo = chat.Channel.getUserInfo(chat.Sender);
    if (!userInfo) return;
    let id = String(chat.sender.id);
    let roomId = String(chat.channel.dataStruct.channelId);
    if (!chatLog[roomId]) chatLog[roomId] = [];
    chatLog[roomId].push({ "보낸사람 정보": [userInfo.Nickname, Number(id), userInfo.OriginalProfileURL], "채팅": chat.Text, "보낸 시간": chat.sendTime, "이전 로그ID": Number(chat.prevLogId), "로그ID": Number(chat.logId), "메시지ID": chat.messageId, "채팅 타입": String(chat.Type) + " " + type_e[type_n.indexOf(String(chat.Type))], "어태치": chat.rawAttachment });
    if (chat.Text && chat.Text.startsWith("!로그 ")) {
        if (chatLog[roomId].length == 0) return chat.replyText("저장된 로그가 없어요.");
        if (isNaN(chat.Text.slice(4))) return chat.replyText("숫자만 입력해주세요.");
        if (chatLog[roomId].length < Number(chat.Text.slice(4))) return chat.replyText("저장된 로그 갯수가 부족합니다.");
        sendWhole("채팅 로그", chatLog[roomId].slice(-Number(chat.Text.slice(4))).reverse().map(e => JSON.stringify(e)).join("\n════════════════\n"));
    }
    if (chat.Text && chat.Text == "!밑메" && chat.Type == 26) {
        if (chatLog[roomId].length == 0) return chat.replyText("저장된 로그가 없어요.");
        let ISO = chatLog[roomId].findIndex(e => e["로그ID"] == Number(chat.rawAttachment.src_logId));
        if (ISO<0 || !chatLog[roomId][ISO + 1]) return chat.replyText("저장된 해당 채팅의 밑메가 없어요.");
        sendWhole("밑메", chatLog[roomId][ISO + 1]);
    }
    if (chat.Text && chat.Text == "!윗메" && chat.Type == 26) {
        if (chatLog[roomId].length == 0) return chat.replyText("저장된 로그가 없어요.");
        let ISO = chatLog[roomId].findIndex(e => e["로그ID"] == Number(chat.rawAttachment.src_logId));
        if (ISO<0 || !chatLog[roomId][ISO - 1]) return chat.replyText("저장된 해당 채팅의 윗메가 없어요.");
        sendWhole("윗메", chatLog[roomId][ISO - 1]);
    }
    require('fs').writeFileSync(__path, JSON.stringify(chatLog));
    function sendWhole(txt1, txt2) {
        return client.ChatManager.mediaManager.sendMedia({ "Id": chat.channel.id }, { type: node_kakao.ChatType.Text, data: Buffer.from(txt1 + "\u200b".repeat(500) + "\n\n" + txt2) });
    }
});
