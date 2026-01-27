import { useEffect, useMemo, useState } from "react";
import styled, { ThemeProvider, createGlobalStyle } from "styled-components";

const lightTheme = {
    bg: "#f6f7fb",
    surface: "#ffffff",
    text: "#1c1f2b",
    muted: "#6b7280",
    border: "#e5e7eb",
    accent: "#2563eb",
    doneBg: "#eaf2ff",
    calendarCell: "#f8fafc",
};

const darkTheme = {
    bg: "#1f2937",
    surface: "#243041",
    text: "#f3f4f6",
    muted: "#cbd5f5",
    border: "#2f3b52",
    accent: "#689fdf",
    doneBg: "#2b3a52",
    calendarCell: "#2a364b",
};

const GlobalStyle = createGlobalStyle`
    * {
        box-sizing: border-box;
    }

    body {
        margin: 0;
        background: ${(props) => props.theme.bg};
        color: ${(props) => props.theme.text};
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
    }
`;

const AppWrap = styled.div`
    min-height: 100vh;
    padding: 32px 20px;
    display: flex;
    justify-content: center;
    min-width: 418px;
    overflow-x: auto;
`;

const Layout = styled.div`
    width: min(1100px, 100%);
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;

    @media (max-width: 900px) {
        grid-template-columns: 1fr;
    }
`;

const Card = styled.div`
    background: ${(props) => props.theme.surface};
    border: 1px solid ${(props) => props.theme.border};
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);

    @media (max-width: 600px) {
        padding: 18px;
    }
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
`;

const Title = styled.h1`
    margin: 0;
    font-size: 22px;
`;

const ToggleWrap = styled.button`
    width: 64px;
    height: 34px;
    border: 1px solid ${(props) => props.theme.border};
    background: ${(props) => (props.$on ? "#9ca3af" : "#e5e7eb")};
    border-radius: 999px;
    cursor: pointer;
    display: flex;
    align-items: center;
    padding: 3px;
`;

const ToggleKnob = styled.span`
    width: 26px;
    height: 26px;
    border-radius: 50%;
    background: #ffffff;
    transform: translateX(${(props) => (props.$on ? "30px" : "0")});
    transition: transform 0.2s ease;
`;

const Form = styled.form`
    display: flex;
    gap: 10px;
    margin-bottom: 16px;

    @media (max-width: 600px) {
        flex-direction: column;
    }
`;

const Input = styled.input`
    flex: 1;
    padding: 12px 14px;
    border-radius: 10px;
    border: 1px solid ${(props) => props.theme.border};
    background: transparent;
    color: ${(props) => props.theme.text};
`;

const DateInput = styled(Input)`
    flex: 0 0 150px;

    @media (max-width: 600px) {
        flex: 1;
    }
`;

const AddBtn = styled.button`
    padding: 12px 16px;
    border: none;
    border-radius: 10px;
    background: ${(props) => props.theme.accent};
    color: white;
    cursor: pointer;
`;

const List = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const Item = styled.li`
    display: grid;
    grid-template-columns: 24px 1fr auto;
    align-items: center;
    gap: 12px;
    padding: 12px 14px;
    border-radius: 12px;
    border: 1px solid ${(props) => props.theme.border};
    background: ${(props) =>
        props.$done ? props.theme.doneBg : "transparent"};

    @media (max-width: 600px) {
        grid-template-columns: 24px 1fr;
        row-gap: 8px;
    }
`;

const ItemText = styled.span`
    color: ${(props) => props.theme.text};
    text-decoration: ${(props) => (props.$done ? "line-through" : "none")};
`;


const DeleteBtn = styled.button`
    border: 1px solid ${(props) => props.theme.border};
    background: transparent;
    color: ${(props) => props.theme.muted};
    padding: 6px 10px;
    border-radius: 8px;
    cursor: pointer;

    @media (max-width: 600px) {
        grid-column: 2 / 3;
        justify-self: start;
    }
`;

const CalendarHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
`;

const MonthTitle = styled.h2`
    margin: 0;
    font-size: 18px;
`;

const NavBtn = styled.button`
    border: 1px solid ${(props) => props.theme.border};
    background: transparent;
    color: ${(props) => props.theme.text};
    padding: 6px 10px;
    border-radius: 8px;
    cursor: pointer;
`;

const WeekRow = styled.div`
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 6px;
    margin-bottom: 6px;
    font-size: 12px;
    color: ${(props) => props.theme.muted};
    text-align: center;
`;

const CalendarGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 6px;
    position: relative;
`;

