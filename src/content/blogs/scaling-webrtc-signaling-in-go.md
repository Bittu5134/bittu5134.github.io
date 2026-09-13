---
slug: scaling-webrtc-signaling-in-go
title: "Scaling WebRTC Signaling in Go: Lessons from 500 Concurrent Peers"
date: 2026-03-08
displayDate: "March 8, 2026"
readTime: "6 min read"
summary: "A deep dive into building PeerBasket low-latency signaling server in Go. How we achieved 41ms average latency and 0% packet loss across 500 concurrent peers with Redis TTL heartbeat pruning and IP token buckets."
tags:
  - Go
  - WebRTC
  - Redis
  - Networking
---

## The Problem: WebRTC Signaling at Scale

WebRTC handles peer-to-peer audio, video, and arbitrary data channels seamlessly—but getting two clients connected requires an external channel to exchange **Session Description Protocol (SDP)** offers/answers and **Interactive Connectivity Establishment (ICE)** candidates.

When building [PeerBasket](https://peerbasket.bittu.dev), our goal was ambitious: support instant room-based signaling across 500+ concurrent peers with minimal memory overhead on bare-metal infrastructure.

```
Client A  <---- (SDP Offer / ICE) ---->  Signaling Server (Go + Redis)  <---- (SDP Answer / ICE) ---->  Client B
               \____________________________________________________________________________/
                                         Direct P2P DataChannel
```

---

## 1. Concurrency Model: Gorilla WebSocket & Goroutine Pools

A naive WebSocket server spawns two goroutines per connection (one reader, one writer). At 500 active peers with bursts of ICE candidates, contention on mutexes causes jitter.

We redesigned the connection worker around non-blocking channels with bounded queues:

```go
type PeerConnection struct {
    ID        string
    RoomID    string
    Conn      *websocket.Conn
    SendQueue chan []byte
    mu        sync.RWMutex
}

func (p *PeerConnection) WritePump() {
    ticker := time.NewTicker(pingPeriod)
    defer func() {
        ticker.Stop()
        p.Conn.Close()
    }()

    for {
        select {
        case msg, ok := <-p.SendQueue:
            if !ok {
                p.Conn.WriteMessage(websocket.CloseMessage, []byte{})
                return
            }
            p.Conn.SetWriteDeadline(time.Now().Add(writeWait))
            if err := p.Conn.WriteMessage(websocket.TextMessage, msg); err != nil {
                return
            }
        case <-ticker.C:
            p.Conn.SetWriteDeadline(time.Now().Add(writeWait))
            if err := p.Conn.WriteMessage(websocket.PingMessage, nil); err != nil {
                return
            }
        }
    }
}
```

---

## 2. Redis TTL Heartbeat Pruning

When peers disconnect unexpectedly (browser crash, Wi-Fi loss), TCP sockets linger in `CLOSE_WAIT` or drop silently without firing client-side teardown events.

We implemented an atomic Redis TTL sliding-window key scheme:
- Every active peer sends a lightweight ping frame every **5 seconds**.
- Redis updates the key `room:{roomID}:peer:{peerID}` with `EXPIRE 12`.
- Redis KeySpace Notifications trigger automatic room eviction events if a client drops off for more than two consecutive intervals.

---

## 3. Results & Benchmarks

Benchmarked with `k6` and distributed simulated WebSocket clients on bare-metal Proxmox nodes:

| Metric | Target | Result |
|---|---|---|
| **Concurrent Peers** | 500 | 500 |
| **Median Signaling Latency** | < 80ms | **41ms** |
| **Packet Drop Rate** | < 0.5% | **0.0%** |
| **Server Memory (RSS)** | < 120MB | **38MB** |

The low footprint of Go goroutines paired with Redis connection pooling enabled high throughput without degrading signaling responsiveness.
