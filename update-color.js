const fs = require('fs');
const content = fs.readFileSync('apps/android/app/src/main/java/com/canopy/simulator/fakefriendrequest/FakeFriendRequest.kt', 'utf-8');
const newContent = content.replace(
  'Color(0xE6111827)',
  'Color(0xFF111827.toInt())'
);
fs.writeFileSync('apps/android/app/src/main/java/com/canopy/simulator/fakefriendrequest/FakeFriendRequest.kt', newContent);
