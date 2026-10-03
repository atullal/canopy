import SwiftUI
import ScenarioKit

@Observable
public final class AuthorityViewModel {
    public let scenario: AuthorityScenario
    public var currentChallengeIndex = 0
    public var feedbackMessage: AuthorityScenario.Feedback.Message? = nil
    public var showHint = false
    public var isComplete = false
    
    public var currentChallenge: AuthorityScenario.Challenge? {
        guard currentChallengeIndex < scenario.challenges.count else { return nil }
        return scenario.challenges[currentChallengeIndex]
    }
    
    public init(scenario: AuthorityScenario) {
        self.scenario = scenario
    }
    
    public func handleAction(isManipulationFlagged: Bool) {
        guard let challenge = currentChallenge else { return }
        
        if isManipulationFlagged == challenge.isManipulation {
            // Correct choice
            if currentChallengeIndex == scenario.challenges.count - 1 {
                isComplete = true
                feedbackMessage = scenario.feedback.success
            } else {
                currentChallengeIndex += 1
                feedbackMessage = nil
                showHint = false
            }
        } else {
            // Incorrect choice
            if isManipulationFlagged {
                feedbackMessage = scenario.feedback.gentleFailureFlaggedSafe
            } else {
                feedbackMessage = scenario.feedback.gentleFailureMissedManipulation
            }
        }
    }
}

public struct AuthorityView: View {
    @State private var viewModel: AuthorityViewModel
    @Environment(\.dynamicTypeSize) private var dynamicTypeSize
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    
    public init(scenario: AuthorityScenario) {
        _viewModel = State(initialValue: AuthorityViewModel(scenario: scenario))
    }
    
    public var body: some View {
        ScrollView {
            VStack(spacing: 24) {
                if let feedback = viewModel.feedbackMessage {
                    FeedbackBanner(message: feedback)
                        .accessibilityAddTraits(.isHeader) // Hypothetical approach
                }
                
                if !viewModel.isComplete {
                    Text(viewModel.scenario.description)
                        .font(.body)
                        .multilineTextAlignment(.leading)
                        .padding(.horizontal)
                        .accessibilityAddTraits(.isHeader) // Provide context
                    
                    if let challenge = viewModel.currentChallenge {
                        ChallengeCard(challenge: challenge)
                            .accessibilityElement(children: .combine)
                        
                        if viewModel.showHint {
                            Text(challenge.justInTimeHint)
                                .font(.callout)
                                .foregroundColor(.secondary)
                                .padding()
                                .background(Color.secondary.opacity(0.1))
                                .cornerRadius(12)
                                .transition(reduceMotion ? .opacity : .slide)
                        } else {
                            Button(action: {
                                withAnimation(reduceMotion ? nil : .default) {
                                    viewModel.showHint = true
                                }
                            }) {
                                Text("Need a hint?")
                                    .font(.callout)
                                    .frame(minWidth: 44, minHeight: 44)
                                    .contentShape(Rectangle())
                            }
                            .padding(.top, 8)
                        }
                        
                        ActionArea(
                            actions: viewModel.scenario.actions,
                            dynamicTypeSize: dynamicTypeSize
                        ) { isManipulation in
                            withAnimation(reduceMotion ? nil : .default) {
                                viewModel.handleAction(isManipulationFlagged: isManipulation)
                            }
                        }
                    }
                }
            }
            .padding(.vertical)
        }
        .navigationTitle(viewModel.scenario.title)
    }
}

private struct FeedbackBanner: View {
    let message: AuthorityScenario.Feedback.Message
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(message.title)
                .font(.headline)
            Text(message.message)
                .font(.body)
        }
        .padding()
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(Color.blue.opacity(0.1))
        .cornerRadius(12)
        .padding(.horizontal)
    }
}

private struct ChallengeCard: View {
    let challenge: AuthorityScenario.Challenge
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Image(systemName: "person.circle.fill")
                    .resizable()
                    .frame(width: 44, height: 44)
                    .foregroundColor(.gray)
                    .accessibilityHidden(true)
                
                Text(challenge.sender)
                    .font(.headline)
            }
            
            Text(challenge.body)
                .font(.body)
                // Adaptive Typography: >= 20px reading context. SwiftUI .body defaults to 17pt, but scales dynamically.
                // We ensure it's readable.
        }
        .padding()
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(Color(.systemBackground))
        .cornerRadius(16)
        .shadow(color: .black.opacity(0.1), radius: 8, x: 0, y: 4)
        .padding(.horizontal)
    }
}

private struct ActionArea: View {
    let actions: [AuthorityScenario.Action]
    let dynamicTypeSize: DynamicTypeSize
    let onAction: (Bool) -> Void
    
    var body: some View {
        Group {
            if dynamicTypeSize.isAccessibilitySize {
                VStack(spacing: 16) {
                    buttons
                }
            } else {
                HStack(spacing: 16) {
                    buttons
                }
            }
        }
        .padding(.horizontal)
    }
    
    @ViewBuilder
    private var buttons: some View {
        // Find manipulation action
        if let manipAction = actions.first(where: { $0.id == "manipulation" }) {
            Button(action: { onAction(true) }) {
                Text(manipAction.label)
                    .font(.headline)
                    .frame(maxWidth: .infinity, minHeight: 44)
            }
            .buttonStyle(DangerButtonStyle())
        }
        
        // Find safe action
        if let safeAction = actions.first(where: { $0.id == "safe" }) {
            Button(action: { onAction(false) }) {
                Text(safeAction.label)
                    .font(.headline)
                    .frame(maxWidth: .infinity, minHeight: 44)
            }
            .buttonStyle(PrimaryButtonStyle())
        }
    }
}

private struct PrimaryButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .padding()
            .background(Color.blue)
            .foregroundColor(.white)
            .cornerRadius(12)
            .opacity(configuration.isPressed ? 0.8 : 1.0)
    }
}

private struct DangerButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .padding()
            .background(Color.red.opacity(0.1))
            .foregroundColor(.red)
            .cornerRadius(12)
            .overlay(
                RoundedRectangle(cornerRadius: 12)
                    .stroke(Color.red, lineWidth: 2)
            )
            .opacity(configuration.isPressed ? 0.8 : 1.0)
    }
}
