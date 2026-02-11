import { ThemeProvider } from "styled-components";
import { useEffect, useMemo, useState } from "react";
import {
    BrowserRouter,
    Navigate,
    Route,
    Routes,
    useLocation,
} from "react-router-dom";
import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signOut,
} from "firebase/auth";
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    onSnapshot,
    query,
    serverTimestamp,
    setDoc,
    updateDoc,
    where,
    writeBatch,
} from "firebase/firestore";
import GlobalStyle from "./styles/GlobalStyle";
import { lightTheme, darkTheme } from "./styles/theme";
import {
    AppWrap,
    AuthCard,
    Badge,
    FullscreenWrap,
    Layout,
    ModalActions,
    ModalCard,
    ModalOverlay,
    ModalTitle,
    NavBar,
    NavLink,
    SmallNote,
    TextLink,
    Title,
    TopBar,
    UserMeta,
} from "./styles/ui";
import { auth, db } from "./firebase";
import AuthPage from "./pages/AuthPage";
import FriendsPage from "./pages/FriendsPage";
import HomePage from "./pages/HomePage";
import MyPage from "./pages/MyPage";

const STORAGE_KEY = "todoList";

function normalizeHandle(value) {
    return value.trim().toLowerCase();
}

function createRandomHandle() {
    const fragment = Math.random().toString(36).slice(2, 8);
    return `todo${fragment}`;
}

