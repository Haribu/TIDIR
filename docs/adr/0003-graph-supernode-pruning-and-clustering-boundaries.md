# 0003. Graph Supernode Pruning & Centrality Dampening in Alert Consolidation

* Status: accepted
* Deciders: Architecture Team / Harry
* Date: 2026-09-15

## Context and Problem Statement

Layer 3 synthesizes real-time and batch findings into correlated incident graphs using sliding temporal windows ($\Delta t = 15\text{m} \dots 2\text{h}$) across shared entity pivots (IPs, users, hosts, process trees).

In enterprise networks, certain entities act as **supernodes**—such as outbound egress NAT gateways, VPN concentrators, recursive internal DNS servers, and automated deployment service accounts. If an alert correlation engine establishes links indiscriminately on any shared pivot, a single noisy vulnerability scanner or NAT gateway will collapse thousands of distinct, unrelated user events into one giant, unintelligible graph (combinatorial explosion).

How do we cluster meaningful attacker lateral traversal without creating monolithic monster clusters centered on shared infrastructure?

## Decision Drivers

* Maintain sharp investigative focus on authentic attacker lateral movement.
* Prevent combinatorial memory and query stalls in in-memory graph correlation fabrics.
* Eliminate false-positive incident merges that conflate distinct users.

## Considered Options

1. **Unconstrained Pivot Linking**: Link any finding that shares at least one common IP, user, or host.
2. **Static Exclusion List (Hardcoded Deny-List)**: Manually configure IP subnets and accounts that should never be used as correlation pivots.
3. **Dynamic Supernode Degree-Capping & Centrality Dampening (Selected)**.

## Decision Outcome

Chosen option: **Dynamic Supernode Degree-Capping & Centrality Dampening**, because:
- Automatically measures the degree centrality of each pivot entity within sliding correlation windows.
- Entities exceeding high-degree thresholds (e.g., > 50 distinct connected entities within $\Delta t$) are dynamically classified as *infrastructure supernodes*.
- Supernodes are barred from serving as primary bridge pivots: edges passing through a supernode require secondary corroborating pivots (e.g., identical process GUID or matching user session token) to connect two finding subgraphs.
- Incorporates an exponential edge decay function ($e^{-\lambda t}$) to naturally dissolve temporal linkages between inactive entities.

### Positive Consequences

* Prevents alert graph explosion and runaway cluster sizes.
* Automatically adapts to changing cloud IP pools and NAT gateways without requiring manual configuration file maintenance.
* Guarantees that elevated Incident Dossiers represent coherent, bounded attacker campaigns.

### Negative Consequences

* Introduces minor computational overhead to calculate dynamic degree centrality across streaming graph state.
* Edge cases where an attacker abuses an authentic supernode (e.g. pivoting directly through a domain controller) require secondary corroboration rules to bridge.
