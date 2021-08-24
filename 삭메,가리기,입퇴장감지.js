client.on('feed', chat => {
    let type = chat.feed.feedType, isHiden;
    if (type === 13 || type === 14) {
        let hidenChatInfo = ["보낸 사람 : " + chat.channel.getUserInfoId(chat.sender.id).Nickname + " (" + String(chat.sender.id) + ")", "채팅 : " + chat.Text, "보낸 시간 : " + chat.sendTime, "로그ID : " + String(chat.logId), "어태치 : " + JSON.stringify(chat.rawAttachment)]
        type === 13 ? isHiden = "가려진" : isHiden = "삭제된";
        sendWhole("방금 " + isHiden + " 메시지 정보", hidenChatInfo.join("\n"));
    } else if (type === 2 || type === 4) {
        type === 2 ? isHiden = "퇴장" : isHiden = "입장";
        chat.replyText(new node_kakao.ChatMention(chat.sender), " 님이 " + isHiden + "하셨어요.");
    } else if (type === 6) chat.replyText(new node_kakao.ChatMention(chat.sender), "님이 ", new node_kakao.ChatMention(client.UserManager.get(chat.Feed.member.userId)), " 님을 강퇴하셨어요.");
    function sendWhole(txt1, txt2) {
        return client.ChatManager.mediaManager.sendMedia({ "Id": chat.channel.id }, { type: 1, data: Buffer.from(txt1 + "\u200b".repeat(500) + "\n\n" + txt2) });
    }
});
