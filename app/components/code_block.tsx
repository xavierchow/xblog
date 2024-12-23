"use client";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { gruvboxDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { FiCopy } from "react-icons/fi";

export default function CodeBlock({
    props,
}: {
    props: { className: string; node: any; children: any }; // TODO type of children?
}) {
    const { children, className, node, ...rest } = props;
    const match = /language-(\w+)/.exec(className || "");
    const handleCopy = () => {
        navigator.clipboard.writeText(String(children));
    };
    return match ? (
        <div className="syntax-highlighter-container">
            <SyntaxHighlighter
                {...rest}
                PreTag="div"
                children={String(children).replace(/\n$/, "")}
                language={match[1]}
                style={gruvboxDark}
            />
            <FiCopy className="copy-icon" onClick={handleCopy} />
        </div>
    ) : (
        <code {...rest} className={className}>
            {children}
        </code>
    );
}
