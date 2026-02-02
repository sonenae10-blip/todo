import {
    AuthCard,
    AuthLinks,
    Header,
    MiniBtn,
    MiniForm,
    MiniInput,
    Message,
    RulesCard,
    RulesFloat,
    RulesList,
    Title,
    ToggleKnob,
    ToggleWrap,
    TextLink,
    FullscreenWrap,
} from "../styles/ui";

function AuthPage({
    isDark,
    setIsDark,
    authView,
    setAuthView,
    loginEmail,
    setLoginEmail,
    loginPassword,
    setLoginPassword,
    signupEmail,
    setSignupEmail,
    signupPassword,
    setSignupPassword,
    resetEmail,
    setResetEmail,
    handleLogin,
    handleSignup,
    handleReset,
    authMessage,
}) {
    return (
        <FullscreenWrap>
            <AuthCard>
                {authView === "signup" && (
                    <RulesFloat>
                        <RulesCard>
                            비밀번호 규칙
                            <RulesList>
                                <li>8자 이상</li>
                                <li>영문/숫자/특수문자 중 2가지 이상</li>
                                <li>공백 사용 불가</li>
                                <li>이메일과 동일한 비밀번호 금지</li>
                            </RulesList>
                        </RulesCard>
                    </RulesFloat>
                )}
                <Header>
                    <Title>
                        {authView === "login" && "로그인"}
                        {authView === "signup" && "회원가입"}
                        {authView === "reset" && "비밀번호 찾기"}
                    </Title>
                    <ToggleWrap
                        type="button"
                        onClick={() => setIsDark(!isDark)}
                        $on={isDark}
                        aria-pressed={isDark}
                        aria-label="다크 모드 토글"
                    >
                        <ToggleKnob $on={isDark} />
                    </ToggleWrap>
                </Header>

                {authView === "login" && (
                    <MiniForm onSubmit={handleLogin}>
                        <MiniInput
                            type="email"
                            placeholder="이메일"
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                            required
                        />
                        <MiniInput
                            type="password"
                            placeholder="비밀번호"
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            required
                        />
                        <MiniBtn type="submit">로그인</MiniBtn>
                        <AuthLinks>
                            <TextLink type="button" onClick={() => setAuthView("reset")}>
                                비밀번호 찾기
                            </TextLink>
                            <TextLink type="button" onClick={() => setAuthView("signup")}>
                                회원가입
                            </TextLink>
                        </AuthLinks>
                    </MiniForm>
                )}

                {authView === "signup" && (
                    <MiniForm onSubmit={handleSignup}>
                        <MiniInput
                            type="email"
                            placeholder="이메일"
                            value={signupEmail}
                            onChange={(e) => setSignupEmail(e.target.value)}
                            required
                        />
                        <MiniInput
                            type="password"
                            placeholder="비밀번호"
                            value={signupPassword}
                            onChange={(e) => setSignupPassword(e.target.value)}
                            required
                        />
                        <MiniBtn type="submit">회원가입</MiniBtn>
                        <AuthLinks>
                            <TextLink type="button" onClick={() => setAuthView("login")}>
                                로그인
                            </TextLink>
                        </AuthLinks>
                    </MiniForm>
                )}

                {authView === "reset" && (
                    <MiniForm onSubmit={handleReset}>
                        <MiniInput
                            type="email"
                            placeholder="이메일"
                            value={resetEmail}
                            onChange={(e) => setResetEmail(e.target.value)}
                            required
                        />
                        <MiniBtn type="submit">메일 보내기</MiniBtn>
                        <AuthLinks>
                            <TextLink type="button" onClick={() => setAuthView("login")}>
                                로그인으로
                            </TextLink>
                        </AuthLinks>
                    </MiniForm>
                )}

                {authMessage && (
                    <Message $tone={authMessage.tone}>
                        {authMessage.text}
                    </Message>
                )}
            </AuthCard>
        </FullscreenWrap>
    );
}

export default AuthPage;
