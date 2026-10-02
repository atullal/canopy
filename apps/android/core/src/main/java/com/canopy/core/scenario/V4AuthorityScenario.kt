package com.canopy.core.scenario

import kotlinx.serialization.Serializable

@Serializable
data class AuthorityAction(
    val id: String,
    val label: String,
    val type: String
)

@Serializable
data class AuthorityChallenge(
    val id: String,
    val sender: String,
    val body: String,
    val isManipulation: Boolean,
    val manipulationType: String,
    val justInTimeHint: String
)

@Serializable
data class AuthorityFeedbackMessage(
    val title: String,
    val message: String
)

@Serializable
data class AuthorityFeedback(
    val gentleFailureMissedManipulation: AuthorityFeedbackMessage,
    val gentleFailureFlaggedSafe: AuthorityFeedbackMessage,
    val success: AuthorityFeedbackMessage
)

@Serializable
data class V4AuthorityScenario(
    val id: String,
    val title: String,
    val description: String,
    val actions: List<AuthorityAction>,
    val challenges: List<AuthorityChallenge>,
    val feedback: AuthorityFeedback
)
