import styled from "styled-components";
import { Link } from "react-router-dom";

export const AppWrap = styled.div`
    min-height: 100vh;
    padding: 50px 20px;
    display: flex;
    justify-content: center;
    min-width: 450px;
    overflow-x: auto;
`;

export const Layout = styled.div`
    width: min(1100px, 100%);
    display: grid;
    grid-template-columns: 1fr;
    gap: 0;
    align-items: start;
`;

export const Card = styled.div`
    background: ${(props) => props.theme.surface};
    border: 1px solid ${(props) => props.theme.border};
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);

    @media (max-width: 600px) {
        padding: 18px;
    }
`;

export const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
`;

export const Title = styled.h1`
    margin: 0;
    font-size: 22px;
`;

export const ToggleWrap = styled.button`
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

export const ToggleKnob = styled.span`
    width: 26px;
    height: 26px;
    border-radius: 50%;
    background: #ffffff;
    transform: translateX(${(props) => (props.$on ? "30px" : "0")});
    transition: transform 0.2s ease;
`;

export const Form = styled.form`
    display: flex;
    gap: 10px;
    margin-bottom: 16px;
    flex-wrap: wrap;

    @media (max-width: 420px) {
        flex-direction: column;
    }
`;

export const Input = styled.input`
    flex: 1;
    padding: 12px 14px;
    border-radius: 10px;
    border: 1px solid ${(props) => props.theme.border};
    background: transparent;
    color: ${(props) => props.theme.text};
`;

export const DateInput = styled(Input)`
    flex: 0 0 150px;

    @media (max-width: 600px) {
        flex: 1;
    }
`;

export const AddBtn = styled.button`
    padding: 12px 16px;
    border: none;
    border-radius: 10px;
    background: ${(props) => props.theme.accent};
    color: white;
    cursor: pointer;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

export const List = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

export const Item = styled.li`
    display: grid;
    grid-template-columns: 24px 1fr auto;
    align-items: center;
    gap: 12px;
    padding: 12px 14px;
    min-height: 56px;
    border-radius: 12px;
    border: 1px solid ${(props) => props.theme.border};
    background: ${(props) => {
        if (props.$friend && props.$done) return props.theme.friendBg;
        if (props.$done) return props.theme.doneBg;
        return props.theme.surface;
    }};
    min-width: 0;

    @media (max-width: 600px) {
        grid-template-columns: 24px minmax(0, 1fr);
        row-gap: 8px;
    }
`;

export const ItemText = styled.span`
    color: ${(props) => props.theme.text};
    text-decoration: ${(props) => (props.$done ? "line-through" : "none")};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

export const ItemMain = styled.div`
    display: flex;
    align-items: center;
    min-width: 0;
`;

export const DeleteBtn = styled.button`
    border: 1px solid ${(props) => props.theme.border};
    background: transparent;
    color: ${(props) => props.theme.muted};
    padding: 6px 10px;
    border-radius: 8px;
    cursor: pointer;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    @media (max-width: 600px) {
        grid-column: 2 / 3;
        justify-self: start;
    }
`;
export const CalendarHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
`;

export const MonthTitle = styled.h2`
    margin: 0;
    font-size: 18px;
`;

export const NavBtn = styled.button`
    border: 1px solid ${(props) => props.theme.border};
    background: transparent;
    color: ${(props) => props.theme.text};
    padding: 6px 10px;
    border-radius: 8px;
    cursor: pointer;
`;

export const WeekRow = styled.div`
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 6px;
    margin-bottom: 6px;
    font-size: 12px;
    color: ${(props) => props.theme.muted};
    text-align: center;
`;

export const CalendarGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 6px;
    position: relative;
`;

export const DayCell = styled.div`
    height: 96px;
    border-radius: 10px;
    border: 1px solid
        ${(props) => (props.$today ? "#93c5fd" : props.theme.border)};
    background: ${(props) =>
        props.$today ? props.theme.doneBg : props.theme.calendarCell};
    padding: 6px;
    opacity: ${(props) => (props.$empty ? 0.4 : 1)};
    overflow: hidden;
    outline: ${(props) =>
        props.$selected ? "2px solid #60a5fa" : "none"};
    cursor: ${(props) => (props.$empty ? "default" : "pointer")};
    -webkit-tap-highlight-color: transparent;
    user-select: none;

    @media (max-width: 600px) {
        height: 84px;
    }
`;

export const CalendarPopup = styled.div`
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

export const PopupHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
`;

export const PopupTitle = styled.div`
    font-weight: 600;
    font-size: 13px;
`;

export const PopupList = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    gap: 6px;
    font-size: 12px;
