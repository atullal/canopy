package com.canopy.simulator.authority

import androidx.compose.animation.*
import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.heading
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.canopy.core.scenario.V4AuthorityScenario
import com.canopy.simulator.fakefriendrequest.AdaptiveHesitationEngine


@Composable
fun SquishButton(
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    colors: ButtonColors,
    content: @Composable RowScope.() -> Unit
) {
    val interactionSource = remember { MutableInteractionSource() }
    val isPressed by interactionSource.collectIsPressedAsState()
    val context = androidx.compose.ui.platform.LocalContext.current
    val isReducedMotion = remember(context) {
        android.provider.Settings.Global.getFloat(context.contentResolver, android.provider.Settings.Global.ANIMATOR_DURATION_SCALE, 1f) == 0f
    }
    val scale by animateFloatAsState(
        targetValue = if (isPressed && !isReducedMotion) 0.95f else 1f,
        animationSpec = if (isReducedMotion) snap() else spring(stiffness = Spring.StiffnessMediumLow),
        label = "squishScale"
    )

    Button(
        onClick = onClick,
        modifier = modifier
            .heightIn(min = 80.dp)
            .graphicsLayer {
                scaleX = scale
                scaleY = scale
            },
        interactionSource = interactionSource,
        shape = RoundedCornerShape(16.dp),
        colors = colors,
        content = content
    )
}

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
                .background(Color(0xFFF9FAFB))
                .padding(24.dp)
        ) {
            Text(
                text = scenario.title,
                fontSize = 36.sp,
                fontWeight = FontWeight.Black,
                color = Color.Black,
                modifier = Modifier.semantics { heading() }
            )

            Spacer(modifier = Modifier.height(16.dp))

            Text(
                text = scenario.description,
                fontSize = 20.sp,
                lineHeight = 28.sp,
                color = Color(0xFF111827)
            )

            Spacer(modifier = Modifier.height(32.dp))

            // The Message Card
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(Color.White, RoundedCornerShape(24.dp))
                    .border(4.dp, Color(0xFFE5E7EB), RoundedCornerShape(24.dp))
                    .padding(24.dp)
            ) {
                Column {
                    Text(
                        text = "From: ${challenge.sender}",
                        fontWeight = FontWeight.Black,
                        fontSize = 20.sp,
                        color = Color.Black
                    )
                    Spacer(modifier = Modifier.height(12.dp))
                    Text(
                        text = challenge.body,
                        fontSize = 24.sp,
                        lineHeight = 32.sp,
                        color = Color(0xFF111827)
                    )
                }
            }

            Spacer(modifier = Modifier.height(32.dp))

            val context = androidx.compose.ui.platform.LocalContext.current
            val isReducedMotion2 = remember(context) {
                android.provider.Settings.Global.getFloat(context.contentResolver, android.provider.Settings.Global.ANIMATOR_DURATION_SCALE, 1f) == 0f
            }
            AnimatedVisibility(
                visible = !showFeedback,
                exit = if (isReducedMotion2) fadeOut(snap()) else fadeOut(spring(stiffness = Spring.StiffnessMediumLow)) + shrinkVertically(spring(stiffness = Spring.StiffnessMediumLow))
            ) {
                Column {
                    scenario.actions.forEach { action ->
                        val isDanger = action.type == "danger"
                        val buttonColor = if (isDanger) Color(0xFFB91C1C) else Color(0xFF047857) // red-700 / emerald-700
                        
                        SquishButton(
                            onClick = {
                                selectedActionId = action.id
                                showFeedback = true
                            },
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(bottom = 16.dp),
                            colors = ButtonDefaults.buttonColors(containerColor = buttonColor)
                        ) {
                            Text(
                                text = action.label,
                                fontSize = 24.sp,
                                fontWeight = FontWeight.Black,
                                color = Color.White,
                                textAlign = TextAlign.Center
                            )
                        }
                    }
                }
            }

            AnimatedVisibility(
                visible = showFeedback,
                enter = if (isReducedMotion2) fadeIn(snap()) else fadeIn(spring(stiffness = Spring.StiffnessMediumLow)) + expandVertically(spring(stiffness = Spring.StiffnessMediumLow))
            ) {
                val isCorrect = (selectedActionId == "manipulation" && challenge.isManipulation) ||
                               (selectedActionId == "safe" && !challenge.isManipulation)
                
                val feedbackMsg = when {
                    isCorrect -> scenario.feedback.success
                    challenge.isManipulation -> scenario.feedback.gentleFailureMissedManipulation
                    else -> scenario.feedback.gentleFailureFlaggedSafe
                }

                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(if (isCorrect) Color(0xFFECFDF5) else Color(0xFFFEF2F2), RoundedCornerShape(24.dp))
                        .border(4.dp, if (isCorrect) Color(0xFF6EE7B7) else Color(0xFFFCA5A5), RoundedCornerShape(24.dp))
                        .padding(32.dp)
                ) {
                    Column {
                        Text(
                            text = feedbackMsg.title,
                            fontWeight = FontWeight.Black,
                            fontSize = 32.sp,
                            color = if (isCorrect) Color(0xFF065F46) else Color(0xFF991B1B) // emerald-800 / red-800
                        )
                        Spacer(modifier = Modifier.height(16.dp))
                        Text(
                            text = feedbackMsg.message,
                            fontSize = 24.sp,
                            lineHeight = 32.sp,
                            color = if (isCorrect) Color(0xFF065F46) else Color(0xFF991B1B)
                        )
                        Spacer(modifier = Modifier.height(32.dp))
                        
                        SquishButton(
                            onClick = {
                                showFeedback = false
                                selectedActionId = null
                                currentChallengeIndex++
                            },
                            modifier = Modifier.fillMaxWidth(),
                            colors = ButtonDefaults.buttonColors(
                                containerColor = if (isCorrect) Color(0xFF047857) else Color(0xFFB91C1C)
                            )
                        ) {
                            Text(
                                text = if (currentChallengeIndex < scenario.challenges.size - 1) "Next Challenge" else "Finish Practice",
                                fontSize = 24.sp,
                                fontWeight = FontWeight.Black,
                                color = Color.White
                            )
                        }
                    }
                }
            }
        }
    }
}
