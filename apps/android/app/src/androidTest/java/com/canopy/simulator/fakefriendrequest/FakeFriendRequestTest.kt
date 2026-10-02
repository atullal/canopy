package com.canopy.simulator.fakefriendrequest

import androidx.compose.ui.test.junit4.createComposeRule
import androidx.compose.ui.test.onNodeWithText
import androidx.compose.ui.test.onRoot
import androidx.compose.ui.test.printToLog
import androidx.compose.ui.test.performClick
import androidx.compose.ui.test.assertIsDisplayed
import androidx.compose.ui.test.performScrollTo
import androidx.compose.ui.test.onAllNodesWithText
import androidx.compose.ui.test.assertCountEquals
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

        // Initially displays Martha
        composeTestRule.onNodeWithText("Martha (Your best friend)").assertIsDisplayed()
        
        // Accept the fake request - it might be off-screen so perform scroll
        val acceptButton = composeTestRule.onNodeWithText("✅ Accept Request")
        acceptButton.performScrollTo()
        acceptButton.assertIsDisplayed()
        acceptButton.performClick()
        
        composeTestRule.waitForIdle()
        
        // The issue is likely that "A Great Discovery Step!" isn't the actual text shown
        // Let's assert ANY failure text based on our FakeFriendRequestScreen logic
        // In FakeFriendRequestScreen: if (actionId == "accept" && currentRequest.isFake) 
        // uses "A Great Discovery Step!" (since type="cloned-friend")
        // However, there is a possibility the modal animation takes time. 
        
        // Wait until it appears (we shouldn't need to do this explicitly in Compose, but just in case)
        composeTestRule.waitUntil(timeoutMillis = 5000) {
            composeTestRule.onAllNodesWithText("A Great Discovery Step!").fetchSemanticsNodes().isNotEmpty()
        }
        composeTestRule.onNodeWithText("A Great Discovery Step!").assertIsDisplayed()
        
        // Continue to next request
        val continueButton = composeTestRule.onNodeWithText("Continue")
        continueButton.performScrollTo()
        continueButton.assertIsDisplayed()
        continueButton.performClick()
        
        composeTestRule.waitForIdle()
        // Now displays Robert Davis
        composeTestRule.onNodeWithText("Robert Davis").assertIsDisplayed()
    }
}
