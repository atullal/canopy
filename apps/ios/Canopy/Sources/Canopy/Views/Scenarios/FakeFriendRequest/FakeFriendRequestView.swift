import SwiftUI
import ScenarioKit

// MARK: - AdaptiveHesitationEngine
public struct AdaptiveHesitationEngine<Content: View, Hint: View>: View {
    let idleTime: TimeInterval
    @ViewBuilder let content: () -> Content
    @ViewBuilder let hintContent: () -> Hint
    
    @State private var showHint = false
    @State private var timer: Timer?
    
    public init(
        idleTime: TimeInterval = 10.0,
        @ViewBuilder content: @escaping () -> Content,
        @ViewBuilder hintContent: @escaping () -> Hint
    ) {
        self.idleTime = idleTime
        self.content = content
        self.hintContent = hintContent
    }
    
    public var body: some View {
        ZStack {
            content()
                .simultaneousGesture(
                    DragGesture(minimumDistance: 0)
                        .onChanged { _ in resetTimer() }
                )
                .onTapGesture { resetTimer() }
            
            if showHint {
                VStack {
                    Spacer()
                    hintContent()
                        .padding()
                        .background(Color(white: 0.95))
                        .cornerRadius(16)
                        .shadow(radius: 10)
                        .padding()
                        .accessibilityElement(children: .combine)
                        .accessibilityLabel("Hint available")
                        .transition(.move(edge: .bottom).combined(with: .opacity))
                }
            }
        }
        .onAppear { resetTimer() }
        .onDisappear { timer?.invalidate() }
    }
    
    private func resetTimer() {
        showHint = false
        timer?.invalidate()
        timer = Timer.scheduledTimer(withTimeInterval: idleTime, repeats: false) { _ in
            withAnimation(.spring()) {
                showHint = true
            }
        }
    }
}

// MARK: - SplitScreenComparative
public struct SplitScreenComparative: View {
    let leftTitle: String
    let leftContent: AnyView
    let rightTitle: String
    let rightContent: AnyView
    
    @Environment(\.dynamicTypeSize) var dynamicTypeSize
    
    public var body: some View {
        ViewThatFits {
            HStack(alignment: .top, spacing: 20) {
                column(title: leftTitle, content: leftContent, isRed: true)
                column(title: rightTitle, content: rightContent, isRed: false)
            }
            VStack(alignment: .leading, spacing: 20) {
                column(title: leftTitle, content: leftContent, isRed: true)
                column(title: rightTitle, content: rightContent, isRed: false)
            }
        }
    }
    
    private func column(title: String, content: AnyView, isRed: Bool) -> some View {
        VStack(alignment: .leading, spacing: 12) {
            Text(title)
                .font(.title2)
                .bold()
                .foregroundColor(isRed ? Color(red: 0.6, green: 0, blue: 0) : Color(red: 0, green: 0.4, blue: 0))
            content
        }
        .frame(maxWidth: .infinity, alignment: .leading)
    }
}

// MARK: - FakeFriendRequestView
@MainActor
public struct FakeFriendRequestView: View {
    let scenario: FakeFriendRequestScenario
    
    @State private var currentIndex = 0
    @State private var feedback: FeedbackState?
    
    struct FeedbackState: Identifiable {
        let id = UUID()
        let title: String
        let message: String
        let type: FeedbackType
        
        enum FeedbackType {
            case success, failure, info
        }
    }
    
    public init(scenario: FakeFriendRequestScenario) {
        self.scenario = scenario
    }
    
    private var currentRequest: FakeFriendRequestScenario.FriendRequest {
        scenario.requests[currentIndex]
    }
    
