package com.canopy.simulator.fakefriendrequest

import androidx.compose.ui.test.junit4.createComposeRule
import androidx.compose.ui.test.onNodeWithText
import androidx.compose.ui.test.performClick
import androidx.compose.ui.test.assertIsDisplayed
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
        
        // Accept the fake request
        composeTestRule.onNodeWithText("✅ Accept Request").performClick()
        
        // Should show failure modal
        composeTestRule.onNodeWithText("A Great Discovery Step!").assertIsDisplayed()
        
        // Continue to next request
        composeTestRule.onNodeWithText("Continue").performClick()
        
        // Now displays Robert Davis
        composeTestRule.onNodeWithText("Robert Davis").assertIsDisplayed()
    }
}
