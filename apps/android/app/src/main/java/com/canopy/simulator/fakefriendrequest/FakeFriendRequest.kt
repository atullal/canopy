package com.canopy.simulator.fakefriendrequest

import android.provider.Settings
import androidx.compose.ui.platform.LocalContext
import androidx.compose.animation.*
import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlinx.coroutines.launch

data class Request(
    val id: String,
    val name: String,
    val profilePicture: String,
    val bio: String,
    val friendsInCommon: Int,
    val joinDate: String,
    val isFake: Boolean,
    val type: String,
    val justInTimeHint: String
)

data class Feedback(
    val title: String,
    val message: String,
    val type: String
)

val sampleRequests = listOf(
    Request("request-1", "Martha (Your best friend)", "martha-smiling.jpg", "I had to make a new account! Add me here.", 0, "Joined Today", true, "cloned-friend", "Look at the 'Joined' date and 'Friends in Common'. Does it seem unusual for your best friend?"),
    Request("request-2", "Robert Davis", "robert-garden.jpg", "Retired teacher. Love gardening and reading.", 4, "Joined 2014", false, "real-connection", "This profile has been around for a long time and shares friends in your community."),
    Request("request-3", "Dr. William Anderson", "stock-doctor-photo.jpg", "Surgeon working overseas on a peacekeeping mission. Looking for a kind soul.", 0, "Joined Yesterday", true, "stranger-scam", "Do you know this person in real life? Check how recently they joined.")
)

@Composable
fun SquishButton(
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    colors: ButtonColors,
    border: androidx.compose.foundation.BorderStroke? = null,
    content: @Composable RowScope.() -> Unit
) {
    val interactionSource = remember { MutableInteractionSource() }
    val isPressed by interactionSource.collectIsPressedAsState()
    val context = LocalContext.current
    val isReducedMotion = remember(context) {
        Settings.Global.getFloat(context.contentResolver, Settings.Global.ANIMATOR_DURATION_SCALE, 1f) == 0f
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
        border = border,
        content = content
    )
}

