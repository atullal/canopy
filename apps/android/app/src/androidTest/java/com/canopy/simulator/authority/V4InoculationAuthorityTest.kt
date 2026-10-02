package com.canopy.simulator.authority

import androidx.compose.ui.test.*
import androidx.compose.ui.test.junit4.createComposeRule
import org.junit.Rule
import org.junit.Test
import androidx.test.ext.junit.runners.AndroidJUnit4
import org.junit.runner.RunWith
import com.canopy.core.scenario.*

@RunWith(AndroidJUnit4::class)
class V4InoculationAuthorityTest {

    @get:Rule
    val composeTestRule = createComposeRule()

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
}
