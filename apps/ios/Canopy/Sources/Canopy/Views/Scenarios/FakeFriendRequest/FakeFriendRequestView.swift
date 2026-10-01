import SwiftUI
import ScenarioKit

// MARK: - Motion & Styling
public struct SpringSquishButtonStyle: ButtonStyle {
    public init() {}
    public func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .scaleEffect(configuration.isPressed ? 0.95 : 1.0)
            .animation(.spring(response: 0.3, dampingFraction: 0.7), value: configuration.isPressed)
    }
}

extension Color {
    static let canopyNavy = Color(red: 0.12, green: 0.25, blue: 0.69) // #1E40AF
    static let canopyRed = Color(red: 0.60, green: 0.11, blue: 0.11) // #991B1B
    static let canopyGreen = Color(red: 0.08, green: 0.40, blue: 0.14) // Deep green
    static let canopyText = Color(white: 0.1) // Near black for contrast
}

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
                        .padding(24)
                        .background(Color.white)
                        .cornerRadius(16)
                        .shadow(color: .black.opacity(0.15), radius: 10)
                        .padding(24)
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
            withAnimation(.spring(response: 0.4, dampingFraction: 0.8)) {
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
            HStack(alignment: .top, spacing: 24) {
                column(title: leftTitle, content: leftContent, isRed: true)
                column(title: rightTitle, content: rightContent, isRed: false)
            }
            VStack(alignment: .leading, spacing: 24) {
                column(title: leftTitle, content: leftContent, isRed: true)
                column(title: rightTitle, content: rightContent, isRed: false)
            }
        }
    }
    
    private func column(title: String, content: AnyView, isRed: Bool) -> some View {
        VStack(alignment: .leading, spacing: 16) {
            Text(title)
                .font(.title2)
                .fontWeight(.black)
                .foregroundColor(isRed ? Color.canopyRed : Color.canopyGreen)
            content
                .font(.title3) // Base 20pt
                .foregroundColor(.canopyText)
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
                    VStack(spacing: 24) {
                        Text(scenario.title)
                            .font(.largeTitle)
                            .fontWeight(.heavy)
                            .multilineTextAlignment(.center)
                            .foregroundColor(.canopyText)
                        
                        Text(scenario.description)
                            .font(.title3) // 20pt base
                            .foregroundColor(.canopyText)
                            .padding(24)
                            .background(Color.white)
                            .cornerRadius(24)
                            .overlay(
                                RoundedRectangle(cornerRadius: 24)
                                    .stroke(Color.canopyNavy.opacity(0.3), lineWidth: 4)
                            )
                            .shadow(color: Color.black.opacity(0.05), radius: 5, x: 0, y: 2)
                            .accessibilityElement(children: .combine)
                    }
                    .padding(.horizontal, 24)
                    
                    // Card Container
                    VStack(spacing: 0) {
                        Text("New Friend Request")
                            .font(.title2)
                            .fontWeight(.black)
                            .foregroundColor(.white)
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 24)
                            .background(Color.canopyNavy)
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
                                .foregroundColor(.canopyText)
                                .multilineTextAlignment(.center)
                            
                            Text("\"\(currentRequest.bio)\"")
                                .font(.title3) // 20pt base
                                .italic()
                                .foregroundColor(Color(white: 0.25))
                                .multilineTextAlignment(.center)
                            
                            // Info Box
                            VStack(spacing: 16) {
                                HStack {
                                    Text("Friends in Common:")
                                        .font(.title3)
                                        .fontWeight(.bold)
                                        .foregroundColor(.canopyNavy)
                                    Spacer()
                                    Text("\(currentRequest.friendsInCommon)")
                                        .font(.title2)
                                        .fontWeight(.black)
                                        .foregroundColor(.canopyText)
                                }
                                .padding(.bottom, 12)
                                .overlay(
                                    Rectangle()
                                        .frame(height: 2)
                                        .foregroundColor(Color.canopyNavy.opacity(0.2)),
                                    alignment: .bottom
                                )
                                
                                HStack {
                                    Text("Profile Created:")
                                        .font(.title3)
                                        .fontWeight(.bold)
                                        .foregroundColor(.canopyNavy)
                                    Spacer()
                                    Text(currentRequest.joinDate)
                                        .font(.title2)
                                        .fontWeight(.black)
                                        .foregroundColor(.canopyText)
                                }
                            }
                            .padding(24)
                            .background(Color.canopyNavy.opacity(0.05))
                            .cornerRadius(16)
                            .overlay(
                                RoundedRectangle(cornerRadius: 16)
                                    .stroke(Color.canopyNavy.opacity(0.2), lineWidth: 4)
                            )
                            .accessibilityElement(children: .combine)
                            
                            Spacer(minLength: 24)
                            
                            // Actions
                            VStack(spacing: 24) {
                                Button(action: { handleAction(id: "accept") }) {
                                    Text(scenario.actions.first { $0.id == "accept" }?.label ?? "Accept")
                                        .font(.title2)
                                        .fontWeight(.black)
                                        .foregroundColor(.white)
                                        .frame(maxWidth: .infinity, minHeight: 80)
                                        .background(Color.canopyNavy)
                                        .cornerRadius(16)
                                }
                                .buttonStyle(SpringSquishButtonStyle())
                                .accessibilityHint("Accepts the friend request")
                                
                                Button(action: { handleAction(id: "decline") }) {
                                    Text(scenario.actions.first { $0.id == "decline" }?.label ?? "Decline")
                                        .font(.title2)
                                        .fontWeight(.black)
                                        .foregroundColor(.canopyText)
                                        .frame(maxWidth: .infinity, minHeight: 80)
                                        .background(Color(white: 0.95))
                                        .cornerRadius(16)
                                        .overlay(
                                            RoundedRectangle(cornerRadius: 16)
                                                .stroke(Color(white: 0.7), lineWidth: 2)
                                        )
                                }
                                .buttonStyle(SpringSquishButtonStyle())
                                .accessibilityHint("Declines and deletes the friend request")
                            }
                        }
                        .padding(32)
                        .background(Color.white)
                    }
                    .cornerRadius(32)
                    .overlay(
                        RoundedRectangle(cornerRadius: 32)
                            .stroke(Color(white: 0.8), lineWidth: 4)
                    )
                    .shadow(color: Color.black.opacity(0.1), radius: 15, x: 0, y: 5)
                    .padding(.horizontal, 24)
                    .animation(.spring(response: 0.4, dampingFraction: 0.8), value: currentIndex)
                }
                .padding(.vertical, 32)
            }
            .background(Color(white: 0.98).edgesIgnoringSafeArea(.all))
        } hintContent: {
            Text("Look at **Friends in Common** and the **Join Date**. Real friends usually have mutual connections and older accounts.")
                .font(.title3) // 20pt base
                .foregroundColor(.canopyText)
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
            // Blur Backdrop
            Rectangle()
                .fill(Color.black.opacity(0.4))
                .background(.ultraThinMaterial)
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
                        .font(.title3) // 20pt base
                        .foregroundColor(.canopyText)
                        .padding(24)
                        .background(Color(white: 0.95))
                        .cornerRadius(24)
                        .overlay(
                            RoundedRectangle(cornerRadius: 24)
                                .stroke(Color(white: 0.9), lineWidth: 4)
                        )
                    
                    // Split Screen Comparative
                    SplitScreenComparative(
                        leftTitle: "Red Flags (Scam)",
                        leftContent: AnyView(
                            VStack(alignment: .leading, spacing: 16) {
                                Text("**Joined Today/Yesterday:** Scammers make new accounts constantly.")
                                Text("**0 Friends in Common:** If it's your real friend, they should be connected to others you know.")
                                Text("**Urgent/Weird Bios:** \"Had to make a new account\" or asking for help.")
                            }
                        ),
                        rightTitle: "Green Flags (Safe)",
                        rightContent: AnyView(
                            VStack(alignment: .leading, spacing: 16) {
                                Text("**Older Join Date:** E.g., \"Joined 2014\", meaning the account has history.")
                                Text("**Mutual Friends:** Sharing several friends in common means they are likely part of your real-world community.")
                                Text("**Normal Bio:** Mentions normal hobbies or work without asking for anything.")
                            }
                        )
                    )
                    .padding(.vertical, 8)
                    
                    Button(action: onDismiss) {
                        Text("Continue")
                            .font(.title2)
                            .fontWeight(.black)
                            .foregroundColor(.white)
                            .frame(maxWidth: .infinity, minHeight: 88)
                            .background(Color.canopyNavy)
                            .cornerRadius(16)
                    }
                    .buttonStyle(SpringSquishButtonStyle())
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
        case .failure: return Color.canopyRed
        case .success: return Color.canopyGreen
        case .info: return Color.canopyNavy
        }
    }
}

