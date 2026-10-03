import SwiftUI
import Canopy
import ScenarioKit

@main
struct CanopyApp: App {
    var body: some Scene {
        WindowGroup {
            if ProcessInfo.processInfo.arguments.contains("-UITestScenario"),
               let index = ProcessInfo.processInfo.arguments.firstIndex(of: "-UITestScenario"),
               index + 1 < ProcessInfo.processInfo.arguments.count,
               ProcessInfo.processInfo.arguments[index + 1] == "v4-inoculation-authority" {
                
                let data = """
                {
                  "id": "v4-inoculation-authority",
                  "title": "Practice Spotting Pressure",
                  "description": "Bad actors don't just use computer tricks—they use psychological patterns. They try to make you panic so you act before thinking. This is called 'False Urgency' or 'Authority Pressure'. Read the messages below. Your goal is to spot which messages are trying to manipulate your emotions, and which are calm and safe.",
                  "actions": [
                    {
                      "id": "manipulation",
                      "label": "🚨 This is trying to rush me",
                      "type": "danger"
                    },
                    {
                      "id": "safe",
                      "label": "✅ This is a calm message",
                      "type": "primary"
                    }
                  ],
                  "challenges": [
                    {
                      "id": "challenge-1",
                      "sender": "Fraud Department",
                      "body": "SECURITY ALERT: Did you authorize a $1,200 transfer? If you did not, you MUST reply 'CANCEL' within 5 minutes or the money will be permanently lost and your account will be frozen.",
                      "isManipulation": true,
                      "manipulationType": "False Urgency & Fear",
                      "justInTimeHint": "Notice the time limit ('within 5 minutes'). How does this message want you to feel?"
                    }
                  ],
                  "feedback": {
                    "gentleFailureMissedManipulation": {
                      "title": "A Perfect Learning Moment!",
                      "message": "It is so natural to want to resolve a concerning warning quickly! But let's look closer: this message was using a psychological pattern called 'False Urgency'. By using threatening words and tight time limits, bad actors try to force you into a rushed decision. Remember, real organizations will never force you to act in a panic. When you feel rushed, the safest move is to stop and breathe. Let's try another one!"
                    },
                    "gentleFailureFlaggedSafe": {
                      "title": "Wonderful Caution!",
                      "message": "It is always a fantastic instinct to be careful! However, notice how calm and polite this message was? There were no time limits, no threats, and no pressure. It's a standard, safe notification. Let's keep practicing how to tell the difference!"
                    },
                    "success": {
                      "title": "Brilliantly Done!",
                      "message": "You completely neutralized their psychological pattern! You saw right through the false urgency and the rushing authority language. By recognizing *how* they were trying to manipulate you, you took away all their power. You are doing a magnificent job staying in control of your digital life!"
                    }
                  }
                }
                """.data(using: .utf8)!
                let scenario = try! JSONDecoder().decode(AuthorityScenario.self, from: data)
                AuthorityView(scenario: scenario)
            } else {
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
}