@Composable
fun FakeFriendRequestScreen() {
    val scrollState = rememberScrollState()
    var currentIndex by remember { mutableIntStateOf(0) }
    var feedback by remember { mutableStateOf<Feedback?>(null) }
    
    val currentRequest = sampleRequests[currentIndex]
    val context = LocalContext.current
    val isReducedMotion = remember(context) {
        Settings.Global.getFloat(context.contentResolver, Settings.Global.ANIMATOR_DURATION_SCALE, 1f) == 0f
    }

    val handleAction: (String) -> Unit = { actionId ->
        if (actionId == "accept" && currentRequest.isFake) {
            val title = if (currentRequest.type == "stranger-scam") "A Wonderful Moment to Practice!" else "A Great Discovery Step!"
            val message = if (currentRequest.type == "stranger-scam") 
                "It is nice to be friendly, but online it is always wonderful to only connect with people you know. This person joined yesterday with no mutual friends. Taking your time and choosing 'Decline' keeps your social circle wonderfully secure. Let's try again!"
            else
                "This simulator is perfect for practicing observation! Notice how this profile was created 'Today' with zero friends in common? When a known friend sends a new request, taking a moment to pause and ask them is a wonderful habit. You are learning so much!"
            feedback = Feedback(title, message, "failure")
        } else if (actionId == "decline" && !currentRequest.isFake) {
            feedback = Feedback("A Perfectly Valid Choice!", "It is completely fine to decline any request! You are in charge of your space. However, notice that this profile was older and had mutual friends, which usually means it's a real person. You are doing a brilliant job taking your time to look at the details!", "info")
        } else {
            feedback = Feedback("Brilliantly Done!", "You successfully protected your social circle! By calmly checking the join dates and friends in common, you made fantastic, confident choices. You are becoming incredibly comfortable online!", "success")
        }
    }

    val handleNext: () -> Unit = {
        feedback = null
        if (currentIndex + 1 < sampleRequests.size) {
            currentIndex++
        } else {
            currentIndex = 0
        }
    }

    AdaptiveHesitationEngine(
        hintContent = {
            Text(
                text = "Look at Friends in Common and the Join Date. Real friends usually have mutual connections and older accounts.",
                fontSize = 20.sp,
                color = Color(0xFF111827)
            )
        }
    ) {
        Column(
            modifier = Modifier.fillMaxSize().verticalScroll(scrollState)
                .background(Color(0xFFF9FAFB))
                .padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                text = "Practice Friend Requests",
                fontSize = 36.sp,
                fontWeight = FontWeight.Black,
                color = Color.Black,
                modifier = Modifier.padding(bottom = 24.dp)
            )

            Box(
                modifier = Modifier
                    .background(Color.White, RoundedCornerShape(16.dp))
                    .border(4.dp, Color(0xFFBFDBFE), RoundedCornerShape(16.dp))
                    .padding(24.dp)
                    .fillMaxWidth()
            ) {
                Text(
                    text = "Welcome to your Practice Social Feed! You have a few new friend requests. Look closely at their profiles to decide if they are real people you know, or if they might be a fake copycat profile. You cannot break anything here!",
                    fontSize = 20.sp,
                    lineHeight = 28.sp,
                    color = Color(0xFF111827)
                )
            }

            Spacer(modifier = Modifier.height(32.dp))

            AnimatedContent(
                targetState = currentRequest,
                transitionSpec = {
                    if (isReducedMotion) {
                        fadeIn(snap()) togetherWith fadeOut(snap())
                    } else {
                        fadeIn(spring(stiffness = Spring.StiffnessMediumLow)) + slideInHorizontally(spring(stiffness = Spring.StiffnessMediumLow)) { it } togetherWith
                        fadeOut(spring(stiffness = Spring.StiffnessMediumLow)) + slideOutHorizontally(spring(stiffness = Spring.StiffnessMediumLow)) { -it }
                    }
                },
                label = "requestCard",
                modifier = Modifier.fillMaxWidth()
            ) { request ->
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .border(4.dp, Color(0xFFD1D5DB), RoundedCornerShape(40.dp))
                        .background(Color.White, RoundedCornerShape(40.dp))
                ) {
                    Column {
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .background(Color(0xFF1E3A8A), RoundedCornerShape(topStart = 36.dp, topEnd = 36.dp))
                                .padding(24.dp)
                        ) {
                            Text(
                                text = "New Friend Request",
                                color = Color.White,
                                fontSize = 24.sp,
                                fontWeight = FontWeight.Black,
                                textAlign = TextAlign.Center,
                                modifier = Modifier.fillMaxWidth()
                            )
                        }

                        Column(
                            modifier = Modifier.fillMaxWidth().padding(24.dp),
                            horizontalAlignment = Alignment.CenterHorizontally
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(120.dp)
                                    .background(Color(0xFFE5E7EB), CircleShape)
                                    .border(8.dp, Color(0xFFF3F4F6), CircleShape),
                                contentAlignment = Alignment.Center
                            ) {
                                Text("👤", fontSize = 60.sp)
                            }
                            
                            Spacer(modifier = Modifier.height(16.dp))
                            Text(
                                text = request.name,
                                fontSize = 28.sp,
                                fontWeight = FontWeight.Black,
                                color = Color.Black
                            )
                            Spacer(modifier = Modifier.height(12.dp))
                            Text(
                                text = "\"${request.bio}\"",
                                fontSize = 20.sp,
                                fontStyle = FontStyle.Italic,
                                color = Color(0xFF1F2937),
                                textAlign = TextAlign.Center
                            )

                            Spacer(modifier = Modifier.height(24.dp))

                            Column(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .background(Color(0xFFEFF6FF), RoundedCornerShape(16.dp))
                                    .border(4.dp, Color(0xFFBFDBFE), RoundedCornerShape(16.dp))
                                    .padding(24.dp)
                            ) {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween
                                ) {
                                    Text("Friends in Common:", color = Color(0xFF1E3A8A), fontWeight = FontWeight.Black, fontSize = 20.sp)
                                    Text(request.friendsInCommon.toString(), color = Color.Black, fontWeight = FontWeight.Black, fontSize = 24.sp)
                                }
                                Spacer(modifier = Modifier.height(16.dp))
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween
                                ) {
                                    Text("Profile Created:", color = Color(0xFF1E3A8A), fontWeight = FontWeight.Black, fontSize = 20.sp)
                                    Text(request.joinDate, color = Color.Black, fontWeight = FontWeight.Black, fontSize = 24.sp)
                                }
                            }

                            Spacer(modifier = Modifier.height(24.dp))

                            SquishButton(
                                onClick = { handleAction("accept") },
                                modifier = Modifier.fillMaxWidth(),
                                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF1E40AF))
                            ) {
                                Text("✅ Accept Request", fontSize = 24.sp, fontWeight = FontWeight.Black, color = Color.White)
                            }
                            Spacer(modifier = Modifier.height(16.dp))
                            SquishButton(
                                onClick = { handleAction("decline") },
                                modifier = Modifier.fillMaxWidth(),
                                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFE5E7EB)),
                                border = androidx.compose.foundation.BorderStroke(2.dp, Color(0xFF9CA3AF))
                            ) {
                                Text("❌ Decline & Delete", fontSize = 24.sp, fontWeight = FontWeight.Black, color = Color(0xFF111827))
                            }
                        }
                    }
                }
            }
        }
        
        AnimatedVisibility(
            visible = feedback != null,
            enter = if (isReducedMotion) fadeIn(snap()) else fadeIn(spring(stiffness = Spring.StiffnessMediumLow)) + slideInVertically(spring(stiffness = Spring.StiffnessMediumLow)) { it / 8 },
            exit = if (isReducedMotion) fadeOut(snap()) else fadeOut(spring(stiffness = Spring.StiffnessMediumLow)) + slideOutVertically(spring(stiffness = Spring.StiffnessMediumLow)) { it / 8 }
        ) {
            val fb = feedback
            if (fb != null) {
                FeedbackModal(fb, onDismiss = handleNext)
            }
        }
    }
}

