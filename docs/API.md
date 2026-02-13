# API Documentation

## Interfaces

### PanelOptions
Configuration options for the Neon Topology Panel.

| Property | Type | Description |
|----------|------|-------------|
| `nodes` | `TopologyNode[]` | List of topology nodes. |
| `links` | `TopologyLink[]` | List of connections between nodes. |
| `auditLogs` | `AuditLogEntry[]` | Log of critical operations. |
| `zoomScale` | `number` | Current zoom level. |
| `apiKey` | `string` | Optional API key for external data sources. |
| `showChat` | `boolean` | Toggle for chat interface (future use). |

### TopologyNode
Represents a single element in the topology.

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Unique identifier. |
| `x` | `number` | X coordinate. |
| `y` | `number` | Y coordinate. |
| `type` | `string` | Node type (e.g., 'default'). |
| `label` | `string` | Display label (optional). |
| `isCritical` | `boolean` | If true, prevents deletion. |

### TopologyLink
Represents a connection between two nodes.

| Property | Type | Description |
|----------|------|-------------|
| `src` | `string` | ID of the source node. |
| `dst` | `string` | ID of the destination node. |
| `metricBind` | `string` | Metric name to bind for status/color. |

### AuditLogEntry
Record of a critical operation.

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Unique log ID. |
| `timestamp` | `number` | Time of the action. |
| `action` | `'create' \| 'update' \| 'delete'` | Type of action performed. |
| `targetType` | `'node' \| 'link'` | Target of the action. |
| `targetId` | `string` | ID of the target element. |
| `details` | `string` | Additional details (e.g., JSON diff). |
| `user` | `string` | User who performed the action (optional). |

## Hooks

### useTopology
Custom hook for managing topology state, history, and persistence.

**Parameters:**
- `initialNodes`: Initial list of nodes.
- `initialLinks`: Initial list of links.
- `initialAuditLogs`: Initial audit logs.
- `onOptionsChange`: Callback for persisting state changes.

**Returns:**
- `nodes`: Current nodes.
- `links`: Current links.
- `auditLogs`: Current audit logs.
- `addNode(node)`: Adds a new node.
- `removeNode(nodeId)`: Removes a node (if not critical).
- `updateNode(nodeId, changes)`: Updates node properties.
- `addLink(link)`: Connects two nodes (validates loops/duplicates).
- `removeLink(src, dst)`: Removes a connection.
- `undo()`: Reverts last action.
- `redo()`: Reapplies last undone action.
- `canUndo`: Boolean indicating if undo is available.
- `canRedo`: Boolean indicating if redo is available.
