import requests
import urllib3
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Import your custom logic engines!
# (Make sure these match your actual Python file names)
from http_chain import HTTPChainAnalyzer
from ssh_monitor import SSHBruteForceMonitor
from vulnerability_scanner import analyze_headers
from hash_analyzer import analyze_text
from port_scanner import scan_local_ports

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

HEADER_RULES = {
    "strict-transport-security": {
        "label": "HSTS",
        "issue": "Missing HSTS header (Prone to downgrade attacks)",
        "severity": "High",
    },
    "content-security-policy": {
        "label": "CSP",
        "issue": "Missing CSP header (Prone to XSS)",
        "severity": "High",
    },
    "x-frame-options": {
        "label": "X-Frame-Options",
        "issue": "Missing X-Frame-Options (Prone to Clickjacking)",
        "severity": "Medium",
    },
    "x-content-type-options": {
        "label": "X-Content-Type-Options",
        "issue": "Missing X-Content-Type-Options (Prone to MIME sniffing)",
        "severity": "Low",
    },
}
# from hash_analyzer import HashAnalyzer

app = FastAPI(title="SecBerg Web Toolkit API")

# --- CORS Configuration ---
# This allows your React frontend (usually running on localhost:5173 or 3000) 
# to securely request data from this Python server (running on localhost:8000).
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Initialize State Machines ---
# We initialize the SSH monitor once globally so it remembers IPs between requests
ssh_monitor = SSHBruteForceMonitor(time_window_seconds=60, alert_threshold=5)

# --- Pydantic Data Models ---
# These tell FastAPI exactly what data format to expect from React
class ChainRequest(BaseModel):
    url: str

class SSHRequest(BaseModel):
    ip_address: str | None = None

class SSHEvent(BaseModel):
    timestamp: str | None = None
    source_ip: str
    status: str
    username: str

class SSHMonitorRequest(BaseModel):
    simulate: bool = False
    events: list[SSHEvent] | None = None
    ip_address: str | None = None

class ScanHeadersRequest(BaseModel):
    url: str

class TextAnalyzeRequest(BaseModel):
    text: str

class LocalPortScanRequest(BaseModel):
    target: str = "127.0.0.1"

# --- API Endpoints ---

@app.get("/")
def read_root():
    return {"status": "SecBerg API is online and armed."}

@app.post("/api/inspect/chain")
def inspect_http_chain(request: ChainRequest):
    """Endpoint for Module 2: HTTP Chain Inspector"""
    analyzer = HTTPChainAnalyzer()
    result = analyzer.analyze_chain(request.url)
    
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
        
    return result

@app.post("/api/scan/headers")
def scan_security_headers(request: ScanHeadersRequest):
    """Endpoint for Module 1: Security Header Vulnerability Scanner"""
    target_url = request.url.strip()
    if not target_url:
        raise HTTPException(status_code=400, detail="URL is required")

    if not target_url.startswith(("http://", "https://")):
        target_url = "https://" + target_url

    try:
        response = requests.get(
            target_url,
            timeout=10,
            verify=False,
            allow_redirects=True,
        )
    except requests.exceptions.RequestException as exc:
        raise HTTPException(status_code=400, detail=f"Failed to fetch target: {exc}") from exc

    scan_result = analyze_headers(dict(response.headers))
    normalized_headers = {key.lower(): value for key, value in response.headers.items()}

    header_checks = []
    for header_key, rule in HEADER_RULES.items():
        present = header_key in normalized_headers
        header_checks.append({
            "header": rule["label"],
            "status": "Pass" if present else "Fail",
            "severity": "Info" if present else rule["severity"],
            "detail": normalized_headers[header_key] if present else rule["issue"],
        })

    return {
        "target": target_url,
        "status_code": response.status_code,
        "score": scan_result["score"],
        "findings": scan_result["findings"],
        "headers": header_checks,
    }

@app.post("/api/scan/http-chain")
def scan_http_chain(request: ChainRequest):
    """Endpoint for HTTP Chain Inspector — trace redirects hop-by-hop."""
    target_url = request.url.strip()
    if not target_url:
        raise HTTPException(status_code=400, detail="URL is required")

    analyzer = HTTPChainAnalyzer()
    result = analyzer.analyze_chain(target_url)

    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])

    return result

@app.post("/api/analyze/text")
def analyze_input_text(request: TextAnalyzeRequest):
    """Endpoint for Hash & Entropy Analyzer."""
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="Input text is required")

    return analyze_text(request.text)

@app.post("/api/scan/local-ports")
def scan_local_ports_endpoint(request: LocalPortScanRequest):
    """Endpoint for Local Service Checker — probe common TCP ports on loopback/private targets."""
    try:
        return scan_local_ports(request.target)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

@app.post("/api/monitor/ssh")
def monitor_ssh_auth(request: SSHMonitorRequest):
    """Endpoint for SSH Brute-Force Monitor — ingest auth events or simulate a log stream."""
    if request.simulate:
        return ssh_monitor.simulate_mock_stream()

    if request.events:
        ssh_monitor.process_events([event.model_dump() for event in request.events])
        return ssh_monitor.get_dashboard()

    if request.ip_address:
        ssh_monitor.log_failure(request.ip_address.strip())
        return ssh_monitor.get_dashboard()

    return ssh_monitor.get_dashboard()

@app.get("/api/monitor/ssh")
def get_ssh_monitor_dashboard():
    """Return the active SSH authentication event dashboard."""
    return ssh_monitor.get_dashboard()

@app.post("/api/monitor/ssh/log")
def log_ssh_failure_legacy(request: SSHRequest):
    """Legacy endpoint — log a single failed attempt by IP."""
    if not request.ip_address:
        raise HTTPException(status_code=400, detail="ip_address is required")
    ssh_monitor.log_failure(request.ip_address)
    return ssh_monitor.get_dashboard()

@app.get("/api/monitor/ssh/active")
def get_active_threats():
    """Endpoint for React to pull the live list of attacker IPs"""
    return {"threats": ssh_monitor.get_active_threats()}

# To run this server:
# uvicorn main:app --reload