`;

export const PopupItem = styled.li`
    padding: 6px 8px;
    border-radius: 8px;
    border: 1px solid ${(props) => props.theme.border};
    background: ${(props) => {
        if (props.$friend && props.$done) return props.theme.friendBg;
        if (props.$done) return props.theme.doneBg;
        return props.theme.surface;
    }};
    text-decoration: ${(props) => (props.$done ? "line-through" : "none")};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

export const DayNumber = styled.div`
    font-size: 12px;
    margin-bottom: 4px;
`;

export const DayList = styled.ul`
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

export const DayItem = styled.li`
    padding: 2px 6px;
    border-radius: 6px;
    background: ${(props) => {
        if (props.$friend && props.$done) return props.theme.friendBg;
        if (props.$done) return props.theme.doneBg;
        return props.theme.surface;
    }};
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

export const SelectedInfo = styled.div`
    margin: 6px 0 12px;
    color: ${(props) => props.theme.muted};
    font-size: 12px;
`;

export const ClearBtn = styled.button`
    border: 1px solid ${(props) => props.theme.border};
    background: transparent;
    color: ${(props) => props.theme.text};
    padding: 4px 8px;
    border-radius: 8px;
    cursor: pointer;
    margin-left: 8px;
`;

export const EditFields = styled.div`
    display: flex;
    gap: 8px;
    align-items: stretch;
    flex-direction: column;
`;

export const InlineInput = styled(Input)`
    padding: 8px 10px;
    font-size: 13px;
`;

export const InlineDateInput = styled(DateInput)`
    padding: 8px 10px;
    font-size: 13px;
`;

export const ActionGroup = styled.div`
    display: flex;
    gap: 8px;
    align-items: center;
    flex-wrap: nowrap;
    white-space: nowrap;
    min-width: 0;

    @media (max-width: 1130px) {
        grid-column: 2 / -1;
        justify-self: start;
        margin-top: 6px;
        grid-row: ${(props) => (props.$editing ? "2" : "1")};
    }

    @media (max-width: 600px) {
        grid-column: 2 / 3;
        justify-self: start;
    }
`;

export const EditBtn = styled(DeleteBtn)``;

export const SaveBtn = styled(AddBtn)`
    padding: 8px 12px;
    font-size: 12px;
`;

export const CancelBtn = styled(DeleteBtn)``;

export const Section = styled.div`
    margin-top: 16px;
    padding-top: 12px;
    border-top: 1px solid ${(props) => props.theme.border};
`;

export const SectionTitle = styled.h3`
    margin: 0 0 10px;
    font-size: 15px;
`;

export const MiniForm = styled.form`
    display: grid;
    gap: 10px;
`;

export const MiniInput = styled(Input)`
    padding: 10px 12px;
    font-size: 14px;
    width: 100%;
`;

export const MiniBtn = styled(AddBtn)`
    padding: 10px 14px;
    font-size: 13px;
    justify-self: stretch;
    width: 100%;
    text-align: center;
`;

export const InlineGroup = styled.div`
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    align-items: center;
`;

export const TodoInputRow = styled.div`
    display: flex;
    gap: 10px;
    flex-wrap: nowrap;
    align-items: center;
    width: 100%;

    @media (max-width: 485px) {
        flex-direction: column;
        align-items: stretch;
    }
`;

export const TodoTextRow = styled.div`
    display: flex;
    gap: 10px;
    align-items: center;
    flex: 1 1 auto;
    min-width: 0;

    & > input {
        flex: 1 1 auto;
    }
`;

export const TodoDateInput = styled(DateInput)`
    flex: 1 1 auto;
    min-width: 0;
`;

export const TodoAddBtn = styled(AddBtn)`
    flex: 0 0 auto;
    width: 78px;
`;

export const DateRangeRow = styled.div`
    display: flex;
    gap: 8px;
    flex-wrap: wrap;

    @media (max-width: 450px) {
        flex-wrap: nowrap;
        overflow-x: auto;
    }

    @media (min-width: 995px) {
        & > label {
            flex: 1 1 0;
        }

        & > label > input {
            flex: 1 1 auto;
            min-width: 0;
        }
    }
`;

export const RepeatDaysRow = styled.div`
    display: flex;
    gap: 6px;
    flex-wrap: wrap;

    @media (max-width: 450px) {
        flex-wrap: nowrap;
        overflow-x: auto;
    }
`;

export const AuthLinks = styled.div`
    display: flex;
    gap: 14px;
    align-items: center;
    font-size: 12px;
    color: ${(props) => props.theme.muted};
    margin-top: 8px;
`;

export const TextLink = styled.button`
    border: none;
    background: transparent;
    color: ${(props) => props.theme.accent};
    cursor: pointer;
    padding: 0;
`;

