// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "Canopy",
    platforms: [
        .iOS(.v17),
        .macOS(.v14)
    ],
    products: [
        .library(
            name: "Canopy",
            targets: ["Canopy"]),
    ],
    dependencies: [
        .package(path: "../ScenarioKit")
    ],
    targets: [
        .target(
            name: "Canopy",
            dependencies: ["ScenarioKit"]),
        .testTarget(
            name: "CanopyTests",
            dependencies: ["Canopy"])
    ]
)
