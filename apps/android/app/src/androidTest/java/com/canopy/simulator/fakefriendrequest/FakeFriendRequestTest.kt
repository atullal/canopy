package com.canopy.simulator.fakefriendrequest

import androidx.compose.ui.test.junit4.createComposeRule
import androidx.compose.ui.test.onNodeWithText
import androidx.compose.ui.test.onRoot
import androidx.compose.ui.test.printToLog
import androidx.compose.ui.test.performClick
import androidx.compose.ui.test.assertIsDisplayed
import androidx.compose.ui.test.performScrollTo
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

        composeTestRule.onRoot().printToLog("FakeFriendRequestTest")

        // Initially displays Martha
        composeTestRule.onNodeWithText("Martha (Your best friend)").assertIsDisplayed()
        
        // Accept the fake request - it might be off-screen so perform scroll
        val acceptButton = composeTestRule.onNodeWithText("✅ Accept Request")
        acceptButton.performScrollTo()
        acceptButton.assertIsDisplayed()
        acceptButton.performClick()
        
        composeTestRule.waitForIdle()
        composeTestRule.onRoot().printToLog("FakeFriendRequestTest-Modal")
        
        // Should show failure modal (It uses "A Great Discovery Step!" for cloned-friend)
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
