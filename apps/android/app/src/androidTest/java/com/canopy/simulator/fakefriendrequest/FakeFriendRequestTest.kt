package com.canopy.simulator.fakefriendrequest

import androidx.compose.ui.test.junit4.createComposeRule
import androidx.compose.ui.test.onNodeWithText
import androidx.compose.ui.test.performClick
import androidx.compose.ui.test.assertIsDisplayed
import androidx.compose.ui.test.performScrollTo
import androidx.compose.ui.test.onAllNodesWithText
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith
import androidx.test.ext.junit.runners.AndroidJUnit4

@RunWith(AndroidJUnit4::class)
class FakeFriendRequestTest {

    @get:Rule
    val composeTestRule = createComposeRule()

    @Test
    fun displaysFirstRequestAndFeedback() {
        composeTestRule.setContent {
            FakeFriendRequestScreen()
        }

        try {
            // Initially displays Martha
            composeTestRule.onNodeWithText("Martha (Your best friend)").assertIsDisplayed()
        } catch (e: AssertionError) {
            throw AssertionError("Failed at Martha", e)
        }
        
        try {
            // Accept the fake request
            val acceptButton = composeTestRule.onNodeWithText("✅ Accept Request")
            acceptButton.performScrollTo()
            acceptButton.assertIsDisplayed()
            acceptButton.performClick()
        } catch (e: AssertionError) {
            throw AssertionError("Failed at Accept Request", e)
        }
        
        composeTestRule.waitForIdle()
        
        try {
            composeTestRule.waitUntil(timeoutMillis = 5000) {
                composeTestRule.onAllNodesWithText("A Great Discovery Step!").fetchSemanticsNodes().isNotEmpty()
            }
            composeTestRule.onNodeWithText("A Great Discovery Step!").assertIsDisplayed()
        } catch (e: AssertionError) {
            throw AssertionError("Failed at Modal Title", e)
        } catch (e: Exception) {
            throw AssertionError("Timeout at Modal Title", e)
        }
        
        try {
            // Continue to next request
            val continueButton = composeTestRule.onNodeWithText("Continue")
            continueButton.performScrollTo()
            continueButton.assertIsDisplayed()
            continueButton.performClick()
        } catch (e: AssertionError) {
            throw AssertionError("Failed at Continue Button", e)
        }
        
        composeTestRule.waitForIdle()
        
        try {
            // Now displays Robert Davis
            composeTestRule.onNodeWithText("Robert Davis").assertIsDisplayed()
        } catch (e: AssertionError) {
            throw AssertionError("Failed at Robert Davis", e)
        }
    }
}
