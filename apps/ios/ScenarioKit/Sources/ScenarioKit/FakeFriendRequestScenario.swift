import Foundation

public struct FakeFriendRequestScenario: Codable, Sendable {
    public let id: String
    public let title: String
    public let description: String
    public let actions: [Action]
    public let requests: [FriendRequest]
    public let feedback: Feedback
    
    public struct Action: Codable, Sendable {
        public let id: String
        public let label: String
        public let type: String
    }
    
    public struct FriendRequest: Codable, Sendable, Identifiable {
        public let id: String
        public let name: String
        public let profilePicture: String
        public let bio: String
        public let friendsInCommon: Int
        public let joinDate: String
        public let isFake: Bool
        public let type: String
        public let justInTimeHint: String
    }
    
    public struct Feedback: Codable, Sendable {
        public let gentleFailureCloned: FeedbackMessage
        public let gentleFailureStranger: FeedbackMessage
        public let gentleFailureDeclineReal: FeedbackMessage
        public let success: FeedbackMessage
    }
    
    public struct FeedbackMessage: Codable, Sendable {
        public let title: String
        public let message: String
    }
}
