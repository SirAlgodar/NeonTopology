import { TopologyNode, TopologyLink } from './types';

export const INITIAL_NODES: TopologyNode[] = [
    {
        "id": "PGC-MPLS-6730",
        "x": 74.05,
        "y": 10.73,
        "type": "fortiswitch",
        "width": 166,
        "height": 94,
        "icon": "fa-laptop",
        "metricBind": "PGC-MPLS-6730: ICMP ping"
    },
    {
        "id": "BORDA",
        "x": 19.67,
        "y": 22.74,
        "type": "fortiswitch",
        "width": 168,
        "height": 94,
        "icon": "fa-network-wired",
        "metricBind": "SLA-BNG-NE8K: ICMP ping"
    },
    {
        "id": "IX -01",
        "x": 15.77,
        "y": 7.51,
        "type": "fortiswitch",
        "icon": "fa-cloud",
        "metricBind": "BHE-SW-CRS: ICMP ping"
    },
    {
        "id": "IX -02",
        "x": 23.45,
        "y": 7.4,
        "type": "fortiswitch",
        "icon": "fa-cloud",
        "metricBind": "AFN-OLT-HW-MA5800-X15: ICMP ping"
    },
    {
        "id": "IX -03",
        "x": 31.14,
        "y": 7.62,
        "type": "fortiswitch",
        "icon": "fa-cloud",
        "metricBind": "AFN-MPLS-6730: Interface XGigabitEthernet0/0/13(PORTCHANEL-103-OCA): Operational status"
    },
    {
        "id": "IX -04",
        "x": 39.67,
        "y": 7.85,
        "type": "fortiswitch",
        "icon": "fa-cloud",
        "metricBind": "AFN-MPLS-6730: Interface XGigabitEthernet0/0/20(PORTCHANEL-100-GGC): Operational status"
    },
    {
        "id": "AP-01",
        "x": 6.07,
        "y": 53.48,
        "type": "fortiswitch",
        "width": 118,
        "height": 72,
        "icon": "fa-wifi",
        "metricBind": "AFN-HOTSPOT-C1036: ICMP ping"
    },
    {
        "id": "AP-02",
        "x": 19.44,
        "y": 58.87,
        "type": "fortiswitch",
        "width": 118,
        "height": 72,
        "icon": "fa-wifi",
        "metricBind": "SW03-LINK-OFFLINE: ICMP ping"
    },
    {
        "id": "A10",
        "x": 41.56,
        "y": 40.57,
        "type": "fortiswitch",
        "width": 118,
        "height": 72,
        "icon": "fa-server",
        "metricBind": "SW03-LINK-OFFLINE: ICMP ping"
    },
    {
        "id": "BRAS",
        "x": 28.86,
        "y": 40.57,
        "type": "fortiswitch",
        "width": 112,
        "height": 74,
        "metricBind": "SW03-LINK-OFFLINE: ICMP ping"
    },
    {
        "id": "RT-01",
        "x": 19.67,
        "y": 92.7,
        "type": "fortiswitch",
        "width": 112,
        "height": 70,
        "icon": "fa-cloud",
        "metricBind": "SW03-LINK-OFFLINE: ICMP ping"
    },
    {
        "id": "SW-CORE",
        "x": 41.62,
        "y": 58.32,
        "type": "fortiswitch",
        "width": 118,
        "height": 72,
        "icon": "fa-wifi",
        "metricBind": "SLA-SW-CRS: ICMP ping"
    },
    {
        "id": "RT-03",
        "x": 59.44,
        "y": 92.7,
        "type": "fortiswitch",
        "width": 112,
        "height": 70,
        "icon": "fa-cloud",
        "metricBind": "SW03-LINK-OFFLINE: ICMP ping"
    },
    {
        "id": "RT-02",
        "x": 41.78,
        "y": 92.88,
        "type": "fortiswitch",
        "width": 112,
        "height": 70,
        "icon": "fa-cloud",
        "metricBind": "BHE-SW-CRS: ICMP ping"
    },
    {
        "id": "RT-04",
        "x": 71.81,
        "y": 92.7,
        "type": "fortiswitch",
        "width": 112,
        "height": 70,
        "icon": "fa-cloud",
        "metricBind": "SW03-LINK-OFFLINE: ICMP ping"
    },
    {
        "id": "RT-05",
        "x": 84.85,
        "y": 92.7,
        "type": "fortiswitch",
        "width": 112,
        "height": 70,
        "icon": "fa-cloud",
        "metricBind": "SW03-LINK-OFFLINE: ICMP ping"
    },
    {
        "id": "A10-COPY",
        "x": 103.41,
        "y": 77.4,
        "type": "fortiswitch",
        "width": 118,
        "height": 72,
        "icon": "fa-server",
        "metricBind": "SW03-LINK-OFFLINE: ICMP ping"
    },
    {
        "id": "SW-01",
        "x": 95.04,
        "y": 60.07,
        "type": "fortiswitch",
        "width": 132,
        "height": 64,
        "icon": "fa-cloud",
        "metricBind": "SW03-LINK-OFFLINE: ICMP ping"
    },
    {
        "id": "BRAS-COPY",
        "x": 30.97,
        "y": 82.44,
        "type": "fortiswitch",
        "width": 112,
        "height": 74,
        "metricBind": "SW03-LINK-OFFLINE: ICMP ping"
    },
    {
        "id": "PGC-MPLS-6730-COPY",
        "x": 105.18,
        "y": 23.32,
        "type": "fortiswitch",
        "width": 166,
        "height": 94,
        "icon": "fa-laptop",
        "metricBind": "PGC-MPLS-6730: ICMP ping"
    }
];

