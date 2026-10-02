const fs = require('fs');
let content = fs.readFileSync('apps/android/app/src/main/java/com/canopy/simulator/fakefriendrequest/FakeFriendRequest.kt', 'utf-8');
content = content.replace(
  'enter = fadeIn(spring(stiffness = Spring.StiffnessMediumLow)) + slideInVertically(spring(stiffness = Spring.StiffnessMediumLow)) { (it / 8).toInt() },\n            exit = fadeOut(spring(stiffness = Spring.StiffnessMediumLow)) + slideOutVertically(spring(stiffness = Spring.StiffnessMediumLow)) { (it / 8).toInt() }',
  'enter = fadeIn(spring(stiffness = Spring.StiffnessMediumLow)) + slideInVertically(spring(stiffness = Spring.StiffnessMediumLow)) { it / 8 },\n            exit = fadeOut(spring(stiffness = Spring.StiffnessMediumLow)) + slideOutVertically(spring(stiffness = Spring.StiffnessMediumLow)) { it / 8 }'
);
content = content.replace(
  'enter = if (isReducedMotion) fadeIn(snap()) else fadeIn(spring(stiffness = Spring.StiffnessMediumLow)) + slideInVertically(spring(stiffness = Spring.StiffnessMediumLow)) { it / 8 },\n            exit = if (isReducedMotion) fadeOut(snap()) else fadeOut(spring(stiffness = Spring.StiffnessMediumLow)) + slideOutVertically(spring(stiffness = Spring.StiffnessMediumLow)) { it / 8 }',
  'enter = if (isReducedMotion) fadeIn(snap()) else fadeIn(spring(stiffness = Spring.StiffnessMediumLow)) + slideInVertically(spring(stiffness = Spring.StiffnessMediumLow)) { (it / 8).toInt() },\n            exit = if (isReducedMotion) fadeOut(snap()) else fadeOut(spring(stiffness = Spring.StiffnessMediumLow)) + slideOutVertically(spring(stiffness = Spring.StiffnessMediumLow)) { (it / 8).toInt() }'
);
fs.writeFileSync('apps/android/app/src/main/java/com/canopy/simulator/fakefriendrequest/FakeFriendRequest.kt', content);
