const fs = require('fs');
const path = 'apps/android/app/src/main/java/com/canopy/simulator/fakefriendrequest/FakeFriendRequest.kt';
let content = fs.readFileSync(path, 'utf8');
content = content.replace('val handleNext = {', 'val handleNext: () -> Unit = {');
fs.writeFileSync(path, content);
