#!/usr/bin/env python3
"""
Repeatedly pings the Moe Counter endpoint with rate-limit protection and backoff.

Usage:
    python3 scripts/ping_counter.py
    python3 scripts/ping_counter.py --interval 2.0 --jitter 0.5
"""

import argparse
import random
import signal
import sys
import time
import urllib.error
import urllib.request
from datetime import datetime

TARGET_URL = "https://count.getloli.com/@bittu?name=bittu&padding=7&scale=2&darkmode=0"

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0.0.0 Safari/537.36"
    ),
    "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    "Referer": "https://bittu.dev/",
}

# State tracking for summary
stats = {
    "total_requests": 0,
    "success": 0,
    "rate_limited": 0,
    "errors": 0,
    "start_time": None,
}


def handle_exit(signum, frame):
    """Print summary statistics on exit."""
    duration = time.time() - (stats["start_time"] or time.time())
    print("\n" + "=" * 50)
    print("🛑 Ping runner stopped.")
    print(f"⏱️  Duration:       {duration:.1f}s")
    print(f"📊 Total Sent:     {stats['total_requests']}")
    print(f"✅ Successes:      {stats['success']}")
    print(f"⏳ Rate Limited:   {stats['rate_limited']}")
    print(f"❌ Other Errors:   {stats['errors']}")
    print("=" * 50)
    sys.exit(0)


signal.signal(signal.SIGINT, handle_exit)
signal.signal(signal.SIGTERM, handle_exit)


def ping_once(url: str, timeout: float = 10.0) -> tuple[int, float, str]:
    """
    Sends a single HTTP GET request.
    Returns (status_code, latency_seconds, message).
    """
    req = urllib.request.Request(url, headers=HEADERS, method="GET")
    start = time.perf_counter()

    try:
        with urllib.request.urlopen(req, timeout=timeout) as response:
            latency = time.perf_counter() - start
            return response.status, latency, "OK"
    except urllib.error.HTTPError as e:
        latency = time.perf_counter() - start
        return e.code, latency, e.reason
    except urllib.error.URLError as e:
        latency = time.perf_counter() - start
        return 0, latency, str(e.reason)
    except Exception as e:
        latency = time.perf_counter() - start
        return 0, latency, str(e)


def main():
    parser = argparse.ArgumentParser(
        description="Safely ping count.getloli.com with rate-limit handling."
    )
    parser.add_argument(
        "--url",
        type=str,
        default=TARGET_URL,
        help="Target URL to ping",
    )
    parser.add_argument(
        "--interval",
        type=float,
        default=2.0,
        help="Base delay (seconds) between requests (default: 2.0s)",
    )
    parser.add_argument(
        "--jitter",
        type=float,
        default=0.5,
        help="Random jitter (+/- seconds) added to interval (default: 0.5s)",
    )
    parser.add_argument(
        "--max-backoff",
        type=float,
        default=60.0,
        help="Maximum backoff wait time when rate limited (default: 60s)",
    )

    args = parser.parse_args()

    stats["start_time"] = time.time()
    current_backoff = 5.0  # Initial backoff on 429

    print("=" * 60)
    print("🚀 Starting counter ping script")
    print(f"🎯 Target URL: {args.url}")
    print(f"⏱️  Base Interval: {args.interval}s (±{args.jitter}s jitter)")
    print("Press Ctrl+C at any time to stop.")
    print("=" * 60 + "\n")

    while True:
        stats["total_requests"] += 1
        now_str = datetime.now().strftime("%H:%M:%S")

        status, latency, msg = ping_once(args.url)

        if 200 <= status < 300:
            stats["success"] += 1
            current_backoff = 5.0  # Reset backoff on success
            print(
                f"[{now_str}] #{stats['total_requests']:04d} "
                f"Status: \033[92m{status}\033[0m | "
                f"Latency: {latency*1000:6.1f}ms | "
                f"Success: {stats['success']}"
            )
            # Normal sleep with jitter
            sleep_time = max(0.5, args.interval + random.uniform(-args.jitter, args.jitter))
            time.sleep(sleep_time)

        elif status == 429:
            # Too Many Requests - apply exponential backoff
            stats["rate_limited"] += 1
            print(
                f"[{now_str}] #{stats['total_requests']:04d} "
                f"Status: \033[93m429 Rate Limited\033[0m | "
                f"Backing off for {current_backoff:.1f}s..."
            )
            time.sleep(current_backoff)
            current_backoff = min(args.max_backoff, current_backoff * 1.5)

        else:
            # Other errors (e.g. 403 WAF challenge, 500/502/503 server error, network drop)
            stats["errors"] += 1
            print(
                f"[{now_str}] #{stats['total_requests']:04d} "
                f"Status: \033[91m{status or 'ERR'}\033[0m ({msg}) | "
                f"Latency: {latency*1000:6.1f}ms"
            )
            # Brief pause on general errors to avoid tight error loops
            time.sleep(max(3.0, args.interval))


if __name__ == "__main__":
    main()
