import requests
import urllib3
from typing import List, Dict, Any
from urllib.parse import urlparse

# Suppress the annoying InsecureRequestWarning since we intentionally use verify=False
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

SECURITY_HEADER_KEYS = {
    "strict-transport-security": "Strict-Transport-Security",
    "content-security-policy": "Content-Security-Policy",
    "x-frame-options": "X-Frame-Options",
    "x-content-type-options": "X-Content-Type-Options",
}

class HTTPChainAnalyzer:
    def __init__(self, timeout: int = 5):
        self.timeout = timeout

    def analyze_chain(self, start_url: str) -> Dict[str, Any]:
        """
        Traces the full redirect path of a URL and analyzes security posture per hop.
        """
        # Ensure the URL has a scheme
        if not start_url.startswith(('http://', 'https://')):
            start_url = 'https://' + start_url

        hops: List[Dict[str, Any]] = []
        current_url = start_url
        downgrade_detected = False
        highest_severity = "Low"

        try:
            # We use a session to maintain consistency but handle redirects manually
            session = requests.Session()
            
            # Limit to a maximum of 10 hops to prevent infinite redirect loops
            for hop_index in range(10):
                # Perform the request without auto-following redirects
                response = session.get(current_url, allow_redirects=False, timeout=self.timeout, verify=False)
                
                # Parse current hop metadata
                parsed_url = urlparse(current_url)
                is_https = parsed_url.scheme == 'https'
                
                # Check for an insecure downgrade (HTTPS -> HTTP)
                if len(hops) > 0 and hops[-1]['is_https'] and not is_https:
                    downgrade_detected = True
                    highest_severity = "High"

                # Analyze cookies set during this hop
                cookie_analysis = self._analyze_cookies(response.headers)
                if any(c['issues'] for c in cookie_analysis):
                    if highest_severity != "High":
                        highest_severity = "Medium"

                hop_data = {
                    "hop": hop_index + 1,
                    "url": current_url,
                    "status_code": response.status_code,
                    "is_https": is_https,
                    "security_headers": self._extract_security_headers(response.headers),
                    "cookies": cookie_analysis
                }
                hops.append(hop_data)

                # If it's a redirect status code (3xx), find the next destination
                if 300 <= response.status_code < 400 and 'Location' in response.headers:
                    next_url = response.headers['Location']
                    # Handle relative paths in redirect headers
                    if not next_url.startswith(('http://', 'https://')):
                        next_url = f"{parsed_url.scheme}://{parsed_url.netloc}{next_url}"
                    current_url = next_url
                else:
                    # No more redirects; terminal destination reached
                    break
            else:
                return {"error": "Max redirect limit reached (Potential Loop)"}

            return {
                "target": start_url,
                "total_hops": len(hops),
                "downgrade_detected": downgrade_detected,
                "highest_severity": highest_severity,
                "chain": hops
            }

        except requests.exceptions.RequestException as e:
            return {"error": f"Failed to connect: {str(e)}"}

    def _extract_security_headers(self, headers: Dict[str, str]) -> List[Dict[str, Any]]:
        normalized = {key.lower(): value for key, value in headers.items()}
        findings: List[Dict[str, Any]] = []

        for key, label in SECURITY_HEADER_KEYS.items():
            present = key in normalized
            findings.append({
                "header": key,
                "label": label,
                "value": normalized.get(key),
                "present": present,
            })

        if "location" in normalized:
            findings.append({
                "header": "location",
                "label": "Location",
                "value": normalized["location"],
                "present": True,
            })

        return findings

    def _analyze_cookies(self, headers: Dict[str, str]) -> List[Dict[str, Any]]:
        """
        Extracts and audits cookie attributes from response headers.
        """
        cookie_findings = []
        
        for header_name, header_value in headers.items():
            if header_name.lower() == 'set-cookie':
                # Split the raw header value by semicolons to separate attributes
                cookie_parts = [part.strip() for part in header_value.split(';')]
                
                # FIX: Access the first element of the list to get the name=value string, 
                # then split that string by '=' and grab the first half for the name.
                if cookie_parts and "=" in cookie_parts[0]:
                    cookie_name = cookie_parts[0].split("=")[0]
                else:
                    cookie_name = "Unknown"
                
                raw_lower = header_value.lower()
                has_httponly = 'httponly' in raw_lower
                has_secure = 'secure' in raw_lower
                
                issues = []
                if not has_secure:
                    issues.append("Missing 'Secure' flag")
                if not has_httponly:
                    issues.append("Missing 'HttpOnly' flag")
                    
                cookie_findings.append({
                    "name": cookie_name,
                    "secure": has_secure,
                    "httponly": has_httponly,
                    "issues": issues
                })
        return cookie_findings

# Example interactive test run:
if __name__ == "__main__":
    analyzer = HTTPChainAnalyzer()
    # Test with a known redirecting site (e.g., http -> https)
    result = analyzer.analyze_chain("http://github.com")
    print(result)