import { base64ToBytes, BASE64_MAX_CHARS } from "../src/lib/base64";

describe("security guards", () => {
	it("rejects excessively large Base64 payloads", () => {
		const large = "A".repeat(BASE64_MAX_CHARS + 4);
		expect(() => base64ToBytes(large)).toThrow(/too large|Malformed/);
	});
});
