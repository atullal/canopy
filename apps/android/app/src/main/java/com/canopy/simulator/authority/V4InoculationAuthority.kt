package com.canopy.simulator.authority

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.heading
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.canopy.core.scenario.V4AuthorityScenario
import com.canopy.simulator.fakefriendrequest.AdaptiveHesitationEngine

@Composable
fun V4InoculationAuthority(
    scenario: V4AuthorityScenario,
    onComplete: () -> Unit
) {
    var currentChallengeIndex by remember { mutableIntStateOf(0) }
    var selectedActionId by remember { mutableStateOf<String?>(null) }
    var showFeedback by remember { mutableStateOf(false) }

    val challenge = scenario.challenges.getOrNull(currentChallengeIndex)

    if (challenge == null) {
        onComplete()
        return
    }

    AdaptiveHesitationEngine(
        hintContent = {
            Text(
                text = challenge.justInTimeHint,
                color = Color(0xFF854D0E), // yellow-800
                fontSize = 20.sp
            )
        },
        idleTimeMs = 15000L
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
                .padding(24.dp)
        ) {
            Text(
                text = scenario.title,
                fontSize = 28.sp,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onBackground,
                modifier = Modifier.semantics { heading() }
            )

            Spacer(modifier = Modifier.height(16.dp))

            Text(
                text = scenario.description,
                fontSize = 20.sp,
                color = MaterialTheme.colorScheme.onBackground
            )

            Spacer(modifier = Modifier.height(32.dp))

            // The Message Card
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant)
            ) {
                Column(modifier = Modifier.padding(24.dp)) {
                    Text(
                        text = "From: ${challenge.sender}",
                        fontWeight = FontWeight.Bold,
                        fontSize = 20.sp
                    )
                    Spacer(modifier = Modifier.height(12.dp))
                    Text(
                        text = challenge.body,
                        fontSize = 20.sp,
                        lineHeight = 28.sp
                    )
                }
            }

            Spacer(modifier = Modifier.height(32.dp))

            if (!showFeedback) {
                scenario.actions.forEach { action ->
                    val isDanger = action.type == "danger"
                    val buttonColor = if (isDanger) Color(0xFFDC2626) else Color(0xFF059669) // red-600 / emerald-600
                    
                    Button(
                        onClick = {
                            selectedActionId = action.id
                            showFeedback = true
                        },
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(bottom = 16.dp)
                            .heightIn(min = 64.dp), // AAA tap target
                        colors = ButtonDefaults.buttonColors(containerColor = buttonColor),
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Text(
                            text = action.label,
                            fontSize = 20.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color.White
                        )
                    }
                }
            } else {
                val isCorrect = (selectedActionId == "manipulation" && challenge.isManipulation) ||
                               (selectedActionId == "safe" && !challenge.isManipulation)
                
                val feedbackMsg = when {
                    isCorrect -> scenario.feedback.success
                    challenge.isManipulation -> scenario.feedback.gentleFailureMissedManipulation
                    else -> scenario.feedback.gentleFailureFlaggedSafe
                }

                Card(
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(
                        containerColor = if (isCorrect) Color(0xFFECFDF5) else Color(0xFFFEF2F2) // emerald-50 / red-50
                    )
                ) {
                    Column(modifier = Modifier.padding(24.dp)) {
                        Text(
                            text = feedbackMsg.title,
                            fontWeight = FontWeight.Bold,
                            fontSize = 24.sp,
                            color = if (isCorrect) Color(0xFF065F46) else Color(0xFF991B1B) // emerald-800 / red-800
                        )
                        Spacer(modifier = Modifier.height(12.dp))
                        Text(
                            text = feedbackMsg.message,
                            fontSize = 20.sp,
                            color = if (isCorrect) Color(0xFF065F46) else Color(0xFF991B1B)
                        )
                        Spacer(modifier = Modifier.height(24.dp))
                        
                        Button(
                            onClick = {
                                showFeedback = false
                                selectedActionId = null
                                currentChallengeIndex++
                            },
                            modifier = Modifier
                                .fillMaxWidth()
                                .heightIn(min = 64.dp),
                            colors = ButtonDefaults.buttonColors(
                                containerColor = if (isCorrect) Color(0xFF059669) else Color(0xFFDC2626)
                            )
                        ) {
                            Text(
                                text = if (currentChallengeIndex < scenario.challenges.size - 1) "Next Challenge" else "Finish Practice",
                                fontSize = 20.sp,
                                fontWeight = FontWeight.Bold,
                                color = Color.White
                            )
                        }
                    }
                }
            }
        }
    }
}
