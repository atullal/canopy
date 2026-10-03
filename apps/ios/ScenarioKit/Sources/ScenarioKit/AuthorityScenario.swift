import Foundation

public struct AuthorityScenario: Codable, Equatable, Sendable {
    public struct Action: Codable, Equatable, Sendable {
        public let id: String
        public let label: String
        public let type: String
        
        public init(id: String, label: String, type: String) {
            self.id = id
            self.label = label
            self.type = type
        }
    }
    
    public struct Challenge: Codable, Equatable, Sendable, Identifiable {
        public let id: String
        public let sender: String
        public let body: String
        public let isManipulation: Bool
        public let manipulationType: String
        public let justInTimeHint: String
        
        public init(id: String, sender: String, body: String, isManipulation: Bool, manipulationType: String, justInTimeHint: String) {
            self.id = id
            self.sender = sender
            self.body = body
            self.isManipulation = isManipulation
            self.manipulationType = manipulationType
            self.justInTimeHint = justInTimeHint
        }
    }
    
    public struct Feedback: Codable, Equatable, Sendable {
        public struct Message: Codable, Equatable, Sendable {
            public let title: String
            public let message: String
            
            public init(title: String, message: String) {
                self.title = title
                self.message = message
            }
        }
        
        public let gentleFailureMissedManipulation: Message
        public let gentleFailureFlaggedSafe: Message
        public let success: Message
        
        public init(gentleFailureMissedManipulation: Message, gentleFailureFlaggedSafe: Message, success: Message) {
            self.gentleFailureMissedManipulation = gentleFailureMissedManipulation
            self.gentleFailureFlaggedSafe = gentleFailureFlaggedSafe
            self.success = success
        }
    }
    
    public let id: String
    public let title: String
    public let description: String
    public let actions: [Action]
    public let challenges: [Challenge]
    public let feedback: Feedback
    
    public init(id: String, title: String, description: String, actions: [Action], challenges: [Challenge], feedback: Feedback) {
        self.id = id
        self.title = title
        self.description = description
        self.actions = actions
        self.challenges = challenges
        self.feedback = feedback
    }
    
    public static func load(from data: Data) throws -> AuthorityScenario {
        let decoder = JSONDecoder()
        return try decoder.decode(AuthorityScenario.self, from: data)
    }
}
