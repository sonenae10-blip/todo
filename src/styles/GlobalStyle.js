import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
    * {
        box-sizing: border-box;
    }

    body {
        margin: 0;
        background: ${(props) => props.theme.bg};
        color: ${(props) => props.theme.text};
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        min-width: 450px;
    }
`;

export default GlobalStyle;
