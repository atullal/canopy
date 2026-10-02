import Testing
@testable import ScenarioKit
@testable import Canopy

@MainActor
struct AuthorityViewModelTests {
    let mockScenario = AuthorityScenario(
        id: "v4-inoculation-authority",
        title: "Test",
        description: "Test description",
        actions: [
            .init(id: "manipulation", label: "Bad", type: "danger"),
            .init(id: "safe", label: "Good", type: "primary")
        ],
        challenges: [
            .init(id: "c1", sender: "Bad Guy", body: "Panic!", isManipulation: true, manipulationType: "Fear", justInTimeHint: "Look out"),
            .init(id: "c2", sender: "Good Guy", body: "Hello", isManipulation: false, manipulationType: "None", justInTimeHint: "Calm")
        ],
        feedback: .init(
            gentleFailureMissedManipulation: .init(title: "Missed", message: "You missed it"),
            gentleFailureFlaggedSafe: .init(title: "Flagged safe", message: "It was safe"),
            success: .init(title: "Success", message: "You won")
        )
    )

    @Test func testInitialState() {
        let viewModel = AuthorityViewModel(scenario: mockScenario)
        
        #expect(viewModel.currentChallengeIndex == 0)
        #expect(viewModel.currentChallenge?.id == "c1")
        #expect(viewModel.feedbackMessage == nil)
        #expect(viewModel.showHint == false)
        #expect(viewModel.isComplete == false)
    }

    @Test func testCorrectActionAdvances() {
        let viewModel = AuthorityViewModel(scenario: mockScenario)
        
        viewModel.handleAction(isManipulationFlagged: true) // Correct for c1
        
        #expect(viewModel.currentChallengeIndex == 1)
        #expect(viewModel.currentChallenge?.id == "c2")
        #expect(viewModel.feedbackMessage == nil)
    }

    @Test func testIncorrectActionShowsFeedback() {
        let viewModel = AuthorityViewModel(scenario: mockScenario)
        
        viewModel.handleAction(isManipulationFlagged: false) // Incorrect for c1
        
        #expect(viewModel.currentChallengeIndex == 0)
        #expect(viewModel.feedbackMessage?.title == "Missed")
    }
    
    @Test func testCompletion() {
        let viewModel = AuthorityViewModel(scenario: mockScenario)
        
        viewModel.handleAction(isManipulationFlagged: true) // Correct c1
        viewModel.handleAction(isManipulationFlagged: false) // Correct c2
        
        #expect(viewModel.isComplete == true)
        #expect(viewModel.feedbackMessage?.title == "Success")
    }
}
