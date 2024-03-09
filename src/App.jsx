import Merger from "./pages/Merger.jsx";
import { Tabs } from "antd";

const items = [
  {
    key: "merger",
    label: "合并 PDF",
    children: <Merger />,
  },
];

const onChange = (key) => {
  console.log(key);
};

function App() {
  return (
    <>
      <Tabs defaultActiveKey="merger" items={items} onChange={onChange} />
    </>
  );
}

export default App;
