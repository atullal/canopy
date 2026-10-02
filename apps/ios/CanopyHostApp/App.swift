
import SwiftUI
import Canopy
import ScenarioKit

@main
struct CanopyApp: App {
    var body: some Scene {
        WindowGroup {
            FakeFriendRequestView(scenario: FakeFriendRequestScenario())
        }
    }
}