    public var body: some View {
        AdaptiveHesitationEngine(idleTime: 10.0) {
            ScrollView {
                VStack(spacing: 32) {
                    // Header
                    VStack(spacing: 16) {
                        Text(scenario.title)
                            .font(.largeTitle)
                            .fontWeight(.heavy)
                            .multilineTextAlignment(.center)
                            .foregroundColor(.primary)
                        
                        Text(scenario.description)
                            .font(.title3)
                            .padding()
                            .background(Color.white)
                            .cornerRadius(16)
                            .overlay(
                                RoundedRectangle(cornerRadius: 16)
                                    .stroke(Color.blue.opacity(0.3), lineWidth: 4)
                            )
                            .shadow(color: Color.black.opacity(0.05), radius: 5, x: 0, y: 2)
                            .accessibilityElement(children: .combine)
                    }
                    .padding(.horizontal)
                    
                    // Card Container
                    VStack(spacing: 0) {
                        Text("New Friend Request")
                            .font(.title2)
                            .fontWeight(.black)
                            .foregroundColor(.white)
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 16)
                            .background(Color(red: 0.1, green: 0.2, blue: 0.5)) // blue-900
                            .zIndex(1)
                        
                        VStack(spacing: 24) {
                            // Profile Avatar
                            Circle()
                                .fill(Color(white: 0.9))
                                .frame(width: 140, height: 140)
                                .overlay(
                                    Text("👤")
                                        .font(.system(size: 64))
                                )
                                .overlay(
                                    Circle().stroke(Color(white: 0.95), lineWidth: 8)
                                )
                                .accessibilityHidden(true)
                            
                            Text(currentRequest.name)
                                .font(.title)
                                .fontWeight(.black)
                                .multilineTextAlignment(.center)
                            
                            Text("\"\(currentRequest.bio)\"")
                                .font(.title3)
                                .italic()
                                .foregroundColor(Color(white: 0.2))
                                .multilineTextAlignment(.center)
                            
                            // Info Box
                            VStack(spacing: 16) {
                                HStack {
                                    Text("Friends in Common:")
                                        .font(.headline)
                                        .bold()
                                        .foregroundColor(Color(red: 0.1, green: 0.2, blue: 0.5))
                                    Spacer()
                                    Text("\(currentRequest.friendsInCommon)")
                                        .font(.title2)
                                        .fontWeight(.black)
                                }
                                .padding(.bottom, 12)
                                .overlay(
                                    Rectangle()
                                        .frame(height: 2)
                                        .foregroundColor(Color.blue.opacity(0.2)),
                                    alignment: .bottom
                                )
                                
                                HStack {
                                    Text("Profile Created:")
                                        .font(.headline)
                                        .bold()
                                        .foregroundColor(Color(red: 0.1, green: 0.2, blue: 0.5))
                                    Spacer()
                                    Text(currentRequest.joinDate)
                                        .font(.title2)
                                        .fontWeight(.black)
                                }
                            }
                            .padding()
                            .background(Color.blue.opacity(0.05))
                            .cornerRadius(16)
                            .overlay(
                                RoundedRectangle(cornerRadius: 16)
                                    .stroke(Color.blue.opacity(0.2), lineWidth: 4)
                            )
                            .accessibilityElement(children: .combine)
                            
                            Spacer(minLength: 24)
                            
                            // Actions
                            VStack(spacing: 16) {
                                Button(action: { handleAction(id: "accept") }) {
                                    Text(scenario.actions.first { $0.id == "accept" }?.label ?? "Accept")
                                        .font(.title2)
                                        .fontWeight(.black)
                                        .foregroundColor(.white)
                                        .frame(maxWidth: .infinity, minHeight: 80)
                                        .background(Color(red: 0.12, green: 0.3, blue: 0.6)) // blue-800
                                        .cornerRadius(16)
                                }
                                .accessibilityHint("Accepts the friend request")
                                
                                Button(action: { handleAction(id: "decline") }) {
                                    Text(scenario.actions.first { $0.id == "decline" }?.label ?? "Decline")
                                        .font(.title2)
                                        .fontWeight(.black)
                                        .foregroundColor(.primary)
                                        .frame(maxWidth: .infinity, minHeight: 80)
                                        .background(Color(white: 0.9))
                                        .cornerRadius(16)
                                        .overlay(
                                            RoundedRectangle(cornerRadius: 16)
                                                .stroke(Color(white: 0.6), lineWidth: 2)
                                        )
                                }
                                .accessibilityHint("Declines and deletes the friend request")
                            }
                        }
                        .padding(24)
                        .background(Color.white)
                    }
                    .cornerRadius(40)
                    .overlay(
                        RoundedRectangle(cornerRadius: 40)
                            .stroke(Color(white: 0.8), lineWidth: 4)
                    )
                    .shadow(color: Color.black.opacity(0.1), radius: 15, x: 0, y: 5)
                    .padding(.horizontal)
                    .animation(.spring(), value: currentIndex) // Animate request transitions
                }
                .padding(.vertical, 32)
            }
            .background(Color(white: 0.98).edgesIgnoringSafeArea(.all))
        } hintContent: {
            Text("Look at **Friends in Common** and the **Join Date**. Real friends usually have mutual connections and older accounts.")
                .font(.title3)
        }
        .overlay(
            Group {
                if let feedback = feedback {
                    FeedbackModal(feedback: feedback, onDismiss: handleNext)
                        .transition(.opacity.combined(with: .scale(scale: 0.95)))
                        .zIndex(2)
                }
            }
        )
        .animation(.spring(response: 0.4, dampingFraction: 0.8), value: feedback != nil)
    }
    
    private func handleAction(id: String) {
        if id == "accept" && currentRequest.isFake {
            // TODO: PostHog event
            let fb = currentRequest.type == "stranger-scam" ? scenario.feedback.gentleFailureStranger : scenario.feedback.gentleFailureCloned
            feedback = FeedbackState(title: fb.title, message: fb.message, type: .failure)
        } else if id == "decline" && !currentRequest.isFake {
            feedback = FeedbackState(title: scenario.feedback.gentleFailureDeclineReal.title, message: scenario.feedback.gentleFailureDeclineReal.message, type: .info)
        } else {
            feedback = FeedbackState(title: scenario.feedback.success.title, message: scenario.feedback.success.message, type: .success)
        }
    }
    
    private func handleNext() {
        feedback = nil
        if currentIndex + 1 < scenario.requests.count {
            currentIndex += 1
        } else {
            currentIndex = 0
        }
    }
}

