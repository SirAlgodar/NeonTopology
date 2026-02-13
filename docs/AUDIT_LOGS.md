# Audit Logs

The Neon Topology Panel includes a built-in audit logging system to track critical operations performed by users. This ensures accountability and helps in troubleshooting configuration changes.

## Logged Actions

The following actions are automatically logged:

- **Create Node**: When a new element is added to the topology.
- **Delete Node**: When an element is removed.
- **Update Node**: When an element's properties (e.g., position, label) are modified.
- **Create Link**: When a connection is established between two elements.
- **Delete Link**: When a connection is removed.
- **Undo/Redo**: When changes are reverted or reapplied.

## Log Structure

Each audit log entry contains:

- **Timestamp**: Exact time of the operation.
- **Action Type**: `create`, `update`, or `delete`.
- **Target Type**: `node` or `link`.
- **Target ID**: Identifier of the affected element.
- **Details**: Optional description of the change (e.g., JSON diff).

## Persistence

Audit logs are persisted within the panel's configuration (JSON model). This means they are saved alongside the dashboard and are preserved between sessions.

## Accessing Logs

Currently, audit logs are stored in the panel options and can be inspected via the dashboard JSON model or potentially exposed in a future UI tab within the panel editor.