@Composable
fun FeedbackModal(feedback: Feedback, onDismiss: () -> Unit) {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xE6111827)) // Very dark semi-transparent for backdrop blur effect
            .padding(24.dp),
        contentAlignment = Alignment.Center
    ) {
        Column(
            modifier = Modifier
                .background(Color.White, RoundedCornerShape(40.dp))
                .border(8.dp, Color(0xFFD1D5DB), RoundedCornerShape(40.dp))
                .padding(32.dp)
        ) {
            val titleColor = when (feedback.type) {
                "failure" -> Color(0xFF991B1B)
                "success" -> Color(0xFF166534)
                else -> Color(0xFF1E40AF)
            }

            Text(
                text = feedback.title,
                fontSize = 36.sp,
                fontWeight = FontWeight.Black,
                color = titleColor,
                modifier = Modifier.padding(bottom = 24.dp)
            )

            Box(
                modifier = Modifier
                    .background(Color(0xFFF3F4F6), RoundedCornerShape(16.dp))
                    .border(4.dp, Color(0xFFE5E7EB), RoundedCornerShape(16.dp))
                    .padding(24.dp)
                    .fillMaxWidth()
            ) {
                Text(
                    text = feedback.message,
                    fontSize = 24.sp,
                    lineHeight = 32.sp,
                    color = Color(0xFF111827)
                )
            }

            Spacer(modifier = Modifier.height(32.dp))

            SplitScreenComparative(
                leftTitle = "Red Flags (Scam)",
                leftContent = {
                    Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
                        Text("Joined Today/Yesterday: Scammers make new accounts constantly.", fontSize = 20.sp, color = Color(0xFF111827))
                        Text("0 Friends in Common: If it's your real friend, they should be connected to others you know.", fontSize = 20.sp, color = Color(0xFF111827))
                        Text("Urgent/Weird Bios: 'Had to make a new account' or asking for help.", fontSize = 20.sp, color = Color(0xFF111827))
                    }
                },
                rightTitle = "Green Flags (Safe)",
                rightContent = {
                    Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
                        Text("Older Join Date: E.g., 'Joined 2014', meaning the account has history.", fontSize = 20.sp, color = Color(0xFF111827))
                        Text("Mutual Friends: Sharing several friends in common means they are likely part of your real-world community.", fontSize = 20.sp, color = Color(0xFF111827))
                        Text("Normal Bio: Mentions normal hobbies or work without asking for anything.", fontSize = 20.sp, color = Color(0xFF111827))
                    }
                }
            )

            Spacer(modifier = Modifier.height(32.dp))

            SquishButton(
                onClick = onDismiss,
                modifier = Modifier.fillMaxWidth(),
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF1E40AF))
            ) {
                Text("Continue", fontSize = 28.sp, fontWeight = FontWeight.Black, color = Color.White)
            }
        }
    }
}