const DayCell = styled.div`
    height: 96px;
    border-radius: 10px;
    border: 1px solid ${(props) => props.theme.border};
    background: ${(props) => props.theme.calendarCell};
    padding: 6px;
    opacity: ${(props) => (props.$empty ? 0.4 : 1)};
    overflow: hidden;
    outline: ${(props) =>
        props.$selected ? `2px solid ${props.theme.accent}` : "none"};
    cursor: ${(props) => (props.$empty ? "default" : "pointer")};

    @media (max-width: 600px) {
        height: 84px;
    }
`;

const CalendarPopup = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    transform: translate(0, -8px);
    width: min(320px, 100%);
    background: ${(props) => props.theme.surface};
    border: 1px solid ${(props) => props.theme.border};
    border-radius: 12px;
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
    padding: 12px;
    z-index: 2;

    @media (max-width: 600px) {
        width: 100%;
        transform: translate(0, -4px);
    }
`;

const PopupHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
`;

const PopupTitle = styled.div`
    font-weight: 600;
    font-size: 13px;
`;

const PopupList = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    gap: 6px;
    font-size: 12px;
`;

const PopupItem = styled.li`
    padding: 6px 8px;
    border-radius: 8px;
    border: 1px solid ${(props) => props.theme.border};
    background: ${(props) => (props.$done ? props.theme.doneBg : "transparent")};
    text-decoration: ${(props) => (props.$done ? "line-through" : "none")};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const DayNumber = styled.div`
    font-size: 12px;
    margin-bottom: 4px;
`;

const DayList = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-size: 12px;
    max-height: 68px;
    overflow: hidden;
`;

const DayItem = styled.li`
    padding: 2px 6px;
    border-radius: 6px;
    background: ${(props) => (props.$done ? props.theme.doneBg : props.theme.surface)};
    text-decoration: ${(props) => (props.$done ? "line-through" : "none")};
    color: ${(props) => props.theme.text};
    border: 1px solid ${(props) => props.theme.border};
    font-size: 11px;
    line-height: 1.2;
    display: block;
    max-width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const SelectedInfo = styled.div`
    margin: 6px 0 12px;
    color: ${(props) => props.theme.muted};
    font-size: 12px;
`;

const ClearBtn = styled.button`
    border: 1px solid ${(props) => props.theme.border};
    background: transparent;
    color: ${(props) => props.theme.text};
    padding: 4px 8px;
    border-radius: 8px;
    cursor: pointer;
    margin-left: 8px;
`;

function TodoInputWithDate({
    textValue,
    dateValue,
    onTextChange,
    onDateChange,
    onSubmit,
}) {
    return (
        <Form onSubmit={onSubmit}>
            <Input
                type="text"
                placeholder="할 일을 입력해주세요."
                value={textValue}
                onChange={onTextChange}
                required
            />
            <DateInput type="date" value={dateValue} onChange={onDateChange} />
            <AddBtn type="submit">추가</AddBtn>
        </Form>
    );
}

function TodoItem({ item, onToggle, onDelete }) {
    return (
        <Item $done={item.done}>
            <input type="checkbox" checked={item.done} onChange={onToggle} />
            <ItemText $done={item.done}>
                {item.text}
            </ItemText>
            <DeleteBtn type="button" onClick={onDelete}>
                삭제
            </DeleteBtn>
        </Item>
    );
}

function buildMonthCells(currentMonth) {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 0);
    const startWeekday = start.getDay();
    const daysInMonth = end.getDate();
    const cells = [];

    for (let i = 0; i < startWeekday; i += 1) {
        cells.push(null);
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
        cells.push(new Date(year, month, day));
    }

    return cells;
}

