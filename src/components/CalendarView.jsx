import { useMemo } from "react";
import {
    CalendarGrid,
    CalendarHeader,
    DayCell,
    DayItem,
    DayList,
    DayNumber,
    MonthTitle,
    NavBtn,
    WeekRow,
} from "../styles/ui";

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

function CalendarView({
    currentMonth,
    monthLabel,
    onMonthChange,
    selectedDate,
    setSelectedDate,
    setTodoStartDate,
    setTodoEndDate,
    todoByDate,
    currentUid,
}) {
    const cells = useMemo(() => buildMonthCells(currentMonth), [currentMonth]);
    const todayKey = useMemo(() => formatDateKey(new Date()), []);

    return (
        <>
            <CalendarHeader>
                <NavBtn type="button" onClick={() => onMonthChange(-1)}>
                    이전
                </NavBtn>
                <MonthTitle>{monthLabel}</MonthTitle>
                <NavBtn type="button" onClick={() => onMonthChange(1)}>
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
                                if (selectedDate === dateKey) {
                                    setSelectedDate("");
                                    return;
                                }
                                setSelectedDate(dateKey);
                                setTodoStartDate(dateKey);
                                setTodoEndDate(dateKey);
                            }}
                            $selected={selectedDate === dateKey}
                            $today={dateKey === todayKey}
                        >
                            <DayNumber>{dateObj.getDate()}</DayNumber>
                            <DayList>
                                {items.slice(0, 2).map((item) => (
                                    <DayItem
                                        key={item.id}
                                        $done={item.done}
                                        $friend={
                                            Boolean(currentUid) &&
                                            Boolean(item.ownerUid) &&
                                            item.ownerUid !== currentUid
                                        }
                                    >
                                        {item.text}
                                    </DayItem>
                                ))}
                                {items.length > 2 && (
                                    <DayItem $done={false}>
                                        +{items.length - 2}개
                                    </DayItem>
                                )}
                            </DayList>
                        </DayCell>
                    );
                })}
            </CalendarGrid>
        </>
    );
}

export default CalendarView;
