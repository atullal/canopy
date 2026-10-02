const fs = require('fs');
const content = fs.readFileSync('apps/android/app/src/main/java/com/canopy/simulator/fakefriendrequest/FakeFriendRequest.kt', 'utf-8');
const newContent = content.replace(
  'enter = fadeIn(spring(stiffness = Spring.StiffnessMediumLow)) + slideInVertically(spring(stiffness = Spring.StiffnessMediumLow)) { it / 8 },\n            exit = fadeOut(spring(stiffness = Spring.StiffnessMediumLow)) + slideOutVertically(spring(stiffness = Spring.StiffnessMediumLow)) { it / 8 }',
  'enter = fadeIn(spring(stiffness = Spring.StiffnessMediumLow)) + slideInVertically(spring(stiffness = Spring.StiffnessMediumLow)) { (it / 8).toInt() },\n            exit = fadeOut(spring(stiffness = Spring.StiffnessMediumLow)) + slideOutVertically(spring(stiffness = Spring.StiffnessMediumLow)) { (it / 8).toInt() }'
);
fs.writeFileSync('apps/android/app/src/main/java/com/canopy/simulator/fakefriendrequest/FakeFriendRequest.kt', newContent);