function formatDateKey(dateObj) {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function App() {
    const today = new Date().toISOString().slice(0, 10);
    const [todo, setTodo] = useState("");
    const [todoDate, setTodoDate] = useState(today);
    const [todoList, setTodoList] = useState([]);
    const [isDark, setIsDark] = useState(false);
    const [selectedDate, setSelectedDate] = useState("");
    const [popupDate, setPopupDate] = useState("");
    const [currentMonth, setCurrentMonth] = useState(() => {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), 1);
    });

    const todoByDate = useMemo(() => {
        return todoList.reduce((acc, item) => {
            if (!item.date) return acc;
            if (!acc[item.date]) acc[item.date] = [];
            acc[item.date].push(item);
            return acc;
        }, {});
    }, [todoList]);

    const cells = useMemo(() => buildMonthCells(currentMonth), [currentMonth]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const trimmed = todo.trim();
        if (!trimmed) return;
        setTodoList([...todoList, { text: trimmed, done: false, date: todoDate }]);
        setTodo("");
        setTodoDate(today);
    };

    const handleToggle = (index) => {
        setTodoList(
            todoList.map((item, idx) =>
                idx === index ? { ...item, done: !item.done } : item
            )
        );
    };

    const handleDelete = (index) => {
        setTodoList(todoList.filter((_, idx) => idx !== index));
    };

    const handleMonthChange = (delta) => {
        setCurrentMonth(
            new Date(
                currentMonth.getFullYear(),
                currentMonth.getMonth() + delta,
                1
            )
        );
    };

    const visibleList = selectedDate
        ? todoList
              .map((item, index) => ({ item, index }))
              .filter(({ item }) => item.date === selectedDate)
        : todoList.map((item, index) => ({ item, index }));

    const monthLabel = `${currentMonth.getFullYear()}년 ${
        currentMonth.getMonth() + 1
    }월`;

    useEffect(() => {
        const handleAnyClick = () => {
            if (popupDate) setPopupDate("");
        };

        document.addEventListener("mousedown", handleAnyClick);
        return () => document.removeEventListener("mousedown", handleAnyClick);
    }, [popupDate]);

    return (
        <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
            <GlobalStyle />
            <AppWrap>
                <Layout>
                    <Card>
                        <Header>
                            <Title>투두리스트</Title>
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

                        <TodoInputWithDate
                            textValue={todo}
                            dateValue={todoDate}
                            onTextChange={(e) => {
                                setTodo(e.target.value);
                                setPopupDate("");
                            }}
                            onDateChange={(e) => {
                            setTodoDate(e.target.value);
                            setSelectedDate(e.target.value);
                            setPopupDate("");
                            }}
                            onSubmit={handleSubmit}
                        />

                        <List>
                            {visibleList.map(({ item, index }) => (
                                <TodoItem
                                    key={`${item.text}-${index}`}
                                    item={item}
                                    onToggle={() => handleToggle(index)}
                                    onDelete={() => handleDelete(index)}
                                />
                            ))}
                        </List>
                    </Card>

                    <Card>
                        <CalendarHeader>
                            <NavBtn type="button" onClick={() => handleMonthChange(-1)}>
                                이전
                            </NavBtn>
                            <MonthTitle>{monthLabel}</MonthTitle>
                            <NavBtn type="button" onClick={() => handleMonthChange(1)}>
                                다음
                            </NavBtn>
                        </CalendarHeader>

                        <WeekRow>
                            <span>일</span>
                            <span>월</span>
                            <span>화</span>
                            <span>수</span>
                            <span>목</span>
                            <span>금</span>
                            <span>토</span>
                        </WeekRow>

                        <CalendarGrid>
                            {popupDate && (
                                <CalendarPopup onClick={(e) => e.stopPropagation()}>
                                    <PopupHeader>
                                        <PopupTitle>{popupDate}</PopupTitle>
                                        <ClearBtn
                                            type="button"
                                            onClick={() => setPopupDate("")}
                                        >
                                            닫기
                                        </ClearBtn>
                                    </PopupHeader>
                                    <PopupList>
                                        {(todoByDate[popupDate] || []).map(
                                            (item, idx) => (
                                                <PopupItem key={`${popupDate}-${idx}`} $done={item.done}>
                                                    {item.text}
                                                </PopupItem>
                                            )
                                        )}
                                        {(todoByDate[popupDate] || []).length === 0 && (
                                            <PopupItem $done={false}>
                                                등록된 할 일이 없습니다.
                                            </PopupItem>
                                        )}
                                    </PopupList>
                                </CalendarPopup>
                            )}
                            {cells.map((dateObj, idx) => {
                                if (!dateObj) {
                                    return <DayCell key={`empty-${idx}`} $empty />;
                                }

                                const dateKey = formatDateKey(dateObj);
                                const items = todoByDate[dateKey] || [];

                                return (
                                    <DayCell
                                        key={dateKey}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedDate(dateKey);
                                            setTodoDate(dateKey);
                                            setPopupDate(dateKey);
                                        }}
                                        $selected={selectedDate === dateKey}
                                    >
                                        <DayNumber>{dateObj.getDate()}</DayNumber>
                                        <DayList>
                                            {items.slice(0, 3).map((item, itemIdx) => (
                                                <DayItem
                                                    key={`${dateKey}-${itemIdx}`}
                                                    $done={item.done}
                                                >
                                                    {item.text}
                                                </DayItem>
                                            ))}
                                            {items.length > 3 && (
                                                <DayItem $done={false}>
                                                    +{items.length - 3}개
                                                </DayItem>
                                            )}
                                        </DayList>
                                    </DayCell>
                                );
                            })}
                        </CalendarGrid>
                    </Card>
                </Layout>
            </AppWrap>
        </ThemeProvider>
    );
}

export default App;
