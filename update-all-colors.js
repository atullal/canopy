const fs = require('fs');
let content = fs.readFileSync('apps/android/app/src/main/java/com/canopy/simulator/fakefriendrequest/FakeFriendRequest.kt', 'utf-8');
content = content.replace(/Color\(0xE6111827\.toInt\(\)\)/g, 'Color(0xE6111827.toInt())');
fs.writeFileSync('apps/android/app/src/main/java/com/canopy/simulator/fakefriendrequest/FakeFriendRequest.kt', content);
