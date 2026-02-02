import {
    Header,
    MiniForm,
    MiniInput,
    MiniBtn,
    Message,
    Section,
    SectionTitle,
    SmallNote,
    FriendList,
    FriendItem,
    InlineGroup,
    EditBtn,
    DeleteBtn,
    WideCard,
} from "../styles/ui";

function FriendsPage({
    displayHandle,
    friendHandle,
    setFriendHandle,
    handleSendRequest,
    friendMessage,
    incomingRequests,
    outgoingRequests,
    friends,
    handleAcceptRequest,
    handleDeclineRequest,
    handleCancelRequest,
    setFriendToRemove,
}) {
    return (
        <WideCard>
            <Header>
                <h1 style={{ margin: 0, fontSize: 22 }}>친구</h1>
            </Header>
            <SmallNote style={{ marginBottom: 10 }}>
                내 아이디: {displayHandle || "생성 중"}
            </SmallNote>
            <MiniForm onSubmit={handleSendRequest}>
                <MiniInput
                    type="text"
                    placeholder="친구 아이디 입력"
                    value={friendHandle}
                    onChange={(e) => setFriendHandle(e.target.value)}
                />
                <MiniBtn type="submit">친구 요청 보내기</MiniBtn>
            </MiniForm>
            {friendMessage && (
                <Message $tone={friendMessage.tone}>
                    {friendMessage.text}
                </Message>
            )}

            <Section>
                <SectionTitle>받은 요청</SectionTitle>
                {incomingRequests.length === 0 && (
                    <SmallNote>받은 요청이 없습니다.</SmallNote>
                )}
                <FriendList>
                    {incomingRequests.map((request) => (
                        <FriendItem key={request.id}>
                            <span>{request.fromHandle}</span>
                            <InlineGroup>
                                <EditBtn
                                    type="button"
                                    onClick={() => handleAcceptRequest(request)}
                                >
                                    수락
                                </EditBtn>
                                <DeleteBtn
                                    type="button"
                                    onClick={() => handleDeclineRequest(request)}
                                >
                                    거절
                                </DeleteBtn>
                            </InlineGroup>
                        </FriendItem>
                    ))}
                </FriendList>
            </Section>

            <Section>
                <SectionTitle>보낸 요청</SectionTitle>
                {outgoingRequests.length === 0 && (
                    <SmallNote>보낸 요청이 없습니다.</SmallNote>
                )}
                <FriendList>
                    {outgoingRequests.map((request) => (
                        <FriendItem key={request.id}>
                            <span>{request.toHandle}</span>
                            <DeleteBtn
                                type="button"
                                onClick={() => handleCancelRequest(request)}
                            >
                                취소
                            </DeleteBtn>
                        </FriendItem>
                    ))}
                </FriendList>
            </Section>

            <Section>
                <SectionTitle>친구 목록</SectionTitle>
                {friends.length === 0 && (
                    <SmallNote>아직 친구가 없습니다.</SmallNote>
                )}
                <FriendList>
                    {friends.map((friend) => (
                        <FriendItem key={friend.id}>
                            <span>{friend.friendHandle}</span>
                            <DeleteBtn
                                type="button"
                                onClick={() => setFriendToRemove(friend)}
                            >
                                삭제
                            </DeleteBtn>
                        </FriendItem>
                    ))}
                </FriendList>
            </Section>
        </WideCard>
    );
}

export default FriendsPage;
