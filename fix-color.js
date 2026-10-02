const fs = require('fs');
let content = fs.readFileSync('apps/android/app/src/main/java/com/canopy/simulator/fakefriendrequest/FakeFriendRequest.kt', 'utf-8');
content = content.replace(/Color\((0x[0-9A-Fa-f]{8})\.toInt\(\)\)/g, 'Color($1)');
fs.writeFileSync('apps/android/app/src/main/java/com/canopy/simulator/fakefriendrequest/FakeFriendRequest.kt', content);
