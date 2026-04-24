import React, { useState, useCallback } from "react";
import { useEffect } from "react";
import ReactFlow, {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  Background,
  Controls,
  MiniMap,
  Handle,
  Position,
} from "reactflow";
import "reactflow/dist/style.css";

/* ================= MOCK API ================= */
const mockAPI = {
  simulate: async (steps) =>
    new Promise((res) =>
      setTimeout(
        () =>
          res({
            logs: steps.map((s, i) => `Step ${i + 1}: ${s}`),
          }),
        500
      )
    ),
};

/* ================= STYLES ================= */
const COLORS = {
  start: "#22c55e",
  task: "#3b82f6",
  approval: "#f59e0b",
  end: "#a855f7",
};

const canvasStyle = {
  background:
    "radial-gradient(1200px 600px at 20% 10%, rgba(59,130,246,0.15), transparent), radial-gradient(800px 500px at 80% 90%, rgba(168,85,247,0.15), transparent), #0b1020",
};

const sidebarStyle = {
  flex: 1,
  padding: 20,
  borderLeft: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(12,18,40,0.75)",
  backdropFilter: "blur(10px)",
  color: "#e5e7eb",
};

const buttonStyle = {
  padding: "8px 12px",
  marginRight: 8,
  marginBottom: 8,
  borderRadius: 8,
  border: "1px solid rgba(255,255,255,0.1)",
  background: "linear-gradient(135deg, #1f2937, #111827)",
  color: "#e5e7eb",
  cursor: "pointer",
};

const inputStyle = {
  width: "100%",
  marginBottom: 10,
  padding: 8,
  borderRadius: 6,
  border: "1px solid #374151",
  background: "#111827",
  color: "#e5e7eb",
};

