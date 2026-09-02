const { execFileSync } = require('child_process');

// Custom electron-builder mac "sign" hook. Without an Apple Developer identity electron-builder
// would leave the app unsigned; Apple Silicon refuses to launch unsigned arm64 binaries and
// Gatekeeper reports them as "damaged". Ad-hoc signing the bundle makes it launch and lets
// Gatekeeper offer the usual right-click "Open" instead.
exports.default = async function sign(opts) {
  execFileSync('codesign', ['--force', '--deep', '--sign', '-', opts.app], { stdio: 'inherit' });
};
