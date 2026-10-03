package com.canopy.simulator.authority

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.tooling.preview.Preview
import com.canopy.core.scenario.AuthorityAction
import com.canopy.core.scenario.AuthorityChallenge
import com.canopy.core.scenario.AuthorityFeedback
import com.canopy.core.scenario.AuthorityFeedbackMessage
import com.canopy.core.scenario.V4AuthorityScenario

val previewScenario = V4AuthorityScenario(
    id = "v4-inoculation-authority",
    title = "Practice Spotting Pressure",
    description = "Bad actors don't just use computer tricks—they use psychological patterns...",
    actions = listOf(
        AuthorityAction("manipulation", "🚨 This is trying to rush me", "danger"),
        AuthorityAction("safe", "✅ This is a calm message", "primary")
    ),
    challenges = listOf(
        AuthorityChallenge(
            id = "c1",
            sender = "Fraud Department",
            body = "SECURITY ALERT: Did you authorize a $1,200 transfer? If not, you MUST reply 'CANCEL' within 5 minutes.",
            isManipulation = true,
            manipulationType = "False Urgency",
            justInTimeHint = "Notice the time limit."
        )
    ),
    feedback = AuthorityFeedback(
        gentleFailureMissedManipulation = AuthorityFeedbackMessage("A Perfect Learning Moment!", "They used false urgency."),
        gentleFailureFlaggedSafe = AuthorityFeedbackMessage("Wonderful Caution!", "Notice how calm this was."),
        success = AuthorityFeedbackMessage("Brilliantly Done!", "You neutralized the pattern.")
    )
)

@Preview(showBackground = true, fontScale = 1.0f, name = "Light Default")
@Preview(showBackground = true, fontScale = 2.0f, name = "Light 200%")
@Composable
fun V4AuthorityPreviewLight() {
    MaterialTheme(colorScheme = lightColorScheme()) {
        V4InoculationAuthority(scenario = previewScenario, onComplete = {})
    }
}

@Preview(showBackground = true, fontScale = 1.0f, name = "Dark Default")
@Preview(showBackground = true, fontScale = 2.0f, name = "Dark 200%")
@Composable
fun V4AuthorityPreviewDark() {
    MaterialTheme(colorScheme = darkColorScheme()) {
        V4InoculationAuthority(scenario = previewScenario, onComplete = {})
    }
}
