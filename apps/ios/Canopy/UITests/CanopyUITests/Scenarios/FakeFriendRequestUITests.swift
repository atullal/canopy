import XCTest

final class FakeFriendRequestUITests: XCTestCase {

    override func setUpWithError() throws {
        continueAfterFailure = false
    }

    func testAccessibilityAuditAndScreenshots() throws {
        let combinations: [(name: String, isDark: Bool, isAX5: Bool)] = [
            ("Default_Light", false, false),
            ("Default_Dark", true, false),
            ("AX5_Light", false, true),
            ("AX5_Dark", true, true)
        ]
        
        for combo in combinations {
            let app = XCUIApplication()
            app.launchArguments = ["--scenario", "fake-friend-request"]
            
            if combo.isAX5 {
                app.launchArguments.append(contentsOf: ["-UIPreferredContentSizeCategoryName", "UICTContentSizeCategoryAccessibilityXXXL"])
            }
            
            if combo.isDark {
                app.launchArguments.append(contentsOf: ["-AppleInterfaceStyle", "Dark"])
            } else {
                app.launchArguments.append(contentsOf: ["-AppleInterfaceStyle", "Light"])
            }
            
            app.launch()
            
            XCTAssertTrue(app.staticTexts["Practice Friend Requests"].waitForExistence(timeout: 5))
            
            let screenshot = XCUIScreen.main.screenshot()
            let attachment = XCTAttachment(screenshot: screenshot)
            attachment.name = "Screenshot_\(combo.name)"
            attachment.lifetime = .keepAlways
            add(attachment)
            
            if combo.name == "Default_Light" {
                if #available(iOS 17.0, *) {
                    var auditReport = "Accessibility Audit Passed"
                    do {
                        try app.performAccessibilityAudit()
                    } catch {
                        auditReport = "Accessibility Audit Failed: \(error)"
                        let auditAttachment = XCTAttachment(string: auditReport)
                        auditAttachment.name = "AccessibilityAudit_Result"
                        auditAttachment.lifetime = .keepAlways
                        add(auditAttachment)
                        throw error
                    }
                    
                    let auditAttachment = XCTAttachment(string: auditReport)
                    auditAttachment.name = "AccessibilityAudit_Result"
                    auditAttachment.lifetime = .keepAlways
                    add(auditAttachment)
                }
            }
            
            app.terminate()
        }
    }
}
