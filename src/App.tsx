import "./styles.css";
import remarkGfm from "remark-gfm";
import remarkGemoji from "remark-gemoji";
import matter from "gray-matter";
import ReactMarkdown from "react-markdown";
import React, { useEffect, useState } from "react";
import axios from "axios";
import sample from "../src/sample.md";

// Fetch the sample markdown file
const App: React.FC = () => {
  const [md, setMd] = useState(null);
  useEffect(() => {
    axios
      .get(sample)
      .then((res) => setMd(res.data))
      .catch((e) => console.log(e));
  }, []);

  // Use gray-matter to parse the markdown
  const trgMd: any | null = md && matter(md);
  const content = trgMd?.content;
  const data = trgMd?.data;
  // console.log(trgMd);
  // console.log(content);
  // console.log(data);

  const anchor = ({ node, ...props }) => {
    // console.log(props.children);
    // console.log(node.position.start.line);
    return (
      <a href={"#" + node.position?.start.line.toString()}>{props.children}</a>
    );
  };

  const anchorH2 = ({ node, ...props }) => {
    return <h2 id={node.position?.start.line.toString()}>{props.children}</h2>;
  };

  return (
    <>
      <div className="App">
        <h1>{data?.title}</h1>
        <p>{data?.description}</p>

        <ReactMarkdown
          children={content}
          remarkPlugins={[remarkGfm, remarkGemoji]}
          allowedElements={["h2"]}
          components={{ h2: anchor }}
        />

        <ReactMarkdown
          children={content}
          remarkPlugins={[remarkGfm, remarkGemoji]}
          components={{ h2: anchorH2 }}
        />
      </div>
    </>
  );
};

export default App;
