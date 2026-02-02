import { useState } from "react";
import { Form, Input, DateInput, ToggleChip, TodoInputRow, TodoTextRow, TodoDateInput, TodoAddBtn, DateRangeRow, RepeatDaysRow } from "../styles/ui";

function TodoInputWithDate({
    textValue,
    startDateValue,
    endDateValue,
    repeatDays,
    onTextChange,
    onStartDateChange,
    onEndDateChange,
    onRepeatDayToggle,
    onSubmit,
    disabled,
}) {
    const [showRange, setShowRange] = useState(false);
    const [showRepeat, setShowRepeat] = useState(false);

    const toggleRange = () => {
        if (showRange) {
            setShowRange(false);
            return;
        }
        setShowRange(true);
        setShowRepeat(false);
    };

    const toggleRepeat = () => {
        if (showRepeat) {
            setShowRepeat(false);
            return;
        }
        setShowRepeat(true);
        setShowRange(false);
    };

    return (
        <Form onSubmit={onSubmit} style={{ flexDirection: "column" }}>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                <ToggleChip
                    type="button"
                    onClick={toggleRange}
                    disabled={disabled}
                    $active={showRange}
                >
                    기간
                </ToggleChip>
                <ToggleChip
                    type="button"
                    onClick={toggleRepeat}
                    disabled={disabled}
                    $active={showRepeat}
                >
                    반복
                </ToggleChip>
            </div>

            {showRange && (
                <DateRangeRow>
                    <label style={{ display: "inline-flex", gap: 6, alignItems: "center", fontSize: 12, whiteSpace: "nowrap" }}>
                        시작일
                        <DateInput
                            type="date"
                            value={startDateValue}
                            onChange={onStartDateChange}
                            disabled={disabled}
                        />
                    </label>
                    <label style={{ display: "inline-flex", gap: 6, alignItems: "center", fontSize: 12, whiteSpace: "nowrap" }}>
                        종료일
                        <DateInput
                            type="date"
                            value={endDateValue}
                            onChange={onEndDateChange}
                            disabled={disabled}
                        />
                    </label>
                </DateRangeRow>
            )}

            {showRepeat && (
                <div style={{ display: "grid", gap: 8 }}>
                    <DateRangeRow>
                        <label style={{ display: "inline-flex", gap: 6, alignItems: "center", fontSize: 12, whiteSpace: "nowrap" }}>
                            시작일
                            <DateInput
                                type="date"
                                value={startDateValue}
                                onChange={onStartDateChange}
                                disabled={disabled}
                            />
                        </label>
                        <label style={{ display: "inline-flex", gap: 6, alignItems: "center", fontSize: 12, whiteSpace: "nowrap" }}>
                            종료일
                            <DateInput
                                type="date"
                                value={endDateValue}
                                onChange={onEndDateChange}
                                disabled={disabled}
                            />
                        </label>
                    </DateRangeRow>
                    <RepeatDaysRow>
                        {["일", "월", "화", "수", "목", "금", "토"].map(
                            (label, idx) => (
                                <label key={label} style={{ fontSize: 12 }}>
                                    <input
                                        type="checkbox"
                                        checked={repeatDays.includes(idx)}
                                        onChange={() => onRepeatDayToggle(idx)}
                                        disabled={disabled}
                                    />{" "}
                                    {label}
                                </label>
                            )
                        )}
                    </RepeatDaysRow>
                </div>
            )}

            <TodoInputRow>
                {!showRange && !showRepeat && (
                    <TodoDateInput
                        type="date"
                        value={startDateValue}
                        onChange={onStartDateChange}
                        disabled={disabled}
                    />
                )}
                <TodoTextRow>
                    <Input
                        type="text"
                        placeholder="할 일을 입력해주세요."
                        value={textValue}
                        onChange={onTextChange}
                        required
                        disabled={disabled}
                    />
                    <TodoAddBtn type="submit" disabled={disabled}>
                        추가
                    </TodoAddBtn>
                </TodoTextRow>
            </TodoInputRow>
        </Form>
    );
}

export default TodoInputWithDate;