// MARK: - FeedbackModal
struct FeedbackModal: View {
    let feedback: FakeFriendRequestView.FeedbackState
    let onDismiss: () -> Void
    
    @Environment(\.dynamicTypeSize) var dynamicTypeSize
    
    var body: some View {
        ZStack {
            Color.black.opacity(0.8)
                .edgesIgnoringSafeArea(.all)
                .onTapGesture(perform: onDismiss)
            
            ScrollView {
                VStack(spacing: 32) {
                    Text(feedback.title)
                        .font(.largeTitle)
                        .fontWeight(.heavy)
                        .foregroundColor(titleColor)
                        .multilineTextAlignment(.center)
                    
                    Text(feedback.message)
                        .font(.title3)
                        .padding(24)
                        .background(Color(white: 0.95))
                        .cornerRadius(16)
                        .overlay(
                            RoundedRectangle(cornerRadius: 16)
                                .stroke(Color(white: 0.9), lineWidth: 4)
                        )
                    
                    // Split Screen Comparative
                    SplitScreenComparative(
                        leftTitle: "Red Flags (Scam)",
                        leftContent: AnyView(
                            VStack(alignment: .leading, spacing: 12) {
                                Text("**Joined Today/Yesterday:** Scammers make new accounts constantly.")
                                Text("**0 Friends in Common:** If it's your real friend, they should be connected to others you know.")
                                Text("**Urgent/Weird Bios:** \"Had to make a new account\" or asking for help.")
                            }
                            .font(.body)
                        ),
                        rightTitle: "Green Flags (Safe)",
                        rightContent: AnyView(
                            VStack(alignment: .leading, spacing: 12) {
                                Text("**Older Join Date:** E.g., \"Joined 2014\", meaning the account has history.")
                                Text("**Mutual Friends:** Sharing several friends in common means they are likely part of your real-world community.")
                                Text("**Normal Bio:** Mentions normal hobbies or work without asking for anything.")
                            }
                            .font(.body)
                        )
                    )
                    .padding(.vertical)
                    
                    Button(action: onDismiss) {
                        Text("Continue")
                            .font(.title)
                            .fontWeight(.black)
                            .foregroundColor(.white)
                            .frame(maxWidth: .infinity, minHeight: 88)
                            .background(Color(red: 0.12, green: 0.3, blue: 0.6))
                            .cornerRadius(16)
                    }
                }
                .padding(32)
                .background(Color.white)
                .cornerRadius(48)
                .overlay(
                    RoundedRectangle(cornerRadius: 48)
                        .stroke(Color(white: 0.8), lineWidth: 8)
                )
                .padding(24)
            }
        }
        .accessibilityAddTraits(.isModal)
    }
    
    private var titleColor: Color {
        switch feedback.type {
        case .failure: return Color(red: 0.6, green: 0, blue: 0)
        case .success: return Color(red: 0, green: 0.4, blue: 0)
        case .info: return Color(red: 0.12, green: 0.3, blue: 0.6)
        }
    }
}
