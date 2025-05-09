
// resolveIPFS.js
export function resolveIPFS(uri) {
    if (!uri) return "";
    if (uri.startsWith("ipfs://")) {
      return `https://gateway.pinata.cloud/ipfs/${uri.slice(7)}`;
    }
    return uri;
  }
  