/* ================= CUSTOM NODE ================= */
function CustomNode({ data }) {
  const color = COLORS[data.type] || "#888";

  return (
    <div
      style={{
        padding: 12,
        borderRadius: 10,
        border: `2px solid ${color}`,
        background: "linear-gradient(180deg,#ffffff,#f3f4f6)",
        minWidth: 120,
        textAlign: "center",
        fontWeight: 600,
        boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
      }}
    >
      <Handle type="target" position={Position.Left} />
      <div style={{ fontSize: 12, opacity: 0.6 }}>
        {data.type.toUpperCase()}
      </div>
      <div style={{ fontSize: 14 }}>
        {data.config?.title || data.label}
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
}

/* ================= NODE FACTORY ================= */
const createNode = (id, type, x, y) => ({
  id,
  type: "custom",
  position: { x, y },
  data: {
    type,
    label: type.toUpperCase(),
    config: {},
  },
});

/* ================= MAIN APP ================= */
export default function App() {
  const [nodes, setNodes] = useState([
    createNode("1", "start", 100, 200),
    createNode("2", "task", 300, 120),
    createNode("3", "approval", 520, 200),
  ]);

  const [edges, setEdges] = useState([
    { id: "e1-2", source: "1", target: "2" },
    { id: "e2-3", source: "2", target: "3" },
  ]);

  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState("");

  /* ===== DERIVED SELECTED NODE (no stale refs) ===== */
  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || null;
  useEffect(() => {
  if (!selectedNodeId) return;

  const updated = nodes.find(n => n.id === selectedNodeId);
  if (updated) {
    setSelectedNodeId(updated.id); // forces re-render binding
  }
}, [nodes]);
  /* ================= FLOW HANDLERS ================= */
  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (params) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            animated: true,
            style: { stroke: "#22d3ee", strokeWidth: 2 },
          },
          eds
        )
      ),
    []
  );

  /* ================= ADD NODE ================= */
  const addNode = (type) => {
    const id = (nodes.length + 1).toString();
    setNodes((prev) => [
      ...prev,
      createNode(id, type, 200 + Math.random() * 200, 150 + Math.random() * 150),
    ]);
  };

  /* ================= VALIDATION ================= */
  const validate = () => {
    const starts = nodes.filter((n) => n.data.type === "start");
    if (starts.length !== 1) {
      setError("Exactly one START node required");
      return false;
    }
    setError("");
    return true;
  };

  /* ================= EXECUTION ================= */
  const runWorkflow = async () => {
    if (!validate()) return;

    const currentNodes = [...nodes];
    const flow = [];
    let current = currentNodes.find((n) => n.data.type === "start");
    const visited = new Set();

    while (current && !visited.has(current.id)) {
      flow.push(current.data.config?.title || current.data.label);
      visited.add(current.id);

      const edge = edges.find((e) => e.source === current.id);
      current = edge
        ? currentNodes.find((n) => n.id === edge.target)
        : null;
    }

    const res = await mockAPI.simulate(flow);
    setLogs(res.logs);
  };

  /* ================= CONFIG UPDATE ================= */
  const updateNodeConfig = (key, value) => {
  if (!selectedNodeId) return;

  setNodes((prevNodes) =>
    prevNodes.map((n) => {
      if (n.id !== selectedNodeId) return n;

      const updatedLabel =
        key === "title"
          ? value || n.data.type.toUpperCase()
          : n.data.label;

      return {
        ...n,
        data: {
          ...n.data,
          label: updatedLabel,
          config: {
            ...n.data.config,
            [key]: value,
          },
        },
      };
    })
  );
};

  /* ================= FORM ================= */
  const renderForm = () => {
    if (!selectedNode) return <p>Select a node</p>;

    const cfg = selectedNode.data.config;

    if (selectedNode.data.type === "task") {
      return (
        <>
          <input
            style={inputStyle}
            placeholder="Title"
            value={cfg.title || ""}
            onChange={(e) => updateNodeConfig("title", e.target.value)}
          />
          <input
            style={inputStyle}
            placeholder="Assignee"
            value={cfg.assignee || ""}
            onChange={(e) => updateNodeConfig("assignee", e.target.value)}
          />
          <input
            style={inputStyle}
            type="date"
            value={cfg.due || ""}
            onChange={(e) => updateNodeConfig("due", e.target.value)}
          />
        </>
      );
    }

    if (selectedNode.data.type === "approval") {
      return (
        <>
          <input
            style={inputStyle}
            placeholder="Role"
            value={cfg.role || ""}
            onChange={(e) => updateNodeConfig("role", e.target.value)}
          />
          <input
            style={inputStyle}
            type="number"
            placeholder="Threshold"
            value={cfg.threshold || ""}
            onChange={(e) => updateNodeConfig("threshold", e.target.value)}
          />
        </>
      );
    }

    if (selectedNode.data.type === "start") {
      return (
        <input
          style={inputStyle}
          placeholder="Workflow Name"
          value={cfg.title || ""}
          onChange={(e) => updateNodeConfig("title", e.target.value)}
        />
      );
    }

    return <p>No config</p>;
  };

  /* ================= RENDER ================= */
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* CANVAS */}
      <div style={{ flex: 3, ...canvasStyle }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={{ custom: CustomNode }}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={(e, node) => setSelectedNodeId(node.id)}
          onConnect={onConnect}
          connectionMode="loose"
          fitView
        >
          <MiniMap />
          <Controls />
          <Background gap={16} size={1} color="#374151" />
        </ReactFlow>
      </div>

      {/* SIDEBAR */}
      <div style={sidebarStyle}>
        <h3>Controls</h3>
        <button style={buttonStyle} onClick={() => addNode("task")}>
          + Task
        </button>
        <button style={buttonStyle} onClick={() => addNode("approval")}>
          + Approval
        </button>

        <h4>Node Form</h4>
        {renderForm()}

        <button style={buttonStyle} onClick={runWorkflow}>
          ▶ Run Workflow
        </button>

        {error && <p style={{ color: "#f87171" }}>{error}</p>}

        <h4>Execution Logs</h4>
        {logs.map((l, i) => (
          <p key={i}>{l}</p>
        ))}
      </div>
    </div>
  );
}