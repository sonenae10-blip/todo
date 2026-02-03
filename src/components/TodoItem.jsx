import { useEffect, useState } from "react";
import {
    ActionGroup,
    CancelBtn,
    DeleteBtn,
    EditBtn,
    EditFields,
    InlineDateInput,
    InlineInput,
    InlineGroup,
    Item,
    ItemMain,
    ItemText,
    OwnerBadge,
    SaveBtn,
    ToggleChip,
} from "../styles/ui";

function TodoItem({
    item,
    isEditing,
    editText,
    editStartDate,
    editEndDate,
    editRepeatDays,
    onEditTextChange,
    onEditStartDateChange,
    onEditEndDateChange,
    onEditRepeatDayToggle,
    onEditKeyDown,
    canEdit,
    ownerLabel,
    dateLabel,
    ddayLabel,
    isFriend,
    onToggle,
    onDelete,
    onEditStart,
    onEditSave,
    onEditCancel,
}) {
    const [editMode, setEditMode] = useState("basic");

    useEffect(() => {
        if (isEditing) {
            setEditMode("basic");
        }
    }, [isEditing]);

    return (
        <Item $done={item.done} $friend={isFriend}>
            <input
                type="checkbox"
                checked={item.done}
                onChange={canEdit ? onToggle : undefined}
                disabled={!canEdit}
            />
            {isEditing ? (
                <EditFields>
                    <InlineInput
                        type="text"
                        value={editText}
                        onChange={onEditTextChange}
                        onKeyDown={onEditKeyDown}
                        required
                    />
                    {editMode === "basic" ? (
                        <InlineDateInput
                            type="date"
                            value={editStartDate}
                            onChange={onEditStartDateChange}
                            onKeyDown={onEditKeyDown}
                        />
                    ) : (
                        <InlineGroup
                            style={{ flexWrap: "nowrap", width: "100%" }}
                        >
                            <InlineDateInput
                                type="date"
                                value={editStartDate}
                                onChange={onEditStartDateChange}
                                onKeyDown={onEditKeyDown}
                            />
                            <InlineDateInput
                                type="date"
                                value={editEndDate}
                                onChange={onEditEndDateChange}
                                onKeyDown={onEditKeyDown}
                            />
                        </InlineGroup>
                    )}
                    {editMode === "repeat" && (
                        <InlineGroup>
                            {["일", "월", "화", "수", "목", "금", "토"].map(
                                (label, idx) => (
                                    <label key={label} style={{ fontSize: 12 }}>
                                        <input
                                            type="checkbox"
                                            checked={editRepeatDays.includes(idx)}
                                            onChange={() =>
                                                onEditRepeatDayToggle(idx)
                                            }
                                        />{" "}
                                        {label}
                                    </label>
                                )
                            )}
                        </InlineGroup>
                    )}
                    <InlineGroup>
                        <ToggleChip
                            type="button"
                            $active={editMode === "range"}
                            onClick={() =>
                                setEditMode((prev) =>
                                    prev === "range" ? "basic" : "range"
                                )
                            }
                        >
                            기간
                        </ToggleChip>
                        <ToggleChip
                            type="button"
                            $active={editMode === "repeat"}
                            onClick={() =>
                                setEditMode((prev) =>
                                    prev === "repeat" ? "basic" : "repeat"
                                )
                            }
                        >
                            반복
                        </ToggleChip>
                    </InlineGroup>
                </EditFields>
            ) : (
                <ItemMain>
                    <ItemText $done={item.done}>{item.text}</ItemText>
                    {ownerLabel && <OwnerBadge>{ownerLabel}</OwnerBadge>}
                    {dateLabel && <OwnerBadge>{dateLabel}</OwnerBadge>}
                    {ddayLabel && <OwnerBadge>{ddayLabel}</OwnerBadge>}
                </ItemMain>
            )}
            <ActionGroup $editing={isEditing}>
                {canEdit ? (
                    isEditing ? (
                        <>
                            <SaveBtn type="button" onClick={onEditSave}>
                                저장
                            </SaveBtn>
                            <CancelBtn type="button" onClick={onEditCancel}>
                                취소
                            </CancelBtn>
                        </>
                    ) : (
                        <>
                            <EditBtn type="button" onClick={onEditStart}>
                                수정
                            </EditBtn>
                            <DeleteBtn type="button" onClick={onDelete}>
                                삭제
                            </DeleteBtn>
                        </>
                    )
                ) : (
                    <>
                        <DeleteBtn
                            type="button"
                            style={{ visibility: "hidden" }}
                            aria-hidden="true"
                            tabIndex={-1}
                        >
                            수정
                        </DeleteBtn>
                        <DeleteBtn
                            type="button"
                            style={{ visibility: "hidden" }}
                            aria-hidden="true"
                            tabIndex={-1}
                        >
                            삭제
                        </DeleteBtn>
                    </>
                )}
            </ActionGroup>
        </Item>
    );
}

export default TodoItem;
