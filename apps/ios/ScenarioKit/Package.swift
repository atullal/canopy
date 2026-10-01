// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "ScenarioKit",
    platforms: [
        .iOS(.v16)
    ],
    products: [
        .library(
            name: "ScenarioKit",
            targets: ["ScenarioKit"]),
    ],
    targets: [
        .target(
            name: "ScenarioKit")
    ]
)
