package com.canopy.simulator.fakefriendrequest

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlinx.coroutines.delay

@Composable
fun AdaptiveHesitationEngine(
    hintContent: @Composable () -> Unit,
    idleTimeMs: Long = 10000L,
    content: @Composable () -> Unit
) {
    var showHint by remember { mutableStateOf(false) }
    var userActivityTrigger by remember { mutableIntStateOf(0) }

    LaunchedEffect(userActivityTrigger) {
        showHint = false
        delay(idleTimeMs)
        showHint = true
    }
    
    Box(modifier = Modifier.fillMaxSize()) {
        content()
        
        val context = androidx.compose.ui.platform.LocalContext.current
        val isReducedMotion = remember(context) {
            android.provider.Settings.Global.getFloat(context.contentResolver, android.provider.Settings.Global.ANIMATOR_DURATION_SCALE, 1f) == 0f
        }

        androidx.compose.animation.AnimatedVisibility(
            visible = showHint,
            enter = if (isReducedMotion) androidx.compose.animation.fadeIn(androidx.compose.animation.core.snap()) else androidx.compose.animation.fadeIn() + androidx.compose.animation.slideInVertically { it },
            exit = if (isReducedMotion) androidx.compose.animation.fadeOut(androidx.compose.animation.core.snap()) else androidx.compose.animation.fadeOut() + androidx.compose.animation.slideOutVertically { it },
            modifier = Modifier.align(Alignment.BottomEnd)
        ) {
            Box(
                modifier = Modifier
                    .align(Alignment.BottomEnd)
                    .padding(16.dp)
                    .background(Color(0xFFFEF3C7), RoundedCornerShape(8.dp)) // yellow-100
                    .padding(16.dp)
            ) {
                Row(verticalAlignment = Alignment.Top) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = "Stuck? Here's a hint:",
                            color = Color(0xFF854D0E), // yellow-800
                            fontWeight = FontWeight.Bold,
                            fontSize = 20.sp
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        hintContent()
                    }
                    Spacer(modifier = Modifier.width(16.dp))
                    Button(
                        onClick = { showHint = false },
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFFDE68A)), // yellow-200
                        shape = RoundedCornerShape(50),
                        modifier = Modifier.defaultMinSize(minWidth = 56.dp, minHeight = 56.dp)
                    ) {
                        Text("✕", color = Color(0xFFA16207), fontWeight = FontWeight.Bold) // yellow-700
                    }
                }
            }
        }
    }
}

