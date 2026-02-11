import { useEffect, useMemo, useRef, useState } from "react";
import {
    HomeCard,
    Header,
    SelectedInfo,
    ClearBtn,
    Message,
    List,
    HomeGrid,
    PaginationWrap,
    PageButton,
    PageIndicator,
} from "../styles/ui";
import TodoInputWithDate from "../components/TodoInputWithDate";
import TodoItem from "../components/TodoItem";
import CalendarView from "../components/CalendarView";

function HomePage({
    isDark,
    setIsDark,
    todo,
    todoStartDate,
    todoEndDate,
    todoRepeatDays,
    setTodo,
    setTodoStartDate,
    setTodoEndDate,
    onTodoRepeatToggle,
    setSelectedDate,
    setSelectedDateClear,
    setPopupDate,
    handleSubmit,
    authUser,
    selectedDate,
    todoMessage,
    sortedVisible,
    editingId,
    editText,
    editStartDate,
    editEndDate,
    editRepeatDays,
    setEditText,
    setEditStartDate,
    setEditEndDate,
    onEditRepeatToggle,
    handleEditKeyDown,
    handleToggle,
    handleDelete,
    handleEditStart,
    handleEditSave,
    handleEditCancel,
    today,
    currentMonth,
    monthLabel,
    handleMonthChange,
    todoByDate,
    friendHandleMap,
}) {
    const [page, setPage] = useState(1);
    const listCardRef = useRef(null);
    const pageSize = 6;

    const getDdayLabel = (dateKey) => {
        if (!dateKey || !today) return "";
        const target = new Date(`${dateKey}T00:00:00`);
        const now = new Date(`${today}T00:00:00`);
        const diff = Math.round((target - now) / 86400000);
        if (diff === 0) return "D-day";
        if (diff > 0) return `D-${diff}`;
        return `D+${Math.abs(diff)}`;
    };

    useEffect(() => {
        setPage(1);
        if (
            selectedDate &&
            typeof window !== "undefined" &&
            window.matchMedia("(max-width: 995px)").matches
        ) {
            listCardRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    }, [selectedDate, sortedVisible.length]);


    const totalPages = Math.max(1, Math.ceil(sortedVisible.length / pageSize));
    const pageItems = useMemo(() => {
        const start = (page - 1) * pageSize;
        return sortedVisible.slice(start, start + pageSize);
    }, [sortedVisible, page]);

    return (
        <HomeGrid>
            <HomeCard ref={listCardRef}>
                <Header>
                    <h1 style={{ margin: 0, fontSize: 22 }}>Todo-List</h1>
                    <button
                        type="button"
                        onClick={() => setIsDark(!isDark)}
                        style={{
                            width: 64,
                            height: 34,
                            borderRadius: 999,
                            border: "1px solid #e5e7eb",
                            background: isDark ? "#9ca3af" : "#e5e7eb",
                            display: "flex",
                            alignItems: "center",
                            padding: 3,
                            cursor: "pointer",
                        }}
                    >
                        <span
                            style={{
                                width: 26,
                                height: 26,
                                borderRadius: "50%",
                                background: "#fff",
                                transform: `translateX(${isDark ? 30 : 0}px)`,
                                transition: "transform 0.2s ease",
                            }}
                        />
                    </button>
                </Header>

                <TodoInputWithDate
                    textValue={todo}
                    startDateValue={todoStartDate}
                    endDateValue={todoEndDate}
                    repeatDays={todoRepeatDays}
                    onTextChange={(e) => {
                        setTodo(e.target.value);
                        setPopupDate("");
                    }}
                    onStartDateChange={(e) => {
                        const next = e.target.value;
                        setTodoStartDate(next);
                        if (todoEndDate && next && todoEndDate < next) {
                            setTodoEndDate(next);
                        }
                        setPopupDate("");
                    }}
                    onEndDateChange={(e) => {
                        const next = e.target.value;
                        setTodoEndDate(next);
                        setPopupDate("");
                    }}
                    onRepeatDayToggle={onTodoRepeatToggle}
                    onSubmit={handleSubmit}
                    disabled={!authUser}
                />

                <SelectedInfo>
                    {selectedDate ? `${selectedDate} 일정` : "전체 일정"}
                    {selectedDate && (
                        <ClearBtn type="button" onClick={setSelectedDateClear}>
                            전체 보기
                        </ClearBtn>
                    )}
                </SelectedInfo>
                {selectedDate && sortedVisible.length === 0 && (
                    <div style={{ marginBottom: 10 }}>
                        <ClearBtn type="button" onClick={setSelectedDateClear}>
                            날짜 필터 해제
                        </ClearBtn>
                    </div>
                )}
                {todoMessage && (
                    <Message $tone={todoMessage.tone}>
                        {todoMessage.text}
                    </Message>
                )}

                <List>
                    {pageItems.length === 0 && (
                        <li
                            style={{
                                padding: "12px 14px",
                                borderRadius: 12,
                                border: "1px solid #e5e7eb",
                                fontSize: 13,
                                color: "#6b7280",
                            }}
                        >
                            선택한 날짜에 일정이 없습니다.
                        </li>
                    )}
                    {pageItems.map(({ item }) => {
                        const isEditing = editingId === item.id;
                        const isOwner =
                            !item.ownerUid || item.ownerUid === authUser.uid;
                        const canEdit = isOwner;
                        const ownerLabel = !isOwner
                            ? `${
                                  friendHandleMap?.[item.ownerUid] ||
                                  item.ownerHandle ||
                                  "친구"
                              }`
                            : "";
                        const startDate = item.startDate || item.date || "";
                        const dateLabel = !selectedDate && startDate ? startDate : "";
                        const ddayLabel = dateLabel ? getDdayLabel(dateLabel) : "";
                        const isFriend =
                            Boolean(item.ownerUid) &&
                            item.ownerUid !== authUser.uid;
                        return (
                            <TodoItem
                                key={item.id}
                                item={item}
                                isEditing={isEditing}
                                editText={isEditing ? editText : ""}
                                editStartDate={isEditing ? editStartDate : today}
                                editEndDate={isEditing ? editEndDate : today}
                                editRepeatDays={isEditing ? editRepeatDays : []}
                                onEditTextChange={(e) =>
                                    setEditText(e.target.value)
                                }
                                onEditStartDateChange={(e) =>
                                    setEditStartDate(e.target.value)
                                }
                                onEditEndDateChange={(e) =>
                                    setEditEndDate(e.target.value)
                                }
                                onEditRepeatDayToggle={onEditRepeatToggle}
                                onEditKeyDown={handleEditKeyDown}
                                canEdit={canEdit}
                                ownerLabel={ownerLabel}
                                dateLabel={dateLabel}
                                ddayLabel={ddayLabel}
                                isFriend={isFriend}
                                onToggle={() => handleToggle(item)}
                                onDelete={() => handleDelete(item)}
                                onEditStart={() => handleEditStart(item)}
                                onEditSave={handleEditSave}
                                onEditCancel={handleEditCancel}
                            />
                        );
                    })}
                </List>
                {totalPages > 1 && (
                    <PaginationWrap>
                        <PageButton
                            type="button"
                            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                            aria-label="이전 페이지"
                        >
                            ‹
                        </PageButton>
                        <PageIndicator>
                            {page} / {totalPages}
                        </PageIndicator>
                        <PageButton
                            type="button"
                            onClick={() =>
                                setPage((prev) => Math.min(totalPages, prev + 1))
                            }
                            aria-label="다음 페이지"
                        >
                            ›
                        </PageButton>
                    </PaginationWrap>
                )}
            </HomeCard>

            <HomeCard>
                <CalendarView
                    currentMonth={currentMonth}
                    monthLabel={monthLabel}
                    onMonthChange={handleMonthChange}
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                    setTodoStartDate={setTodoStartDate}
                    setTodoEndDate={setTodoEndDate}
                    todoByDate={todoByDate}
                    currentUid={authUser?.uid}
                />
            </HomeCard>
        </HomeGrid>
    );
}

export default HomePage;
