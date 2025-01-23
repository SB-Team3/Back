import Chat from '../schema/ChatSchema.js'
import User from '../schema/UserSchema.js'
import * as authRepository from '../query/authQuery.js'
import mongoose from 'mongoose';

export async function getChatRoomList(req, res) {
    // const userId = req.user.id; // 사용자 인증 미들웨어로 가져온 사용자 ID
    const mongo_id = req.mongo_id; // 로그인한 사용자 ID
    // console.log('로그인한 사용자 ID:', mongo_id);

    try {
        // TaskUserId로 검색
        const taskUserRooms = await Chat.find({ TaskUserId: new mongoose.Types.ObjectId(mongo_id) })
            .sort({ lastMessageTime: -1 })
            .select('_id lastMessage lastMessageTime TaskUserId toTaskUserId');

        // toTaskUserId로 검색
        const toTaskUserRooms = await Chat.find({ toTaskUserId: new mongoose.Types.ObjectId(mongo_id) })
            .sort({ lastMessageTime: -1 })
            .select('_id lastMessage lastMessageTime TaskUserId toTaskUserId');

        // 두 검색 결과 합치기
        // const chatRooms = [...taskUserRooms, ...toTaskUserRooms];

        // 정렬 하고 검색 결과 합치기
        const chatRooms = [...taskUserRooms, ...toTaskUserRooms].sort(
            (a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime)
        );
        


        // 닉네임 정보 추가
        const chatRoomsWithNicknames = await Promise.all(
            chatRooms.map(async (room) => {
                let otherUserId;
                let otherUserNickname;
                let otherUserPhotoUrl;

                if (room.TaskUserId.equals(new mongoose.Types.ObjectId(mongo_id))) {
                    otherUserId = room.toTaskUserId;
                } else if (room.toTaskUserId.equals(new mongoose.Types.ObjectId(mongo_id))) {
                    otherUserId = room.TaskUserId;
                }

                if (otherUserId) {
                    const otherUser = await User.findById(new mongoose.Types.ObjectId(otherUserId))
                        .select('nickname photoUrl');

                    otherUserNickname = otherUser?.nickname || 'Unknown User';
                    otherUserPhotoUrl = otherUser?.photoUrl || null;
                }

                return {
                    _id: room._id,
                    lastMessage: room.lastMessage,
                    lastMessageTime: room.lastMessageTime,
                    otherUserNickname,
                    otherUserPhotoUrl
                };
            })
        );

        res.status(200).json({ success: true, data: chatRoomsWithNicknames });
    } catch (error) {
        console.error('채팅룸 리스트 조회 중 오류:', error);
        res.status(500).json({ success: false, message: '채팅룸 리스트 조회 실패', error });
    }
}
