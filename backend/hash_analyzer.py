import math
import re
from collections import Counter


def calculate_entropy(text: str) -> float:
    """Calculate Shannon entropy of the given text (0–8 bits per character)."""
    if not text:
        return 0.0

    entropy = 0.0
    total_characters = len(text)
    text_count = Counter(text)

    for count in text_count.values():
        probability = count / total_characters
        if probability > 0:
            entropy -= probability * math.log2(probability)

    return round(entropy, 2)


def identify_hash(hash_string: str) -> str:
    hash_string = hash_string.strip()
    length = len(hash_string)

    if length == 32 and re.match(r"^[a-fA-F0-9]{32}$", hash_string):
        return "MD5"
    if length == 40 and re.match(r"^[a-fA-F0-9]{40}$", hash_string):
        return "SHA-1"
    if length == 64 and re.match(r"^[a-fA-F0-9]{64}$", hash_string):
        return "SHA-256"
    if length == 128 and re.match(r"^[a-fA-F0-9]{128}$", hash_string):
        return "SHA-512"
    if hash_string.startswith(("$2a$", "$2b$", "$2x$", "$2y$")) and (59 <= length <= 60):
        return "BCrypt"

    return "Unknown/ Not a valid hash"


def describe_entropy(score: float) -> str:
    if score == 0:
        return "No entropy — empty input or a single repeated character."
    if score < 2.5:
        return "Very low entropy — highly predictable or repetitive text."
    if score < 4.0:
        return "Low entropy — common words, simple passwords, or patterns."
    if score < 5.5:
        return "Moderate entropy — mixed character sets with some randomness."
    if score < 6.5:
        return "High entropy — complex password, encoded blob, or key-like material."
    return "Very high entropy — likely cryptographic hash, key, or token material."


KNOWN_HASH_TYPES = {"MD5", "SHA-1", "SHA-256", "SHA-512", "BCrypt"}


def analyze_text(text: str) -> dict:
    trimmed = text.strip()
    entropy = calculate_entropy(text)
    hash_type = identify_hash(trimmed) if trimmed else "Unknown/ Not a valid hash"
    is_known_hash = hash_type in KNOWN_HASH_TYPES
    high_entropy = entropy >= 5.5

    return {
        "entropy": entropy,
        "entropy_description": describe_entropy(entropy),
        "hash_type": hash_type,
        "length": len(text),
        "high_entropy": high_entropy,
        "high_entropy_warning": high_entropy and not is_known_hash,
    }
