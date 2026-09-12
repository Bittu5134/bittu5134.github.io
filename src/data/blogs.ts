export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  readTime: string;
  summary: string;
  tags: string[];
  content: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "scaling-webrtc-signaling-in-go",
    title: "Scaling WebRTC Signaling in Go: Lessons from 500 Concurrent Peers",
    date: "March 8, 2026",
    readTime: "6 min read",
    summary:
      "A deep dive into building PeerBasket low-latency signaling server in Go. How we achieved 41ms average latency and 0% packet loss across 500 concurrent peers with Redis TTL heartbeat pruning and IP token buckets.",
    tags: ["Go", "WebRTC", "Redis", "Networking"],
    content: `## The Problem: WebRTC Signaling at Scale

WebRTC handles peer-to-peer audio, video, and arbitrary data channels seamlessly—but getting two clients connected requires an external channel to exchange **Session Description Protocol (SDP)** offers/answers and **Interactive Connectivity Establishment (ICE)** candidates.

When building [PeerBasket](https://peerbasket.bittu.dev), our goal was ambitious: support instant room-based signaling across 500+ concurrent peers with minimal memory overhead on bare-metal infrastructure.

\`\`\`
Client A  <---- (SDP Offer / ICE) ---->  Signaling Server (Go + Redis)  <---- (SDP Answer / ICE) ---->  Client B
               \\____________________________________________________________________________/
                                         Direct P2P DataChannel
\`\`\`

---

## 1. Concurrency Model: Gorilla WebSocket & Goroutine Pools

A naive WebSocket server spawns two goroutines per connection (one reader, one writer). At 500 active peers with bursts of ICE candidates, contention on mutexes causes jitter.

We redesigned the connection worker around non-blocking channels with bounded queues:

\`\`\`go
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
\`\`\`

---

## 2. Redis TTL Heartbeat Pruning

When peers disconnect unexpectedly (browser crash, Wi-Fi loss), TCP sockets linger in \`CLOSE_WAIT\` or drop silently without firing client-side teardown events.

We implemented an atomic Redis TTL sliding-window key scheme:
- Every active peer sends a lightweight ping frame every **5 seconds**.
- Redis updates the key \`room:{roomID}:peer:{peerID}\` with \`EXPIRE 12\`.
- Redis KeySpace Notifications trigger automatic room eviction events if a client drops off for more than two consecutive intervals.

---

## 3. Results & Benchmarks

Benchmarked with \`k6\` and distributed simulated WebSocket clients on bare-metal Proxmox nodes:

| Metric | Target | Result |
|---|---|---|
| **Concurrent Peers** | 500 | 500 |
| **Median Signaling Latency** | < 80ms | **41ms** |
| **Packet Drop Rate** | < 0.5% | **0.0%** |
| **Server Memory (RSS)** | < 120MB | **38MB** |

The low footprint of Go goroutines paired with Redis connection pooling enabled high throughput without degrading signaling responsiveness.
`,
  },
  {
    slug: "reverse-engineering-minecraft-protocol",
    title: "Reverse Engineering the Modern Minecraft Network Protocol",
    date: "January 22, 2026",
    readTime: "8 min read",
    summary:
      "Unpacking the binary wire format of Minecraft Java Edition. From variable-length integers (VarInt) and zlib packet compression to handshake state machines and live packet sniffing.",
    tags: ["Minecraft", "Reverse Engineering", "Protocols", "C++"],
    content: `## Introduction: The Architecture of Minecraft Packets

Minecraft Java Edition communicates over TCP using a custom binary wire protocol. Unlike modern REST or GraphQL APIs, game state updates happen through tightly packed binary streams with minimal serialization overhead.

Let us dissect how data flows over the wire from handshake to play state.

---

## 1. The VarInt Wire Format

At the core of the protocol is the **VarInt** (variable-length integer), encoded similarly to Protocol Buffer LEB128:
- Each byte uses 7 bits for data and 1 most significant bit (MSB) as a continuation flag.
- Values between \`0\` and \`127\` take only **1 byte**.

\`\`\`cpp
// Reading a VarInt from a raw byte buffer
int32_t readVarInt(ByteBuffer& buf) {
    int32_t value = 0;
    int32_t position = 0;
    uint8_t currentByte;

    while (true) {
        currentByte = buf.readByte();
        value |= (currentByte & 0x7F) << position;

        if ((currentByte & 0x80) == 0) break;
        position += 7;

        if (position >= 32) {
            throw std::runtime_error("VarInt is too big");
        }
    }
    return value;
}
\`\`\`

---

## 2. Packet Framing & Compression

Every packet starts with a framing header:
\`\`\`
+---------------------+-------------------+---------------------+
| Packet Length       | Packet ID         | Data Payload        |
| (VarInt)            | (VarInt)          | (Byte Array)        |
+---------------------+-------------------+---------------------+
\`\`\`

When compression is enabled (typically for packets > 256 bytes):
\`\`\`
+---------------------+-------------------+-----------------------------------+
| Total Packet Length | Data Length       | Zlib Compressed (ID + Payload)    |
| (VarInt)            | (VarInt, 0 if uncompressed) |                         |
+---------------------+-------------------+-----------------------------------+
\`\`\`

---

## 3. Protocol State Machine

A client connection transitions through 4 distinct protocol states:

1. **Handshaking**: Initial packet specifying target protocol version, server address, and next desired state.
2. **Status**: Server list ping query (returns MOTD, online player count, and favicon PNG base64).
3. **Login**: Encryption handshake (RSA + AES-128 CFB8), Mojang authentication session verification.
4. **Play**: Active gameplay synchronization (chunks, entity metadata, velocity vectors, block updates).

Building custom network tools for Minecraft opens endless possibilities—from high-performance proxies to protocol analyzers.
`,
  },
  {
    slug: "spatial-geometry-parsing-in-pymupdf",
    title: "Coordinate Geometry in PyMuPDF: Extracting Unruly Academic LaTeX PDFs",
    date: "November 14, 2025",
    readTime: "5 min read",
    summary:
      "Why standard PDF parsers struggle with academic transcripts and resumes, and how we solved it for CDW IIT Kanpur using 2D spatial coordinate clustering and step-gradient scoring.",
    tags: ["Python", "PyMuPDF", "Algorithms", "AI"],
    content: `## Why Standard PDF Parsers Fail on LaTeX Documents

LaTeX compilers (pdfLaTeX, XeLaTeX) generate visual perfection by positioning text snippets using absolute Cartesian coordinates (\`x0, y0, x1, y1\`). 

However, they do **not** embed semantic structure:
- A two-column table is actually just 50 disjoint text boxes placed near each other.
- Section dividers and horizontal rules are raw vector drawing operations (\`re\`, \`l\`, \`m\` PDF commands) with no association to the text above or below them.

When building the **IITK-Resume-Engine** for the Academics & Career Council, standard text extractors scrambled multi-column course lists into gibberish.

---

## The Solution: 2D Geometric Clustering

Using \`PyMuPDF\` (\`fitz\`), we extracted low-level text spans with bounding boxes and built a geometric clustering pipeline:

\`\`\`python
import fitz

def extract_spatial_spans(page):
    blocks = page.get_text("dict")["blocks"]
    spans = []
    for block in blocks:
        if "lines" in block:
            for line in block["lines"]:
                for span in line["spans"]:
                    text = span["text"].strip()
                    if text:
                        spans.append({
                            "text": text,
                            "bbox": span["bbox"],  # (x0, y0, x1, y1)
                            "size": span["size"],
                            "font": span["font"],
                            "flags": span["flags"]
                        })
    return spans
\`\`\`

---

## 1. Topological Sorting & Dynamic Row Grouping

Instead of relying on vertical order alone, we group spans into logical horizontal rows by computing overlap intervals on the Y-axis:

\`\`\`python
def group_into_rows(spans, tolerance=3.0):
    rows = []
    sorted_spans = sorted(spans, key=lambda s: s["bbox"][1])
    
    for span in sorted_spans:
        y_mid = (span["bbox"][1] + span["bbox"][3]) / 2
        matched = False
        for row in rows:
            if abs(row["y_mid"] - y_mid) <= tolerance:
                row["spans"].append(span)
                row["spans"].sort(key=lambda s: s["bbox"][0])  # Sort by X
                matched = True
                break
        if not matched:
            rows.append({"y_mid": y_mid, "spans": [span]})
            
    return rows
\`\`\`

---

## 2. Recognizing 4,400+ IITK Courses

Once rows are reconstructed spatially:
- Course codes (e.g., \`CS210A\`, \`ESC101\`, \`EE671\`) are mapped against the 4,400+ course registry.
- CPI metrics, grade distributions, and semester credits are accurately extracted with 99.4% precision.
- A 6-track step-gradient scoring model produces instant counterfactual guidance for students.

Spatial parsing transformed an intractable document formatting problem into deterministic coordinate geometry.
`,
  },
];
