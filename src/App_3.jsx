import { useState } from "react";
import styled from "styled-components";

const Container = styled.div`
    padding: 20px;
    background-color: ${(props) => (props.darkMode ? "#333" : "#fff")};
    color: ${(props) => (props.darkMode ? "#fff" : "#333")};
`;

const TodoItemWrapper = styled.div`
    padding: 10px;
    background-color: ${(props) => props.completed && "#999"};

    span {
        text-decoration: ${(props) => (props.completed ? "line-through" : "none")};
    }
`;

const initialTodoList = [
    { id: "001", text: "나나 물 주기", completed: true },
    { id: "002", text: "나나 밥 주기", completed: false },
];

function TodoInput({ onSubmit, value, onChange }) {
    return (
        <form onSubmit={onSubmit}>
            <input type="text" value={value} onChange={(e) => onChange(e.target.value)} />
            <button type="submit">추가</button>
        </form>
    );
}

function TodoItem({ todo, onToggle, onDelete }) {
    return (
        <TodoItemWrapper completed={todo.completed} key={todo.id}>
            <span onClick={() => onToggle(todo.id)}>{todo.text}</span>
            <button onClick={() => onDelete(todo.id)}>삭제</button>
        </TodoItemWrapper>
    );
}

function App() {
    const [todos, setTodos] = useState(initialTodoList);
    const [inputValue, setInputValue] = useState("");
    const [darkMode, setDarkMode] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const newTodo = {
            id: Date.now(),
            text: inputValue,
            completed: false,
        };

        setTodos([...todos, newTodo]);
        setInputValue("");
    };

    const handelToggle = (id) => {
        setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)));
    };

    const handleDelete = (id) => {
        setTodos(todos.filter((todo) => todo.id !== id));
    };

    return (
        <Container darkMode={darkMode}>
            <h1>Todo List</h1>

            <button onClick={() => setDarkMode(!darkMode)}>{darkMode ? "라이트 모드" : "다크 모드"}</button>
            {/* 입력폼 */}
            <TodoInput value={inputValue} onChange={setInputValue} onSubmit={handleSubmit} />

            {/* 할일 목록 */}
            {todos.map((todo) => (
                <TodoItem key={todo.id} todo={todo} onToggle={() => handelToggle(todo.id)} onDelete={() => handleDelete(todo.id)} />
            ))}
        </Container>
    );
}

export default App;