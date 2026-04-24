# HR Workflow Designer

## Overview

This project is an interactive workflow builder designed to model HR processes such as task assignment and approval flows. It provides a visual interface where users can create, configure, and execute workflows dynamically.

The application focuses on clean state management, modular design, and a graph-based execution engine to simulate real-world workflow systems.

---

## Problem Statement

Traditional HR workflows are often rigid, hard-coded, and difficult to modify. This project explores a flexible, visual approach where workflows can be created and adjusted dynamically using a node-based interface.

---

## Key Features

* Interactive workflow canvas built with React Flow
* Drag-and-drop node positioning
* Dynamic node creation (Start, Task, Approval)
* Configurable node forms (title, assignee, role, threshold)
* Real-time UI updates using controlled components
* Edge-based connections between nodes
* Graph-based workflow execution engine
* Mock API simulation with execution logs

---

## Tech Stack

* Frontend: React
* Graph Visualization: React Flow
* State Management: React Hooks
* Execution Logic: Graph traversal (DFS-style)
* API Layer: Mock asynchronous simulation

---

## System Design

### Node-based Architecture

Each workflow step is represented as a node:

* Start node defines the entry point
* Task nodes represent actions or assignments
* Approval nodes represent decision points

### State Management

The entire workflow is maintained in a centralized state using React hooks. This ensures consistency and avoids stale state issues.

### Execution Engine

The workflow execution is simulated using graph traversal:

* Starts from the Start node
* Follows edges sequentially
* Logs each step during execution

---

## Engineering Decisions

* Used controlled components for form inputs to ensure reliable updates
* Maintained a single source of truth for workflow state
* Designed nodes to be extensible for future enhancements
* Separated UI rendering from execution logic for clarity and scalability

---


## How to Run

```bash
npm install
npm run dev
```

Open the application in the browser at:
http://localhost:5173

---

## Usage Guide

1. Add nodes such as Task or Approval
2. Drag nodes to position them on the canvas
3. Connect nodes using edges
4. Select a node to configure its properties
5. Run the workflow to simulate execution
6. View execution logs

---
## Scalability

The system is designed to be extensible:
- New node types can be added easily
- Execution logic can support conditional branching
- Backend integration can enable persistence and multi-user workflows

---

## Future Improvements

* Conditional branching (approved/rejected flows)
* Backend integration for persistence
* Role-based workflow management
* Workflow versioning
* Enhanced validation and error handling

---

## Conclusion

This project demonstrates the design and implementation of a workflow engine using a visual interface. It highlights key concepts such as state management, graph traversal, and modular UI architecture, making it a strong foundation for scalable workflow systems.

---

## Author

Kartik Koacher