export const Badge = styled.span`
    display: inline-flex;
    align-items: center;
    padding: 2px 6px;
    border-radius: 999px;
    border: 1px solid ${(props) => props.theme.border};
    font-size: 11px;
    color: ${(props) => props.theme.muted};
`;

export const OwnerBadge = styled(Badge)`
    margin-left: 8px;
    white-space: nowrap;
    flex-shrink: 0;
`;
export const FriendList = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    gap: 6px;
`;

export const FriendItem = styled.li`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    padding: 8px 10px;
    border-radius: 10px;
    border: 1px solid ${(props) => props.theme.border};
    font-size: 13px;
`;

export const SmallNote = styled.div`
    font-size: 12px;
    color: ${(props) => props.theme.muted};
`;

export const InfoGrid = styled.div`
    display: grid;
    gap: 8px;
    margin-top: 12px;
`;

export const InfoRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    font-size: 13px;
`;

export const CopyBtn = styled(DeleteBtn)`
    padding: 4px 8px;
    font-size: 11px;
`;

export const Message = styled.div`
    margin-top: 8px;
    font-size: 12px;
    color: ${(props) =>
        props.$tone === "success" ? "#15803d" : "#b91c1c"};
`;

export const ModalOverlay = styled.div`
    position: fixed;
    inset: 0;
    background: rgba(15, 23, 42, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    z-index: 10;
`;

export const ModalCard = styled.div`
    width: min(420px, 100%);
    background: ${(props) => props.theme.surface};
    border: 1px solid ${(props) => props.theme.border};
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
`;

export const ModalTitle = styled.h4`
    margin: 0 0 8px;
    font-size: 16px;
`;

export const ModalActions = styled.div`
    margin-top: 16px;
    display: flex;
    gap: 8px;
    justify-content: flex-end;
`;

export const FullscreenWrap = styled.div`
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 32px 20px;
    background: ${(props) => props.theme.bg};
`;

export const AuthShell = styled.div`
    position: relative;
    width: min(420px, 100%);
`;

export const AuthCard = styled(Card)`
    width: min(420px, 100%);
    padding: 26px;
    position: relative;
`;

export const TopBar = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    grid-column: 1 / -1;
    padding-bottom: 50px;

    @media (max-width: 600px) {
        padding-bottom: 50px;
    }
`;

export const NavBar = styled.nav`
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
`;

export const NavLink = styled(Link)`
    padding: 6px 10px;
    border-radius: 999px;
    border: 1px solid ${(props) => props.theme.border};
    color: ${(props) => props.theme.text};
    text-decoration: none;
    font-size: 12px;
`;

export const UserMeta = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
`;

export const WideCard = styled(Card)`
    grid-column: 1 / -1;
    margin-top: 0;
    min-height: 540px;
`;

export const HomeGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 540px));
    gap: 20px;
    align-items: start;
    grid-column: 1 / -1;
    width: 100%;
    justify-content: center;

    @media (max-width: 995px) {
        grid-template-columns: 1fr;
    }
`;

export const HomeCard = styled(Card)`
    min-height: 540px;
`;


export const RulesList = styled.ul`
    margin: 6px 0 0;
    padding-left: 18px;
    font-size: 12px;
    color: ${(props) => props.theme.muted};
    display: grid;
    gap: 4px;
`;

export const RulesCard = styled.div`
    background: ${(props) => props.theme.surface};
    border: 1px solid ${(props) => props.theme.border};
    border-radius: 12px;
    padding: 10px 12px;
    font-size: 12px;
    color: ${(props) => props.theme.text};
`;

export const RulesFloat = styled.div`
    position: absolute;
    right: calc(100% + 16px);
    top: 50%;
    transform: translateY(-50%);
    width: 180px;

    @media (max-width: 900px) {
        position: static;
        width: 100%;
        transform: none;
        margin-bottom: 12px;
    }
`;

export const ToggleChip = styled.button`
    border: 1px solid ${(props) => props.theme.border};
    background: ${(props) =>
        props.$active ? props.theme.accent : "transparent"};
    color: ${(props) => (props.$active ? "#ffffff" : props.theme.text)};
    padding: 6px 10px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 12px;
`;

export const PaginationWrap = styled.div`
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
    margin-top: 10px;
    justify-content: center;
`;

export const PageButton = styled.button`
    border: 1px solid ${(props) => props.theme.border};
    background: ${(props) =>
        props.$active ? props.theme.accent : "transparent"};
    color: ${(props) => (props.$active ? "#ffffff" : props.theme.text)};
    padding: 4px 10px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 12px;
    height: 28px;
`;

export const PageIndicator = styled.span`
    display: inline-flex;
    align-items: center;
    font-size: 12px;
    color: ${(props) => props.theme.muted};
    padding: 0 6px;
    height: 28px;
`;
