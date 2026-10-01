import XCTest

final class FakeFriendRequestUITests: XCTestCase {

    override func setUpWithError() throws {
        continueAfterFailure = false
        let app = XCUIApplication()
        app.launchArguments = ["--scenario", "fake-friend-request"]
        app.launch()
    }

    func testAccessibilityAudit() throws {
        let app = XCUIApplication()
        
        // Ensure the view is loaded before running the audit
        XCTAssertTrue(app.staticTexts["Practice Friend Requests"].waitForExistence(timeout: 5))
        
        // Run performAccessibilityAudit if available (Xcode 15+)
        if #available(iOS 17.0, *) {
            try app.performAccessibilityAudit()
        }
    }
}
