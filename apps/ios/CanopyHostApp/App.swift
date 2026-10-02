import SwiftUI
import Canopy
import ScenarioKit

@main
struct CanopyApp: App {
    var body: some Scene {
        WindowGroup {
            // Load dummy scenario from decoder since struct doesn't have an empty initializer
            let data = """
            {
              "id": "fake-friend-request",
              "title": "Practice Friend Requests",
              "description": "Welcome to your Practice Social Feed! You have a few new friend requests. Look closely at their profiles to decide if they are real people you know, or if they might be a fake copycat profile. You cannot break anything here!",
              "actions": [
                {
                  "id": "accept",
                  "label": "✅ Accept Request",
                  "type": "primary"
                },
                {
                  "id": "decline",
                  "label": "❌ Decline & Delete",
                  "type": "danger"
                }
              ],
              "requests": [
                {
                  "id": "request-1",
                  "name": "Martha (Your best friend)",
                  "profilePicture": "martha-smiling.jpg",
                  "bio": "I had to make a new account! Add me here.",
                  "friendsInCommon": 0,
                  "joinDate": "Joined Today",
                  "isFake": true,
                  "type": "cloned-friend",
                  "justInTimeHint": "Look at the 'Joined' date and 'Friends in Common'. Does it seem unusual for your best friend?"
                }
              ],
              "feedback": {
                "gentleFailureCloned": {
                  "title": "A Great Discovery Step!",
                  "message": "This simulator is perfect for practicing observation! Notice how this profile was created 'Today' with zero friends in common? When a known friend sends a new request, taking a moment to pause and ask them is a wonderful habit. You are learning so much!"
                },
                "gentleFailureStranger": {
                  "title": "A Wonderful Moment to Practice!",
                  "message": "It is nice to be friendly, but online it is always wonderful to only connect with people you know. This person joined yesterday with no mutual friends. Taking your time and choosing 'Decline' keeps your social circle wonderfully secure. Let's try again!"
                },
                "gentleFailureDeclineReal": {
                  "title": "A Perfectly Valid Choice!",
                  "message": "It is completely fine to decline any request! You are in charge of your space. However, notice that this profile was older and had mutual friends, which usually means it's a real person. You are doing a brilliant job taking your time to look at the details!"
                },
                "success": {
                  "title": "Brilliantly Done!",
                  "message": "You successfully protected your social circle! By calmly checking the join dates and friends in common, you made fantastic, confident choices. You are becoming incredibly comfortable online!"
                }
              }
            }
            """.data(using: .utf8)!
            let scenario = try! JSONDecoder().decode(FakeFriendRequestScenario.self, from: data)
            FakeFriendRequestView(scenario: scenario)
        }
    }
}
