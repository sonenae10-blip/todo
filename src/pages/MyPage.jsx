import { Link } from "react-router-dom";
import {
    Badge,
    CopyBtn,
    Header,
    InfoGrid,
    InfoRow,
    InlineGroup,
    Message,
    Section,
    SectionTitle,
    WideCard,
} from "../styles/ui";

function MyPage({
    displayHandle,
    profile,
    authUser,
    handleCopyId,
    createdAtLabel,
    ownTodoCount,
    sharedTodoCount,
    friends,
    incomingRequests,
    outgoingRequests,
    myPageMessage,
}) {
    return (
        <WideCard>
            <Header>
                <h1 style={{ margin: 0, fontSize: 22 }}>마이페이지</h1>
            </Header>
            <Section>
                <SectionTitle>내 아이디</SectionTitle>
                <InlineGroup>
                    <Badge>{displayHandle || "생성 중"}</Badge>
                    <CopyBtn type="button" onClick={handleCopyId}>
                        복사
                    </CopyBtn>
                </InlineGroup>
            </Section>
            <Section>
                <SectionTitle>계정 정보</SectionTitle>
                <InfoGrid>
                    <InfoRow>
                        <span>이메일</span>
                        <span>{profile?.email || authUser.email}</span>
                    </InfoRow>
                    <InfoRow>
                        <span>가입일</span>
                        <span>{createdAtLabel || "-"}</span>
                    </InfoRow>
                </InfoGrid>
            </Section>
            <Section>
                <SectionTitle>활동 요약</SectionTitle>
                <InfoGrid>
                    <InfoRow>
                        <span>내 할 일</span>
                        <Link
                            to="/"
                            style={{
                                color: "inherit",
                                textDecoration: "none",
                                fontWeight: 600,
                            }}
                        >
                            {ownTodoCount}개
                        </Link>
                    </InfoRow>
                    <InfoRow>
                        <span>친구 일정</span>
                        <Link
                            to="/friends"
                            style={{
                                color: "inherit",
                                textDecoration: "none",
                                fontWeight: 600,
                            }}
                        >
                            {sharedTodoCount}개
                        </Link>
                    </InfoRow>
                    <InfoRow>
                        <span>친구 수</span>
                        <Link
                            to="/friends"
                            style={{
                                color: "inherit",
                                textDecoration: "none",
                                fontWeight: 600,
                            }}
                        >
                            {friends.length}명
                        </Link>
                    </InfoRow>
                    <InfoRow>
                        <span>받은 요청</span>
                        <Link
                            to="/friends"
                            style={{
                                color: "inherit",
                                textDecoration: "none",
                                fontWeight: 600,
                            }}
                        >
                            {incomingRequests.length}건
                        </Link>
                    </InfoRow>
                    <InfoRow>
                        <span>보낸 요청</span>
                        <Link
                            to="/friends"
                            style={{
                                color: "inherit",
                                textDecoration: "none",
                                fontWeight: 600,
                            }}
                        >
                            {outgoingRequests.length}건
                        </Link>
                    </InfoRow>
                </InfoGrid>
            </Section>
            {myPageMessage && (
                <Message $tone={myPageMessage.tone}>
                    {myPageMessage.text}
                </Message>
            )}
        </WideCard>
    );
}

export default MyPage;
