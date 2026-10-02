import XCTest
import SwiftUI
@testable import Canopy
@testable import ScenarioKit

@MainActor
final class FakeFriendRequestViewTests: XCTestCase {
    
    func testViewInitialization() throws {
        let scenario = FakeFriendRequestScenario(
            id: "fake-friend-request",
            title: "Practice Friend Requests",
            description: "Test description",
            actions: [
                .init(id: "accept", label: "✅ Accept Request", type: "primary"),
                .init(id: "decline", label: "❌ Decline & Delete", type: "danger")
            ],
            requests: [
                .init(id: "req-1", name: "Fake Friend", profilePicture: "test.jpg", bio: "bio", friendsInCommon: 0, joinDate: "Today", isFake: true, type: "cloned-friend", justInTimeHint: "hint")
            ],
            feedback: .init(
                gentleFailureCloned: .init(title: "Fail Cloned", message: "Msg"),
                gentleFailureStranger: .init(title: "Fail Stranger", message: "Msg"),
                gentleFailureDeclineReal: .init(title: "Fail Real", message: "Msg"),
                success: .init(title: "Success", message: "Msg")
            )
        )
        
        let view = FakeFriendRequestView(scenario: scenario)
        XCTAssertNotNil(view)
    }
}
