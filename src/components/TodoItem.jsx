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
                </EditFields>
            ) : (
                <ItemMain>
                    <ItemText $done={item.done}>{item.text}</ItemText>
                    {ownerLabel && <OwnerBadge>{ownerLabel}</OwnerBadge>}
                    {dateLabel && <OwnerBadge>{dateLabel}</OwnerBadge>}
                    {ddayLabel && <OwnerBadge>{ddayLabel}</OwnerBadge>}
                </ItemMain>
            )}
            <ActionGroup>
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
