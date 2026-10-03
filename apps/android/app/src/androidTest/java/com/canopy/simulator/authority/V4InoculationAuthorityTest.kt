package com.canopy.simulator.authority

import androidx.compose.ui.test.*
import androidx.compose.ui.test.junit4.createComposeRule
import org.junit.Rule
import org.junit.Test
import androidx.test.ext.junit.runners.AndroidJUnit4
import org.junit.runner.RunWith
import androidx.test.espresso.accessibility.AccessibilityChecks
import org.junit.BeforeClass
import com.canopy.core.scenario.*
import androidx.test.runner.screenshot.Screenshot
import androidx.test.runner.screenshot.ScreenCapture
import java.io.File
import androidx.compose.ui.test.onRoot
import androidx.compose.ui.graphics.asAndroidBitmap
import androidx.test.platform.app.InstrumentationRegistry
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.unit.Density

@RunWith(AndroidJUnit4::class)
class V4InoculationAuthorityTest {

    companion object {
        @BeforeClass
        @JvmStatic
        fun enableAccessibilityChecks() {
            AccessibilityChecks.enable().setRunChecksFromRootView(true)
        }
    }

    @get:Rule
    val composeTestRule = createComposeRule()

    private fun takeScreenshot(name: String) {
        val bitmap = composeTestRule.onRoot().captureToImage().asAndroidBitmap()
        val appContext = InstrumentationRegistry.getInstrumentation().targetContext
        val dir = File(appContext.getExternalFilesDir(null), "screenshots")
        dir.mkdirs()
        val file = File(dir, "$name.png")
        file.outputStream().use { out ->
            bitmap.compress(android.graphics.Bitmap.CompressFormat.PNG, 100, out)
        }
    }

    private val testScenario = V4AuthorityScenario(
        id = "test-scenario",
        title = "Test Title",
        description = "Test Desc",
        actions = listOf(
            AuthorityAction("manipulation", "🚨 Danger", "danger"),
            AuthorityAction("safe", "✅ Safe", "primary")
        ),
        challenges = listOf(
            AuthorityChallenge(
                id = "c1",
                sender = "Bad Guy",
                body = "You MUST act now!",
                isManipulation = true,
                manipulationType = "Urgency",
                justInTimeHint = "Hint 1"
            ),
            AuthorityChallenge(
                id = "c2",
                sender = "Good Guy",
                body = "Hello there.",
                isManipulation = false,
                manipulationType = "None",
                justInTimeHint = "Hint 2"
            )
        ),
        feedback = AuthorityFeedback(
            gentleFailureMissedManipulation = AuthorityFeedbackMessage("Oops 1", "Missed it"),
            gentleFailureFlaggedSafe = AuthorityFeedbackMessage("Oops 2", "Was safe"),
            success = AuthorityFeedbackMessage("Yay", "Got it")
        )
    )

    @Test
    fun displaysFirstChallengeAndActions() {
        composeTestRule.setContent {
            V4InoculationAuthority(scenario = testScenario, onComplete = {})
        }

        composeTestRule.onNodeWithText("Test Title").assertExists()
        composeTestRule.onNodeWithText("From: Bad Guy").assertExists()
        composeTestRule.onNodeWithText("You MUST act now!").assertExists()
        
        composeTestRule.onNodeWithText("🚨 Danger").assertExists()
        composeTestRule.onNodeWithText("✅ Safe").assertExists()
        takeScreenshot("v4_authority_default")
    }

    @Test
    fun clickingCorrectActionShowsSuccessFeedbackAndNextButton() {
        composeTestRule.setContent {
            V4InoculationAuthority(scenario = testScenario, onComplete = {})
        }

        // It's a manipulation, so clicking Danger is correct
        composeTestRule.onNodeWithText("🚨 Danger").performClick()

        // Should show success feedback
        composeTestRule.onNodeWithText("Yay").assertExists()
        composeTestRule.onNodeWithText("Got it").assertExists()

        // Should show next button
        composeTestRule.onNodeWithText("Next Challenge").assertExists()
    }

    @Test
    fun clickingIncorrectActionShowsGentleFailure() {
        composeTestRule.setContent {
            V4InoculationAuthority(scenario = testScenario, onComplete = {})
        }

        // It's a manipulation, so clicking Safe is wrong
        composeTestRule.onNodeWithText("✅ Safe").performClick()

        // Should show gentle failure
        composeTestRule.onNodeWithText("Oops 1").assertExists()
        composeTestRule.onNodeWithText("Missed it").assertExists()
    }

    @Test
    fun displaysWithLargeTextSize() {
        composeTestRule.setContent {
            val originalDensity = LocalDensity.current
            val customDensity = Density(
                density = originalDensity.density,
                fontScale = 2.0f // 200% font scale
            )
            CompositionLocalProvider(LocalDensity provides customDensity) {
                V4InoculationAuthority(scenario = testScenario, onComplete = {})
            }
        }
        
        composeTestRule.onNodeWithText("Test Title").assertExists()
        
        takeScreenshot("v4_authority_large_text")
    }
}
