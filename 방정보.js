client.on("message", chat => {
    let userInfo = chat.Channel.getUserInfo(chat.Sender);
    if (!userInfo) return;
    let id = String(chat.sender.id);
    let roomId = String(chat.channel.dataStruct.channelId);
    if (chat.Text) {
        if (chat.Text == "!봇정보" || chat.Text == "!방정보") {
            var chlist;
            if (chat.Text == "!봇정보") chlist = client.ChannelManager.getChannelList();
            else if (chat.Text == "!방정보") chlist = [chat.channel];
            var __list = [], n = "\n        ";
            for (i = 0; i < chlist.length; i++) {
                var info = chlist[i].dataStruct, _array = [];
                var co = info.lastChatLog, ml = info.displayMemberList;
                if (chlist[i].openLink) {
                    var plus = chlist[i].openLink.linkStruct;
                    if (plus.linkName) _array.push("◎ 방 이름 : " + plus.linkName);
                    if (plus.linkURL) _array.push("◎ 방 링크 : " + plus.linkURL);
                    if (plus.linkCoverURL) _array.push("◎ 방 커버사진 : " + plus.linkCoverURL);
                    if (plus.description) _array.push("◎ 방 설명 : " + plus.description);
                    if (plus.createdAt) _array.push("◎ 방 생성일 : " + plus.createdAt);
                }
                if (info.chanelId) _array.push("◎ 방아이디 : " + info.channelId);
                if (info.linkId) _array.push("◎ 링크아이디 : " + info.linkId);
                if (info.type) _array.push("◎ 방 타입 : " + getRoomType(info.type));
                if (info.activeMemberCount) _array.push("◎ 맴버 수 : " + info.activeMemberCount + "명");
                if (info.newMessageCount) _array.push("◎ 새 메시지 : " + info.newMessageCount + "개");
                if (co) _array.push("◎ 마지막 메시지 정보" + n + "◎ 로그아이디 : " + co.logId + n + "◎ 유저아이디 : " + co.senderId + n + "◎ 채팅타입 : " + co.type + n + "◎ 채팅 : " + co.text.replace(/\n/g, "\\n") + n + "◎ 보낸시간 : " + co.sendTime + n + "◎ 어태치 : " + co.rawAttachment + n + "◎ ID : " + co.messageId);
                if (ml) {
                    _array.push("◎ 멤버 정보");
                    for (j = 0; j < ml.length; j++) {
                        var str = "";
                        if (ml[j].nickname) str += n + "◎ 이름 : " + ml[j].nickname.replace(/\n/g, "\\n");
                        if (ml[j].userId) str += n + "◎ 아이디 : " + ml[j].userId;
                        if (ml[j].profileImageUrl) str += n + "◎ 프사 : " + ml[j].profileImageUrl.replace("img_s.jpg", "img.jpg");
                        _array.push(str);
                    }
                    __list.push(_array.join("\n\n"));
                }
            }
            sendWhole("|  " + chat.Text.slice(1) + "  |", __list.join("\n════════════════════\n\n\n════════════════════\n"));
        }
    }
    function sendWhole(txt1, txt2) {
        client.ChatManager.mediaManager.sendMedia({ "Id": chat.channel.id }, { type: node_kakao.ChatType.Text, data: Buffer.from(txt1+"\u200b".repeat(500)+"\n\n"+txt2) });
    }
    function getRoomType(type) {
        switch (type) {
            case "OM": return "오픈채팅방"; break;
            case "OD": return "오픈프로필 채팅방"; break;
            case "MultiChat": return "그룹채팅방"; break;
            case "DirectChat": return "개인채팅방"; break;
            case "MemoChat": return "나와의 채팅"; break;
            case "PlusChat": return "플러스 채팅"; break;
            default: return "UNKNOWN"; break;
       }
    }
});
