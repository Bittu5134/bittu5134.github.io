---
slug: reverse-engineering-minecraft-protocol
title: "Reverse Engineering the Modern Minecraft Network Protocol"
date: 2026-01-22
displayDate: "January 22, 2026"
readTime: "8 min read"
summary: "Unpacking the binary wire format of Minecraft Java Edition. From variable-length integers (VarInt) and zlib packet compression to handshake state machines and live packet sniffing."
tags:
  - Minecraft
  - Reverse Engineering
  - Protocols
  - C++
---

## Introduction: The Architecture of Minecraft Packets

Minecraft Java Edition communicates over TCP using a custom binary wire protocol. Unlike modern REST or GraphQL APIs, game state updates happen through tightly packed binary streams with minimal serialization overhead.

Let us dissect how data flows over the wire from handshake to play state.

---

## 1. The VarInt Wire Format

At the core of the protocol is the **VarInt** (variable-length integer), encoded similarly to Protocol Buffer LEB128:
- Each byte uses 7 bits for data and 1 most significant bit (MSB) as a continuation flag.
- Values between `0` and `127` take only **1 byte**.

```cpp
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
```

---

## 2. Packet Framing & Compression

Every packet starts with a framing header:
```
+---------------------+-------------------+---------------------+
| Packet Length       | Packet ID         | Data Payload        |
| (VarInt)            | (VarInt)          | (Byte Array)        |
+---------------------+-------------------+---------------------+
```

When compression is enabled (typically for packets > 256 bytes):
```
+---------------------+-------------------+-----------------------------------+
| Total Packet Length | Data Length       | Zlib Compressed (ID + Payload)    |
| (VarInt)            | (VarInt, 0 if uncompressed) |                         |
+---------------------+-------------------+-----------------------------------+
```

---

## 3. Protocol State Machine

A client connection transitions through 4 distinct protocol states:

1. **Handshaking**: Initial packet specifying target protocol version, server address, and next desired state.
2. **Status**: Server list ping query (returns MOTD, online player count, and favicon PNG base64).
3. **Login**: Encryption handshake (RSA + AES-128 CFB8), Mojang authentication session verification.
4. **Play**: Active gameplay synchronization (chunks, entity metadata, velocity vectors, block updates).

Building custom network tools for Minecraft opens endless possibilities—from high-performance proxies to protocol analyzers.
