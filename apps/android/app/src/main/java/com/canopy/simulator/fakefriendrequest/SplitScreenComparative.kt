package com.canopy.simulator.fakefriendrequest

import androidx.compose.foundation.layout.*
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun SplitScreenComparative(
    leftTitle: String,
    leftContent: @Composable () -> Unit,
    rightTitle: String,
    rightContent: @Composable () -> Unit
) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Column(modifier = Modifier.weight(1f)) {
            Text(
                text = leftTitle,
                color = Color(0xFF7F1D1D), // red-900
                fontWeight = FontWeight.Black,
                fontSize = 24.sp,
                modifier = Modifier.padding(bottom = 8.dp)
            )
            leftContent()
        }
        Column(modifier = Modifier.weight(1f)) {
            Text(
                text = rightTitle,
                color = Color(0xFF14532D), // green-900
                fontWeight = FontWeight.Black,
                fontSize = 24.sp,
                modifier = Modifier.padding(bottom = 8.dp)
            )
            rightContent()
        }
    }
}

