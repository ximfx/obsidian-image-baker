const BASE64_PATTERN = /^[A-Za-z0-9+/]*={0,2}$/;

/** Maximum allowed base64 payload length (characters) to defend against OOM in atob.
 *  Default: 12_000_000 chars (~9 MiB decoded). Adjust if needed.
 */
export const BASE64_MAX_CHARS = 12_000_000;

/** Encodes raw bytes as a Base64 string. */
export function bytesToBase64(bytes: Uint8Array): string {
	let binary = "";
	const BASE64_CHUNK_SIZE = 0x8000; // 32 KiB: safe chunk size for String.fromCharCode spread
	for (let i = 0; i < bytes.length; i += BASE64_CHUNK_SIZE) {
		binary += String.fromCharCode(...bytes.subarray(i, i + BASE64_CHUNK_SIZE));
	}
	return btoa(binary);
}

/**
 * Decodes a Base64 string into raw bytes. Whitespace is tolerated.
 * Throws on malformed input or when the payload is too large.
 */
export function base64ToBytes(base64: string): Uint8Array {
	const cleaned = base64.replace(/\s+/g, "");
	if (cleaned.length > BASE64_MAX_CHARS) {
		throw new Error("Base64 payload too large");
	}
	if (cleaned.length % 4 !== 0 || !BASE64_PATTERN.test(cleaned)) {
		throw new Error("Malformed Base64 payload");
	}
	const binary = atob(cleaned);
	const bytes = new Uint8Array(binary.length);
	for (let i = 0; i < binary.length; i++) {
		bytes[i] = binary.charCodeAt(i);
	}
	return bytes;
}
