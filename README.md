# Painel de Topologia Neon para Grafana

![Neon Topology](img/logo.svg)

O **Painel de Topologia Neon** é um plugin de visualização interativo e de alto desempenho para o Grafana, projetado para exibir topologias de rede complexas com uma estética neon moderna.

## Funcionalidades

- **Visualização Interativa**: Arraste e solte nós para organizar sua topologia.
- **Tela Infinita**: Zoom e pan para navegar em grandes redes.
- **Métricas em Tempo Real**: Vincule métricas do Grafana a nós e links para visualizar status (Online/Offline) e tráfego.
- **Estética Neon**: Efeitos de brilho para caminhos e nós ativos.
- **Personalizável**: Configure níveis de zoom, chaves de API e mais.

## Instalação

### Pelo Catálogo do Grafana

1. Vá para **Administração** > **Plugins** na sua instância do Grafana.
2. Pesquise por "Neon Topology".
3. Clique em **Instalar**.

### Instalação Manual

1. Baixe o arquivo zip da versão mais recente.
2. Extraia-o no diretório de plugins do Grafana (geralmente `/var/lib/grafana/plugins`).
3. Reinicie o Grafana.

## Uso

### 1. Adicionar o Painel

Crie um novo dashboard e adicione o painel "Neon Topology".

### 2. Configurar Métricas

O painel espera que as métricas sejam vinculadas a nós e links.
- **Nós**: Vincule métricas aos IDs dos nós (ex: "BORDA", "IX-01").
- **Links**: Vincule métricas às conexões de link.

Nas **Opções do Painel**, você pode configurar:
- **Escala de Zoom**: Nível de zoom inicial.
- **Mostrar Chat IA**: Habilitar/desabilitar o assistente de IA (se configurado).
- **Chave de API**: Chave de API para serviços externos.

### 3. Interação

- **Arrastar Nós**: Clique e arraste nós para reorganizar a topologia.
- **Pan**: Clique e arraste no fundo para mover a visualização.
- **Zoom**: Use a roda do mouse para ampliar/reduzir.

## Desenvolvimento

### Pré-requisitos

- Node.js >= 18
- NPM

### Build

```bash
npm install
npm run build
```

### Executar em Modo de Desenvolvimento

```bash
npm run dev
```

### Executar Testes

```bash
npm run test:ci
```

### Iniciar Grafana Local

```bash
npm run server
```

## Licença

[Apache 2.0](LICENSE)
