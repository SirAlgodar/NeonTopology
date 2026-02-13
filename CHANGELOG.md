# Registro de Alterações

## 1.0.2 (2026-02-13)

### Correções

- **UI**: Correção de posicionamento da Toolbar e ContextMenu (adicionado `position: relative` ao container principal) para garantir que os controles de edição sejam visíveis.

## 1.0.1 (2026-02-13)

### Funcionalidades

- **Prevenção de Ciclos**: Implementação de detecção de loops em tempo real para impedir conexões cíclicas na topologia.
- **Auditoria de Operações**: Sistema de logs de auditoria para rastrear criação, atualização e remoção de elementos, com histórico rotativo.
- **Histórico de Edição**: Funcionalidade completa de Undo/Redo para operações de nós e links.
- **Otimização de Performance**: Melhoria no parsing de métricas utilizando Map para acesso O(1), suportando maior volume de dados.
- **Proteção de Elementos**: Validação para impedir remoção de nós marcados como críticos.
- **Interface**: Melhorias visuais e validações na criação de links (prevenção de auto-conexão e duplicatas).

## 1.0.0 (2026-02-13)

### Funcionalidades

- Versão inicial do Painel de Topologia Neon
- Visualização interativa de topologia de rede
- Suporte a arrastar e soltar nós
- Capacidades de Zoom e Pan
- Vinculação de métricas em tempo real
- Efeitos de brilho neon
