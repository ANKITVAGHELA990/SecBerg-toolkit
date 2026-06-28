import ipaddress
import socket
from typing import Any, Dict, List

STANDARD_PORTS = [
    (21, "FTP"),
    (22, "SSH"),
    (80, "HTTP"),
    (443, "HTTPS"),
    (3306, "MySQL"),
    (5173, "Vite"),
    (8000, "FastAPI"),
]

SCAN_TIMEOUT = 0.5

ALLOWED_NETWORKS = [
    "127.0.0.0/8",
    "10.0.0.0/8",
    "172.16.0.0/12",
    "192.168.0.0/16",
]


def is_safe_to_scan(target_ip: str, allowed_net: list) -> bool:
    """Checks if a target IP belongs to an explicitly allowed network."""
    try:
        ip_obj = ipaddress.ip_address(target_ip)
    except ValueError:
        return False

    for net in allowed_net:
        if ip_obj in ipaddress.ip_network(net):
            return True
    return False


def resolve_target(target: str) -> str:
    """Resolve a hostname or IP to an address safe for local port scanning."""
    cleaned = target.strip()
    if not cleaned:
        return "127.0.0.1"

    lowered = cleaned.lower()
    if lowered in {"localhost", "127.0.0.1", "::1"}:
        return "127.0.0.1"

    try:
        ip_obj = ipaddress.ip_address(cleaned)
        host = str(ip_obj)
        if ip_obj.version == 6:
            if ip_obj.is_loopback:
                return "127.0.0.1"
            raise ValueError("IPv6 targets are not supported for local port scans.")
        if not is_safe_to_scan(host, ALLOWED_NETWORKS):
            raise ValueError("Only loopback or private network targets are permitted.")
        return host
    except ValueError as exc:
        if "Only loopback" in str(exc) or "IPv6 targets" in str(exc):
            raise

    try:
        resolved = socket.gethostbyname(cleaned)
    except socket.gaierror as exc:
        raise ValueError(f"Could not resolve target: {cleaned}") from exc

    if not is_safe_to_scan(resolved, ALLOWED_NETWORKS):
        raise ValueError("Only loopback or private network targets are permitted.")

    return resolved


def probe_port(host: str, port: int, timeout: float = 0.5) -> str:
    """Attempt a TCP connection and return Open or Closed."""
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.settimeout(0.5)
    try:
        result = sock.connect_ex((host, port))
        return "Open" if result == 0 else "Closed"
    except (TimeoutError, socket.timeout, OSError):
        return "Closed"
    finally:
        sock.close()


def scan_local_ports(target: str) -> Dict[str, Any]:
    """Scan standard application ports on a local or loopback target."""
    target_ip = resolve_target(target)
    ports: List[Dict[str, Any]] = []

    for port, service in STANDARD_PORTS:
        print(f"Scanning target: {target_ip} on port {port}")
        ports.append(
            {
                "port": port,
                "service": service,
                "status": probe_port(target_ip, port),
            }
        )

    open_count = sum(1 for item in ports if item["status"] == "Open")

    return {
        "target": target_ip,
        "ports": ports,
        "open_count": open_count,
        "scanned_count": len(ports),
    }
