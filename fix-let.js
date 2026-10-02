const fs = require('fs');
const path = 'apps/android/app/src/main/java/com/canopy/simulator/fakefriendrequest/FakeFriendRequest.kt';
let content = fs.readFileSync(path, 'utf8');
content = content.replace(/feedback\?\.let \{ fb ->\s*FeedbackModal\(fb, onDismiss = handleNext\)\s*\}/, 'val fb = feedback\n            if (fb != null) {\n                FeedbackModal(fb, onDismiss = handleNext)\n            }');
fs.writeFileSync(path, content);
