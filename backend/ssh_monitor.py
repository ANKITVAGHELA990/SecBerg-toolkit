import time
from collections import defaultdict, deque
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional


class SSHBruteForceMonitor:
    MAX_EVENTS = 200

    def __init__(self, time_window_seconds: int = 60, alert_threshold: int = 5):
        self.time_window = time_window_seconds
        self.threshold = alert_threshold
        self.tracking_data: Dict[str, deque] = defaultdict(deque)
        self.events: List[Dict[str, Any]] = []
        self._event_counter = 0

    def _parse_timestamp(self, timestamp: Optional[str]) -> float:
        if not timestamp:
            return time.time()

        normalized = timestamp.replace("Z", "+00:00")
        try:
            return datetime.fromisoformat(normalized).timestamp()
        except ValueError:
            return time.time()

    def _format_timestamp(self, epoch: float) -> str:
        return datetime.fromtimestamp(epoch, tz=timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")

    def _slide_window(self, ip_address: str, current_time: float) -> None:
        ip_queue = self.tracking_data[ip_address]

        while ip_queue and ip_queue[0] < (current_time - self.time_window):
            ip_queue.popleft()

        if not ip_queue:
            del self.tracking_data[ip_address]

    def process_event(
        self,
        source_ip: str,
        status: str,
        username: str,
        timestamp: Optional[str] = None,
    ) -> Dict[str, Any]:
        epoch = self._parse_timestamp(timestamp)
        normalized_status = status.strip().capitalize()
        if normalized_status not in {"Success", "Failed"}:
            normalized_status = "Failed"

        self._event_counter += 1
        event = {
            "id": f"evt-{self._event_counter}",
            "timestamp": timestamp or self._format_timestamp(epoch),
            "source_ip": source_ip.strip(),
            "status": normalized_status,
            "username": username.strip() or "unknown",
        }

        self.events.insert(0, event)
        if len(self.events) > self.MAX_EVENTS:
            self.events = self.events[: self.MAX_EVENTS]

        if normalized_status == "Failed":
            self.tracking_data[source_ip].append(epoch)

        evaluation_time = time.time()
        self._slide_window(source_ip, evaluation_time)
        active_failures = len(self.tracking_data.get(source_ip, []))
        is_flagged = active_failures >= self.threshold

        return {
            **event,
            "active_failures": active_failures,
            "is_flagged": is_flagged,
            "alert": "Brute Force Attempt Detected" if is_flagged else None,
        }

    def process_events(self, events: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        results = []
        for event in events:
            results.append(
                self.process_event(
                    source_ip=event["source_ip"],
                    status=event["status"],
                    username=event.get("username", "unknown"),
                    timestamp=event.get("timestamp"),
                )
            )
        return results

    def log_failure(self, ip_address: str) -> Dict[str, Any]:
        return self.process_event(
            source_ip=ip_address,
            status="Failed",
            username="unknown",
        )

    def get_flagged_ips(self) -> List[Dict[str, Any]]:
        current_time = time.time()
        flagged: List[Dict[str, Any]] = []

        for ip in list(self.tracking_data.keys()):
            self._slide_window(ip, current_time)
            if ip not in self.tracking_data:
                continue

            failures = len(self.tracking_data[ip])
            if failures >= self.threshold:
                flagged.append(
                    {
                        "source_ip": ip,
                        "failed_attempts": failures,
                        "alert": "Brute Force Attempt Detected",
                    }
                )

        return sorted(flagged, key=lambda item: item["failed_attempts"], reverse=True)

    def get_active_threats(self) -> List[Dict[str, Any]]:
        flagged = self.get_flagged_ips()
        return [
            {
                "ip": item["source_ip"],
                "failures": item["failed_attempts"],
                "status": "ALERT",
            }
            for item in flagged
        ]

    def get_dashboard(self) -> Dict[str, Any]:
        return {
            "events": self.events,
            "flagged_ips": self.get_flagged_ips(),
            "threshold": self.threshold,
            "time_window_seconds": self.time_window,
        }

    def simulate_mock_stream(self) -> Dict[str, Any]:
        self.events.clear()
        self.tracking_data.clear()
        self._event_counter = 0

        now = time.time()
        mock_events = [
            {"offset": 55, "source_ip": "10.0.0.12", "status": "Success", "username": "deploy"},
            {"offset": 48, "source_ip": "10.0.0.12", "status": "Success", "username": "deploy"},
            {"offset": 42, "source_ip": "185.220.101.47", "status": "Failed", "username": "root"},
            {"offset": 38, "source_ip": "185.220.101.47", "status": "Failed", "username": "admin"},
            {"offset": 34, "source_ip": "185.220.101.47", "status": "Failed", "username": "root"},
            {"offset": 30, "source_ip": "185.220.101.47", "status": "Failed", "username": "root"},
            {"offset": 26, "source_ip": "185.220.101.47", "status": "Failed", "username": "ubuntu"},
            {"offset": 22, "source_ip": "185.220.101.47", "status": "Failed", "username": "root"},
            {"offset": 18, "source_ip": "103.152.112.88", "status": "Failed", "username": "test"},
            {"offset": 14, "source_ip": "103.152.112.88", "status": "Failed", "username": "guest"},
            {"offset": 10, "source_ip": "45.142.214.19", "status": "Success", "username": "ops"},
            {"offset": 6, "source_ip": "194.26.229.238", "status": "Failed", "username": "root"},
            {"offset": 2, "source_ip": "10.0.0.12", "status": "Success", "username": "deploy"},
        ]

        parsed_events = []
        for item in mock_events:
            epoch = now - item["offset"]
            parsed_events.append(
                {
                    "timestamp": self._format_timestamp(epoch),
                    "source_ip": item["source_ip"],
                    "status": item["status"],
                    "username": item["username"],
                }
            )

        self.process_events(parsed_events)
        return self.get_dashboard()