export const INITIAL_LINKS: TopologyLink[] = [
    {
        "src": "BORDA",
        "dst": "IX -01",
        "metricBind": "AFN-MPLS-6730: Interface XGigabitEthernet0/0/15(6720): Bits received"
    },
    {
        "src": "BORDA",
        "dst": "IX -03",
        "metricBind": "AFN-MPLS-6730: Interface XGigabitEthernet0/0/17(6720): Bits received"
    },
    {
        "src": "BORDA",
        "dst": "IX -04",
        "metricBind": "AFN-MPLS-6730: Interface Eth-Trunk11(6730_ALFENAS_MPLS <-> 6720_ALFENAS): Bits received"
    },
    {
        "src": "BORDA",
        "dst": "AP-01",
        "metricBind": "VAR-MPLS-6730: Interface 100GE0/0/5(VARGINHA <-> ELOI MENDES ELOINET): Bits received"
    },
    {
        "src": "BORDA",
        "dst": "AP-02",
        "metricBind": "VAR-MPLS-6730: Interface Eth-Trunk2(TRUNK-CENTURY): Bits received"
    },
    {
        "src": "BORDA",
        "dst": "A10",
        "metricBind": "ELM-MPLS-6730: Interface 100GE0/0/6(ELOI MENDES <-> VARGINHA DATANET): Bits received"
    },
    {
        "src": "BRAS",
        "dst": "AP-02",
        "metricBind": "VAR-MPLS-6730: Interface 100GE0/0/3(CENTURY-ROTA-DIGITAL): Bits received"
    },
    {
        "src": "A10",
        "dst": "SW-CORE",
        "metricBind": "VAR-MPLS-6730: Interface Vlanif1096(LINK IP CENTURY - ITOP ALFENAS): Bits sent"
    },
    {
        "src": "AP-02",
        "dst": "RT-01",
        "metricBind": "ELM-MPLS-6730: Interface Eth-Trunk0(ELOI MENDES <-> VARGINHA): Bits sent"
    },
    {
        "src": "RT-01",
        "dst": "RT-02",
        "metricBind": "AFN-MPLS-6730: Interface XGigabitEthernet0/0/12(\"ALF <-> ELOI MENDES\"): Operational status"
    },
    {
        "src": "RT-02",
        "dst": "RT-03",
        "metricBind": "PGC-MPLS-6730: Interface Eth-Trunk2(PARAGUACU <-> VARGINHA): Bits received"
    },
    {
        "src": "RT-03",
        "dst": "RT-04",
        "metricBind": "AFN-SW-6720: Interface XGigabitEthernet0/0/20(FIBRA-MACHADO): Bits received"
    },
    {
        "src": "RT-04",
        "dst": "RT-05",
        "metricBind": "AFN-SW-6720: Interface XGigabitEthernet0/0/21(AREADO-EITELECOM): Bits received"
    },
    {
        "src": "RT-05",
        "dst": "A10-COPY",
        "metricBind": "AFN-SW-6720: Interface Eth-Trunk4(6720_ALFENAS<->6730_ALFENAS_MPLS): Bits received"
    },
    {
        "src": "AP-01",
        "dst": "AP-02",
        "metricBind": "AFN-SW-6720: Interface XGigabitEthernet0/0/17(\"OLT-FIBERHOME-1G-19:2\"): Bits received"
    },
    {
        "src": "AP-02",
        "dst": "SW-CORE",
        "metricBind": "VAR-MPLS-6730: Interface 100GE0/0/4(ATC - ELOINET): Bits sent"
    },
    {
        "src": "AP-02",
        "dst": "BRAS-COPY",
        "metricBind": "PGC-MPLS-6730: Interface Eth-Trunk2(PARAGUACU <-> VARGINHA): Operational status"
    },
    {
        "src": "BRAS-COPY",
        "dst": "AP-02",
        "metricBind": "VAR-MPLS-6730: Interface 100GE0/0/6(VARGINHA <-> ELOI MENDES DATANET): Bits received"
    },
    {
        "src": "SW-CORE",
        "dst": "RT-03",
        "metricBind": "AFN-SW-6720: Interface Eth-Trunk5(FIBRA-HUAWEI-ALFENAS): Bits received"
    },
    {
        "src": "SW-CORE",
        "dst": "RT-02",
        "metricBind": "AFN-MPLS-6730: Interface XGigabitEthernet0/0/15(6720): Bits received"
    },
    {
        "src": "SW-CORE",
        "dst": "RT-05",
        "metricBind": "VAR-MPLS-6730: Interface XGigabitEthernet0/0/18(VISTA-DOS-YPES-DIGITALVGA): Operational status"
    },
    {
        "src": "SW-CORE",
        "dst": "SW-01",
        "metricBind": "VAR-MPLS-6730: Interface XGigabitEthernet0/0/23(LACP - ELOINET <-> CENTURY): Bits received"
    },
    {
        "src": "SW-01",
        "dst": "A10-COPY",
        "metricBind": "AFN-SW-6720: Interface XGigabitEthernet0/0/19(OLT HUAWEI X15): Bits received"
    },
    {
        "src": "BORDA",
        "dst": "PGC-MPLS-6730",
        "metricBind": "PGC-MPLS-6730: Interface 100GE0/0/3(PARAGUACU <-> ELOI MENDES ITOP): Bits received"
    },
    {
        "src": "A10",
        "dst": "PGC-MPLS-6730",
        "metricBind": "AFN-SW-6720: Interface XGigabitEthernet0/0/17(\"OLT-FIBERHOME-1G-19:2\"): Bits received"
    },
    {
        "src": "SW-CORE",
        "dst": "PGC-MPLS-6730",
        "metricBind": "AFN-MPLS-6730: Interface Eth-Trunk13(UPLINK BGP): Bits received"
    },
    {
        "src": "BORDA",
        "dst": "IX -02",
        "metricBind": "AFN-MPLS-6730: Interface XGigabitEthernet0/0/16(6720): Bits received"
    },
    {
        "src": "PGC-MPLS-6730-COPY",
        "dst": "PGC-MPLS-6730"
    },
    {
        "src": "PGC-MPLS-6730-COPY",
        "dst": "PGC-MPLS-6730"
    },
    {
        "src": "PGC-MPLS-6730-COPY",
        "dst": "PGC-MPLS-6730",
        "metricBind": "AFN-MPLS-6730: Interface XGigabitEthernet0/0/13(PORTCHANEL-103-OCA): Bits received"
    },
    {
        "src": "PGC-MPLS-6730-COPY",
        "dst": "PGC-MPLS-6730"
    },
    {
        "src": "PGC-MPLS-6730-COPY",
        "dst": "PGC-MPLS-6730"
    },
    {
        "src": "PGC-MPLS-6730",
        "dst": "PGC-MPLS-6730-COPY"
    },
    {
        "src": "PGC-MPLS-6730",
        "dst": "PGC-MPLS-6730-COPY"
    },
    {
        "src": "PGC-MPLS-6730",
        "dst": "SW-01",
        "metricBind": "iNVD7032-TECHIN: Interface eth0: Bits received"
    },
    {
        "src": "PGC-MPLS-6730-COPY",
        "dst": "SW-01"
    },
    {
        "src": "SW-01",
        "dst": "A10-COPY",
        "metricBind": "iNVD7032-TECHIN: Interface eth0: Bits sent"
    }
];

export const MOCK_METRICS = [
    { name: "SW01-AGROMAVE: ICMP ping", value: 1 },
    { name: "SW02-AGROMAVE-MUTUM: ICMP ping", value: 1 },
    { name: "SW03-LINK-OFFLINE: ICMP ping", value: 0 }, 
    { name: "Interface-Link-Principal: Status", value: 2 },
    { name: "Roteador-Core: ICMP ping", value: 1 },
    { name: "AFN-MPLS-6730: Interface Eth-Trunk101(NODE04-GGC): Bits received", value: 450000000 },
    { name: "VAR-MPLS-6730: Interface Vlanif1096(LINK IP CENTURY - ITOP ALFENAS): Bits sent", value: 120000000 },
    { name: "AFN-MPLS-6730: Interface XGigabitEthernet0/0/13(PORTCHANEL-103-OCA): Bits received", value: 8000000 },
    { name: "AFN-MPLS-6730: Interface XGigabitEthernet0/0/1(DATACOM-OI): Operational status", value: 2 },
    { name: "Firewall-Principal: ICMP ping", value: 1 },
    { name: "Servidor-Zabbix: ICMP ping", value: 1 }
];