function normalizeTodoList(list) {
    if (!Array.isArray(list)) return [];
    return list.map((item) => ({
        id: item.id || `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        text: item.text || "",
        done: Boolean(item.done),
        date: item.date || "",
        startDate: item.startDate || item.date || "",
        endDate: item.endDate || item.date || "",
        repeatDays: Array.isArray(item.repeatDays) ? item.repeatDays : [],
    }));
}

function normalizeDateKey(dateKey) {
    if (!dateKey) return "";
    const raw = String(dateKey).trim();
    if (!raw) return "";

    const isoMatch = raw.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
    if (isoMatch) {
        const year = isoMatch[1];
        const month = isoMatch[2].padStart(2, "0");
        const day = isoMatch[3].padStart(2, "0");
        const normalized = `${year}-${month}-${day}`;
        const parsed = new Date(`${normalized}T00:00:00`);
        if (!Number.isNaN(parsed.getTime())) return normalized;
    }

    const parsed = new Date(raw);
    if (Number.isNaN(parsed.getTime())) return "";
    return formatDateKey(parsed);
}

function parseDateKey(dateKey) {
    const normalized = normalizeDateKey(dateKey);
    if (!normalized) return null;
    return new Date(`${normalized}T00:00:00`);
}

function formatDateKey(dateObj) {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function normalizeDateRange(startKey, endKey) {
    const normalizedStart = normalizeDateKey(startKey);
    if (!normalizedStart) return { startKey: "", endKey: "" };
    const normalizedEnd = normalizeDateKey(endKey || normalizedStart);
    const startDate = parseDateKey(normalizedStart);
    const endDate = parseDateKey(normalizedEnd || normalizedStart);
    if (!startDate) return { startKey: "", endKey: "" };
    if (!endDate || endDate < startDate) {
        return { startKey: normalizedStart, endKey: normalizedStart };
    }
    return { startKey: normalizedStart, endKey: formatDateKey(endDate) };
}

function getItemRange(item) {
    const { startKey, endKey } = normalizeDateRange(
        item.startDate || item.date || "",
        item.endDate || item.date || item.startDate || ""
    );
    const repeatDays = Array.isArray(item.repeatDays) ? item.repeatDays : [];
    return { startKey, endKey, repeatDays };
}

function itemMatchesDate(item, dateKey) {
    const targetKey = normalizeDateKey(dateKey);
    if (!targetKey) return false;
    const { startKey, endKey, repeatDays } = getItemRange(item);
    if (!startKey) return false;
    if (targetKey < startKey || targetKey > endKey) return false;
    if (repeatDays.length === 0) return true;
    const dateObj = parseDateKey(targetKey);
    if (!dateObj) return false;
    return repeatDays.includes(dateObj.getDay());
}


function validatePassword(password, email) {
    if (!password || password.length < 8) return false;
    if (/\s/.test(password)) return false;
    const hasLetter = /[A-Za-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);
    const typeCount = [hasLetter, hasNumber, hasSpecial].filter(Boolean).length;
    if (typeCount < 2) return false;
    const trimmedEmail = String(email || "").trim();
    if (trimmedEmail && password === trimmedEmail) return false;
    return true;
}

function App() {
    const today = new Date().toISOString().slice(0, 10);
    const [todo, setTodo] = useState("");
    const [todoStartDate, setTodoStartDate] = useState(today);
    const [todoEndDate, setTodoEndDate] = useState(today);
    const [todoRepeatDays, setTodoRepeatDays] = useState([]);
    const [todoList, setTodoList] = useState([]);
    const [localCache, setLocalCache] = useState([]);
    const [localMigrated, setLocalMigrated] = useState(false);
    const [isDark, setIsDark] = useState(false);
    const [selectedDate, setSelectedDate] = useState("");
    const [popupDate, setPopupDate] = useState("");
    const [currentMonth, setCurrentMonth] = useState(() => {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), 1);
    });
    const [editingId, setEditingId] = useState("");
    const [editText, setEditText] = useState("");
    const [editStartDate, setEditStartDate] = useState("");
    const [editEndDate, setEditEndDate] = useState("");
    const [editRepeatDays, setEditRepeatDays] = useState([]);
    const [authUser, setAuthUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [authView, setAuthView] = useState("login");
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [signupEmail, setSignupEmail] = useState("");
    const [signupPassword, setSignupPassword] = useState("");
    const [resetEmail, setResetEmail] = useState("");
    const [authMessage, setAuthMessage] = useState(null);
    const [profile, setProfile] = useState(null);
    const [friendHandle, setFriendHandle] = useState("");
    const [friendMessage, setFriendMessage] = useState(null);
    const [myPageMessage, setMyPageMessage] = useState(null);
    const [todoMessage, setTodoMessage] = useState(null);
    const [pendingHandle, setPendingHandle] = useState("");
    const [friends, setFriends] = useState([]);
    const [incomingRequests, setIncomingRequests] = useState([]);
    const [outgoingRequests, setOutgoingRequests] = useState([]);
    const [friendToRemove, setFriendToRemove] = useState(null);
    const [handleEnsured, setHandleEnsured] = useState(false);

    useEffect(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return;
            const parsed = JSON.parse(raw);
            const normalized = normalizeTodoList(parsed);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
            setLocalCache(normalized);
        } catch {
            setLocalCache([]);
        }
    }, []);
    useEffect(() => {
        if (!authMessage) return;
        const timer = setTimeout(() => setAuthMessage(null), 4000);
        return () => clearTimeout(timer);
    }, [authMessage]);

    useEffect(() => {
        if (!friendMessage) return;
        const timer = setTimeout(() => setFriendMessage(null), 4000);
        return () => clearTimeout(timer);
    }, [friendMessage]);

    useEffect(() => {
        if (!myPageMessage) return;
        const timer = setTimeout(() => setMyPageMessage(null), 4000);
        return () => clearTimeout(timer);
    }, [myPageMessage]);

    useEffect(() => {
        if (!todoMessage) return;
        const timer = setTimeout(() => setTodoMessage(null), 4000);
        return () => clearTimeout(timer);
    }, [todoMessage]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setAuthUser(user);
            setAuthLoading(false);
            if (!user) {
                setProfile(null);
                setFriends([]);
                setIncomingRequests([]);
                setOutgoingRequests([]);
                setTodoList([]);
                setPendingHandle("");
                setHandleEnsured(false);
            }
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!authUser) return undefined;
        const userRef = doc(db, "users", authUser.uid);
        return onSnapshot(userRef, (snap) => {
            if (snap.exists()) {
                setProfile({ id: snap.id, ...snap.data() });
            }
        });
    }, [authUser]);

    useEffect(() => {
        if (!authUser) return;
        const ensureProfile = async () => {
            try {
                if (handleEnsured) return;
                const email = authUser.email || "";
                const userRef = doc(db, "users", authUser.uid);
                const userSnap = await getDoc(userRef);
                const existingHandle = userSnap.exists()
                    ? userSnap.data().handle
                    : "";

                if (existingHandle) {
                    const normalized = normalizeHandle(existingHandle);
                    if (normalized !== existingHandle) {
                        await setDoc(
                            userRef,
                            { handle: normalized },
                            { merge: true }
                        );
                    }
                    const handleRef = doc(db, "handles", normalized);
                    const handleSnap = await getDoc(handleRef);
                    if (!handleSnap.exists()) {
                        await setDoc(handleRef, { uid: authUser.uid });
                    }
                    setHandleEnsured(true);
                    return;
                }

                let handle = "";
                for (let i = 0; i < 12; i += 1) {
                    const candidate = normalizeHandle(createRandomHandle());
                    if (candidate === normalizeHandle(email)) continue;
                    const handleRef = doc(db, "handles", candidate);
                    const handleSnap = await getDoc(handleRef);
                    if (!handleSnap.exists()) {
                        handle = candidate;
                        break;
                    }
                }
                if (!handle) {
                    setMyPageMessage({
                        tone: "error",
                        text: "아이디 생성에 실패했습니다.",
                    });
                    return;
                }
                setPendingHandle(handle);
                await setDoc(doc(db, "handles", handle), {
                    uid: authUser.uid,
                });
                await setDoc(
                    userRef,
                    {
                        email,
                        handle,
                        handleAuto: true,
                        createdAt: serverTimestamp(),
                    },
                    { merge: true }
                );
                setHandleEnsured(true);
            } catch {
                setMyPageMessage({
                    tone: "error",
                    text: "아이디 생성 권한을 확인해주세요.",
                });
            }
        };
        ensureProfile();
    }, [authUser, handleEnsured]);
    useEffect(() => {
        if (!authUser) return undefined;
        const friendsQuery = query(
            collection(db, "friends"),
            where("ownerUid", "==", authUser.uid)
        );
        return onSnapshot(friendsQuery, (snap) => {
            const next = [];
            snap.forEach((docSnap) => {
                next.push({ id: docSnap.id, ...docSnap.data() });
            });
            setFriends(next);
        });
    }, [authUser]);

    useEffect(() => {
        if (!authUser) return undefined;
        const incomingQuery = query(
            collection(db, "friendRequests"),
            where("toUid", "==", authUser.uid)
        );
        const outgoingQuery = query(
            collection(db, "friendRequests"),
            where("fromUid", "==", authUser.uid)
        );
        const unsubIncoming = onSnapshot(incomingQuery, (snap) => {
            const next = [];
            snap.forEach((docSnap) => {
                next.push({ id: docSnap.id, ...docSnap.data() });
            });
            setIncomingRequests(next);
        });
        const unsubOutgoing = onSnapshot(outgoingQuery, (snap) => {
            const next = [];
            snap.forEach((docSnap) => {
                next.push({ id: docSnap.id, ...docSnap.data() });
            });
            setOutgoingRequests(next);
        });
        return () => {
            unsubIncoming();
            unsubOutgoing();
        };
    }, [authUser]);

    useEffect(() => {
        if (!authUser) return undefined;
        const ownerIds = [
            authUser.uid,
            ...friends.map((friend) => friend.friendUid),
        ];
        const chunks = [];
        for (let i = 0; i < ownerIds.length; i += 10) {
            chunks.push(ownerIds.slice(i, i + 10));
        }
        const unsubscribes = chunks.map((chunk) => {
            const q = query(
                collection(db, "todos"),
                where("ownerUid", "in", chunk)
            );
            return onSnapshot(
                q,
                (snap) => {
                    setTodoList((prev) => {
                        const chunkSet = new Set(chunk);
                        const nextMap = new Map(
                            prev
                                .filter((item) => !chunkSet.has(item.ownerUid))
                                .map((item) => [item.id, item])
                        );
                        snap.forEach((docSnap) => {
                            nextMap.set(docSnap.id, {
                                id: docSnap.id,
                                ...docSnap.data(),
                            });
                        });
                        return Array.from(nextMap.values());
                    });
                },
                () => {
                    setTodoMessage({
                        tone: "error",
                        text: "일정 불러오기에 실패했습니다.",
                    });
                }
            );
        });
        return () => {
            unsubscribes.forEach((unsub) => unsub());
        };
    }, [authUser, friends]);

    useEffect(() => {
        if (!authUser || localMigrated || localCache.length === 0) return;
        const migrate = async () => {
            try {
                await Promise.all(
                    localCache.map((item) => {
                        const { startKey, endKey } = normalizeDateRange(
                            item.startDate || item.date || today,
                            item.endDate || item.date || item.startDate || today
                        );
                        return addDoc(collection(db, "todos"), {
                            text: item.text,
                            done: item.done,
                            date: startKey,
                            startDate: startKey,
                            endDate: endKey,
                            repeatDays: Array.isArray(item.repeatDays)
                                ? item.repeatDays
                                : [],
                            ownerUid: authUser.uid,
                            ownerHandle: profile?.handle || "",
                            ownerAuto: Boolean(profile?.handleAuto),
                            createdAt: serverTimestamp(),
                            updatedAt: serverTimestamp(),
                        });
                    })
                );
                setLocalCache([]);
                localStorage.removeItem(STORAGE_KEY);
                setLocalMigrated(true);
            } catch {
                setLocalMigrated(true);
            }
        };
        migrate();
    }, [authUser, localCache, localMigrated, profile]);

    const todoByDate = useMemo(() => {
        const monthStart = new Date(
            currentMonth.getFullYear(),
            currentMonth.getMonth(),
            1
        );
        const monthEnd = new Date(
            currentMonth.getFullYear(),
            currentMonth.getMonth() + 1,
            0
        );
        const map = {};

        todoList.forEach((item) => {
            const { startKey, endKey, repeatDays } = getItemRange(item);
            if (!startKey) return;
            const normalized = normalizeDateRange(startKey, endKey);
            if (!normalized.startKey) return;
            const rangeStart = parseDateKey(normalized.startKey);
            const rangeEnd = parseDateKey(normalized.endKey);
            if (!rangeStart || !rangeEnd) return;

            const effectiveStart =
                rangeStart > monthStart ? rangeStart : monthStart;
            const effectiveEnd = rangeEnd < monthEnd ? rangeEnd : monthEnd;
            if (effectiveEnd < effectiveStart) return;

            const cursor = new Date(effectiveStart);
            while (cursor <= effectiveEnd) {
                if (
                    repeatDays.length === 0 ||
                    repeatDays.includes(cursor.getDay())
                ) {
                    const key = formatDateKey(cursor);
                    if (!map[key]) map[key] = [];
                    map[key].push(item);
                }
                cursor.setDate(cursor.getDate() + 1);
            }
        });

        return map;
    }, [todoList, currentMonth]);

    const ownTodoCount = useMemo(() => {
        if (!authUser) return 0;
        return todoList.filter((item) => item.ownerUid === authUser.uid).length;
    }, [todoList, authUser]);

    const sharedTodoCount = useMemo(() => {
        if (!authUser) return 0;
        return todoList.filter((item) => item.ownerUid !== authUser.uid).length;
    }, [todoList, authUser]);

    const createdAtLabel = useMemo(() => {
        const createdAt = profile?.createdAt?.toDate?.();
        if (!createdAt) return "";
        return createdAt.toLocaleDateString("ko-KR");
    }, [profile]);

    const displayHandle = profile?.handle || pendingHandle || "";
    const friendHandleMap = useMemo(() => {
        const map = {};
        friends.forEach((friend) => {
            if (friend.friendUid) {
                map[friend.friendUid] = friend.friendHandle || "친구";
            }
        });
        return map;
    }, [friends]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        const trimmed = todo.trim();
        if (!trimmed || !authUser) return;
        const { startKey, endKey } = normalizeDateRange(
            todoStartDate || today,
            todoEndDate || todoStartDate || today
        );
        try {
            await addDoc(collection(db, "todos"), {
                text: trimmed,
                done: false,
                date: startKey,
                startDate: startKey,
                endDate: endKey,
                repeatDays: [...new Set(todoRepeatDays)].sort(),
                ownerUid: authUser.uid,
                ownerHandle: displayHandle,
                ownerAuto: Boolean(profile?.handleAuto),
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });
            setTodo("");
            setTodoStartDate(today);
            setTodoEndDate(today);
            setTodoRepeatDays([]);
        } catch {
            setTodoMessage({
                tone: "error",
                text: "일정 추가에 실패했습니다.",
            });
        }
    };

    const handleToggle = async (item) => {
        if (!authUser || (item.ownerUid && item.ownerUid !== authUser.uid)) {
            return;
        }
        try {
            await updateDoc(doc(db, "todos", item.id), {
                done: !item.done,
                updatedAt: serverTimestamp(),
            });
        } catch {
            setTodoMessage({
                tone: "error",
                text: "체크 상태 변경에 실패했습니다.",
            });
        }
    };

    const handleDelete = async (item) => {
        if (!authUser || (item.ownerUid && item.ownerUid !== authUser.uid)) {
            return;
        }
        try {
            await deleteDoc(doc(db, "todos", item.id));
        } catch {
            setTodoMessage({
                tone: "error",
                text: "일정 삭제에 실패했습니다.",
            });
        }
    };

    const handleEditStart = (item) => {
        const { startKey, endKey, repeatDays } = getItemRange(item);
        setEditingId(item.id);
        setEditText(item.text);
        setEditStartDate(startKey || today);
        setEditEndDate(endKey || startKey || today);
        setEditRepeatDays(repeatDays);
    };

    const handleEditCancel = () => {
        setEditingId("");
        setEditText("");
        setEditStartDate("");
        setEditEndDate("");
        setEditRepeatDays([]);
    };

    const handleEditSave = async () => {
        if (!authUser || !editingId) return;
        const trimmed = editText.trim();
        if (!trimmed) return;
        const { startKey, endKey } = normalizeDateRange(
            editStartDate || today,
            editEndDate || editStartDate || today
        );
        try {
            await updateDoc(doc(db, "todos", editingId), {
                text: trimmed,
                date: startKey,
                startDate: startKey,
                endDate: endKey,
                repeatDays: [...new Set(editRepeatDays)].sort(),
                updatedAt: serverTimestamp(),
            });
            handleEditCancel();
        } catch {
            setTodoMessage({
                tone: "error",
                text: "일정 수정에 실패했습니다.",
            });
        }
    };

    const handleEditKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleEditSave();
        } else if (e.key === "Escape") {
            e.preventDefault();
            handleEditCancel();
        }
    };

    const handleTodoRepeatToggle = (dayIdx) => {
        setTodoRepeatDays((prev) =>
            prev.includes(dayIdx)
                ? prev.filter((day) => day !== dayIdx)
                : [...prev, dayIdx]
        );
    };

    const handleEditRepeatToggle = (dayIdx) => {
        setEditRepeatDays((prev) =>
            prev.includes(dayIdx)
                ? prev.filter((day) => day !== dayIdx)
                : [...prev, dayIdx]
        );
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

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
            setAuthMessage({ tone: "success", text: "로그인 성공!" });
        } catch {
            setAuthMessage({
                tone: "error",
                text: "로그인 실패. 이메일과 비밀번호를 확인하세요.",
            });
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        if (!validatePassword(signupPassword, signupEmail)) {
            setAuthMessage({
                tone: "error",
                text: "비밀번호 규칙을 확인해주세요.",
            });
            return;
        }
        try {
            const credential = await createUserWithEmailAndPassword(
                auth,
                signupEmail,
                signupPassword
            );
            let handle = "";
            const handleAuto = true;
            for (let i = 0; i < 12; i += 1) {
                const candidate = normalizeHandle(createRandomHandle());
                if (candidate === normalizeHandle(signupEmail)) continue;
                if (candidate === signupPassword) continue;
                const handleRef = doc(db, "handles", candidate);
                const handleSnap = await getDoc(handleRef);
                if (!handleSnap.exists()) {
                    handle = candidate;
                    break;
                }
            }
            if (!handle) {
                throw new Error("HANDLE_GENERATION_FAILED");
            }
            await setDoc(doc(db, "handles", handle), {
                uid: credential.user.uid,
            });
            await setDoc(doc(db, "users", credential.user.uid), {
                email: signupEmail,
                handle,
                handleAuto,
                createdAt: serverTimestamp(),
            });
            setAuthMessage({
                tone: "success",
                text: "회원가입 완료! 로그인 해주세요.",
            });
            setAuthView("login");
        } catch {
            setAuthMessage({
                tone: "error",
                text: "회원가입에 실패했습니다.",
            });
        }
    };

    const handleReset = async (e) => {
        e.preventDefault();
        try {
            await sendPasswordResetEmail(auth, resetEmail);
            setAuthMessage({
                tone: "success",
                text: "비밀번호 재설정 메일을 보냈습니다.",
            });
        } catch {
            setAuthMessage({
                tone: "error",
                text: "비밀번호 찾기에 실패했습니다.",
            });
        }
    };

    const handleLogout = async () => {
        await signOut(auth);
    };

    const handleCopyId = async () => {
        if (!displayHandle) return;
        try {
            await navigator.clipboard.writeText(displayHandle);
            setMyPageMessage({ tone: "success", text: "아이디를 복사했어요." });
        } catch {
            setMyPageMessage({
                tone: "error",
                text: "복사에 실패했습니다.",
            });
        }
    };
    const handleSendRequest = async (e) => {
        e.preventDefault();
        if (!authUser || !profile) return;
        try {
            const targetHandle = normalizeHandle(friendHandle);
            if (!displayHandle) {
                setFriendMessage({
                    tone: "error",
                    text: "아이디 생성 중입니다. 잠시 후 다시 시도하세요.",
                });
                return;
            }
            if (!targetHandle || targetHandle === normalizeHandle(displayHandle)) {
                setFriendMessage({
                    tone: "error",
                    text: "올바른 친구 아이디를 입력하세요.",
                });
                return;
            }
            const handleSnap = await getDoc(doc(db, "handles", targetHandle));
            if (!handleSnap.exists()) {
                setFriendMessage({
                    tone: "error",
                    text: "해당 아이디를 찾을 수 없습니다.",
                });
                return;
            }
            const targetUid = handleSnap.data().uid;
            const requestId = `${authUser.uid}_${targetUid}`;
            const existingFriend = friends.find(
                (friend) => friend.friendUid === targetUid
            );
            if (existingFriend) {
                setFriendMessage({
                    tone: "error",
                    text: "이미 친구입니다.",
                });
                return;
            }
            if (
                outgoingRequests.some((req) => req.toUid === targetUid) ||
                incomingRequests.some((req) => req.fromUid === targetUid)
            ) {
                setFriendMessage({
                    tone: "error",
                    text: "이미 요청이 존재합니다.",
                });
                return;
            }
            await setDoc(doc(db, "friendRequests", requestId), {
                fromUid: authUser.uid,
                toUid: targetUid,
                fromHandle: displayHandle,
                toHandle: targetHandle,
                createdAt: serverTimestamp(),
            });
            setFriendHandle("");
            setFriendMessage({ tone: "success", text: "친구 요청을 보냈어요." });
        } catch {
            setFriendMessage({
                tone: "error",
                text: "요청 전송에 실패했습니다.",
            });
        }
    };

    const handleAcceptRequest = async (request) => {
        if (!authUser || !profile) return;
        const fromUid = request.fromUid;
        const toUid = request.toUid;
        const friendId = `${toUid}_${fromUid}`;
        const reverseId = `${fromUid}_${toUid}`;
        const batch = writeBatch(db);
        batch.set(doc(db, "friends", friendId), {
            ownerUid: toUid,
            friendUid: fromUid,
            friendHandle: request.fromHandle,
            createdAt: serverTimestamp(),
        });
        batch.set(doc(db, "friends", reverseId), {
            ownerUid: fromUid,
            friendUid: toUid,
            friendHandle: displayHandle,
            createdAt: serverTimestamp(),
        });
        batch.delete(doc(db, "friendRequests", request.id));
        await batch.commit();
    };

    const handleDeclineRequest = async (request) => {
        await deleteDoc(doc(db, "friendRequests", request.id));
    };

    const handleCancelRequest = async (request) => {
        await deleteDoc(doc(db, "friendRequests", request.id));
    };

    const handleRemoveFriend = async () => {
        if (!authUser || !friendToRemove) return;
        const batch = writeBatch(db);
        batch.delete(
            doc(db, "friends", `${authUser.uid}_${friendToRemove.friendUid}`)
        );
        batch.delete(
            doc(db, "friends", `${friendToRemove.friendUid}_${authUser.uid}`)
        );
        batch.delete(
            doc(db, "friendRequests", `${authUser.uid}_${friendToRemove.friendUid}`)
        );
        batch.delete(
            doc(db, "friendRequests", `${friendToRemove.friendUid}_${authUser.uid}`)
        );
        await batch.commit();
        setFriendToRemove(null);
    };

    const visibleList = selectedDate
        ? todoList
              .map((item) => ({ item }))
              .filter(({ item }) => itemMatchesDate(item, selectedDate))
        : todoList.map((item) => ({ item }));

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

    useEffect(() => {
        if (!friendToRemove) return undefined;
        const handleKeydown = (e) => {
            if (e.key === "Escape") setFriendToRemove(null);
        };
        window.addEventListener("keydown", handleKeydown);
        return () => window.removeEventListener("keydown", handleKeydown);
    }, [friendToRemove]);

    const sortedVisible = useMemo(() => {
        return [...visibleList].sort((a, b) => {
            const aDate = (a.item.startDate || a.item.date || "").trim();
            const bDate = (b.item.startDate || b.item.date || "").trim();
            if (aDate === bDate) return 0;
            if (!aDate) return 1;
            if (!bDate) return -1;
            return aDate.localeCompare(bDate);
        });
    }, [visibleList]);

    if (authLoading) {
        return (
            <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
                <GlobalStyle />
                <FullscreenWrap>
                    <AuthCard>
                        <Title>로딩 중...</Title>
                    </AuthCard>
                </FullscreenWrap>
            </ThemeProvider>
        );
    }

    if (!authUser) {
        return (
            <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
                <GlobalStyle />
                <AuthPage
                    isDark={isDark}
                    setIsDark={setIsDark}
                    authView={authView}
                    setAuthView={setAuthView}
                    loginEmail={loginEmail}
                    setLoginEmail={setLoginEmail}
                    loginPassword={loginPassword}
                    setLoginPassword={setLoginPassword}
                    signupEmail={signupEmail}
                    setSignupEmail={setSignupEmail}
                    signupPassword={signupPassword}
                    setSignupPassword={setSignupPassword}
                    resetEmail={resetEmail}
                    setResetEmail={setResetEmail}
                    handleLogin={handleLogin}
                    handleSignup={handleSignup}
                    handleReset={handleReset}
                    authMessage={authMessage}
                />
            </ThemeProvider>
        );
    }

    return (
        <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
            <GlobalStyle />
            <BrowserRouter basename={import.meta.env.BASE_URL}>
                <AppShell
                    isDark={isDark}
                    setIsDark={setIsDark}
                    todo={todo}
                    todoStartDate={todoStartDate}
                    todoEndDate={todoEndDate}
                    todoRepeatDays={todoRepeatDays}
                    setTodo={setTodo}
                    setTodoStartDate={setTodoStartDate}
                    setTodoEndDate={setTodoEndDate}
                    onTodoRepeatToggle={handleTodoRepeatToggle}
                    setSelectedDate={setSelectedDate}
                    setSelectedDateClear={() => setSelectedDate("")}
                    setPopupDate={setPopupDate}
                    handleSubmit={handleSubmit}
                    authUser={authUser}
                    selectedDate={selectedDate}
                    todoMessage={todoMessage}
                    sortedVisible={sortedVisible}
                    editingId={editingId}
                    editText={editText}
                    editStartDate={editStartDate}
                    editEndDate={editEndDate}
                    editRepeatDays={editRepeatDays}
                    setEditText={setEditText}
                    setEditStartDate={setEditStartDate}
                    setEditEndDate={setEditEndDate}
                    onEditRepeatToggle={handleEditRepeatToggle}
                    handleEditKeyDown={handleEditKeyDown}
                    handleToggle={handleToggle}
                    handleDelete={handleDelete}
                    handleEditStart={handleEditStart}
                    handleEditSave={handleEditSave}
                    handleEditCancel={handleEditCancel}
                    today={today}
                    currentMonth={currentMonth}
                    monthLabel={monthLabel}
                    handleMonthChange={handleMonthChange}
                    popupDate={popupDate}
                    todoByDate={todoByDate}
                    friendHandleMap={friendHandleMap}
                    displayHandle={displayHandle}
                    handleLogout={handleLogout}
                    friendHandle={friendHandle}
                    setFriendHandle={setFriendHandle}
                    handleSendRequest={handleSendRequest}
                    friendMessage={friendMessage}
                    incomingRequests={incomingRequests}
                    outgoingRequests={outgoingRequests}
                    friends={friends}
                    handleAcceptRequest={handleAcceptRequest}
                    handleDeclineRequest={handleDeclineRequest}
                    handleCancelRequest={handleCancelRequest}
                    setFriendToRemove={setFriendToRemove}
                    profile={profile}
                    handleCopyId={handleCopyId}
                    createdAtLabel={createdAtLabel}
                    ownTodoCount={ownTodoCount}
                    sharedTodoCount={sharedTodoCount}
                    myPageMessage={myPageMessage}
                    friendToRemove={friendToRemove}
                    setFriendToRemoveModal={setFriendToRemove}
                    handleRemoveFriend={handleRemoveFriend}
                />
            </BrowserRouter>
        </ThemeProvider>
    );
}

function AppShell(props) {
    const location = useLocation();
    const isHome = location.pathname === "/";
    return (
        <>
            <AppWrap>
                <Layout>
                    <TopBar $spaced={!isHome}>
                        <NavBar>
                            <NavLink to="/">홈</NavLink>
                            <NavLink to="/friends">친구</NavLink>
                            <NavLink to="/me">마이페이지</NavLink>
                        </NavBar>
                        <UserMeta>
                            <Badge>{props.displayHandle || "사용자"}</Badge>
                            <TextLink type="button" onClick={props.handleLogout}>
                                로그아웃
                            </TextLink>
                        </UserMeta>
                    </TopBar>
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <HomePage
                                    isDark={props.isDark}
                                    setIsDark={props.setIsDark}
                                    todo={props.todo}
                                    todoStartDate={props.todoStartDate}
                                    todoEndDate={props.todoEndDate}
                                    todoRepeatDays={props.todoRepeatDays}
                                    setTodo={props.setTodo}
                                    setTodoStartDate={props.setTodoStartDate}
                                    setTodoEndDate={props.setTodoEndDate}
                                    onTodoRepeatToggle={props.onTodoRepeatToggle}
                                    setSelectedDate={props.setSelectedDate}
                                    setSelectedDateClear={props.setSelectedDateClear}
                                    setPopupDate={props.setPopupDate}
                                    handleSubmit={props.handleSubmit}
                                    authUser={props.authUser}
                                    selectedDate={props.selectedDate}
                                    todoMessage={props.todoMessage}
                                    sortedVisible={props.sortedVisible}
                                    editingId={props.editingId}
                                    editText={props.editText}
                                    editStartDate={props.editStartDate}
                                    editEndDate={props.editEndDate}
                                    editRepeatDays={props.editRepeatDays}
                                    setEditText={props.setEditText}
                                    setEditStartDate={props.setEditStartDate}
                                    setEditEndDate={props.setEditEndDate}
                                    onEditRepeatToggle={props.onEditRepeatToggle}
                                    handleEditKeyDown={props.handleEditKeyDown}
                                    handleToggle={props.handleToggle}
                                    handleDelete={props.handleDelete}
                                    handleEditStart={props.handleEditStart}
                                    handleEditSave={props.handleEditSave}
                                    handleEditCancel={props.handleEditCancel}
                                    today={props.today}
                                    currentMonth={props.currentMonth}
                                    monthLabel={props.monthLabel}
                                    handleMonthChange={props.handleMonthChange}
                                    popupDate={props.popupDate}
                                    todoByDate={props.todoByDate}
                                    friendHandleMap={props.friendHandleMap}
                                />
                            }
                        />
                        <Route
                            path="/friends"
                            element={
                                <FriendsPage
                                    displayHandle={props.displayHandle}
                                    friendHandle={props.friendHandle}
                                    setFriendHandle={props.setFriendHandle}
                                    handleSendRequest={props.handleSendRequest}
                                    friendMessage={props.friendMessage}
                                    incomingRequests={props.incomingRequests}
                                    outgoingRequests={props.outgoingRequests}
                                    friends={props.friends}
                                    handleAcceptRequest={props.handleAcceptRequest}
                                    handleDeclineRequest={props.handleDeclineRequest}
                                    handleCancelRequest={props.handleCancelRequest}
                                    setFriendToRemove={props.setFriendToRemove}
                                />
                            }
                        />
                        <Route
                            path="/me"
                            element={
                                <MyPage
                                    displayHandle={props.displayHandle}
                                    profile={props.profile}
                                    authUser={props.authUser}
                                    handleCopyId={props.handleCopyId}
                                    createdAtLabel={props.createdAtLabel}
                                    ownTodoCount={props.ownTodoCount}
                                    sharedTodoCount={props.sharedTodoCount}
                                    friends={props.friends}
                                    incomingRequests={props.incomingRequests}
                                    outgoingRequests={props.outgoingRequests}
                                    myPageMessage={props.myPageMessage}
                                />
                            }
                        />
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </Layout>
            </AppWrap>
            {props.friendToRemove && (
                <ModalOverlay
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            props.setFriendToRemoveModal(null);
                        }
                    }}
                >
                    <ModalCard>
                        <ModalTitle>
                            {props.friendToRemove.friendHandle}님을 삭제할까요?
                        </ModalTitle>
                        <SmallNote>
                            친구 삭제는 양쪽에서 동시에 제거됩니다.
                        </SmallNote>
                        <ModalActions>
                            <TextLink
                                type="button"
                                onClick={() => props.setFriendToRemoveModal(null)}
                            >
                                취소
                            </TextLink>
                            <TextLink
                                type="button"
                                onClick={props.handleRemoveFriend}
                            >
                                삭제
                            </TextLink>
                        </ModalActions>
                    </ModalCard>
                </ModalOverlay>
            )}
        </>
    );
}

export default App;
